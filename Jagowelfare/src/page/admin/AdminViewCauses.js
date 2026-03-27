import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { formatDate } from "../../utils/dateFormatter";

const AdminViewCauses = ({ onEdit }) => {
    const [causes, setCauses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCauses = async () => {
        setLoading(true);
        try {
            // Try sorting by priority first
            const { data, error } = await supabase.from('causes').select('*').order('priority', { ascending: false }).order('created_at', { ascending: false });
            
            // If the priority column doesn't exist, it might error. Catching and falling back:
            if (error) {
                console.warn("Priority column missing. Falling back to date sorting.", error);
                const { data: fallbackData, error: fallbackError } = await supabase.from('causes').select('*').order('created_at', { ascending: false });
                if (fallbackError) throw fallbackError;
                setCauses(fallbackData || []);
            } else {
                setCauses(data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCauses();
    }, []);

    const [draggedIndex, setDraggedIndex] = useState(null);

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

        const newCauses = [...causes];
        const itemToMove = newCauses.splice(draggedIndex, 1)[0];
        newCauses.splice(index, 0, itemToMove);
        setCauses(newCauses);

        // Update priority in DB
        // We set priority such that the top items have higher values
        const updates = newCauses.map((c, i) => ({
            id: c.id,
            priority: newCauses.length - i
        }));

        try {
            for (const update of updates) {
                await supabase.from('causes').update({ priority: update.priority }).eq('id', update.id);
            }
        } catch (err) {
            console.error("Order update failed", err);
        }
        setDraggedIndex(null);
    };

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

    if (loading) return <div className="text-center p-5"><h4>Fetching Causes History...</h4></div>;

    return (
        <div style={{ backgroundColor: "#f4f6f9", padding: "30px", borderRadius: "15px" }}>
            <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                    <div>
                        <h3 style={{ margin: 0, fontWeight: "800", color: "#222" }}>Manage Causes Details</h3>
                        <p style={{ margin: 0, fontSize: "12px", color: "#e33129" }}>Tip: Drag any row to reorder items on the website</p>
                    </div>
                    <span className="badge" style={{ backgroundColor: "#e3312915", color: "#e33129", padding: "10px 20px", borderRadius: "30px", fontWeight: "700" }}>
                        {causes.length} Active Causes
                    </span>
                </div>

                <div className="table-responsive">
                    <table className="table" style={{ borderCollapse: "separate", borderSpacing: "0 15px", marginTop: "-15px" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#fdfdfd" }}>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px", width: "40px" }}>Order</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px" }}>Principal Image</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px" }}>Title</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px" }}>Status</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px", textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {causes.map((c, index) => {
                                const firstImage = (c.image_url || "").split(',')[0];
                                return (
                                    <tr 
                                        key={c.id} 
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
                                            <img src={firstImage} alt="img" style={{ width: "60px", height: "60px", borderRadius: "12px", objectFit: "cover", border: "1px solid #f0f0f0" }} />
                                        </td>
                                        <td style={{ border: "none", padding: "15px" }}>
                                            <div style={{ fontWeight: "700", color: "#222", fontSize: "15px" }}>{c.title}</div>
                                            <div style={{ fontSize: "11px", color: "#999" }}>Created: {formatDate(c.created_at)}</div>
                                        </td>
                                        <td style={{ border: "none", padding: "15px" }}>
                                            <span style={{ backgroundColor: "#228a1a15", color: "#228a1a", padding: "6px 15px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td style={{ border: "none", padding: "15px", borderTopRightRadius: "15px", borderBottomRightRadius: "15px", textAlign: "right" }}>
                                            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                                                <button onClick={() => onEdit(c)} className="btn btn-light" title="Edit" style={{ width: "35px", height: "35px", borderRadius: "10px", color: "#f39c12" }}><i className="fas fa-edit"></i></button>
                                                <button onClick={() => handleDelete(c.id)} className="btn btn-light" title="Delete" style={{ width: "35px", height: "35px", borderRadius: "10px", color: "#e33129" }}><i className="fas fa-trash"></i></button>
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
