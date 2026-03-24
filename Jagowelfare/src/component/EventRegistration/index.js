import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import { apiFetch } from "../../api";
import { useAuth } from "../../auth/AuthProvider";
import { formatDate, formatTime } from "../../utils/dateFormatter";
import GoldenTicket from "./GoldenTicket";

const EventRegistrationArea = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Page states: 'landing' (details + seat choice), 'form' (collecting details), 'success' (msg)
    const [pageStatus, setPageStatus] = useState('landing');
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [bookedCount, setBookedCount] = useState(0);
    const [isSoldOut, setIsSoldOut] = useState(false);

    // Seat and participant states
    const [numSeats, setNumSeats] = useState(1);
    const [selectedSection, setSelectedSection] = useState("");
    const [availableSections, setAvailableSections] = useState([]);
    const [sectionsList, setSectionsList] = useState([]); // Defined sections {name, seats}
    const [sectionBookedCounts, setSectionBookedCounts] = useState({}); // { 'Gold': 5 }
    const [sectionError, setSectionError] = useState(""); // Immediate feedback error

    const [currentStep, setCurrentStep] = useState(0); // 0 to numSeats-1
    const [participants, setParticipants] = useState([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [registeredParticipants, setRegisteredParticipants] = useState([]);

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
        if (sectionsList.length === 0) return;

        // Auto-select the first available section that has at least 1 seat left
        const autoFindSection = () => {
            for (const section of sectionsList) {
                const limit = parseInt(section.seats) || 0;
                const booked = sectionBookedCounts[section.name] || 0;
                if (limit > 0 && booked < limit) {
                    return section.name;
                }
            }
            return sectionsList[0]?.name || "";
        };

        const autoSection = autoFindSection();
        setSelectedSection(autoSection);

        if (!autoSection) {
            setSectionError("No sections available.");
            return;
        }

        const targetSection = sectionsList.find(s => s.name === autoSection);
        const sectionLimit = targetSection ? parseInt(targetSection.seats) : 0;
        const currentBooked = sectionBookedCounts[autoSection] || 0;
        
        if (sectionLimit > 0 && (currentBooked + parseInt(numSeats)) > sectionLimit) {
            // Check if there's any section that can hold ALL requested seats
            const sectionWithSpace = sectionsList.find(s => {
                const booked = sectionBookedCounts[s.name] || 0;
                return (booked + parseInt(numSeats)) <= parseInt(s.seats);
            });

            if (!sectionWithSpace) {
                // If no single section can hold all, we might have to split, 
                // but for now let's just show a warning that the remaining seats in this section are low.
                // Or find the section with MOST space.
                setSectionError(`Only ${sectionLimit - currentBooked} seats left in the current available section (${autoSection}). Please reduce the number of seats.`);
            } else {
                setSelectedSection(sectionWithSpace.name);
                setSectionError("");
            }
        } else {
            setSectionError("");
        }
    }, [numSeats, sectionsList, sectionBookedCounts]);


    const handleStartRegistration = () => {
        if (availableSections.length > 0 && !selectedSection) {
            setError("Please select a seat section");
            return;
        }

        if (sectionError) {
             setError(sectionError);
             return;
        }

        setError("");

        // Initialize empty participants array
        const pArr = Array(parseInt(numSeats)).fill(null).map(() => ({
            name: "",
            email: "",
            phoneNo: "",
            location: "",
            section: selectedSection
        }));

        // Pre-fill first participant if user logged in
        if (user && user.user_metadata) {
            pArr[0] = {
                name: user.user_metadata.full_name || "",
                email: user.email || "",
                phoneNo: user.user_metadata.phone || "",
                location: "",
                section: selectedSection
            };
        }

        setParticipants(pArr);
        setPageStatus('form');
        setCurrentStep(0);
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
                    await fetch('http://localhost:5000/api/send-ticket', {
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
    if (error && pageStatus === 'landing') return <div className="text-center section_padding"><h3 style={{ color: 'red' }}>{error}</h3></div>;
    if (!event) return <div className="text-center section_padding"><h3>Event not found</h3></div>;

    return (
        <section id="registration_area" className="section_padding">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 offset-lg-2">
                        <div className="registration_card" style={{
                            background: "#fff",
                            borderRadius: "20px",
                            boxShadow: "0 15px 50px rgba(0,0,0,0.1)",
                            overflow: "hidden",
                            padding: "40px"
                        }}>

                            {pageStatus === 'landing' && (
                                <div className="event_info_step">
                                    <div className="text-center mb-4">
                                        <h2 style={{ fontWeight: "800", color: "#333" }}>{event.title}</h2>
                                        <p className="text-muted" style={{ fontSize: "18px" }}>Please select how many seats you want to book</p>
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
                                                            <span>✨ Only {(event.seatsAvailable - bookedCount)} Seats Remaining (Total: {event.seatsAvailable})</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>


                                    <div className="seat_selector text-center mb-5">
                                        <label style={{ display: "block", marginBottom: "15px", fontWeight: "700", fontSize: "1.1rem" }}>Number of Seats</label>
                                        <div className="d-flex justify-content-center align-items-center gap-3">
                                            <button 
                                                className="btn btn-outline-danger" 
                                                style={{ borderRadius: "50%", width: "45px", height: "45px", fontWeight: "bold" }} 
                                                onClick={() => setNumSeats(Math.max(1, numSeats - 1))}
                                                disabled={isSoldOut}
                                            >-</button>
                                            <span style={{ fontSize: "24px", fontWeight: "800", minWidth: "40px", color: isSoldOut ? "#ccc" : "#000" }}>
                                                {isSoldOut ? 0 : numSeats}
                                            </span>
                                            <button 
                                                className="btn btn-outline-danger" 
                                                style={{ borderRadius: "50%", width: "45px", height: "45px", fontWeight: "bold" }} 
                                                onClick={() => setNumSeats(prev => Math.min(event.seatsAvailable ? Math.min(10, event.seatsAvailable - bookedCount) : 10, prev + 1))}
                                                disabled={isSoldOut || (event.seatsAvailable && numSeats >= (event.seatsAvailable - bookedCount))}
                                            >+</button>
                                        </div>
                                    </div>

                                    {sectionError && (
                                        <div className="section_selector text-center mb-5">
                                            <div style={{ color: "#e33129", marginTop: "15px", fontWeight: "800", fontSize: "14px", padding: "12px", backgroundColor: "#fff5f5", borderRadius: "10px", maxWidth: "450px", margin: "15px auto", border: "1px solid #ffcccc" }}>
                                                ⚠️ {sectionError}
                                            </div>
                                        </div>
                                    )}


                                    <div className="text-center d-flex justify-content-center gap-3">
                                        <button 
                                            className="btn btn-outline-dark btn_md" 
                                            style={{ width: "200px", borderRadius: "10px" }}
                                            onClick={() => navigate(-1)}
                                        >
                                            Back
                                        </button>
                                        <button 
                                            className="btn btn_theme btn_md" 
                                            style={{ width: "200px", backgroundColor: (isSoldOut || sectionError) ? "#ccc" : "#e33129", cursor: (isSoldOut || sectionError) ? "not-allowed" : "pointer" }} 
                                            onClick={handleStartRegistration}
                                            disabled={isSoldOut || !!sectionError}
                                        >
                                            {isSoldOut ? "SOLDOUT" : sectionError ? "FULL" : "Register Now"}
                                        </button>
                                    </div>
                                </div>
                            )}



                            {pageStatus === 'form' && (
                                <div className="form_step">
                                    <h3 className="text-center mb-4" style={{ fontWeight: "700" }}>Register for Bhakti Sandhya</h3>
                                    
                                    <div className="participants_area mb-4">
                                        {[0, 1].map(offset => {
                                            const pIdx = currentStep + offset;
                                            if (pIdx >= numSeats) return null;
                                            const p = participants[pIdx];

                                            return (
                                                <div key={pIdx} className="participant_block mb-4 p-4" style={{ backgroundColor: "#fff", borderRadius: "15px", border: "1px solid #eee", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
                                                    <h5 className="mb-4 text-start" style={{ fontWeight: "800", color: "#e33129" }}>Person {pIdx + 1} of {numSeats}</h5>
                                                    
                                                    {/* Row 1: Name & Email */}
                                                    <div className="row g-3 mb-3">
                                                        <div className="col-md-6 text-start">
                                                            <label className="mb-2 small fw-bold">Full Name <span style={{ color: 'red' }}>*</span></label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                style={{ borderRadius: "10px", padding: "12px", border: (error && !p.name.trim()) ? "1px solid red" : "1px solid #ced4da" }}
                                                                placeholder="Enter Name"
                                                                value={p.name}
                                                                 onChange={(e) => {
                                                                    const up = [...participants];
                                                                    up[pIdx].name = e.target.value.replace(/[^a-zA-Z\s]/g, '');
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
                                                                style={{ borderRadius: "10px", padding: "12px", border: (error && !p.email.trim()) ? "1px solid red" : "1px solid #ced4da" }}
                                                                placeholder="Enter Email"
                                                                value={p.email}
                                                                onChange={(e) => {
                                                                    const up = [...participants];
                                                                    up[pIdx].email = e.target.value;
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
                                                                style={{ borderRadius: "10px", padding: "12px", border: (error && !/^\d{10}$/.test(p.phoneNo)) ? "1px solid red" : "1px solid #ced4da" }}
                                                                placeholder="10 digit number"
                                                                value={p.phoneNo}
                                                                onChange={(e) => {
                                                                    const up = [...participants];
                                                                    up[pIdx].phoneNo = e.target.value.replace(/\D/g, '').slice(0, 10);
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
                                                                style={{ borderRadius: "10px", padding: "12px", border: (error && !p.location.trim()) ? "1px solid red" : "1px solid #ced4da" }}
                                                                placeholder="e.g. Mulund West"
                                                                value={p.location}
                                                                onChange={(e) => {
                                                                    const up = [...participants];
                                                                    up[pIdx].location = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                                                                    setParticipants(up);
                                                                }}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {error && <div className="alert alert-danger mt-3">{error}</div>}

                                    <div className="text-center mt-4 d-flex justify-content-center gap-3">
                                        <button 
                                            type="button"
                                            className="btn btn-outline-dark btn_md px-5"
                                            style={{ borderRadius: "10px" }}
                                            onClick={() => {
                                                if (currentStep === 0) {
                                                    setPageStatus('landing');
                                                } else {
                                                    setCurrentStep(prev => Math.max(0, prev - 2));
                                                }
                                                setError("");
                                            }}
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn_theme btn_md px-5"
                                            onClick={async () => {
                                                setError("");
                                                // Validate CURRENT page forms
                                                for (let i = currentStep; i < Math.min(currentStep + 2, numSeats); i++) {
                                                    const p = participants[i];
                                                    if (!p.name.trim()) { setError(`Person ${i+1}: Name is required`); return; }
                                                    if (!p.email.trim()) { setError(`Person ${i+1}: Email is required`); return; }
                                                    if (!/^\d{10}$/.test(p.phoneNo)) { setError(`Person ${i+1}: Valid 10-digit number required`); return; }
                                                    if (!p.location.trim()) { setError(`Person ${i+1}: Location is required`); return; }
                                                    
                                                    // Local check
                                                    const dup = participants.some((dp, idx) => idx !== i && dp.phoneNo === p.phoneNo && p.phoneNo.length > 0);
                                                    if (dup) { setError(`Phone numbers must be unique! (Check Person ${i+1})`); return; }

                                                    // DB check
                                                    try {
                                                        const { count } = await supabase.from('event_registrations').select('*', { count: 'exact', head: true }).eq('event_id', eventId).eq('phone_number', p.phoneNo);
                                                        if (count > 0) { setError(`Number ${p.phoneNo} (Person ${i+1}) is already registered.`); return; }
                                                    } catch (e) {}
                                                }

                                                if (currentStep + 2 < numSeats) {
                                                    setCurrentStep(prev => prev + 2);
                                                    window.scrollTo(0,0);
                                                } else {
                                                    handleSubmit(participants);
                                                }
                                            }}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Processing..." : (currentStep + 2 < numSeats ? "Next" : "Submit")}
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
