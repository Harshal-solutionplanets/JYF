import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";

const AdminViewCauses = () => {
    const [causes, setCauses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    const fetchCauses = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('causes')
                .select('*')
                .order('created_at', { ascending: false });
            
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
                const { error } = await supabase
                    .from('causes')
                    .delete()
                    .eq('id', id);
                
                if (error) throw error;
                setCauses(causes.filter(e => e.id !== id));
            } catch (err) {
                alert("Delete failed: " + err.message);
            }
        }
    };

    const handleSaveEdit = async (id) => {
        try {
            const { error } = await supabase
                .from('causes')
                .update({
                    title: editForm.title,
                    tag: editForm.tag,
                    goal: parseFloat(editForm.goal),
                    raised: parseFloat(editForm.raised)
                })
                .eq('id', id);
            
            if (error) throw error;
            setCauses(causes.map(c => c.id === id ? { ...c, ...editForm } : c));
            setEditingId(null);
            alert("Edited successfully!");
        } catch (err) {
            alert("Edit failed: " + err.message);
        }
    };

    const handleEditClick = (c) => {
        setEditingId(c.id);
        setEditForm({ title: c.title, tag: c.tag, goal: c.goal, raised: c.raised || 0 });
    };

    if (loading) return <div className="text-center p-5"><h4>Fetching Causes History (Supabase)...</h4></div>;

    return (
        <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "15px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <h3 style={{ marginBottom: "30px", fontWeight: "800" }}>Manage Causes Details</h3>
            <div className="table-responsive">
                <table className="table">
                    <thead style={{ backgroundColor: "#f8f9fa" }}>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Goal ($)</th>
                            <th>Raised ($)</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {causes.map((c) => {
                            const firstImage = (c.imageUrl || "").split(",")[0];
                            return editingId === c.id ? (
                                <tr key={c.id} style={{ verticalAlign: "middle" }}>
                                    <td>
                                        <img src={firstImage} alt="img" style={{ width: "50px", height: "50px", borderRadius: "8px", objectFit: "cover" }} />
                                    </td>
                                    <td><input value={editForm.title} onChange={x => setEditForm({...editForm, title: x.target.value})} className="form-control" /></td>
                                    <td><input value={editForm.tag} onChange={x => setEditForm({...editForm, tag: x.target.value})} className="form-control" /></td>
                                    <td><input type="number" value={editForm.goal} onChange={x => setEditForm({...editForm, goal: x.target.value})} className="form-control" style={{width: 80}} /></td>
                                    <td><input type="number" value={editForm.raised} onChange={x => setEditForm({...editForm, raised: x.target.value})} className="form-control" style={{width: 80}} /></td>
                                    <td>{c.created_at ? new Date(c.created_at).toLocaleDateString() : "Just now"}</td>
                                    <td>
                                        <button onClick={() => handleSaveEdit(c.id)} className="btn btn-sm btn-success mr-2" style={{ borderRadius: "20px" }}>Save</button>
                                        <button onClick={() => setEditingId(null)} className="btn btn-sm btn-secondary" style={{ borderRadius: "20px" }}>Cancel</button>
                                    </td>
                                </tr>
                            ) : (
                                <tr key={c.id} style={{ verticalAlign: "middle" }}>
                                    <td>
                                        <img src={firstImage} alt="img" style={{ width: "50px", height: "50px", borderRadius: "8px", objectFit: "cover" }} />
                                    </td>
                                    <td style={{ fontWeight: "600" }}>{c.title}</td>
                                    <td><span className="badge bg-light text-dark">{c.tag}</span></td>
                                    <td>{c.goal}</td>
                                    <td style={{ color: "#28a745", fontWeight: "700" }}>{c.raised || 0}</td>
                                    <td>{c.created_at ? new Date(c.created_at).toLocaleDateString() : "Just now"}</td>
                                    <td>
                                        <button onClick={() => handleEditClick(c)} className="btn btn-sm btn-outline-warning" style={{ borderRadius: "20px", marginRight: "10px" }}>
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button onClick={() => handleDelete(c.id)} className="btn btn-sm btn-outline-danger" style={{ borderRadius: "20px" }}>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminViewCauses;
