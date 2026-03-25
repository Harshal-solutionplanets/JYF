import React, { useState, useEffect } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from "../../supabase";
import { formatDate } from "../../utils/dateFormatter";

const AdminViewNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [updating, setUpdating] = useState(false);

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'clean']
        ],
    };

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
                alert("Deleted successfully!");
            } catch (err) {
                alert("Delete failed: " + err.message);
            }
        }
    };

    const handleSaveEdit = async (e) => {
        if (e) e.preventDefault();
        setUpdating(true);
        try {
            const { error } = await supabase.from('news').update({ 
                title: editForm.title, 
                tag: editForm.tag,
                summary: editForm.summary,
                content: editForm.content,
                author_name: editForm.author_name,
                author_role: editForm.author_role,
                location: editForm.location
            }).eq('id', editingId);
            
            if (error) throw error;
            
            setNews(news.map(n => n.id === editingId ? { ...n, ...editForm } : n));
            setEditingId(null);
            alert("Article updated successfully!");
        } catch (err) {
            alert("Update failed: " + err.message);
        } finally {
            setUpdating(false);
        }
    };

    const inputStyle = { border: "none", borderBottom: "2px solid #ddd", borderRadius: "0", padding: "12px 0", backgroundColor: "transparent", fontSize: "16px", outline: "none", width: "100%", transition: "all 0.3s", boxSizing: "border-box" };
    const labelStyle = { fontWeight: "700", color: "#222", fontSize: "14px", marginBottom: "10px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" };
    const sectionHeadingStyle = { fontSize: "18px", fontWeight: "800", color: "#e33129", marginBottom: "20px", paddingBottom: "8px", borderBottom: "1px solid #eee", width: "100%" };
    const sectionContainerStyle = { backgroundColor: "#fcfcfc", padding: "25px", borderRadius: "15px", border: "1px solid #f0f0f0", marginBottom: "30px", boxSizing: "border-box" };

    if (loading) return <div className="text-center p-5"><h4>Fetching News...</h4></div>;

    if (editingId) {
        return (
            <div style={{ backgroundColor: "#f4f6f9", padding: "30px", borderRadius: "15px" }}>
                <style>
                    {`
                        .ql-container { min-height: 150px; font-size: 16px; font-family: inherit; }
                        .ql-editor { min-height: 150px; }
                    `}
                </style>
                <div style={{ backgroundColor: "#fff", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)", maxWidth: "1000px", margin: "0 auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
                        <h3 style={{ margin: 0, fontWeight: "800", color: "#222", fontSize: "28px" }}>Edit News Article</h3>
                        <button onClick={() => setEditingId(null)} className="btn btn-secondary" style={{ borderRadius: "50px", padding: "10px 25px" }}>Back to List</button>
                    </div>

                    <form onSubmit={handleSaveEdit}>
                        <div style={sectionContainerStyle}>
                            <div style={sectionHeadingStyle}>Article Information</div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "30px" }}>
                                <div>
                                    <label style={labelStyle}>Headline / Title</label>
                                    <input type="text" style={inputStyle} value={editForm.title || ""} onChange={(e) => setEditForm({...editForm, title: e.target.value})} required />
                                </div>
                                <div>
                                    <label style={labelStyle}>Category / Tag</label>
                                    <input type="text" style={inputStyle} value={editForm.tag || ""} onChange={(e) => setEditForm({...editForm, tag: e.target.value})} />
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "30px", marginTop: "20px" }}>
                                <div>
                                    <label style={labelStyle}>Author Name</label>
                                    <input type="text" style={inputStyle} value={editForm.author_name || ""} onChange={(e) => setEditForm({...editForm, author_name: e.target.value})} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Author Role</label>
                                    <input type="text" style={inputStyle} value={editForm.author_role || ""} onChange={(e) => setEditForm({...editForm, author_role: e.target.value})} />
                                </div>
                            </div>

                            <div style={{ marginTop: "20px" }}>
                                <label style={labelStyle}>Location</label>
                                <input type="text" style={inputStyle} value={editForm.location || ""} onChange={(e) => setEditForm({...editForm, location: e.target.value})} />
                            </div>
                        </div>

                        <div style={sectionContainerStyle}>
                            <div style={sectionHeadingStyle}>Content & Details</div>
                            <div className="mb-4">
                                <label style={labelStyle}>Short Summary</label>
                                <ReactQuill theme="snow" value={editForm.summary || ""} onChange={(val) => setEditForm({...editForm, summary: val})} modules={quillModules} style={{ backgroundColor: "#fff" }} />
                            </div>
                            <div>
                                <label style={labelStyle}>Full Article Content</label>
                                <ReactQuill theme="snow" value={editForm.content || ""} onChange={(val) => setEditForm({...editForm, content: val})} modules={quillModules} style={{ backgroundColor: "#fff" }} />
                            </div>
                        </div>

                        <div className="text-center mt-5">
                            <button type="submit" className="btn btn_theme btn_md" style={{ padding: "18px 80px", borderRadius: "50px", fontWeight: "800" }} disabled={updating}>
                                {updating ? "Updating..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

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
                                return (
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
                                                {item.summary ? item.summary.replace(/<[^>]*>?/gm, '') : ""}
                                            </div>
                                        </td>
                                        <td style={{ border: "none", padding: "15px", borderTopRightRadius: "15px", borderBottomRightRadius: "15px", textAlign: "right" }}>
                                            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                                                <button onClick={() => { setEditingId(item.id); setEditForm(item); }} className="btn btn-light" style={{ width: "35px", height: "35px", borderRadius: "10px", color: "#f39c12" }}><i className="fas fa-edit"></i></button>
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
