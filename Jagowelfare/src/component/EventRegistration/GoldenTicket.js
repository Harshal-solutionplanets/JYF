import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import logo from "../../assets/img/jyf_logo.png"; // Now using the new logo

const GoldenTicket = ({ registration, event }) => {
    if (!registration || !event) return null;

    const formatDate = (dateStr) => {
        if (!dateStr) return "TBD";
        const date = new Date(dateStr);
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = String(date.getFullYear()).slice(-2);
        return `${d}/${m}/${y}`;
    };

    return (
        <div style={{
            background: "linear-gradient(135deg, #000 0%, #1a1a1a 100%)",
            color: "gold",
            padding: "30px 20px",
            borderRadius: "20px",
            maxWidth: "450px",
            margin: "0 auto",
            border: "3px solid gold",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            position: "relative",
            textAlign: "center"
        }}>
            <div style={{ position: "absolute", top: "10px", left: "10px", opacity: 0.2 }}>✨</div>
            <div style={{ position: "absolute", bottom: "10px", right: "10px", opacity: 0.2 }}>✨</div>

            <div style={{ marginBottom: "15px" }}>
                <img 
                    src={logo} 
                    alt="Logo" 
                    style={{ 
                        height: "100px", 
                        marginBottom: "5px",
                        filter: "drop-shadow(0 0 10px rgba(212, 175, 55, 0.3))"
                    }} 
                />
                <p style={{ 
                    color: "gold", 
                    fontSize: "14px", 
                    fontWeight: "600", 
                    margin: "0 0 15px 0",
                    textTransform: "uppercase",
                    letterSpacing: "1px"
                }}>
                    Jain Youth Foundation presents
                </p>
                <h1 style={{ 
                    fontFamily: "'Playfair Display', serif", 
                    fontSize: "30px", 
                    fontWeight: "900", 
                    color: "gold", 
                    textTransform: "uppercase", 
                    letterSpacing: "1px",
                    lineHeight: "1.2",
                    margin: "0" 
                }}>
                    {event.title}
                </h1>
            </div>

            <div style={{ borderTop: "1px solid rgba(212, 175, 55, 0.3)", borderBottom: "1px solid rgba(212, 175, 55, 0.3)", padding: "15px 0", margin: "15px 0" }}>
                <h2 style={{ fontSize: "24px", color: "#fff", fontWeight: "700" }}>{registration.full_name}</h2>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#aaa", marginTop: "10px", padding: "0 20px" }}>
                    <div style={{ textAlign: "left" }}>
                        <strong>DATE:</strong><br />
                        {formatDate(event.startAt || event.start_at)}
                    </div>
                    <div style={{ textAlign: "right", maxWidth: "200px" }}>
                        <strong>VENUE:</strong><br />
                        {event.venue || "TBD"}
                    </div>
                </div>
            </div>

            <div style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "10px", display: "inline-block", margin: "20px 0 20px", border: "5px solid #d4af37" }}>
                <QRCodeCanvas 
                    value={registration.id} 
                    size={150}
                    fgColor="#000"
                />
            </div>

            {(registration.section || registration.selected_section) && (
                <div style={{ 
                    margin: "10px auto 20px", 
                    backgroundColor: "gold", 
                    display: "block", 
                    padding: "10px 30px", 
                    borderRadius: "50px",
                    maxWidth: "200px",
                    boxShadow: "0 4px 15px rgba(212, 175, 55, 0.3)"
                }}>
                    <span style={{ 
                        fontSize: "14px", 
                        fontWeight: "900", 
                        color: "#000", 
                        textTransform: "uppercase",
                        letterSpacing: "1px"
                    }}>
                        {registration.section || registration.selected_section}
                    </span>
                </div>
            )}

            <p style={{ marginTop: "20px", color: "#888", fontSize: "11px" }}>
                Scan this at the entrance • Entry on First come basis • jainyouthfoundation.org
            </p>
        </div>
    );
};

export default GoldenTicket;
