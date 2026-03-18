import React, { useState } from "react";
import logo from "../../assets/img/logo.jpeg";
import { supabase } from "../../supabase";
import AdminAddEvent from "./AdminAddEvent";
import AdminAddCause from "./AdminAddCause";
import AdminAddGallery from "./AdminAddGallery";
import AdminAddNews from "./AdminAddNews";
import AdminAddTeam from "./AdminAddTeam";
import AdminAddTestimonial from "./AdminAddTestimonial";
import AdminViewEvents from "./AdminViewEvents";
import AdminViewCauses from "./AdminViewCauses";
import AdminViewNews from "./AdminViewNews";

const DashboardOverview = ({ setActiveView }) => {
    return (
        <div style={{ textAlign: "center", padding: "100px 20px" }}>
            <h1 style={{ fontWeight: "800", color: "#ddd", fontSize: "48px", marginBottom: "20px" }}>WELCOME TO ADMIN PANEL</h1>
            <p style={{ color: "#999", fontSize: "18px" }}>Select an option from the sidebar to manage your website content.</p>
            
            <div className="row mt-5 justify-content-center">
                <div className="col-lg-8">
                    <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "15px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)", display: "flex", justifyContent: "center", gap: "20px" }}>
                        <button onClick={() => setActiveView("add_events")} className="btn btn_theme btn_md" style={{ padding: "15px 30px", borderRadius: "30px" }}>
                            <i className="fas fa-plus-circle mr-2"></i> Add New Event
                        </button>
                        <button onClick={() => setActiveView("add_causes")} className="btn btn_theme btn_md" style={{ padding: "15px 30px", borderRadius: "30px" }}>
                            <i className="fas fa-hand-holding-heart mr-2"></i> Post a Cause
                        </button>
                        <button onClick={() => setActiveView("add_news")} className="btn btn_theme btn_md" style={{ padding: "15px 30px", borderRadius: "30px" }}>
                            <i className="fas fa-newspaper mr-2"></i> Write News
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminDashboardPage = () => {
    const [openMenus, setOpenMenus] = useState({});
    const [activeView, setActiveView] = useState("dashboard");

    const toggleMenu = (menu) => {
        setOpenMenus((prev) => ({
            ...prev,
            [menu]: !prev[menu],
        }));
    };

    const renderContent = () => {
        switch (activeView) {
            case "add_events": return <AdminAddEvent onPublish={() => setActiveView("dashboard")} />;
            case "view_events": return <AdminViewEvents />;
            case "add_causes": return <AdminAddCause onPublish={() => setActiveView("dashboard")} />;
            case "view_causes": return <AdminViewCauses />;
            case "add_gallery": return <AdminAddGallery onPublish={() => setActiveView("dashboard")} />;
            case "add_news": return <AdminAddNews onPublish={() => setActiveView("dashboard")} />;
            case "view_news": return <AdminViewNews />;
            case "add_team": return <AdminAddTeam onPublish={() => setActiveView("dashboard")} />;
            case "add_testimonials": return <AdminAddTestimonial onPublish={() => setActiveView("dashboard")} />;
            default:
                return <DashboardOverview setActiveView={setActiveView} />;
        }
    };

    const navItemStyle = {
        padding: "12px 25px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        color: "#222",
        fontWeight: "600",
        fontSize: "16px",
    };

    const subItemStyle = {
        padding: "8px 25px 8px 60px",
        cursor: "pointer",
        display: "block",
        color: "#555",
        fontSize: "14px",
        fontWeight: "500",
    };

    const menuItems = [
        { 
            title: "Manage Events", icon: "fas fa-calendar-alt", key: "events",
            subs: [
                { label: "Add Event", view: "add_events" },
                { label: "View Events List", view: "view_events" }
            ]
        },
        { 
            title: "Causes", icon: "fas fa-hand-holding-heart", key: "causes",
            subs: [
                { label: "Add Cause", view: "add_causes" },
                { label: "View Causes List", view: "view_causes" }
            ]
        },
        { 
            title: "News Articles", icon: "fas fa-newspaper", key: "news",
            subs: [
                { label: "Add News", view: "add_news" },
                { label: "View News List", view: "view_news" }
            ]
        },
        { title: "Gallery", icon: "fas fa-images", key: "gallery", addView: "add_gallery", viewPath: "/gallery" },
        { title: "Team Members", icon: "fas fa-users", key: "team", addView: "add_team", viewPath: "/team" },
        { title: "Testimonials", icon: "fas fa-comment-dots", key: "testimonials", addView: "add_testimonials", viewPath: "/testimonial" },
    ];

    return (
        <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f4f6f9" }}>
            <aside style={{ width: "260px", backgroundColor: "#ffffff", boxShadow: "2px 0 10px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "25px 20px", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #eaeaea" }}>
                    <img src={logo} alt="Logo" style={{ maxWidth: "160px" }} />
                </div>
                <div style={{ padding: "25px 0", flex: 1, overflowY: "auto" }}>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        <li onClick={() => setActiveView("dashboard")} style={navItemStyle}>
                            <span style={{ display: "flex", alignItems: "center" }}>
                                <i className="fas fa-home" style={{ width: "35px", color: "#e33129" }}></i> Dashboard
                            </span>
                        </li>
                        {menuItems.map((item) => (
                            <li key={item.key}>
                                <div onClick={() => toggleMenu(item.key)} style={navItemStyle}>
                                    <span style={{ display: "flex", alignItems: "center" }}>
                                        <i className={item.icon} style={{ width: "35px", color: "#e33129" }}></i> {item.title}
                                    </span>
                                    <i className={`fas fa-chevron-${openMenus[item.key] ? "down" : "right"}`} style={{ fontSize: "12px", color: "#999" }}></i>
                                </div>
                                {openMenus[item.key] && (
                                    <div style={{ backgroundColor: "#f9f9f9" }}>
                                        {item.subs ? (
                                            item.subs.map((sub, idx) => (
                                                sub.external ? (
                                                    <a key={idx} href={sub.path} target="_blank" rel="noopener noreferrer" style={{ ...subItemStyle, textDecoration: "none" }}>{sub.label}</a>
                                                ) : (
                                                    <div key={idx} onClick={() => setActiveView(sub.view)} style={subItemStyle}>{sub.label}</div>
                                                )
                                            ))
                                        ) : (
                                            <>
                                                <div onClick={() => setActiveView(item.addView)} style={subItemStyle}>Add {item.title.replace("Manage ", "").replace(" Articles", "").replace(" Members", "")}</div>
                                                <a href={item.viewPath} target="_blank" rel="noopener noreferrer" style={{ ...subItemStyle, textDecoration: "none" }}>View {item.title.replace("Manage ", "")}</a>
                                            </>
                                        )}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
            <main style={{ flex: 1, padding: "50px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
                    <h2 style={{ color: "#222", margin: 0 }}>{activeView.replace("_", " ").toUpperCase()}</h2>
                    {activeView !== "dashboard" && (
                        <button onClick={() => setActiveView("dashboard")} className="btn btn_theme btn_md">Back to Overview</button>
                    )}
                </div>
                {renderContent()}
            </main>
        </div>
    );
};

export default AdminDashboardPage;
