import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";

const AdminViewEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            setEvents(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                const { error } = await supabase
                    .from('events')
                    .delete()
                    .eq('id', id);
                
                if (error) throw error;
                setEvents(events.filter(e => e.id !== id));
            } catch (err) {
                alert("Delete failed: " + err.message);
            }
        }
    };

    const handleSaveEdit = async (id) => {
        try {
            const { error } = await supabase
                .from('events')
                .update({
                    title: editForm.title,
                    tag: editForm.tag,
                    venue: editForm.venue
                })
                .eq('id', id);
            
            if (error) throw error;
            setEvents(events.map(e => e.id === id ? { ...e, ...editForm } : e));
            setEditingId(null);
            alert("Edited successfully!");
        } catch (err) {
            alert("Edit failed: " + err.message);
        }
    };

    const handleEditClick = (e) => {
        setEditingId(e.id);
        setEditForm({ title: e.title, tag: e.tag, venue: e.venue });
    };

    if (loading) return <div className="text-center p-5"><h4>Loading Events...</h4></div>;

    return (
        <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "15px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <h3 style={{ marginBottom: "30px", fontWeight: "800" }}>Manage Events Detailed (Supabase)</h3>
            <div className="table-responsive">
                <table className="table table-hover">
                    <thead style={{ backgroundColor: "#f8f9fa" }}>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Tag</th>
                            <th>Venue</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((e) => {
                            const firstImage = (e.heroImageUrl || "").split(',')[0];
                            return editingId === e.id ? (
                                <tr key={e.id} style={{ verticalAlign: "middle" }}>
                                    <td>
                                        <img src={firstImage} alt="img" style={{ width: "50px", height: "50px", borderRadius: "8px", objectFit: "cover" }} />
                                    </td>
                                    <td><input value={editForm.title} onChange={x => setEditForm({...editForm, title: x.target.value})} className="form-control" /></td>
                                    <td><input value={editForm.tag} onChange={x => setEditForm({...editForm, tag: x.target.value})} className="form-control" /></td>
                                    <td><input value={editForm.venue} onChange={x => setEditForm({...editForm, venue: x.target.value})} className="form-control" /></td>
                                    <td>{e.startAt ? new Date(e.startAt).toLocaleDateString() : "N/A"}</td>
                                    <td>
                                        <button onClick={() => handleSaveEdit(e.id)} className="btn btn-sm btn-success mr-2" style={{ borderRadius: "20px" }}>Save</button>
                                        <button onClick={() => setEditingId(null)} className="btn btn-sm btn-secondary" style={{ borderRadius: "20px" }}>Cancel</button>
                                    </td>
                                </tr>
                            ) : (
                                <tr key={e.id} style={{ verticalAlign: "middle" }}>
                                    <td>
                                        <img src={firstImage} alt="img" style={{ width: "50px", height: "50px", borderRadius: "8px", objectFit: "cover" }} />
                                    </td>
                                    <td style={{ fontWeight: "600" }}>{e.title}</td>
                                    <td><span className="badge bg-light text-dark">{e.tag}</span></td>
                                    <td>{e.venue}</td>
                                    <td>{e.startAt ? new Date(e.startAt).toLocaleDateString() : "N/A"}</td>
                                    <td>
                                        <button onClick={() => handleEditClick(e)} className="btn btn-sm btn-outline-warning" style={{ borderRadius: "20px", marginRight: "10px" }}>
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <a href={`/event/${e.id}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary" style={{ borderRadius: "20px", marginRight: "10px" }}>
                                            <i className="fas fa-eye"></i>
                                        </a>
                                        <button onClick={() => handleDelete(e.id)} className="btn btn-sm btn-outline-danger" style={{ borderRadius: "20px" }}>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                        {events.length === 0 && <tr><td colSpan="6" className="text-center">No events found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminViewEvents;
