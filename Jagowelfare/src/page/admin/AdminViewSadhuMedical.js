import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../../supabase";
import { QRCodeCanvas } from "qrcode.react";
import logo from "../../assets/img/logo.png";

const AdminViewSadhuMedical = ({ onEdit }) => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewData, setViewData] = useState(null);
    const [qrData, setQrData] = useState(null);

    const printRef = useRef();

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('sadhu_medical_details')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            console.error("Error fetching records:", error);
        } else {
            setRecords(data || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            await supabase.from('sadhu_medical_details').delete().eq('id', id);
            fetchRecords();
        }
    };

    const handlePrintQR = () => {
        const printContent = printRef.current.innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print QR</title>
                    <style>
                        body { text-align: center; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                        .qr-card { border: 1px solid #ccc; padding: 20px; border-radius: 10px; display: inline-block; }
                        img { max-width: 150px; margin-bottom: 20px; }
                        h3, h4 { margin: 5px 0; }
                    </style>
                </head>
                <body>
                    <div class="qr-card">${printContent}</div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
    };

    if (loading) return <div className="text-center py-5">Loading records...</div>;

    if (viewData) {
        return (
            <div style={{ backgroundColor: "#fff", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                    <h3 style={{ margin: 0, fontWeight: "800" }}>Sadhu / Sadhviji Details</h3>
                    <button onClick={() => setViewData(null)} className="btn btn_theme btn_md" style={{ padding: "8px 20px" }}>Back to List</button>
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
        );
    }

    return (
        <div style={{ backgroundColor: "#fff", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
            <h3 style={{ margin: 0, fontWeight: "800", color: "#222", marginBottom: "30px" }}>Manage Sadhu / Sadhviji Details</h3>
            
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f4f6f9", borderBottom: "1px solid #eee" }}>
                            <th style={{ padding: "15px 20px", textAlign: "left", color: "#666" }}>ID</th>
                            <th style={{ padding: "15px 20px", textAlign: "left", color: "#666" }}>Name</th>
                            <th style={{ padding: "15px 20px", textAlign: "left", color: "#666" }}>Samuday Name</th>
                            <th style={{ padding: "15px 20px", textAlign: "right", color: "#666" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record) => (
                            <tr key={record.id} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: "15px 20px", fontWeight: "600" }}>{record.person_id}</td>
                                <td style={{ padding: "15px 20px" }}>{record.name}</td>
                                <td style={{ padding: "15px 20px" }}>{record.samuday_name || '-'}</td>
                                <td style={{ padding: "15px 20px", textAlign: "right" }}>
                                    <button onClick={() => setViewData(record)} style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer", fontSize: "16px", marginRight: "15px" }}>
                                        <i className="fas fa-eye"></i> View
                                    </button>
                                    <button onClick={() => onEdit(record)} style={{ background: "none", border: "none", color: "#f39c12", cursor: "pointer", fontSize: "16px", marginRight: "15px" }}>
                                        <i className="fas fa-edit"></i> Edit
                                    </button>
                                    <button onClick={() => setQrData(record)} style={{ background: "none", border: "none", color: "#28a745", cursor: "pointer", fontSize: "16px", marginRight: "15px" }}>
                                        <i className="fas fa-qrcode"></i> QR Code
                                    </button>
                                    <button onClick={() => handleDelete(record.id)} style={{ background: "none", border: "none", color: "#ca1e14", cursor: "pointer", fontSize: "16px" }}>
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {records.length === 0 && (
                            <tr><td colSpan="4" style={{ padding: "30px", textAlign: "center" }}>No records found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* QR Code Modal Overlay */}
            {qrData && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
                    <div style={{ backgroundColor: "#fff", padding: "40px", borderRadius: "10px", textAlign: "center", position: "relative" }}>
                        <button onClick={() => setQrData(null)} style={{ position: "absolute", top: "10px", right: "15px", background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}>&times;</button>
                        
                        <div ref={printRef}>
                            <img src={logo} alt="Logo" style={{ maxWidth: "150px", marginBottom: "20px" }} />
                            <div>
                                <QRCodeCanvas value={`${window.location.origin}/admin/sadhu-medical/view/${qrData.id}`} size={200} />
                            </div>
                            <div style={{ marginTop: "20px" }}>
                                <h3 style={{ margin: "0", fontSize: "20px" }}>{qrData.name}</h3>
                                <p style={{ margin: "5px 0 0 0", color: "#666" }}>ID: {qrData.person_id}</p>
                            </div>
                        </div>

                        <button onClick={handlePrintQR} className="btn btn_theme btn_md" style={{ marginTop: "30px", padding: "8px 20px" }}>Print / Save QR</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminViewSadhuMedical;
