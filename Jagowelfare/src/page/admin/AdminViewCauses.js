import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { formatDate } from "../../utils/dateFormatter";

const AdminViewCauses = ({ onEdit }) => {
    const [causes, setCauses] = useState([]);
    const [loading, setLoading] = useState(true);

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
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px" }}>Principal Image</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px" }}>Title</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px" }}>Status</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px", textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {causes.map((c) => {
                                const firstImage = (c.image_url || "").split(',')[0];
                                return (
                                    <tr key={c.id} style={{ backgroundColor: "#fff", boxShadow: "0 5px 15px rgba(0,0,0,0.02)", borderRadius: "10px", verticalAlign: "middle" }}>
                                        <td style={{ border: "none", padding: "15px", borderTopLeftRadius: "15px", borderBottomLeftRadius: "15px" }}>
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
                                                <button onClick={() => onEdit(c)} className="btn btn-light" title="Edit Cause Details" style={{ width: "35px", height: "35px", borderRadius: "10px", color: "#f39c12" }}><i className="fas fa-edit"></i></button>
                                                <button onClick={() => handleDelete(c.id)} className="btn btn-light" title="Delete Cause" style={{ width: "35px", height: "35px", borderRadius: "10px", color: "#e33129" }}><i className="fas fa-trash"></i></button>
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
