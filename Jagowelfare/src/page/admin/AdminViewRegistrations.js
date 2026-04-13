import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { formatDate } from "../../utils/dateFormatter";

const AdminViewRegistrations = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState({});
    const [eventsList, setEventsList] = useState([]);
    const [eventsFullList, setEventsFullList] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState("all");
    const [viewMode, setViewMode] = useState("all");
    const [resendingId, setResendingId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: eventsData } = await supabase.from('events').select('*');
            setEventsList(eventsData || []);
            setEventsFullList(eventsData || []);
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

    const handleResendEmail = async (reg) => {
        const ev = eventsFullList.find(e => e.id === reg.event_id);
        if (!ev) {
            alert("Event details not found!");
            return;
        }

        setResendingId(reg.id);
        try {
            const response = await fetch('/api/send-ticket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipientEmail: reg.email,
                    recipientName: reg.full_name,
                    eventTitle: ev.title,
                    ticketId: reg.id,
                    section: reg.selected_section,
                    description: ev.description,
                    venue: ev.venue || "Kalidas Auditorium, Mulund West, Mumbai",
                    date: formatDate(ev.startAt || ev.start_at),
                    time: "07:00 PM" 
                })
            });

            if (response.ok) {
                alert(`Official Ticket successfully resent to ${reg.full_name}`);
            } else {
                throw new Error("Failed to send email. Please check server logs.");
            }
        } catch (err) {
            alert("Error: " + err.message);
        } finally {
            setResendingId(null);
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

    const getRepeatedRegistrations = () => {
        const counts = {};
        const filtered = registrations.filter(r => selectedEventId === "all" || String(r.event_id) === String(selectedEventId));
        filtered.forEach(r => {
            const key = r.phone_number;
            counts[key] = (counts[key] || 0) + 1;
        });
        return filtered.filter(r => {
            const key = r.phone_number;
            return counts[key] > 1;
        });
    };

    const downloadCSV = () => {
        const filtered = registrations.filter(r => selectedEventId === "all" || String(r.event_id) === String(selectedEventId));
        const headers = ["User Name", "Email", "Phone", "Location", "Event", "Section", "Status", "Date"];
        const rows = filtered.map(r => [
            r.full_name,
            r.email,
            r.phone_number,
            r.location || "N/A",
            events[r.event_id] || "Unknown",
            r.selected_section || "General",
            r.is_checked_in ? "Checked-In" : "Pending",
            formatDate(r.created_at)
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `registrations-${new Date().toISOString().slice(0,10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="text-center p-5"><h4>Loading registrations...</h4></div>;

    const displayedRegistrations = viewMode === "repeated" ? getRepeatedRegistrations() : registrations.filter(r => selectedEventId === "all" || String(r.event_id) === String(selectedEventId));

    return (
        <div style={{ backgroundColor: "#f4f6f9", padding: "0", borderRadius: "15px" }}>
            <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "20px" }}>
                    <div>
                        <h3 style={{ margin: 0, fontWeight: "800", color: "#222" }}>User Registration Data</h3>
                        <div style={{ marginTop: "15px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
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

                            <select 
                                value={viewMode} 
                                onChange={(e) => setViewMode(e.target.value)}
                                style={{ padding: "10px 15px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "14px", minWidth: "180px", outline: "none", backgroundColor: viewMode === "repeated" ? "#ffebeb" : "#f9f9f9", color: viewMode === "repeated" ? "#e33129" : "#333", fontWeight: "600" }}
                            >
                                <option value="all">Show All Entries</option>
                                <option value="repeated">🔥 Repeated Details Only</option>
                            </select>

                            <button
                                onClick={downloadCSV}
                                style={{ padding: "10px 20px", borderRadius: "10px", border: "none", backgroundColor: "#333", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                            >
                                <i className="fas fa-file-csv"></i> Export CSV File
                            </button>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <span className="badge" style={{ backgroundColor: "#28a74515", color: "#28a745", padding: "10px 20px", borderRadius: "30px", fontWeight: "700" }}>
                            {displayedRegistrations.filter(r => r.is_checked_in).length} Checked-in
                        </span>
                        <span className="badge" style={{ backgroundColor: "#e3312915", color: "#e33129", padding: "10px 20px", borderRadius: "30px", fontWeight: "700" }}>
                            {displayedRegistrations.length} {viewMode === "repeated" ? "Repeated" : "Total"}
                        </span>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table" style={{ borderCollapse: "separate", borderSpacing: "0 12px", marginTop: "-12px" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#fdfdfd", position: "sticky", top: 0, zIndex: 1, boxShadow: "0 1px 0 #eee" }}>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "11px", backgroundColor: "#fff" }}>User Name</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "11px", backgroundColor: "#fff" }}>Contact Details</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "11px", backgroundColor: "#fff" }}>Registered For</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "11px", backgroundColor: "#fff", fontWeight: "900", color: "#e33129" }}>Tier / Section</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "11px", backgroundColor: "#fff" }}>Status</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "11px", backgroundColor: "#fff" }}>Date</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "11px", textAlign: "right", backgroundColor: "#fff" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedRegistrations.map((r) => (
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
                                        {(r.selected_section || r.section) ? (
                                            <div style={{ 
                                                fontWeight: "800", 
                                                color: "#333", 
                                                fontSize: "14px",
                                                textTransform: "uppercase",
                                                padding: "5px 12px",
                                                backgroundColor: "#fff3cd",
                                                borderRadius: "6px",
                                                display: "inline-block"
                                            }}>
                                                {r.selected_section || r.section}
                                            </div>
                                        ) : (
                                            <span style={{color: '#ddd', fontSize: '12px'}}>—</span>
                                        )}
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
                                        <button 
                                            onClick={() => handleResendEmail(r)} 
                                            className="btn btn-light mr-2" 
                                            style={{ width: "35px", height: "35px", borderRadius: "10px", color: "#28a745", border: "1px solid #e7f4e8" }}
                                            title="Resend Ticket Email"
                                            disabled={resendingId === r.id}
                                        >
                                            {resendingId === r.id ? (
                                                <i className="fas fa-spinner fa-spin"></i>
                                            ) : (
                                                <i className="fas fa-envelope"></i>
                                            )}
                                        </button>
                                        <button onClick={() => handleDelete(r.id)} className="btn btn-light" style={{ width: "35px", height: "35px", borderRadius: "10px", color: "#e33129" }}>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {displayedRegistrations.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center", padding: "50px", color: "#999" }}>
                                        {viewMode === "repeated" ? "No repeated registrations found. Good job!" : "No registrations found for this event."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminViewRegistrations;
