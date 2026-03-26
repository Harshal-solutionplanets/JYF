import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { formatDate } from "../../utils/dateFormatter";

const AdminViewTestimonials = ({ onEdit }) => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTestimonials = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setTestimonials(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Remove this testimonial permanently?")) {
            try {
                const { error } = await supabase.from('testimonials').delete().eq('id', id);
                if (error) throw error;
                setTestimonials(testimonials.filter(t => t.id !== id));
            } catch (err) {
                alert("Delete failed: " + err.message);
            }
        }
    };

    if (loading) return <div className="text-center p-5"><h4>Retrieving Feedback History...</h4></div>;

    return (
        <div style={{ backgroundColor: "#f4f6f9", padding: "30px", borderRadius: "15px" }}>
            <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                    <h3 style={{ margin: 0, fontWeight: "800", color: "#222" }}>Supporter Feedback</h3>
                    <span className="badge" style={{ backgroundColor: "#e3312915", color: "#e33129", padding: "10px 20px", borderRadius: "30px", fontWeight: "700" }}>
                        {testimonials.length} Reviews
                    </span>
                </div>

                <div className="table-responsive">
                    <table className="table" style={{ borderCollapse: "separate", borderSpacing: "0 15px", marginTop: "-15px" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#fdfdfd" }}>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px" }}>Supporter</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px" }}>Testimonial Content</th>
                                <th style={{ border: "none", padding: "15px", color: "#777", textTransform: "uppercase", fontSize: "12px", textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {testimonials.map((t) => (
                                <tr key={t.id} style={{ backgroundColor: "#fff", boxShadow: "0 5px 15px rgba(0,0,0,0.02)", borderRadius: "10px", verticalAlign: "middle" }}>
                                    <td style={{ border: "none", padding: "15px", borderTopLeftRadius: "15px", borderBottomLeftRadius: "15px", minWidth: "220px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                            <img src={t.image_url || "/default-avatar.png"} alt="img" style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover", border: "1px solid #f0f0f0" }} />
                                            <div>
                                                <div style={{ fontWeight: "700", color: "#222", fontSize: "14px" }}>{t.name}</div>
                                                <div style={{ fontSize: "11px", color: "#999" }}>{t.role}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ border: "none", padding: "15px" }}>
                                        <div 
                                            style={{ 
                                                fontSize: "13px", 
                                                color: "#666", 
                                                lineHeight: "1.5", 
                                                maxHeight: "3em", 
                                                overflow: "hidden", 
                                                textOverflow: "ellipsis",
                                                display: "-webkit-box",
                                                WebkitLineClamp: "2",
                                                WebkitBoxOrient: "vertical"
                                            }}
                                            dangerouslySetInnerHTML={{ __html: t.comment }}
                                        />
                                        <div style={{ fontSize: "10px", color: "#bbb", marginTop: "5px" }}>Posted: {formatDate(t.created_at)}</div>
                                    </td>
                                    <td style={{ border: "none", padding: "15px", borderTopRightRadius: "15px", borderBottomRightRadius: "15px", textAlign: "right" }}>
                                        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                                            <button onClick={() => onEdit(t)} className="btn btn-light" title="Edit Testimonial" style={{ width: "35px", height: "35px", borderRadius: "10px", color: "#f39c12" }}><i className="fas fa-edit"></i></button>
                                            <button onClick={() => handleDelete(t.id)} className="btn btn-light" title="Delete Review" style={{ width: "35px", height: "35px", borderRadius: "10px", color: "#e33129" }}><i className="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {testimonials.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="text-center py-5 text-muted">No testimonials found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminViewTestimonials;
