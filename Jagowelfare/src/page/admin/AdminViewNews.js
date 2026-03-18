import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";

const AdminViewNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    const fetchNews = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            setNews(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Delete this article permanently?")) {
            try {
                const { error } = await supabase
                    .from('news')
                    .delete()
                    .eq('id', id);
                
                if (error) throw error;
                setNews(news.filter(e => e.id !== id));
            } catch (err) {
                alert("Delete failed: " + err.message);
            }
        }
    };

    const handleSaveEdit = async (id) => {
        try {
            const { error } = await supabase
                .from('news')
                .update({
                    title: editForm.title,
                    summary: editForm.summary
                })
                .eq('id', id);
            
            if (error) throw error;
            setNews(news.map(n => n.id === id ? { ...n, ...editForm } : n));
            setEditingId(null);
            alert("Edited successfully!");
        } catch (err) {
            alert("Edit failed: " + err.message);
        }
    };

    const handleEditClick = (item) => {
        setEditingId(item.id);
        setEditForm({ title: item.title, summary: item.summary });
    };

    if (loading) return <div className="text-center p-5"><h4>Fetching News...</h4></div>;

    return (
        <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "15px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <h3 style={{ marginBottom: "30px", fontWeight: "800" }}>Manage News in Detail</h3>
            <div className="table-responsive">
                <table className="table">
                    <thead style={{ backgroundColor: "#f8f9fa" }}>
                        <tr>
                            <th>Image</th>
                            <th>Headlines</th>
                            <th>Summary</th>
                            <th>Published Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {news.map((item) => {
                            const firstImage = (item.imageUrl || "").split(",")[0];
                            return editingId === item.id ? (
                                <tr key={item.id} style={{ verticalAlign: "middle" }}>
                                    <td>
                                        <img src={firstImage} alt="img" style={{ width: "50px", height: "50px", borderRadius: "8px", objectFit: "cover" }} />
                                    </td>
                                    <td><input value={editForm.title} onChange={x => setEditForm({...editForm, title: x.target.value})} className="form-control" /></td>
                                    <td><input value={editForm.summary} onChange={x => setEditForm({...editForm, summary: x.target.value})} className="form-control" /></td>
                                    <td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : "Just now"}</td>
                                    <td>
                                        <button onClick={() => handleSaveEdit(item.id)} className="btn btn-sm btn-success mr-2" style={{ borderRadius: "20px" }}>Save</button>
                                        <button onClick={() => setEditingId(null)} className="btn btn-sm btn-secondary" style={{ borderRadius: "20px" }}>Cancel</button>
                                    </td>
                                </tr>
                            ) : (
                                <tr key={item.id} style={{ verticalAlign: "middle" }}>
                                    <td>
                                        <img src={firstImage} alt="img" style={{ width: "50px", height: "50px", borderRadius: "8px", objectFit: "cover" }} />
                                    </td>
                                    <td style={{ fontWeight: "600", maxWidth: "300px" }}>{item.title}</td>
                                    <td style={{ color: "#777", fontSize: "13px", maxWidth: "400px" }}>{item.summary}</td>
                                    <td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : "Just now"}</td>
                                    <td>
                                        <button onClick={() => handleEditClick(item)} className="btn btn-sm btn-outline-warning" style={{ borderRadius: "20px", marginRight: "10px" }}>
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-outline-danger" style={{ borderRadius: "20px" }}>
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

export default AdminViewNews;
