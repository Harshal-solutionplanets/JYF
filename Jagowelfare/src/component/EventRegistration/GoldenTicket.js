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

            {(() => {
                let displaySection = (registration.selected_section || registration.section || "GENERAL").toString().trim().toUpperCase();
                
                if (event.description && event.description.startsWith("SECTIONS:")) {
                    try {
                        const metadataPart = event.description.split(" | CONTENT: ")[0];
                        const sectionsString = metadataPart.split("SECTIONS: ")[1].split(" | ")[0];
                        const parsed = JSON.parse(sectionsString);
                        
                        const availableSections = (Array.isArray(parsed) ? parsed : Object.keys(parsed))
                            .map(s => (typeof s === 'string' ? s : s.name).toUpperCase());

                        const match = availableSections.find(s => s === displaySection);
                        if (match) {
                            displaySection = match;
                        } else if (displaySection === "GENERAL" || displaySection === "" || !availableSections.includes(displaySection)) {
                            if (availableSections.length > 0) {
                                displaySection = availableSections[0];
                            }
                        }
                    } catch (e) { console.error("GoldenTicket Strong Logic Error:", e); }
                }
                
                if (!displaySection) {
                    displaySection = "GENERAL";
                }
                
                if (!displaySection) return null;
                
                return (
                    <div style={{ 
                        margin: "10px auto 20px", 
                        backgroundColor: "#FFCC00", 
                        display: "block", 
                        padding: "12px 20px", 
                        borderRadius: "0", 
                        maxWidth: "180px",
                        textAlign: "center",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
                    }}>
                        <span style={{ 
                            fontSize: "18px", 
                            fontWeight: "900", 
                            color: "#000", 
                            textTransform: "uppercase",
                            letterSpacing: "1px"
                        }}>
                            {displaySection}
                        </span>
                    </div>
                );
            })()}

            <p style={{ marginTop: "20px", color: "#888", fontSize: "11px" }}>
                Scan this at the entrance • Entry on First come basis • <a href="https://jainyouthfoundation.org" target="_blank" rel="noopener noreferrer" style={{ color: "#D4AF37", textDecoration: "none" }}>jainyouthfoundation.org</a>
            </p>
        </div>
    );
};

export default GoldenTicket;
