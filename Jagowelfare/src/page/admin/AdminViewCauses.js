import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { formatDate } from "../../utils/dateFormatter";

const AdminViewCauses = () => {
    const [causes, setCauses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    const fetchCauses = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('causes').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setCauses(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCauses();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Delete this cause record permanently?")) {
            try {
                const { error } = await supabase.from('causes').delete().eq('id', id);
                if (error) throw error;
                setCauses(causes.filter(e => e.id !== id));
            } catch (err) {
                alert("Delete failed: " + err.message);
            }
        }
    };

    const handleSaveEdit = async (id) => {
        try {
            const { error } = await supabase.from('causes').update({
                title: editForm.title,
                tag: editForm.tag,
                goal: parseFloat(editForm.goal),
                raised: parseFloat(editForm.raised)
            }).eq('id', id);
            if (error) throw error;
            setCauses(causes.map(c => c.id === id ? { ...c, ...editForm } : c));
            setEditingId(null);
            alert("Edited successfully!");
        } catch (err) {
            alert("Edit failed: " + err.message);
        }
    };

    if (loading) return <div className="text-center p-5"><h4>Fetching Causes History...</h4></div>;

    return (
        <div style={{ backgroundColor: "#f4f6f9", padding: "30px", borderRadius: "15px" }}>
            <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                    <h3 style={{ margin: 0, fontWeight: "800", color: "#222" }}>Manage Causes Details</h3>
                    <span className="badge" style={{ backgroundColor: "#e3312915", color: "#e33129", padding: "10px 20px", borderRadius: "30px", fontWeight: "700" }}>
                        {causes.length} Active Causes
                    </span>
                </div>

                <div className="table-responsive">
                    <table className="table" style={{ borderCollapse: "separate", borderSpacing: "0 15px", marginTop: "-15px" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#fdfdfd" }}>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px" }}>Image</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px" }}>Title</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px" }}>Category</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px" }}>Goal</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px" }}>Raised</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px", textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {causes.map((c) => {
                                const firstImage = (c.image_url || "").split(',')[0];
                                return editingId === c.id ? (
                                    <tr key={c.id} style={{ backgroundColor: "#fff9f9", borderRadius: "10px", verticalAlign: "middle" }}>
                                        <td style={{ border: "none", padding: "15px", borderTopLeftRadius: "15px", borderBottomLeftRadius: "15px" }}>
                                            <img src={firstImage} alt="img" style={{ width: "50px", height: "50px", borderRadius: "8px", objectFit: "cover" }} />
                                        </td>
                                        <td style={{ border: "none", padding: "15px" }}><input value={editForm.title} onChange={x => setEditForm({...editForm, title: x.target.value})} className="form-control" /></td>
                                        <td style={{ border: "none", padding: "15px" }}><input value={editForm.tag} onChange={x => setEditForm({...editForm, tag: x.target.value})} className="form-control" /></td>
                                        <td style={{ border: "none", padding: "15px" }}><input type="number" value={editForm.goal} onChange={x => setEditForm({...editForm, goal: x.target.value})} className="form-control" /></td>
                                        <td style={{ border: "none", padding: "15px" }}><input type="number" value={editForm.raised} onChange={x => setEditForm({...editForm, raised: x.target.value})} className="form-control" /></td>
                                        <td style={{ border: "none", padding: "15px", borderTopRightRadius: "15px", borderBottomRightRadius: "15px", textAlign: "right" }}>
                                            <button onClick={() => handleSaveEdit(c.id)} className="btn btn-sm btn-success mr-2" style={{ borderRadius: "10px" }}>Save</button>
                                            <button onClick={() => setEditingId(null)} className="btn btn-sm btn-secondary" style={{ borderRadius: "10px" }}>Cancel</button>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr key={c.id} style={{ backgroundColor: "#fff", boxShadow: "0 5px 15px rgba(0,0,0,0.02)", borderRadius: "10px", verticalAlign: "middle" }}>
                                        <td style={{ border: "none", padding: "15px", borderTopLeftRadius: "15px", borderBottomLeftRadius: "15px" }}>
                                            <img src={firstImage} alt="img" style={{ width: "60px", height: "60px", borderRadius: "12px", objectFit: "cover", border: "1px solid #f0f0f0" }} />
                                        </td>
                                        <td style={{ border: "none", padding: "15px" }}>
                                            <div style={{ fontWeight: "700", color: "#222" }}>{c.title}</div>
                                            <div style={{ fontSize: "11px", color: "#999" }}>Created: {formatDate(c.created_at)}</div>
                                        </td>
                                        <td style={{ border: "none", padding: "15px" }}>
                                            <span style={{ backgroundColor: "#228a1a15", color: "#228a1a", padding: "6px 15px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>
                                                {c.tag || "#Cause"}
                                            </span>
                                        </td>
                                        <td style={{ border: "none", padding: "15px", fontWeight: "600" }}>${c.goal}</td>
                                        <td style={{ border: "none", padding: "15px", color: "#228a1a", fontWeight: "800" }}>${c.raised || 0}</td>
                                        <td style={{ border: "none", padding: "15px", borderTopRightRadius: "15px", borderBottomRightRadius: "15px", textAlign: "right" }}>
                                            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                                                <button onClick={() => { setEditingId(c.id); setEditForm({ title: c.title, tag: c.tag, goal: c.goal, raised: c.raised || 0 }); }} className="btn btn-light" style={{ width: "35px", height: "35px", borderRadius: "10px", color: "#f39c12" }}><i className="fas fa-edit"></i></button>
                                                <button onClick={() => handleDelete(c.id)} className="btn btn-light" style={{ width: "35px", height: "35px", borderRadius: "10px", color: "#e33129" }}><i className="fas fa-trash"></i></button>
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

export default AdminViewCauses;
