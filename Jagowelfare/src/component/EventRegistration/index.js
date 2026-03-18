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
    const [currentStep, setCurrentStep] = useState(0); // 0 to numSeats-1
    const [participants, setParticipants] = useState([]);

    // Form fields for current participant
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNo: "",
        location: ""
    });
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

                // 2. Fetch booked count from backend API
                try {
                    const countRes = await apiFetch(`/events/${eventId}/count`);
                    const count = countRes.bookedCount || 0;
                    setBookedCount(count);
                    
                    if (data.seatsAvailable && count >= data.seatsAvailable) {
                        setIsSoldOut(true);
                    }
                } catch (countErr) {
                    console.error("Failed to fetch booked count:", countErr);
                }

            } catch (err) {
                setError(err?.message || "Failed to load event");
            } finally {
                setLoading(false);
            }
        };

        if (eventId) fetchEvent();
    }, [eventId]);

    const handleStartRegistration = () => {
        // Initialize empty participants array
        const emptyParticipants = Array(numSeats).fill(null).map(() => ({
            name: "",
            email: "",
            phoneNo: "",
            location: ""
        }));
        setParticipants(emptyParticipants);
        setPageStatus('form');
        setCurrentStep(0);
        // Pre-fill first one if user info available
        if (user && user.user_metadata) {
            setFormData({
                name: user.user_metadata.full_name || "",
                email: user.email || "",
                phoneNo: user.user_metadata.phone || "",
                location: ""
            });
        }
    };


    const handleNext = () => {
        // Validation for unique phone number
        if (!formData.phoneNo) {
            setError("Phone number is required");
            return;
        }

        // Save current form data into participants array
        const updatedParticipants = [...participants];

        // Local Check for duplicate phone in current registration session
        const phoneExists = updatedParticipants.some((p, idx) => idx !== currentStep && p.phoneNo === formData.phoneNo);
        if (phoneExists) {
            setError("Same phone number is not allowed for different seats!");
            return;
        }

        updatedParticipants[currentStep] = formData;
        setParticipants(updatedParticipants);
        setError("");

        if (currentStep < numSeats - 1) {
            setCurrentStep(currentStep + 1);
            // Pre-fill next form if it was already filled (if going back/forth) or reset
            setFormData(updatedParticipants[currentStep + 1].name ? updatedParticipants[currentStep + 1] : {
                name: "",
                email: "",
                phoneNo: "",
                location: ""
            });
        } else {
            // Last form filled, trigger submit
            handleSubmit(updatedParticipants);
        }
    };

    const handleSubmit = async (finalParticipants) => {
        setIsSubmitting(true);
        setError("");
        try {
            // Save each participant to Supabase seriously
            const inserts = finalParticipants.map(v => ({
                event_id: eventId,
                full_name: v.name,
                email: v.email,
                phone_number: v.phoneNo,
                location: v.location
            }));

            const { data, error: sbError } = await supabase
                .from('event_registrations')
                .insert(inserts)
                .select(); // Get data back with IDs

            if (sbError) throw sbError;

            setRegisteredParticipants(data || []);
            setPageStatus('success');
            setSuccessMsg("Your registration is successful! Your Golden Ticket has been generated.");
        } catch (err) {
            setError(err?.message || "Registration failed. One of the numbers might already be registered.");
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

                                    <div className="text-center">
                                        <button 
                                            className="btn btn_theme btn_md" 
                                            style={{ width: "200px", backgroundColor: isSoldOut ? "#777" : "#e33129" }} 
                                            onClick={handleStartRegistration}
                                            disabled={isSoldOut}
                                        >
                                            {isSoldOut ? "SOLDOUT" : "Register Now"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {pageStatus === 'form' && (
                                <div className="form_step">
                                    <h3 className="text-center mb-4" style={{ fontWeight: "700" }}>Register for Bhakti Sandhya</h3>
                                    <div className="progress_header mb-4 text-center">
                                        <span className="badge bg-danger p-2" style={{ fontSize: "14px" }}>Person {currentStep + 1} of {numSeats}</span>
                                    </div>

                                    <div className="form-group mb-3">
                                        <label className="mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Enter Email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            placeholder="Enter Phone Number"
                                            value={formData.phoneNo}
                                            onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group mb-3">
                                                <label className="mb-2">Location</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="e.g. Mulund West"
                                                    value={formData.location}
                                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>


                                    {error && <div className="alert alert-danger mt-3">{error}</div>}

                                    <div className="text-center mt-4">
                                        <button
                                            className="btn btn_theme btn_md px-5"
                                            onClick={handleNext}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Processing..." : (currentStep < numSeats - 1 ? "Next" : "Submit")}
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
                                                <GoldenTicket registration={reg} event={event} />
                                                <div className="mt-3">
                                                    <p className="text-muted small">An email with this ticket has been simulated and sent to <strong>{reg.email}</strong></p>
                                                    <button className="btn btn-outline-dark btn-sm" onClick={() => window.print()}>Download / Print Ticket</button>
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
