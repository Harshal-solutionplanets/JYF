import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";

const AdminViewSupporter = ({ onEdit }) => {
    const [supporters, setSupporters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [draggedIndex, setDraggedIndex] = useState(null);

    const fetchSupporters = async () => {
        setLoading(true);
        try {
            // Try sorting by priority first
            const { data, error } = await supabase.from('supporters').select('*').order('priority', { ascending: false }).order('created_at', { ascending: false });
            
            if (error) {
                console.warn("Priority column might be missing. Falling back to date sorting.", error);
                const { data: fallbackData, error: fallbackError } = await supabase.from('supporters').select('*').order('created_at', { ascending: false });
                if (fallbackError) throw fallbackError;
                setSupporters(fallbackData || []);
            } else {
                setSupporters(data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSupporters();
    }, []);

    const onDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
    };

    const onDragOver = (e, index) => {
        e.preventDefault();
    };

    const onDrop = async (e, index) => {
        e.preventDefault();
        if (draggedIndex === index) return;

        const newSupporters = [...supporters];
        const itemToMove = newSupporters.splice(draggedIndex, 1)[0];
        newSupporters.splice(index, 0, itemToMove);
        setSupporters(newSupporters);

        // Update priority in DB
        const updates = newSupporters.map((s, i) => ({
            id: s.id,
            priority: newSupporters.length - i
        }));

        try {
            for (const update of updates) {
                await supabase.from('supporters').update({ priority: update.priority }).eq('id', update.id);
            }
        } catch (err) {
            console.error("Order update failed", err);
        }
        setDraggedIndex(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this supporter?")) {
            try {
                const { error } = await supabase.from('supporters').delete().eq('id', id);
                if (error) throw error;
                setSupporters(supporters.filter(s => s.id !== id));
            } catch (err) {
                alert("Delete failed: " + err.message);
            }
        }
    };

    if (loading) return <div className="text-center p-5"><h4>Loading Supporters...</h4></div>;

    return (
        <div style={{ backgroundColor: "#f4f6f9", padding: "30px", borderRadius: "15px" }}>
            <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                    <div>
                        <h3 style={{ margin: 0, fontWeight: "800", color: "#222" }}>Supporters Management</h3>
                        <p style={{ margin: 0, fontSize: "12px", color: "#e33129" }}>Tip: Drag any row to reorder items on the website</p>
                    </div>
                    <span className="badge" style={{ backgroundColor: "#e3312915", color: "#e33129", padding: "10px 20px", borderRadius: "30px", fontWeight: "700" }}>
                        {supporters.length} Active
                    </span>
                </div>

                <div className="table-responsive">
                    <table className="table" style={{ borderCollapse: "separate", borderSpacing: "0 15px", marginTop: "-15px" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#fdfdfd" }}>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px", width: "40px" }}>Order</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px" }}>Logo</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px" }}>Name</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px", textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {supporters.map((s, index) => (
                                <tr 
                                    key={s.id} 
                                    draggable
                                    onDragStart={(e) => onDragStart(e, index)}
                                    onDragOver={(e) => onDragOver(e, index)}
                                    onDrop={(e) => onDrop(e, index)}
                                    style={{ 
                                        backgroundColor: "#fff", 
                                        boxShadow: "0 5px 15px rgba(0,0,0,0.02)", 
                                        borderRadius: "10px", 
                                        verticalAlign: "middle",
                                        cursor: "grab",
                                        opacity: draggedIndex === index ? 0.5 : 1,
                                        transition: "transform 0.2s"
                                    }}
                                >
                                    <td style={{ border: "none", padding: "15px", borderTopLeftRadius: "15px", borderBottomLeftRadius: "15px", textAlign: "center", color: "#ccc" }}>
                                        <i className="fas fa-grip-vertical"></i>
                                    </td>
                                    <td style={{ border: "none", padding: "15px" }}>
                                        <img src={s.image_url} alt="logo" style={{ width: "80px", height: "45px", objectFit: "contain", borderRadius: "8px", border: "1px solid #f0f0f0", padding: "4px" }} />
                                    </td>
                                    <td style={{ border: "none", padding: "15px" }}>
                                        <div style={{ fontWeight: "700", color: "#222", fontSize: "15px" }}>{s.name}</div>
                                        {s.website_url && <div style={{ fontSize: "11px", color: "#999" }}>{s.website_url}</div>}
                                    </td>
                                    <td style={{ border: "none", padding: "15px", borderTopRightRadius: "15px", borderBottomRightRadius: "15px", textAlign: "right" }}>
                                        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                                            <button onClick={() => onEdit(s)} className="btn btn-light" title="Edit" style={{ width: "35px", height: "35px", borderRadius: "10px", color: "#f39c12" }}><i className="fas fa-edit"></i></button>
                                            <button onClick={() => handleDelete(s.id)} className="btn btn-light" title="Delete" style={{ width: "35px", height: "35px", borderRadius: "10px", color: "#e33129" }}><i className="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {supporters.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-5 text-muted">No supporters found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminViewSupporter;
