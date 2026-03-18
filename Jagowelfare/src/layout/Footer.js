import React from 'react'
// Improt Link
import { Link } from 'react-router-dom'
// import Logo
import logo from "../assets/img/logo.jpeg"
// import Data
import { FooterData } from './FooterData'

const Footer = () => {
    return (
        <footer id="footer_area" style={{ padding: "80px 0 60px 0", background: "#f8fafd" }}>
            <div className="container">
                <div className="row">
                    {/* About Section */}
                    <div className="col-lg-4 col-md-12 col-sm-12 col-12 mb-4">
                        <div className="footer_area_about">
                            <img src={logo} alt="Jago Welfare Logo" style={{ maxWidth: "150px", marginBottom: "20px" }} />
                            <p style={{ color: "#555", lineHeight: "1.6" }}>
                                Jago Welfare Foundation (JYF) - Unity in commUNITY. 
                                Empowering lives through service, compassion, and sustainable community welfare.
                            </p>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-lg-2 col-md-6 col-sm-12 col-12 mb-4">
                        <div className="footer_navitem_ara">
                            <h3 style={{ fontWeight: "700", marginBottom: "25px", fontSize: "1.2rem" }}>Quick Links</h3>
                            <div className="nav_item_footer">
                                <ul style={{ listStyle: "none", padding: 0 }}>
                                    <li><Link to="/about">About Us</Link></li>
                                    <li><Link to="/causes">Causes</Link></li>
                                    <li><Link to="/event">Events</Link></li>
                                    <li><Link to="/news">News</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Support Links */}
                    <div className="col-lg-2 col-md-6 col-sm-12 col-12 mb-4">
                        <div className="footer_navitem_ara">
                            <h3 style={{ fontWeight: "700", marginBottom: "25px", fontSize: "1.2rem" }}>Support</h3>
                            <div className="nav_item_footer">
                                <ul style={{ listStyle: "none", padding: 0 }}>
                                    <li><Link to="/faqs">Help & FAQ</Link></li>
                                    <li><Link to="/contact">Contact Us</Link></li>
                                    <li><Link to="/terms-service">Terms of Service</Link></li>
                                    <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="col-lg-4 col-md-12 col-sm-12 col-12 mb-4">
                        <div className="footer_navitem_ara">
                            <h3 style={{ fontWeight: "700", marginBottom: "25px", fontSize: "1.2rem" }}>Contact Us</h3>
                            <div style={{ color: "#555" }}>
                                <p style={{ marginBottom: "10px" }}><i className="fas fa-map-marker-alt" style={{ marginRight: "10px", color: "#ca1e14" }}></i> [Update with actual address]</p>
                                <p style={{ marginBottom: "10px" }}><i className="fas fa-phone" style={{ marginRight: "10px", color: "#ca1e14" }}></i> <Link to="tel:+91XXXXXXXXXX" style={{ color: "inherit" }}>+91 XXXXX XXXXX</Link></p>
                                <p style={{ marginBottom: "10px" }}><i className="fas fa-envelope" style={{ marginRight: "10px", color: "#ca1e14" }}></i> <Link to="mailto:info@jyf.org" style={{ color: "inherit" }}>info@jyf.org</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer