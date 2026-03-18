import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { formatDate } from "../../utils/dateFormatter";

const AdminViewEvents = ({ onEdit }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [selectedEventTitle, setSelectedEventTitle] = useState("");
    const [attendees, setAttendees] = useState([]);
    const [loadingAttendees, setLoadingAttendees] = useState(false);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setEvents(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendees = async (eventId, title) => {
        setLoadingAttendees(true);
        setSelectedEventId(eventId);
        setSelectedEventTitle(title);
        try {
            const { data, error } = await supabase
                .from('event_registrations')
                .select('*')
                .eq('event_id', eventId)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            setAttendees(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingAttendees(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDeleteEvent = async (id) => {
        if (window.confirm("Delete this event and all its registrations?")) {
            try {
                const { error } = await supabase.from('events').delete().eq('id', id);
                if (error) throw error;
                setEvents(events.filter(e => e.id !== id));
            } catch (err) {
                alert("Delete failed: " + err.message);
            }
        }
    };

    const handleDeleteAttendee = async (id) => {
        if (window.confirm("Delete this user registration?")) {
            try {
                const { error } = await supabase.from('event_registrations').delete().eq('id', id);
                if (error) throw error;
                setAttendees(attendees.filter(a => a.id !== id));
            } catch (err) {
                alert("Delete failed: " + err.message);
            }
        }
    };

    if (loading) return <div className="text-center p-5"><h4>Loading Events...</h4></div>;

    if (selectedEventId) {
        return (
            <div style={{ backgroundColor: "#f4f6f9", padding: "30px", borderRadius: "15px" }}>
                <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                        <div>
                            <button onClick={() => setSelectedEventId(null)} style={{ border: "none", background: "none", color: "#666", display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", fontWeight: "600" }}>
                                <i className="fas fa-arrow-left"></i> Back to Events
                            </button>
                            <h3 style={{ margin: 0, fontWeight: "800", color: "#222" }}>Attendees: {selectedEventTitle}</h3>
                        </div>
                        <span className="badge" style={{ backgroundColor: "#28a74515", color: "#28a745", padding: "10px 20px", borderRadius: "30px", fontWeight: "700" }}>
                            {attendees.length} Users Registered
                        </span>
                    </div>

                    {loadingAttendees ? (
                        <div className="text-center p-5">Loading Attendees...</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table" style={{ borderCollapse: "separate", borderSpacing: "0 10px", marginTop: "-10px" }}>
                                <thead>
                                    <tr>
                                        <th style={{ border: "none", color: "#777", fontSize: "12px", textTransform: "uppercase" }}>User Name</th>
                                        <th style={{ border: "none", color: "#777", fontSize: "12px", textTransform: "uppercase" }}>Contact Info</th>
                                        <th style={{ border: "none", color: "#777", fontSize: "12px", textTransform: "uppercase" }}>Status</th>
                                        <th style={{ border: "none", color: "#777", fontSize: "12px", textTransform: "uppercase" }}>Registered On</th>
                                        <th style={{ border: "none", color: "#777", fontSize: "12px", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendees.map((r) => (
                                        <tr key={r.id} style={{ backgroundColor: "#fafafa", borderRadius: "10px", verticalAlign: "middle" }}>
                                            <td style={{ border: "none", padding: "15px", fontWeight: "700", borderTopLeftRadius: "12px", borderBottomLeftRadius: "12px" }}>{r.full_name}</td>
                                            <td style={{ border: "none", padding: "15px", fontSize: "13px" }}>
                                                <div>{r.email}</div>
                                                <div style={{ color: "#999" }}>{r.phone_number}</div>
                                            </td>
                                            <td style={{ border: "none", padding: "15px" }}>
                                                {r.is_checked_in ? (
                                                    <span style={{ color: "#28a745", fontWeight: "800", fontSize: "11px" }}><i className="fas fa-check-circle"></i> CHECKED-IN</span>
                                                ) : (
                                                    <span style={{ color: "#ffc107", fontWeight: "800", fontSize: "11px" }}><i className="fas fa-clock"></i> PENDING</span>
                                                )}
                                            </td>
                                            <td style={{ border: "none", padding: "15px", fontSize: "13px" }}>{formatDate(r.created_at)}</td>
                                            <td style={{ border: "none", padding: "15px", borderTopRightRadius: "12px", borderBottomRightRadius: "12px", textAlign: "right" }}>
                                                <button onClick={() => handleDeleteAttendee(r.id)} style={{ border: "none", background: "none", color: "#e33129" }}><i className="fas fa-trash"></i></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {attendees.length === 0 && (
                                        <tr><td colSpan="5" className="text-center p-5 text-muted">No one has registered for this event yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: "#f4f6f9", padding: "30px", borderRadius: "15px" }}>
            <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                    <h3 style={{ margin: 0, fontWeight: "800", color: "#222" }}>Manage Events Detailed</h3>
                    <span className="badge" style={{ backgroundColor: "#e3312915", color: "#e33129", padding: "10px 20px", borderRadius: "30px", fontWeight: "700" }}>
                        {events.length} Total Events
                    </span>
                </div>
                
                <div className="table-responsive">
                    <table className="table" style={{ borderCollapse: "separate", borderSpacing: "0 15px", marginTop: "-15px" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#fdfdfd" }}>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px" }}>Image</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px" }}>Title</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px" }}>Venue</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px" }}>Date</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px", textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((e) => {
                                const images = (e.image_url || "").split(',');
                                const firstImage = images[0];
                                return (
                                    <tr key={e.id} style={{ backgroundColor: "#fff", boxShadow: "0 5px 15px rgba(0,0,0,0.02)", borderRadius: "10px", verticalAlign: "middle" }}>
                                        <td style={{ border: "none", padding: "15px", borderTopLeftRadius: "15px", borderBottomLeftRadius: "15px" }}>
                                            <img src={firstImage} alt="img" style={{ width: "60px", height: "60px", borderRadius: "12px", objectFit: "cover", border: "1px solid #f0f0f0" }} />
                                        </td>
                                        <td style={{ border: "none", padding: "15px" }}>
                                            <div style={{ fontWeight: "700", color: "#222", fontSize: "15px" }}>{e.title}</div>
                                            <div style={{ display: "flex", gap: "8px", marginTop: "5px" }}>
                                                <span style={{ fontSize: "11px", backgroundColor: "#ca1e1410", color: "#ca1e14", padding: "2px 8px", borderRadius: "10px", fontWeight: "700" }}>{e.tag || "#Event"}</span>
                                                <button onClick={() => fetchAttendees(e.id, e.title)} style={{ border: "none", background: "none", color: "#007bff", fontSize: "12px", fontWeight: "700", padding: "0" }}>
                                                    <i className="fas fa-users mr-1"></i> View Registrations
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{ border: "none", padding: "15px" }}>
                                            <div style={{ fontSize: "13px", color: "#555", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.venue}</div>
                                        </td>
                                        <td style={{ border: "none", padding: "15px" }}>
                                            <div style={{ fontSize: "13px", fontWeight: "600" }}>{formatDate(e.startAt || e.start_at)}</div>
                                        </td>
                                        <td style={{ border: "none", padding: "15px", borderTopRightRadius: "15px", borderBottomRightRadius: "15px", textAlign: "right" }}>
                                            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                                                <button onClick={() => onEdit(e)} className="btn btn-light" style={{ width: "35px", height: "35px", borderRadius: "10px", color: "#f39c12" }}><i className="fas fa-edit"></i></button>
                                                <button onClick={() => handleDeleteEvent(e.id)} className="btn btn-light" style={{ width: "35px", height: "35px", borderRadius: "10px", color: "#e33129" }}><i className="fas fa-trash"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminViewEvents;
