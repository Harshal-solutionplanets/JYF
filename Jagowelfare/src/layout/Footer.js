import React from 'react'
import { Link } from 'react-router-dom'
import logo from "../assets/img/logo.jpeg"

const Footer = () => {
    return (
        <footer id="footer_area" style={{ padding: "40px 0 20px 0", background: "#f8fafd", borderTop: "1px solid #eee" }}>
            <div className="container">
                <div className="row">
                    {/* About Section */}
                    <div className="col-lg-5 col-md-12 col-sm-12 col-12 mb-4">
                        <div className="footer_area_about" style={{ textAlign: "center", paddingRight: "40px" }}>
                            <img src={logo} alt="Jain Youth Foundation Logo" style={{ maxWidth: "150px", marginBottom: "15px", borderRadius: "10px" }} />
                            <p style={{ color: "#444", lineHeight: "1.6", fontSize: "14px", margin: "0 auto", maxWidth: "350px" }}>
                                Jain Youth Foundation - Unity in commUNITY.
                                Empowering lives through service, compassion, and sustainable community welfare.
                            </p>
                        </div>
                    </div>

                    {/* Support Links */}
                    <div className="col-lg-3 col-md-6 col-sm-6 col-6 mb-4">
                        <div className="footer_navitem_ara">
                            <h3 style={{ fontWeight: "800", marginBottom: "20px", fontSize: "18px", color: "#222" }}>Support</h3>
                            <div className="nav_item_footer">
                                <ul style={{ listStyle: "none", padding: 0 }}>
                                    <li style={{ marginBottom: "8px" }}><Link to="/faqs" style={{ color: "#666", fontSize: "15px" }}>Help & FAQ</Link></li>
                                    <li style={{ marginBottom: "8px" }}><Link to="/contact" style={{ color: "#666", fontSize: "15px" }}>Contact Us</Link></li>
                                    <li style={{ marginBottom: "8px" }}><Link to="/terms-service" style={{ color: "#666", fontSize: "15px" }}>Terms of Service</Link></li>
                                    <li style={{ marginBottom: "8px" }}><Link to="/privacy-policy" style={{ color: "#666", fontSize: "15px" }}>Privacy Policy</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="col-lg-4 col-md-6 col-sm-6 col-6 mb-4">
                        <div className="footer_navitem_ara">
                            <h3 style={{ fontWeight: "800", marginBottom: "20px", fontSize: "18px", color: "#222" }}>Contact Us</h3>
                            <div style={{ color: "#666", fontSize: "15px" }}>
                                <p style={{ marginBottom: "12px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                                    <i className="fas fa-map-marker-alt" style={{ marginTop: "4px", color: "#ca1e14" }}></i> 
                                    <span>21/B, Shanti Bhuvan Shopping Centre, 2nd Floor, JD Road, Above 396 Bus Stop, Mulund (W), Mumbai-80.</span>
                                </p>
                                <p style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                                    <i className="fas fa-phone" style={{ color: "#ca1e14" }}></i> 
                                    <Link to="tel:+917045707500" style={{ color: "inherit" }}>+91 70 45 70 75 00</Link>
                                </p>
                                <p style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                                    <i className="fas fa-envelope" style={{ color: "#ca1e14" }}></i> 
                                    <Link to="mailto:info@jainyouth.in" style={{ color: "inherit" }}>info@jainyouth.in</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer