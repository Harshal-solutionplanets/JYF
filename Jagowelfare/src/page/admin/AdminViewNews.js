import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { formatDate } from "../../utils/dateFormatter";

const AdminViewNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    const fetchNews = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
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
                const { error } = await supabase.from('news').delete().eq('id', id);
                if (error) throw error;
                setNews(news.filter(e => e.id !== id));
            } catch (err) {
                alert("Delete failed: " + err.message);
            }
        }
    };

    const handleSaveEdit = async (id) => {
        try {
            const { error } = await supabase.from('news').update({ title: editForm.title, summary: editForm.summary }).eq('id', id);
            if (error) throw error;
            setNews(news.map(n => n.id === id ? { ...n, ...editForm } : n));
            setEditingId(null);
            alert("Edited successfully!");
        } catch (err) {
            alert("Edit failed: " + err.message);
        }
    };

    if (loading) return <div className="text-center p-5"><h4>Fetching News...</h4></div>;

    return (
        <div style={{ backgroundColor: "#f4f6f9", padding: "30px", borderRadius: "15px" }}>
            <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                    <h3 style={{ margin: 0, fontWeight: "800", color: "#222" }}>Manage News Articles</h3>
                    <span className="badge" style={{ backgroundColor: "#ca1e1415", color: "#ca1e14", padding: "10px 20px", borderRadius: "30px", fontWeight: "700" }}>
                        {news.length} Published Articles
                    </span>
                </div>

                <div className="table-responsive">
                    <table className="table" style={{ borderCollapse: "separate", borderSpacing: "0 15px", marginTop: "-15px" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#fdfdfd" }}>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px" }}>Cover</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px" }}>Headline</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px" }}>Summary</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px", textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {news.map((item) => {
                                const firstImage = (item.image_url || "").split(',')[0];
                                return editingId === item.id ? (
                                    <tr key={item.id} style={{ backgroundColor: "#f9f9ff", borderRadius: "10px", verticalAlign: "middle" }}>
                                        <td style={{ border: "none", padding: "15px", borderTopLeftRadius: "15px", borderBottomLeftRadius: "15px" }}>
                                            <img src={firstImage} alt="img" style={{ width: "50px", height: "50px", borderRadius: "8px", objectFit: "cover" }} />
                                        </td>
                                        <td style={{ border: "none", padding: "15px" }}><input value={editForm.title} onChange={x => setEditForm({...editForm, title: x.target.value})} className="form-control" /></td>
                                        <td style={{ border: "none", padding: "15px" }}><input value={editForm.summary} onChange={x => setEditForm({...editForm, summary: x.target.value})} className="form-control" /></td>
                                        <td style={{ border: "none", padding: "15px", borderTopRightRadius: "15px", borderBottomRightRadius: "15px", textAlign: "right" }}>
                                            <button onClick={() => handleSaveEdit(item.id)} className="btn btn-sm btn-success mr-2" style={{ borderRadius: "10px" }}>Save</button>
                                            <button onClick={() => setEditingId(null)} className="btn btn-sm btn-secondary" style={{ borderRadius: "10px" }}>Cancel</button>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr key={item.id} style={{ backgroundColor: "#fff", boxShadow: "0 5px 15px rgba(0,0,0,0.02)", borderRadius: "10px", verticalAlign: "middle" }}>
                                        <td style={{ border: "none", padding: "15px", borderTopLeftRadius: "15px", borderBottomLeftRadius: "15px" }}>
                                            <img src={firstImage} alt="img" style={{ width: "60px", height: "60px", borderRadius: "12px", objectFit: "cover", border: "1px solid #eee" }} />
                                        </td>
                                        <td style={{ border: "none", padding: "15px" }}>
                                            <div style={{ fontWeight: "700", color: "#222" }}>{item.title}</div>
                                            <div style={{ fontSize: "11px", color: "#999" }}>{formatDate(item.created_at)}</div>
                                        </td>
                                        <td style={{ border: "none", padding: "15px" }}>
                                            <div style={{ fontSize: "13px", color: "#777", maxWidth: "400px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical" }}>
                                                {item.summary}
                                            </div>
                                        </td>
                                        <td style={{ border: "none", padding: "15px", borderTopRightRadius: "15px", borderBottomRightRadius: "15px", textAlign: "right" }}>
                                            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                                                <button onClick={() => { setEditingId(item.id); setEditForm({ title: item.title, summary: item.summary }); }} className="btn btn-light" style={{ width: "35px", height: "35px", borderRadius: "10px", color: "#f39c12" }}><i className="fas fa-edit"></i></button>
                                                <button onClick={() => handleDelete(item.id)} className="btn btn-light" style={{ width: "35px", height: "35px", borderRadius: "10px", color: "#e33129" }}><i className="fas fa-trash"></i></button>
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

export default AdminViewNews;
