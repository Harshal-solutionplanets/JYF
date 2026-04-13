import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import { apiFetch } from "../../api";
import { useAuth } from "../../auth/AuthProvider";
import { formatDate, formatTime } from "../../utils/dateFormatter";
import GoldenTicket from "./GoldenTicket";

const EventRegistrationArea = ({ onTitleFetch }) => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Page states: 'landing' (details + seat choice), 'form' (collecting details), 'success' (msg)
    const [pageStatus, setPageStatus] = useState('landing');
    const [event, setEvent] = useState(null);

    useEffect(() => {
        if (event && onTitleFetch) {
            onTitleFetch(`Registration: ${event.title}`);
        }
    }, [event, onTitleFetch]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [bookedCount, setBookedCount] = useState(0);
    const [isSoldOut, setIsSoldOut] = useState(false);

    // Seat and participant states
    const numSeats = 1; // Fixed to 1 ticket
    const [selectedSection, setSelectedSection] = useState("");
    const [availableSections, setAvailableSections] = useState([]);
    const [sectionsList, setSectionsList] = useState([]); // Defined sections {name, seats}
    const [sectionBookedCounts, setSectionBookedCounts] = useState({}); // { 'Gold': 5 }
    const [sectionError, setSectionError] = useState(""); // Immediate feedback error

    const [participants, setParticipants] = useState([
        { name: "", email: "", phoneNo: "", location: "", section: "" }
    ]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [registeredParticipants, setRegisteredParticipants] = useState([]);
    const [formError, setFormError] = useState("");

    // Reservation Lock states
    const [sessionId] = useState(() => user?.email || `anon_${Math.random().toString(36).substr(2, 9)}`);
    const [lockRemainingTime, setLockRemainingTime] = useState(0);
    const [isPriorityUser, setIsPriorityUser] = useState(false);
    const [lockInterval, setLockInterval] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                // Parallelize fetches for better performance
                const [eventRes, regRes] = await Promise.all([
                    supabase.from("events").select("*").eq("id", eventId).single(),
                    supabase.from('event_registrations').select('selected_section').eq('event_id', eventId)
                ]);

                if (eventRes.error) throw eventRes.error;
                if (regRes.error) throw regRes.error;

                const data = eventRes.data;
                const regList = regRes.data;

                // Safety check: if registration not required, redirect or error
                if (data.description?.includes("REG_TYPE: not_required")) {
                    setError("Online registration is not required for this event. You can attend directly.");
                    setLoading(false);
                    return;
                }

                setEvent(data);

                // Extract sections from description
                const desc = data.description || "";
                if (desc.startsWith("SECTIONS:")) {
                    try {
                        const parts = desc.split(" | CONTENT: ");
                        const sectionsJson = parts[0].replace("SECTIONS: ", "");
                        const parsed = JSON.parse(sectionsJson);

                        let names = [];
                        let fullList = [];
                        if (Array.isArray(parsed)) {
                            names = parsed.map(s => s.name);
                            fullList = parsed;
                        } else {
                            // legacy support for old object format
                            names = Object.keys(parsed).filter(k => parsed[k].enabled);
                            fullList = Object.keys(parsed).map(k => ({ name: k, seats: parsed[k].seats, enabled: parsed[k].enabled }));
                        }

                        setAvailableSections(names);
                        setSectionsList(fullList);
                        
                        // Smart Default: Find the first section that still has seats available
                        const currentCounts = {};
                        (regList || []).forEach(r => {
                            const sec = (r.selected_section || "General").trim().toUpperCase();
                            currentCounts[sec] = (currentCounts[sec] || 0) + 1;
                        });

                        console.log("Current Registrations per Section (Normalized):", currentCounts);

                        const firstAvailable = fullList.find(s => {
                            const capacity = parseInt(s.seats) || 0;
                            const sectionName = s.name.toUpperCase();
                            const booked = currentCounts[sectionName] || 0;
                            const hasSpace = capacity > booked;
                            console.log(`Section: ${s.name} | Booked: ${booked}/${capacity} | Available: ${hasSpace}`);
                            return hasSpace;
                        });

                        if (firstAvailable) {
                            console.log("Auto-selecting next available section:", firstAvailable.name);
                            setSelectedSection(firstAvailable.name);
                        } else if (names.length > 0) {
                            setSelectedSection(names[0]);
                        }
                        
                        setSectionBookedCounts(currentCounts);

                        // Define Sold Out: Total seats reached OR all categories are full
                        const totalLimitReached = data.seatsAvailable && (regList?.length || 0) >= data.seatsAvailable;
                        const allCategoriesFull = (fullList.length > 0) && !firstAvailable;

                        if (totalLimitReached || allCategoriesFull) {
                            setIsSoldOut(true);
                        }

                    } catch (e) {
                        console.error("Failed to parse sections", e);
                    }
                }

                setBookedCount(regList?.length || 0);

            } catch (err) {
                setError(err?.message || "Failed to load event");
            } finally {
                setLoading(false);
            }
        };

        if (eventId) fetchEvent();
    }, [eventId]);

    useEffect(() => {
        // Only pre-fill if it's NOT a staff member (to allow easy testing/manual entry by staff)
        const isStaff = user?.email === 'donotreply@jainyouth.in';

        if (event && selectedSection) {
            setParticipants(prev => {
                const updated = [...prev];
                updated[0] = {
                    ...updated[0],
                    name: updated[0].name || ((user && !isStaff) ? (user?.user_metadata?.full_name || "") : ""),
                    email: updated[0].email || ((user && !isStaff) ? (user?.email || "") : ""),
                    phoneNo: updated[0].phoneNo || ((user && !isStaff) ? (user?.user_metadata?.phone || "") : ""),
                    section: selectedSection
                };
                return updated;
            });
        }
    }, [event, selectedSection, user]);

    // Release lock on unmount
    useEffect(() => {
        return () => {
            if (sessionId && eventId) {
                supabase.from('ticket_locks').delete().eq('event_id', eventId).eq('locked_by', sessionId).then(() => { });
            }
        };
    }, [sessionId, eventId]);

    // Timer logic
    useEffect(() => {
        if (lockRemainingTime > 0) {
            const timer = setInterval(() => {
                setLockRemainingTime(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [lockRemainingTime]);

    // Ticket Lock Logic
    const startRegistrationFlow = async () => {
        try {
            setLoading(true);
            setFormError("");

            // 1. Fetch current status
            const [regRes, lockRes] = await Promise.all([
                supabase.from('event_registrations').select('id', { count: 'exact', head: true }).eq('event_id', eventId),
                supabase.from('ticket_locks').select('*').eq('event_id', eventId).gt('expires_at', new Date().toISOString())
            ]);

            const currentRegs = regRes.count || 0;
            const activeLocks = (lockRes.data || []).filter(l => l.locked_by !== sessionId);

            if (event.seatsAvailable && (currentRegs + activeLocks.length) >= event.seatsAvailable) {
                // No priority available, but per user request "register open hoga", 
                // we still go to form but warn them.
                setIsPriorityUser(false);
                setFormError("⚠️ All seats are currently being filled by others. You can try filling the form, but a seat might not be available when you submit.");
            } else {
                // Try to acquire priority lock
                const expiresAt = new Date(Date.now() + 16000).toISOString(); // 15s + 1s buffer
                const { error: lockErr } = await supabase
                    .from('ticket_locks')
                    .insert([{
                        event_id: eventId,
                        locked_by: sessionId,
                        expires_at: expiresAt
                    }]);

                if (!lockErr) {
                    setIsPriorityUser(true);
                    setLockRemainingTime(15);
                }
            }

            setPageStatus('form');
        } catch (err) {
            console.error("Lock error", err);
            setPageStatus('form'); // Fail safe to form
        } finally {
            setLoading(false);
        }
    };


    const handleValidationAndSubmit = async () => {
        setIsSubmitting(true);
        setFormError("");
        const p = participants[0];

        if (!p.name.trim()) { setFormError("Name is required"); setIsSubmitting(false); return; }
        if (!p.email.trim()) { setFormError("Email is required"); setIsSubmitting(false); return; }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(p.email.trim())) {
            setFormError("Please enter a valid email address (e.g., user@example.com)");
            setIsSubmitting(false);
            return;
        }
        if (!/^\d{10}$/.test(p.phoneNo)) { setFormError("Valid 10-digit phone number required"); setIsSubmitting(false); return; }
        if (!p.location.trim()) { setFormError("Location is required"); setIsSubmitting(false); return; }

        // DB check for duplicate registration
        try {
            const { count } = await supabase
                .from('event_registrations')
                .select('*', { count: 'exact', head: true })
                .eq('event_id', eventId)
                .eq('phone_number', p.phoneNo);

            if (count > 0) {
                setFormError(`This phone number is already registered for this event.`);
                setIsSubmitting(false);
                return;
            }
        } catch (e) {
            console.error("DB check error", e);
            setIsSubmitting(false);
        }

        handleSubmit(participants);
    };

    const handleSubmit = async (finalParticipants) => {
        setIsSubmitting(true);
        setError("");
        try {
            // 1. Final seat count check (Respecting locks)
            const { data: eventData, error: eventErr } = await supabase.from("events").select("seatsAvailable").eq("id", eventId).single();
            if (eventErr) throw eventErr;

            const [regRes, lockRes] = await Promise.all([
                supabase.from('event_registrations').select('id', { count: 'exact', head: true }).eq('event_id', eventId),
                supabase.from('ticket_locks').select('*').eq('event_id', eventId).gt('expires_at', new Date().toISOString())
            ]);

            const currentRegs = regRes.count || 0;
            // Count locks from OTHERS that haven't expired
            const otherActiveLocks = (lockRes.data || []).filter(l => l.locked_by !== sessionId);

            if (eventData.seatsAvailable && (currentRegs + otherActiveLocks.length) >= eventData.seatsAvailable) {
                setFormError("Sorry, the event just sold out! No more seats available.");
                setIsSoldOut(true);
                setIsSubmitting(false);
                return;
            }

            // 2. Final duplicate check (Phone Only) to prevent double submissions
            const { count: dupCount } = await supabase
                .from('event_registrations')
                .select('*', { count: 'exact', head: true })
                .eq('event_id', eventId)
                .eq('phone_number', finalParticipants[0].phoneNo);

            if (dupCount > 0) {
                setFormError("This phone number is already registered for this event.");
                setIsSubmitting(false);
                return;
            }

            // 3. Just-in-Time Section Calculation (Preventing overbooking of tiers)
            let finalAssignedSection = "General";
            const desc = event.description || "";
            if (desc.startsWith("SECTIONS:")) {
                try {
                    // Fetch latest counts specifically to avoid race conditions
                    const { data: latestRegs } = await supabase.from('event_registrations').select('selected_section').eq('event_id', eventId);
                    const currentCounts = {};
                    (latestRegs || []).forEach(r => {
                        const sec = (r.selected_section || "General").trim().toUpperCase();
                        currentCounts[sec] = (currentCounts[sec] || 0) + 1;
                    });

                    const parts = desc.split(" | CONTENT: ");
                    const sectionsJson = parts[0].replace("SECTIONS: ", "").split(" | ")[0];
                    const parsed = JSON.parse(sectionsJson);
                    const fullList = Array.isArray(parsed) ? parsed : Object.keys(parsed).map(k => ({ name: k, seats: parsed[k].seats, enabled: parsed[k].enabled }));

                    const nextAvailable = fullList.find(s => {
                        const capacity = parseInt(s.seats) || 0;
                        const sectionName = s.name.toUpperCase();
                        const booked = currentCounts[sectionName] || 0;
                        return capacity > booked;
                    });

                    if (nextAvailable) {
                        finalAssignedSection = nextAvailable.name;
                        setSelectedSection(nextAvailable.name); // Update UI state
                    }
                } catch (e) { console.error("JIT Section Calc Error:", e); }
            }

            const inserts = finalParticipants.map(v => ({
                event_id: eventId,
                full_name: v.name,
                email: v.email,
                phone_number: v.phoneNo,
                location: v.location,
                selected_section: finalAssignedSection,
            }));

            const { data, error: sbError } = await supabase
                .from('event_registrations')
                .insert(inserts)
                .select();

            if (sbError) throw sbError;

            const enrichedData = data.map(d => ({
                ...d,
                section: selectedSection
            }));

            setRegisteredParticipants(enrichedData || []);
            setPageStatus('success');
            setSuccessMsg("Your registration is successful! Official Tickets have been sent to your email.");

            // TRIGGER EMAIL SENDING in background (non-blocking)
            enrichedData.forEach(reg => {
                fetch('/api/send-ticket', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        recipientEmail: reg.email,
                        recipientName: reg.full_name,
                        eventTitle: event.title,
                        ticketId: reg.id,
                        section: reg.selected_section || finalAssignedSection,
                        description: event.description,
                        venue: event.venue || "TBD",
                        date: formatDate(event.startAt),
                        time: formatTime(event.startAt)
                    })
                }).catch(emailErr => console.error("Background email error:", emailErr));
            });

            // Cleanup lock
            supabase.from('ticket_locks').delete().eq('event_id', eventId).eq('locked_by', sessionId).then(() => {});
            setLockRemainingTime(0);
        } catch (err) {
            setError(err?.message || "Registration failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="text-center section_padding"><h3>Loading event details...</h3></div>;
    if (error) return <div className="text-center section_padding"><h3 style={{ color: 'red' }}>{error}</h3></div>;
    if (!event) return <div className="text-center section_padding"><h3>Event not found</h3></div>;

    return (
        <section id="registration_area" className="section_padding">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 offset-lg-2">
                        <div className="registration_card custom_registration_card" style={{
                            background: "#fff",
                            borderRadius: "20px",
                            boxShadow: "0 15px 50px rgba(0,0,0,0.1)",
                            overflow: "hidden"
                        }}>

                            {pageStatus === 'landing' && (
                                <div className="event_info_step">
                                    <div className="text-center mb-4">
                                        <h2 style={{ fontWeight: "800", color: "#333" }}>{event.title}</h2>
                                    </div>

                                    {/* Important Note Section */}
                                    <div className="important_note_section mb-4 p-4" style={{
                                        backgroundColor: "#f9fcf9",
                                        border: "1px solid #d4edda",
                                        borderRadius: "15px",
                                        textAlign: "left"
                                    }}>
                                        <h6 style={{ color: "#155724", fontWeight: "700", marginBottom: "15px" }}>⚠️ Important Note:</h6>
                                        <ul style={{
                                            margin: 0,
                                            padding: 0,
                                            color: "#333",
                                            fontSize: "15px",
                                            lineHeight: "1.8",
                                            fontWeight: "500",
                                            listStyle: "none"
                                        }}>
                                            <li style={{ marginBottom: "10px", display: "flex", alignItems: "flex-start" }}>
                                                <span style={{ color: "#e33129", marginRight: "12px", fontSize: "14px", marginTop: "2px" }}>●</span>
                                                <span>Kindly register only if you are certain to attend, as seats are limited.</span>
                                            </li>
                                            <li style={{ marginBottom: "10px", display: "flex", alignItems: "flex-start" }}>
                                                <span style={{ color: "#e33129", marginRight: "12px", fontSize: "14px", marginTop: "2px" }}>●</span>
                                                <span>One registration per mobile number will be considered.</span>
                                            </li>
                                            <li style={{ marginBottom: "10px", display: "flex", alignItems: "flex-start" }}>
                                                <span style={{ color: "#e33129", marginRight: "12px", fontSize: "14px", marginTop: "2px" }}>●</span>
                                                <span>Entry will be on a first-come, first-served basis — registration does not guarantee a reserved seat.</span>
                                            </li>
                                            <li style={{ display: "flex", alignItems: "flex-start" }}>
                                                <span style={{ color: "#e33129", marginRight: "12px", fontSize: "14px", marginTop: "2px" }}>●</span>
                                                <span>Guests are requested to arrive on time to avoid inconvenience.</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="event_basic_details mb-5 p-4" style={{ background: "#f8f9fa", borderRadius: "15px" }}>
                                        <div className="row text-center">
                                            <div className="col-md-6 mb-3">
                                                <strong>📍 Venue:</strong> {event.venue || "TBD"}
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <strong>📅 Date:</strong> {formatDate(event.startAt)}
                                            </div>
                                            <div className="col-md-6 mb-3 mb-md-0">
                                                <strong>⏰ Time:</strong> {formatTime(event.startAt)}
                                            </div>
                                            <div className="col-md-6">
                                                <strong>🏷️ Category:</strong> {event.tag || "General"}
                                            </div>
                                            {event.seatsAvailable && (
                                                <div className="col-12 mt-3">
                                                    <div style={{ padding: "10px", backgroundColor: (isSoldOut || (event.seatsAvailable && (event.seatsAvailable - bookedCount) <= 0)) ? "#feecec" : "#e7f4e8", borderRadius: "10px", color: (isSoldOut || (event.seatsAvailable && (event.seatsAvailable - bookedCount) <= 0)) ? "#e33129" : "#28a745", fontWeight: "700" }}>
                                                        {(isSoldOut || (event.seatsAvailable && (event.seatsAvailable - bookedCount) <= 0)) ? (
                                                            <span>🚫 SOLD OUT - All seats are booked!</span>
                                                        ) : (
                                                            <span>✨ Only {(event.seatsAvailable - bookedCount)} Seats Remaining</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>


                                    {!(isSoldOut || (event.seatsAvailable && (event.seatsAvailable - bookedCount) <= 0)) && (
                                        <div className="text-center mt-5">
                                            <button
                                                className="btn btn_theme btn_md"
                                                style={{ padding: "15px 50px", fontSize: "18px" }}
                                                onClick={startRegistrationFlow}
                                            >
                                                Register Now
                                            </button>
                                        </div>
                                    )}

                                    {(isSoldOut || (event.seatsAvailable && (event.seatsAvailable - bookedCount) <= 0)) && (
                                        <div className="text-center mt-4">
                                            <button className="btn btn-outline-dark btn_md" onClick={() => navigate(-1)}>Back to Events</button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {pageStatus === 'form' && (
                                <div className="event_form_step p-4">
                                    {/* Timer Bar */}
                                    {isPriorityUser && (
                                        <div className="timer_container mb-4 text-center">
                                            <div style={{ fontSize: "14px", fontWeight: "700", color: lockRemainingTime <= 5 ? "#e33129" : "#666", marginBottom: "8px" }}>
                                                {lockRemainingTime > 0 ? (
                                                    <span>⏱️ Reservation expires in: {lockRemainingTime}s</span>
                                                ) : (
                                                    <span style={{ color: "#e33129" }}>⚠️ Reservation expired! Seats may be taken.</span>
                                                )}
                                            </div>
                                            <div className="progress" style={{ height: "10px", borderRadius: "5px" }}>
                                                <div
                                                    className={`progress-bar progress-bar-striped progress-bar-animated ${lockRemainingTime <= 5 ? "bg-danger" : "bg-success"}`}
                                                    role="progressbar"
                                                    style={{ width: `${(lockRemainingTime / 15) * 100}%`, transition: "width 1s linear" }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="text-center mb-4">
                                        <h3 style={{ fontWeight: "800", color: "#333" }}>{event.title}</h3>
                                        <p className="text-muted">Enter your details below to secure your ticket</p>
                                    </div>

                                    <div className="participant_block mb-4 p-4" style={{ backgroundColor: "#fff", borderRadius: "15px", border: "1px solid #eee", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
                                        {/* Row 1: Name & Email */}
                                        <div className="row g-3 mb-3">
                                            <div className="col-md-6 text-start">
                                                <label className="mb-2 small fw-bold">Full Name <span style={{ color: 'red' }}>*</span></label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    style={{ borderRadius: "10px", padding: "12px", border: (formError && !participants[0].name.trim()) ? "1px solid red" : "1px solid #ced4da" }}
                                                    placeholder="Enter Name"
                                                    value={participants[0].name}
                                                    onChange={(e) => {
                                                        const up = [...participants];
                                                        up[0].name = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                                                        setParticipants(up);
                                                    }}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6 text-start">
                                                <label className="mb-2 small fw-bold">Email Address <span style={{ color: 'red' }}>*</span></label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    style={{ borderRadius: "10px", padding: "12px", border: (formError && !participants[0].email.trim()) ? "1px solid red" : "1px solid #ced4da" }}
                                                    placeholder="Enter Email"
                                                    value={participants[0].email}
                                                    onChange={(e) => {
                                                        const up = [...participants];
                                                        up[0].email = e.target.value;
                                                        setParticipants(up);
                                                    }}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Row 2: Phone & Location */}
                                        <div className="row g-3">
                                            <div className="col-md-6 text-start">
                                                <label className="mb-2 small fw-bold">Phone Number <span style={{ color: 'red' }}>*</span></label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    style={{ borderRadius: "10px", padding: "12px", border: (formError && !/^\d{10}$/.test(participants[0].phoneNo)) ? "1px solid red" : "1px solid #ced4da" }}
                                                    placeholder="10 digit number"
                                                    value={participants[0].phoneNo}
                                                    onChange={(e) => {
                                                        const up = [...participants];
                                                        up[0].phoneNo = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                        setParticipants(up);
                                                    }}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6 text-start">
                                                <label className="mb-2 small fw-bold">Location <span style={{ color: 'red' }}>*</span></label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    style={{ borderRadius: "10px", padding: "12px", border: (formError && !participants[0].location.trim()) ? "1px solid red" : "1px solid #ced4da" }}
                                                    placeholder="e.g. Mulund West"
                                                    value={participants[0].location}
                                                    onChange={(e) => {
                                                        const up = [...participants];
                                                        up[0].location = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                                                        setParticipants(up);
                                                    }}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {formError && <div className="alert alert-danger mt-3">{formError}</div>}

                                    <div className="text-center d-flex justify-content-center gap-3 mt-4">
                                        <button
                                            className="btn btn-outline-dark btn_md"
                                            style={{ width: "200px", borderRadius: "10px" }}
                                            onClick={() => setPageStatus('landing')}
                                        >
                                            Back
                                        </button>
                                        <button
                                            className={`btn btn_theme btn_md ${(lockRemainingTime > 0 && lockRemainingTime <= 5) ? 'pulse_btn' : ''}`}
                                            style={{ width: "200px" }}
                                            onClick={handleValidationAndSubmit}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Processing..." : "Submit Registration"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {pageStatus === 'success' && (
                                <div className="success_step text-center py-5">
                                    <div className="success_icon mb-4" style={{ fontSize: "60px", color: "#28a745" }}>
                                        ✅
                                    </div>
                                    <h2 style={{ fontWeight: "800", color: "#333", marginBottom: "30px" }}>Thank You!</h2>
                                    <p style={{ fontSize: "18px", color: "#666", marginBottom: "40px" }}>{successMsg}</p>

                                    <div className="tickets_container d-flex flex-column gap-5">
                                        {registeredParticipants.map((reg) => (
                                            <div key={reg.id}>
                                                <div id={`ticket-area-${reg.id}`} style={{ padding: "10px", backgroundColor: "#fff" }}>
                                                    <GoldenTicket registration={reg} event={event} />
                                                </div>
                                                <div className="mt-3">
                                                    <p className="text-muted small">
                                                        The official ticket has also been sent to <strong>{reg.email}</strong> which will be scanned at the Venue on the Event Date.<br />
                                                        Please check the SPAM/Junk folder of your mailbox also in case you don't find it in your Inbox.
                                                    </p>
                                                    <button
                                                        className="btn btn-outline-dark btn-sm"
                                                        onClick={() => {
                                                            const area = document.getElementById(`ticket-area-${reg.id}`);
                                                            import('html2canvas').then(html2canvas => {
                                                                html2canvas.default(area, {
                                                                    scale: 3,
                                                                    backgroundColor: "#fff",
                                                                    useCORS: true,
                                                                    logging: false
                                                                }).then(canvas => {
                                                                    const ticketName = (reg.name || "Ticket").replace(/\s+/g, '-');
                                                                    const link = document.createElement('a');
                                                                    link.download = `JYF-Ticket-${ticketName}.png`;
                                                                    link.href = canvas.toDataURL("image/png");
                                                                    link.click();
                                                                });
                                                            });
                                                        }}
                                                    >
                                                        Download Ticket (PNG)
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-5 pt-5 border-top">
                                        <button className="btn btn_theme btn_md" onClick={() => navigate('/')}>Back to Home</button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .registration_card { transition: all 0.3s ease; }
                .form-control { 
                    border-radius: 10px; 
                    padding: 12px 20px; 
                    border: 1px solid #e1e1e1;
                    font-size: 16px;
                }
                .form-control:focus {
                    box-shadow: 0 0 10px rgba(227, 49, 41, 0.1);
                    border-color: #e33129;
                }
                .btn_theme {
                    background: #e33129;
                    color: white;
                    border: none;
                    font-weight: 700;
                    border-radius: 10px;
                    transition: all 0.2s;
                }
                .btn_theme:hover {
                    background: #c22922;
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(227, 49, 41, 0.3);
                }
                .badge { border-radius: 20px; }
                .pulse_btn {
                    animation: pulse 1.5s infinite;
                    background: #e33129 !important;
                }
                @keyframes pulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(227, 49, 41, 0.7); }
                    70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(227, 49, 41, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(227, 49, 41, 0); }
                }
            `}</style>
        </section>
    );
};

export default EventRegistrationArea;
