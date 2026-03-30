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

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                // 1. Fetch event from Supabase
                const { data, error: sbError } = await supabase
                    .from("events")
                    .select("*")
                    .eq("id", eventId)
                    .single();

                if (sbError) throw sbError;
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
                        if (names.length > 0) setSelectedSection(names[0]);
                    } catch (e) {
                        console.error("Failed to parse sections", e);
                    }
                }

                // 2. Fetch all registrations for this event safely
                const { data: regList, error: countError } = await supabase
                    .from('event_registrations')
                    .select('selected_section')
                    .eq('event_id', eventId);
                
                if (countError) throw countError;
                
                const currentCounts = {};
                (regList || []).forEach(r => {
                    const s = r.selected_section || "General";
                    currentCounts[s] = (currentCounts[s] || 0) + 1;
                });
                
                setSectionBookedCounts(currentCounts);
                setBookedCount(regList?.length || 0);
                
                if (data.seatsAvailable && (regList?.length || 0) >= data.seatsAvailable) {
                    setIsSoldOut(true);
                }

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
        const isStaff = user?.email === 'jainyouthfoundation9@gmail.com'; 
        
        if (event && selectedSection && participants[0].section === "") {
            setParticipants([{
                name: (user && !isStaff) ? (user?.user_metadata?.full_name || "") : "",
                email: (user && !isStaff) ? (user?.email || "") : "",
                phoneNo: (user && !isStaff) ? (user?.user_metadata?.phone || "") : "",
                location: "",
                section: selectedSection
            }]);
        }
    }, [event, selectedSection, user]);


    const handleValidationAndSubmit = async () => {
        setFormError("");
        const p = participants[0];

        if (!p.name.trim()) { setFormError("Name is required"); return; }
        if (!p.email.trim()) { setFormError("Email is required"); return; }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(p.email.trim())) {
            setFormError("Please enter a valid email address (e.g., user@example.com)");
            return;
        }
        if (!/^\d{10}$/.test(p.phoneNo)) { setFormError("Valid 10-digit phone number required"); return; }
        if (!p.location.trim()) { setFormError("Location is required"); return; }

        // DB check for duplicate registration
        try {
            const { count } = await supabase
                .from('event_registrations')
                .select('*', { count: 'exact', head: true })
                .eq('event_id', eventId)
                .eq('phone_number', p.phoneNo);
            
            if (count > 0) {
                setFormError(`This phone number (${p.phoneNo}) is already registered for this event.`);
                return;
            }
        } catch (e) {
            console.error("DB check error", e);
        }

        handleSubmit(participants);
    };

    const handleSubmit = async (finalParticipants) => {
        setIsSubmitting(true);
        setError("");
        try {
            const inserts = finalParticipants.map(v => ({
                event_id: eventId,
                full_name: v.name,
                email: v.email,
                phone_number: v.phoneNo,
                location: v.location,
                selected_section: selectedSection, // Use real column
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

            // TRIGGER ACTUAL EMAIL SENDING via server.js
            try {
                for (const reg of enrichedData) {
                    await fetch('/api/send-ticket', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            recipientEmail: reg.email,
                            recipientName: reg.full_name,
                            eventTitle: event.title,
                            ticketId: reg.id,
                            section: reg.selected_section,
                            venue: event.venue || "TBD",
                            date: formatDate(event.startAt),
                            time: formatTime(event.startAt)
                        })
                    });
                }
            } catch (emailErr) {
                console.error("Email sending background error:", emailErr);
            }

            setRegisteredParticipants(enrichedData || []);
            setPageStatus('success');
            setSuccessMsg("Your registration is successful! Official Tickets have been sent to your email.");
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

                                    {/* Important Note Added */}
                                    <div className="important_note_section mb-4 p-4" style={{ 
                                        backgroundColor: "#f9fcf9", 
                                        border: "1px solid #d4edda", 
                                        borderRadius: "15px",
                                        textAlign: "left" 
                                    }}>
                                        <h6 style={{ color: "#155724", fontWeight: "700", marginBottom: "15px" }}>⚠️ Important Note:</h6>
                                        <ul style={{ 
                                            margin: 0, 
                                            paddingLeft: "1.5rem", 
                                            color: "#333", 
                                            fontSize: "15px", 
                                            lineHeight: "1.6",
                                            fontWeight: "500"
                                        }}>
                                            <li>Kindly register only if you are certain to attend, as seats are limited.</li>
                                            <li>One registration per mobile number will be considered.</li>
                                            <li>Entry will be on a first-come, first-served basis — registration does not guarantee a reserved seat.</li>
                                            <li>Guests are requested to arrive on time to avoid inconvenience.</li>
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
                                                    <div style={{ padding: "10px", backgroundColor: isSoldOut ? "#feecec" : "#e7f4e8", borderRadius: "10px", color: isSoldOut ? "#e33129" : "#28a745", fontWeight: "700" }}>
                                                        {isSoldOut ? (
                                                            <span>🚫 SOLD OUT - All {event.seatsAvailable} seats are booked!</span>
                                                        ) : (
                                                            <span>✨ Only {(event.seatsAvailable - bookedCount)} Seats Remaining</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {!isSoldOut && (
                                        <div className="registration_form_step mt-5">
                                            <h3 className="text-center mb-4" style={{ fontWeight: "700", color: "#e33129" }}>Complete Your Registration</h3>
                                            
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
                                                    onClick={() => navigate(-1)}
                                                >
                                                    Back
                                                </button>
                                                <button 
                                                    className="btn btn_theme btn_md" 
                                                    style={{ width: "200px" }} 
                                                    onClick={handleValidationAndSubmit}
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? "Processing..." : "Register Now"}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {isSoldOut && (
                                        <div className="text-center mt-4">
                                            <button className="btn btn-outline-dark btn_md" onClick={() => navigate(-1)}>Back to Events</button>
                                        </div>
                                    )}
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
                                                    <p className="text-muted small">The official ticket has been sent to <strong>{reg.email}</strong></p>
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
            `}</style>
        </section>
    );
};

export default EventRegistrationArea;
