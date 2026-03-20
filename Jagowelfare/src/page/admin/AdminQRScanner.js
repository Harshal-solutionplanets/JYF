import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { supabase } from "../../supabase";

const AdminQRScanner = () => {
    const [scanResult, setScanResult] = useState(null);
    const [userData, setUserData] = useState(null);
    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [msg, setMsg] = useState({ text: "", type: "" });
    const [scannerKey, setScannerKey] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            const readerEl = document.getElementById("reader");
            if (!readerEl) return;

            const scanner = new Html5QrcodeScanner("reader", {
                fps: 10,
                qrbox: { width: 250, height: 250 },
            });

            scanner.render(
                (decodedText) => {
                    setScanResult(decodedText);
                    fetchUserData(decodedText);
                    scanner.clear(); 
                },
                (err) => {
                    // noise
                }
            );

            return () => {
                try {
                    scanner.clear();
                } catch (e) {}
            };
        }, 100);

        return () => clearTimeout(timer);
    }, [scannerKey]);

    const fetchUserData = async (regId) => {
        setLoading(true);
        setMsg({ text: "", type: "" });
        try {
            const { data, error } = await supabase
                .from('event_registrations')
                .select('*')
                .eq('id', regId)
                .single();
            
            if (error) throw error;
            setUserData(data);

            if (data.is_checked_in) {
                setMsg({ text: "ENTRY REJECTED: ALREADY SCANNED! ❌", type: "danger" });
            }

            const { data: ev } = await supabase.from('events').select('title').eq('id', data.event_id).single();
            setEventData(ev);

        } catch (err) {
            setMsg({ text: "Pass not found in system", type: "danger" });
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async () => {
        if (!userData) return;
        setIsUpdating(true);
        try {
            const { error } = await supabase
                .from('event_registrations')
                .update({ is_checked_in: true })
                .eq('id', userData.id);

            if (error) throw error;
            setMsg({ text: "Attendance marked successfully! ✅", type: "success" });
            setUserData(prev => ({ ...prev, is_checked_in: true }));
        } catch (err) {
            alert("Check-in failed: " + err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    const resetScanner = () => {
        setScanResult(null);
        setUserData(null);
        setEventData(null);
        setMsg({ text: "", type: "" });
        setScannerKey(prev => prev + 1);
    };

    return (
        <div style={{ backgroundColor: "#f4f4f4", padding: "60px 20px", minHeight: "90vh" }}>
            <div style={{ backgroundColor: "#fff", padding: "40px", borderRadius: "30px", boxShadow: "0 15px 50px rgba(0,0,0,0.1)", maxWidth: "800px", margin: "0 auto" }}>
                <h3 style={{ marginBottom: "35px", fontWeight: "900", textAlign: "center", color: "#333", fontSize: "32px", letterSpacing: "-1px" }}>Entry Pass Scanner</h3>
                
                {!scanResult ? (
                    <div id="reader" key={scannerKey} style={{ borderRadius: "20px", overflow: "hidden", border: "1px solid #ddd" }}></div>
                ) : (
                    <div className="p-5" style={{ 
                        background: "linear-gradient(135deg, #000 0%, #1a1a1a 100%)", 
                        color: "#d4af37", 
                        borderRadius: "25px", 
                        boxShadow: "0 25px 60px rgba(0,0,0,0.4)", 
                        position: "relative",
                        minHeight: "500px",
                        border: "3px solid #d4af37"
                    }}>
                        
                        {/* Status Circle Plate (Top Right) */}
                        {userData && !loading && (
                            <div style={{
                                position: "absolute",
                                top: "25px",
                                right: "25px",
                                width: "110px",
                                height: "110px",
                                borderRadius: "50%",
                                backgroundColor: userData.is_checked_in ? (msg.type === 'danger' ? "#e74c3c" : "#28a745") : "#f39c12",
                                color: "#fff",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 8px 25px rgba(0,0,0,0.5)",
                                zIndex: 10,
                                border: "4px solid #d4af37",
                                textAlign: "center"
                            }}>
                                <span style={{ fontSize: "18px", fontWeight: "900", lineHeight: "1" }}>{userData.is_checked_in ? (msg.type === 'danger' ? "FAILED" : "ENTRY") : "PENDING"}</span>
                                <span style={{ fontSize: "16px", marginTop: "5px" }}>{userData.is_checked_in ? (msg.type === 'danger' ? "❌" : "OK ✅") : "⏳"}</span>
                            </div>
                        )}

                        {loading ? (
                            <div className="text-center py-5">
                                <p className="fw-bold" style={{ color: "#d4af37", fontSize: "20px" }}>Fetching User Details...</p>
                            </div>
                        ) : userData ? (
                            <div style={{ textAlign: "center" }}>
                                <div style={{ marginBottom: "35px", borderBottom: "1px solid rgba(212, 175, 55, 0.3)", paddingBottom: "25px" }}>
                                    <h2 style={{ fontWeight: "900", color: "#fff", fontSize: "40px", marginBottom: "5px" }}>{userData.full_name}</h2>
                                    <p style={{ color: "#d4af37", opacity: 0.9, fontSize: "20px" }}>{userData.email}</p>
                                </div>

                                <table style={{ width: "fit-content", margin: "0 auto", fontSize: "19px", borderCollapse: "separate", borderSpacing: "20px 10px", textAlign: "left" }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ color: "#d4af37", fontWeight: "900" }}>EVENT:</td>
                                            <td style={{ color: "#fff", fontWeight: "bold" }}>{eventData?.title || "Unknown"}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ color: "#d4af37", fontWeight: "900" }}>PHONE:</td>
                                            <td style={{ color: "#fff", fontWeight: "bold" }}>{userData.phone_number}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ color: "#d4af37", fontWeight: "900" }}>SECTION:</td>
                                            <td style={{ color: "#fff", fontWeight: "900", textTransform: "uppercase", fontSize: "22px" }}>{userData.selected_section || "General"}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                {msg.text && (
                                    <div style={{ 
                                        backgroundColor: msg.type === "danger" ? "rgba(231, 76, 60, 0.2)" : "rgba(40, 167, 69, 0.2)", 
                                        color: "#fff", 
                                        padding: "15px", 
                                        borderRadius: "12px", 
                                        border: msg.type === "danger" ? "1px solid #e74c3c" : "1px solid #28a745", 
                                        marginTop: "25px", 
                                        maxWidth: "600px", 
                                        margin: "25px auto 0", 
                                        textAlign: "center", 
                                        fontWeight: "bold", 
                                        fontSize: "18px" 
                                    }}>
                                        {msg.text}
                                    </div>
                                )}
                                
                                <div style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: "50px",
                                    width: "100%",
                                    gap: "30px"
                                }}>
                                    <button 
                                        onClick={resetScanner} 
                                        style={{
                                            backgroundColor: "transparent",
                                            color: "#d4af37",
                                            border: "2px solid #d4af37",
                                            borderRadius: "50px",
                                            padding: "15px 40px",
                                            fontWeight: "900",
                                            cursor: "pointer",
                                            fontSize: "16px",
                                            minWidth: "200px"
                                        }}
                                    >
                                        Scan Another
                                    </button>

                                    {userData && !userData.is_checked_in && (
                                        <button 
                                            onClick={handleAccept} 
                                            style={{
                                                backgroundColor: "#e33129",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "50px",
                                                padding: "18px 50px",
                                                fontWeight: "900",
                                                fontSize: "18px",
                                                boxShadow: "0 10px 25px rgba(227, 49, 41, 0.4)",
                                                cursor: "pointer",
                                                minWidth: "250px"
                                            }}
                                            disabled={isUpdating}
                                        >
                                            {isUpdating ? "Confirming..." : "ACCEPT ENTRY"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-5">
                                <h3 style={{ color: "#e33129", fontWeight: "900", fontSize: "28px" }}>Invalid Pass</h3>
                                <button onClick={resetScanner} className="btn btn-outline-warning mt-5 px-5 py-3">Try Again</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <style>{`
                #reader__dashboard_section_csr button {
                    background: #e33129 !important;
                    color: white !important;
                    border: none !important;
                    padding: 8px 15px !important;
                    border-radius: 8px !important;
                }
            `}</style>
        </div>
    );
};

export default AdminQRScanner;
