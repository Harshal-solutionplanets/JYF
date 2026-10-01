import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";

const AdminSadhuDetailStandalone = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [viewData, setViewData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('sadhu_medical_details')
                .select('*')
                .eq('id', id)
                .single();
            if (error) {
                console.error("Error fetching record:", error);
            } else {
                setViewData(data);
            }
            setLoading(false);
        };
        fetchDetails();
    }, [id]);

    if (loading) return <div className="text-center py-5">Loading details...</div>;

    if (!viewData) return <div className="text-center py-5">Record not found.</div>;

    return (
        <div style={{ backgroundColor: "#f4f6f9", padding: "40px", minHeight: "100vh" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto", backgroundColor: "#fff", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                    <h3 style={{ margin: 0, fontWeight: "800", color: "#222" }}>Sadhu / Sadhviji Details</h3>
                    <button onClick={() => navigate('/admin/dashboard')} className="btn btn_theme btn_md" style={{ padding: "8px 20px" }}>Dashboard</button>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
                    <p><strong>Name:</strong> {viewData.name}</p>
                    <p><strong>ID:</strong> {viewData.person_id}</p>
                    <p><strong>Gender:</strong> {viewData.gender}</p>
                    <p><strong>Age:</strong> {viewData.age || 'N/A'}</p>
                    <p><strong>Samuday Name:</strong> {viewData.samuday_name || 'N/A'}</p>
                    <p><strong>Date:</strong> {viewData.entry_date || 'N/A'}</p>
                    <p><strong>Contact Number:</strong> {viewData.contact_number || 'N/A'}</p>
                </div>

                <h4 style={{ color: "#ca1e14", fontWeight: "700", marginBottom: "15px" }}>Uploaded Documents</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
                    <div>
                        <h5>Forms</h5>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                            {viewData.form_images && viewData.form_images.map((img, i) => (
                                <a key={i} href={img} target="_blank" rel="noopener noreferrer"><img src={img} style={{ width: "100px", height: "100px", objectFit: "cover", border: "1px solid #ddd" }} alt="Form" /></a>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h5>Reports</h5>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                            {viewData.report_images && viewData.report_images.map((img, i) => (
                                <a key={i} href={img} target="_blank" rel="noopener noreferrer"><img src={img} style={{ width: "100px", height: "100px", objectFit: "cover", border: "1px solid #ddd" }} alt="Report" /></a>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h5>Prescriptions</h5>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                            {viewData.prescription_images && viewData.prescription_images.map((img, i) => (
                                <a key={i} href={img} target="_blank" rel="noopener noreferrer"><img src={img} style={{ width: "100px", height: "100px", objectFit: "cover", border: "1px solid #ddd" }} alt="Prescription" /></a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSadhuDetailStandalone;
