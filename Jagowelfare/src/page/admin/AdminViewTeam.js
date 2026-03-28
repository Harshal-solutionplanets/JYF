import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { formatDate } from "../../utils/dateFormatter";

const AdminViewTeam = ({ onEdit }) => {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [draggedIndex, setDraggedIndex] = useState(null);

    const fetchTeam = async () => {
        setLoading(true);
        try {
            // Try sorting by priority first
            const { data, error } = await supabase.from('team').select('*').order('priority', { ascending: false }).order('created_at', { ascending: false });
            
            if (error) {
                console.warn("Priority column might be missing. Falling back to date sorting.", error);
                const { data: fallbackData, error: fallbackError } = await supabase.from('team').select('*').order('created_at', { ascending: false });
                if (fallbackError) throw fallbackError;
                setTeam(fallbackData || []);
            } else {
                setTeam(data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
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

        const newTeam = [...team];
        const itemToMove = newTeam.splice(draggedIndex, 1)[0];
        newTeam.splice(index, 0, itemToMove);
        setTeam(newTeam);

        // Update priority in DB
        const updates = newTeam.map((t, i) => ({
            id: t.id,
            priority: newTeam.length - i
        }));

        try {
            for (const update of updates) {
                await supabase.from('team').update({ priority: update.priority }).eq('id', update.id);
            }
        } catch (err) {
            console.error("Order update failed", err);
        }
        setDraggedIndex(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Remove this team member permanently?")) {
            try {
                const { error } = await supabase.from('team').delete().eq('id', id);
                if (error) throw error;
                setTeam(team.filter(t => t.id !== id));
            } catch (err) {
                alert("Delete failed: " + err.message);
            }
        }
    };

    if (loading) return <div className="text-center p-5"><h4>Loading Team Directory...</h4></div>;

    return (
        <div style={{ backgroundColor: "#f4f6f9", padding: "30px", borderRadius: "15px" }}>
            <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                    <div>
                        <h3 style={{ margin: 0, fontWeight: "800", color: "#222" }}>Team Management</h3>
                        <p style={{ margin: 0, fontSize: "12px", color: "#e33129" }}>Tip: Drag any row to reorder items on the website</p>
                    </div>
                    <span className="badge" style={{ backgroundColor: "#e3312915", color: "#e33129", padding: "10px 20px", borderRadius: "30px", fontWeight: "700" }}>
                        {team.length} Members
                    </span>
                </div>

                <div className="table-responsive">
                    <table className="table" style={{ borderCollapse: "separate", borderSpacing: "0 15px", marginTop: "-15px" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#fdfdfd" }}>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px", width: "40px" }}>Order</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px" }}>Photo</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px" }}>Name & Role</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px", textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {team.map((t, index) => (
                                <tr 
                                    key={t.id} 
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
                                        <img src={t.image_url || "/default-avatar.png"} alt="img" style={{ width: "55px", height: "55px", borderRadius: "50%", objectFit: "cover", border: "2px solid #f0f0f0" }} />
                                    </td>
                                    <td style={{ border: "none", padding: "15px" }}>
                                        <div style={{ fontWeight: "700", color: "#222", fontSize: "15px" }}>{t.name}</div>
                                        <div style={{ fontSize: "12px", color: "#e33129", fontWeight: "600" }}>{t.role}</div>
                                        <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                                            {t.company_url && <a href={t.company_url} target="_blank" rel="noreferrer" style={{ fontSize: "11px", color: "#e33129", textDecoration: "underline", fontWeight: "700" }}>{t.company_name || "Visit Website"}</a>}
                                        </div>
                                        <div style={{ fontSize: "10px", color: "#bbb", marginTop: "3px" }}>Member since: {formatDate(t.created_at)}</div>
                                    </td>
                                    <td style={{ border: "none", padding: "15px", borderTopRightRadius: "15px", borderBottomRightRadius: "15px", textAlign: "right" }}>
                                        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                                            <button onClick={() => onEdit(t)} className="btn btn-light" title="Edit Profile" style={{ width: "35px", height: "35px", borderRadius: "10px", color: "#f39c12" }}><i className="fas fa-edit"></i></button>
                                            <button onClick={() => handleDelete(t.id)} className="btn btn-light" title="Remove Member" style={{ width: "35px", height: "35px", borderRadius: "10px", color: "#e33129" }}><i className="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {team.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-5 text-muted">No team members found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminViewTeam;
