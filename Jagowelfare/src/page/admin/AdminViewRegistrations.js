import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { formatDate } from "../../utils/dateFormatter";

const AdminViewRegistrations = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState({});
    const [eventsList, setEventsList] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState("all");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: eventsData } = await supabase.from('events').select('id, title');
            setEventsList(eventsData || []);
            const eventMap = {};
            eventsData?.forEach(e => eventMap[e.id] = e.title);
            setEvents(eventMap);

            const { data, error } = await supabase.from('event_registrations').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setRegistrations(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this registration?")) {
            try {
                const { error } = await supabase.from('event_registrations').delete().eq('id', id);
                if (error) throw error;
                setRegistrations(registrations.filter(r => r.id !== id));
            } catch (err) {
                alert("Delete failed: " + err.message);
            }
        }
    };

    if (loading) return <div className="text-center p-5"><h4>Loading registrations...</h4></div>;

    return (
        <div style={{ backgroundColor: "#f4f6f9", padding: "30px", borderRadius: "15px" }}>
            <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
                    <div>
                        <h3 style={{ margin: 0, fontWeight: "800", color: "#222" }}>User Registration Data</h3>
                        <div style={{ marginTop: "15px" }}>
                            <select 
                                value={selectedEventId} 
                                onChange={(e) => setSelectedEventId(e.target.value)}
                                style={{ padding: "10px 15px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "14px", minWidth: "250px", outline: "none", backgroundColor: "#f9f9f9" }}
                            >
                                <option value="all">Search / Filter by Event (All)</option>
                                {eventsList.map(ev => (
                                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <span className="badge" style={{ backgroundColor: "#28a74515", color: "#28a745", padding: "10px 20px", borderRadius: "30px", fontWeight: "700" }}>
                            {registrations.filter(r => (selectedEventId === "all" || String(r.event_id) === String(selectedEventId))).filter(r => r.is_checked_in).length} Checked-in
                        </span>
                        <span className="badge" style={{ backgroundColor: "#e3312915", color: "#e33129", padding: "10px 20px", borderRadius: "30px", fontWeight: "700" }}>
                            {registrations.filter(r => (selectedEventId === "all" || String(r.event_id) === String(selectedEventId))).length} Total
                        </span>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table" style={{ borderCollapse: "separate", borderSpacing: "0 12px", marginTop: "-12px" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#fdfdfd" }}>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "11px" }}>User Name</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "11px" }}>Contact Details</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "11px" }}>Registered For</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "11px" }}>Status</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "11px" }}>Date</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "11px", textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations
                                .filter(r => selectedEventId === "all" || String(r.event_id) === String(selectedEventId))
                                .map((r) => (
                                <tr key={r.id} style={{ backgroundColor: "#fff", boxShadow: "0 4px 10px rgba(0,0,0,0.01)", borderRadius: "12px", verticalAlign: "middle" }}>
                                    <td style={{ border: "none", padding: "15px", borderTopLeftRadius: "15px", borderBottomLeftRadius: "15px" }}>
                                        <div style={{ fontWeight: "800", color: "#222", fontSize: "15px" }}>{r.full_name}</div>
                                        <div style={{ fontSize: "12px", color: "#999" }}>Location: {r.location || "N/A"}</div>
                                    </td>
                                    <td style={{ border: "none", padding: "15px" }}>
                                        <div style={{ fontSize: "13px", color: "#444" }}><i className="fas fa-envelope mr-2" style={{ width: "15px", color: "#aaa" }}></i> {r.email}</div>
                                        <div style={{ fontSize: "13px", color: "#444" }}><i className="fas fa-phone mr-2" style={{ width: "15px", color: "#aaa" }}></i> {r.phone_number}</div>
                                    </td>
                                    <td style={{ border: "none", padding: "15px" }}>
                                        <div style={{ fontWeight: "700", color: "#e33129", fontSize: "14px" }}>{events[r.event_id] || "Unknown Event"}</div>
                                    </td>
                                    <td style={{ border: "none", padding: "15px" }}>
                                        {r.is_checked_in ? (
                                            <span style={{ backgroundColor: "#28a74515", color: "#28a745", padding: "6px 15px", borderRadius: "10px", fontSize: "11px", fontWeight: "800", textTransform: "uppercase" }}>Checked-In</span>
                                        ) : (
                                            <span style={{ backgroundColor: "#ffc10715", color: "#b58d00", padding: "6px 15px", borderRadius: "10px", fontSize: "11px", fontWeight: "800", textTransform: "uppercase" }}>Pending</span>
                                        )}
                                    </td>
                                    <td style={{ border: "none", padding: "15px", fontSize: "13px", color: "#666" }}>
                                        {formatDate(r.created_at)}
                                    </td>
                                    <td style={{ border: "none", padding: "15px", borderTopRightRadius: "15px", borderBottomRightRadius: "15px", textAlign: "right" }}>
                                        <button onClick={() => handleDelete(r.id)} className="btn btn-light" style={{ width: "35px", height: "35px", borderRadius: "10px", color: "#e33129" }}>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminViewRegistrations;
