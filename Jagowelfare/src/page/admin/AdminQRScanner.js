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

    useEffect(() => {
        const scanner = new Html5QrcodeScanner("reader", {
            fps: 10,
            qrbox: { width: 250, height: 250 },
        });

        scanner.render(onScanSuccess, onScanError);

        function onScanSuccess(decodedText) {
            setScanResult(decodedText);
            fetchUserData(decodedText);
            scanner.clear(); // Stop scanning after success
        }

        function onScanError(err) {
            // Silence errors as they happen on every non-qr frame
        }

        return () => {
            scanner.clear();
        };
    }, []);

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

            // Fetch event info too
            const { data: ev } = await supabase.from('events').select('title').eq('id', data.event_id).single();
            setEventData(ev);

        } catch (err) {
            setMsg({ text: "Error fetching user data: " + err.message, type: "danger" });
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
        // Need to re-initialize scanner logic? Actually, we'll just window.location.reload() or re-render
        window.location.reload(); 
    };

    return (
        <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "15px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", maxWidth: "600px", margin: "0 auto" }}>
            <h3 style={{ marginBottom: "30px", fontWeight: "800", textAlign: "center" }}>Entry Pass Scanner</h3>
            
            {!scanResult ? (
                <div id="reader" style={{ borderRadius: "10px", overflow: "hidden" }}></div>
            ) : (
                <div className="p-4" style={{ backgroundColor: "#f8f9fa", borderRadius: "15px", border: "1px solid #eee" }}>
                    {loading ? (
                        <p className="text-center">Loading user info...</p>
                    ) : userData ? (
                        <>
                            <div className="text-center mb-4">
                                <div style={{ width: "80px", height: "80px", backgroundColor: "#e33129", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 15px", fontSize: "30px", fontWeight: "bold" }}>
                                    {userData.full_name.charAt(0)}
                                </div>
                                <h4 style={{ fontWeight: "800", margin: 0 }}>{userData.full_name}</h4>
                                <p className="text-muted">{userData.email}</p>
                            </div>

                            <table className="table table-sm">
                                <tbody>
                                    <tr>
                                        <td><strong>Event:</strong></td>
                                        <td>{eventData?.title || "Unknown"}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Phone:</strong></td>
                                        <td>{userData.phone_number}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Location:</strong></td>
                                        <td>{userData.location || "N/A"}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Status:</strong></td>
                                        <td>
                                            {userData.is_checked_in ? (
                                                <span className="badge bg-success p-2">Already Checked-in ✅</span>
                                            ) : (
                                                <span className="badge bg-warning text-dark p-2">Pending ⏳</span>
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {msg.text && (
                                <div className={`alert alert-${msg.type} mt-3 text-center`}>{msg.text}</div>
                            )}

                            {!userData.is_checked_in && (
                                <button 
                                    onClick={handleAccept} 
                                    className="btn btn-danger w-100 mt-4 py-3" 
                                    style={{ fontWeight: "800", borderRadius: "12px" }}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? "Confirming..." : "ACCEPT ENTRY"}
                                </button>
                            )}

                            <button onClick={resetScanner} className="btn btn-outline-secondary w-100 mt-3 py-2" style={{ borderRadius: "10px" }}>Scan Another</button>
                        </>
                    ) : (
                        <div className="text-center">
                            <p className="text-danger">Failed to retrieve data for ID: {scanResult}</p>
                            <button onClick={resetScanner} className="btn btn-dark w-100 mt-3">Try Again</button>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-4 text-center">
                <p className="text-muted small">Scanner uses your device camera. Please allow permission if prompted.</p>
            </div>
        </div>
    );
};

export default AdminQRScanner;
