import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    const [stats, setStats] = useState({ events: 0, causes: 0, news: 0, gallery: 0 });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const collections = ["events", "causes", "news", "gallery"];
                const newStats = {};
                
                for (const col of collections) {
                    const { count, error } = await supabase
                        .from(col)
                        .select('*', { count: 'exact', head: true });
                    
                    if (error) {
                        console.error(`Error counting ${col}:`, error);
                        newStats[col] = 0;
                    } else {
                        newStats[col] = count || 0;
                    }
                }
                setStats(newStats);

                // Fetch recent activity across categories
                const collectionsToFetch = [
                    { name: "events", label: "Event" },
                    { name: "causes", label: "Cause" },
                    { name: "news", label: "News" },
                    { name: "gallery", label: "Gallery" }
                ];
                
                let combinedActivity = [];
                for (const colDef of collectionsToFetch) {
                    const { data, error } = await supabase
                        .from(colDef.name)
                        .select('id, title, created_at')
                        .order('created_at', { ascending: false })
                        .limit(3);
                    
                    if (!error && data) {
                        const items = data.map(item => ({ 
                            id: item.id, 
                            type: colDef.label, 
                            title: item.title || "New Entry", 
                            createdAt: item.created_at 
                        }));
                        combinedActivity = [...combinedActivity, ...items];
                    }
                }

                // Sort by time and take top 8
                combinedActivity.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setRecentActivity(combinedActivity.slice(0, 8));
            } catch (err) {
                console.error("Error fetching stats from Supabase:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div style={{ padding: "50px", textAlign: "center" }}><h4>Loading Dashboard Data...</h4></div>;

    return (
        <div>
            {/* Stats Cards */}
            <div className="row mb-5">
                {[
                    { label: "Active Events", count: stats.events, icon: "calendar-alt", color: "#ca1e14", view: "add_events" },
                    { label: "Total Causes", count: stats.causes, icon: "hand-holding-heart", color: "#228a1a", view: "add_causes" },
                    { label: "News Updates", count: stats.news, icon: "newspaper", color: "#04046d", view: "add_news" },
                    { label: "Gallery Photos", count: stats.gallery, icon: "images", color: "#f9d80d", view: "add_gallery" },
                ].map((item, index) => (
                    <div className="col-lg-3 col-md-6 mb-3" key={index}>
                        <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "15px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: "20px" }}>
                            <div style={{ width: "60px", height: "60px", backgroundColor: item.color + "15", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <i className={`fas fa-${item.icon}`} style={{ fontSize: "24px", color: item.color }}></i>
                            </div>
                            <div>
                                <h2 style={{ margin: 0, fontWeight: "800", color: "#222" }}>{item.count}</h2>
                                <p style={{ margin: 0, color: "#777", fontSize: "14px", fontWeight: "600" }}>{item.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row">
                {/* Recent Activity Table */}
                <div className="col-lg-8 mb-4">
                    <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "15px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
                        <h4 style={{ fontWeight: "800", marginBottom: "25px", color: "#1a1a1a" }}>Recent Admin Actions</h4>
                        <div className="table-responsive">
                            <table className="table">
                                <thead style={{ backgroundColor: "#f8f9fa" }}>
                                    <tr>
                                        <th style={{ border: "none" }}>Content Type</th>
                                        <th style={{ border: "none" }}>Title</th>
                                        <th style={{ border: "none" }}>Status</th>
                                        <th style={{ border: "none" }}>Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentActivity.map((item) => (
                                        <tr key={`${item.type}-${item.id}`} style={{ verticalAlign: "middle" }}>
                                            <td><span className="badge" style={{ backgroundColor: "#ca1e1415", color: "#ca1e14", padding: "8px 12px" }}>{item.type}</span></td>
                                            <td style={{ fontWeight: "600" }}>{item.title}</td>
                                            <td><span className="badge bg-success">Published</span></td>
                                            <td style={{ color: "#777" }}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Just now"}</td>
                                        </tr>
                                    ))}
                                    {recentActivity.length === 0 && <tr><td colSpan="4" className="text-center">No recent activity found.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="col-lg-4 mb-4">
                    <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "15px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
                        <h4 style={{ fontWeight: "800", marginBottom: "25px", color: "#1a1a1a" }}>Quick Actions</h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <button onClick={() => setActiveView("add_events")} className="btn btn-outline-danger w-100 text-start" style={{ padding: "12px", borderRadius: "10px", fontWeight: "600" }}>
                                <i className="fas fa-plus-circle mr-2"></i> Add New Event
                            </button>
                            <button onClick={() => setActiveView("add_causes")} className="btn btn-outline-danger w-100 text-start" style={{ padding: "12px", borderRadius: "10px", fontWeight: "600" }}>
                                <i className="fas fa-plus-circle mr-2"></i> Post a Cause
                            </button>
                            <button onClick={() => setActiveView("add_news")} className="btn btn-outline-danger w-100 text-start" style={{ padding: "12px", borderRadius: "10px", fontWeight: "600" }}>
                                <i className="fas fa-plus-circle mr-2"></i> Write News Article
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminDashboardPage = () => {
    const navigate = useNavigate();
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
                                <i className="fas fa-home" style={{ width: "35px", color: "#ca1e14" }}></i> Dashboard
                            </span>
                        </li>
                        {menuItems.map((item) => (
                            <li key={item.key}>
                                <div onClick={() => toggleMenu(item.key)} style={navItemStyle}>
                                    <span style={{ display: "flex", alignItems: "center" }}>
                                        <i className={item.icon} style={{ width: "35px", color: "#ca1e14" }}></i> {item.title}
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
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        <h2 style={{ color: "#222", margin: 0, fontWeight: "800" }}>{activeView.replace("_", " ").toUpperCase()}</h2>
                        {activeView !== "dashboard" && (
                            <button onClick={() => setActiveView("dashboard")} className="btn btn_theme btn_md" style={{ padding: "8px 20px" }}>
                                <i className="fas fa-arrow-left mr-2"></i> Back
                            </button>
                        )}
                    </div>

                    <button 
                        onClick={async () => {
                            await supabase.auth.signOut();
                            window.location.href = "/";
                        }} 
                        className="btn btn_theme btn_md" 
                        style={{ backgroundColor: "#333", border: "none", display: "flex", alignItems: "center", gap: "10px" }}
                    >
                        <i className="fas fa-sign-out-alt"></i> Logout Admin
                    </button>
                </div>
                {renderContent()}
            </main>
        </div>
    );
};

export default AdminDashboardPage;
