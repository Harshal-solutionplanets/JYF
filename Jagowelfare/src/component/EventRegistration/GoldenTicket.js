import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const GoldenTicket = ({ registration, event }) => {
    if (!registration || !event) return null;

    return (
        <div style={{
            background: "linear-gradient(135deg, #000 0%, #1a1a1a 100%)",
            color: "gold",
            padding: "40px 20px",
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

            <div style={{ marginBottom: "20px" }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: "900", color: "gold", textTransform: "uppercase", letterSpacing: "2px" }}>
                    {event.title}
                </h1>
                <p style={{ color: "#d4af37", fontStyle: "italic", fontSize: "14px", marginTop: "5px" }}>
                    {event.tag || "Live Grand Bhakti"}
                </p>
            </div>

            <div style={{ borderTop: "1px solid rgba(212, 175, 55, 0.3)", borderBottom: "1px solid rgba(212, 175, 55, 0.3)", padding: "15px 0", margin: "15px 0" }}>
                <h2 style={{ fontSize: "24px", color: "#fff", fontWeight: "700" }}>{registration.full_name}</h2>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#aaa", marginTop: "10px", padding: "0 20px" }}>
                    <div style={{ textAlign: "left" }}>
                        <strong>DATE:</strong><br />
                        {new Date(event.startAt || event.start_at).toLocaleDateString()}
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <strong>VENUE:</strong><br />
                        {event.venue || "TBD"}
                    </div>
                </div>
            </div>

            <div style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "10px", display: "inline-block", margin: "20px 0", border: "5px solid #d4af37" }}>
                <QRCodeCanvas 
                    value={registration.id} 
                    size={150}
                    fgColor="#000"
                />
            </div>

            <div style={{ 
                backgroundColor: "rgba(212, 175, 55, 0.9)", 
                color: "#000", 
                padding: "8px 30px", 
                borderRadius: "30px", 
                fontWeight: "900", 
                display: "inline-block",
                letterSpacing: "3px",
                textTransform: "uppercase",
                fontSize: "18px",
                boxShadow: "0 5px 15px rgba(212, 175, 55, 0.4)"
            }}>
                GOLDEN TICKET
            </div>

            <p style={{ marginTop: "20px", color: "#888", fontSize: "11px" }}>
                Scan this at the entrance • Entry on First come basis • www.faithbook.in
            </p>
        </div>
    );
};

export default GoldenTicket;
