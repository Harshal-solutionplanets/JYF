import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/img/logo.jpeg";
import { supabase } from "../../supabase";
import { formatDate } from "../../utils/dateFormatter";
import AdminAddEvent from "./AdminAddEvent";
import AdminAddCause from "./AdminAddCause";
import AdminAddGallery from "./AdminAddGallery";
import AdminAddNews from "./AdminAddNews";
import AdminAddTeam from "./AdminAddTeam";
import AdminAddTestimonial from "./AdminAddTestimonial";
import AdminViewEvents from "./AdminViewEvents";
import AdminViewCauses from "./AdminViewCauses";
import AdminViewNews from "./AdminViewNews";
import AdminViewRegistrations from "./AdminViewRegistrations";

const DashboardOverview = () => {
  return (
    <div className="text-center py-5">
      <h4 className="text-muted">Welcome to the Admin Dashboard. Select an option from the sidebar to manage content.</h4>
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

  const [editingEvent, setEditingEvent] = useState(null);

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setActiveView("edit_event");
  };

  const renderContent = () => {
    switch (activeView) {
      case "add_events":
        return <AdminAddEvent onPublish={() => setActiveView("dashboard")} />;
      case "edit_event":
        return <AdminAddEvent eventData={editingEvent} onPublish={() => { setEditingEvent(null); setActiveView("view_events"); }} />;
      case "view_events":
        return <AdminViewEvents onEdit={handleEditEvent} />;
      case "add_causes": return <AdminAddCause onPublish={() => setActiveView("dashboard")} />;
      case "view_causes": return <AdminViewCauses />;
      case "add_gallery": return <AdminAddGallery onPublish={() => setActiveView("dashboard")} />;
      case "add_news": return <AdminAddNews onPublish={() => setActiveView("dashboard")} />;
      case "view_news": return <AdminViewNews />;
      case "add_team": return <AdminAddTeam onPublish={() => setActiveView("dashboard")} />;
      case "add_testimonials": return <AdminAddTestimonial onPublish={() => setActiveView("dashboard")} />;
      case "view_registrations": return <AdminViewRegistrations />;
      default:
        return <DashboardOverview />;
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
        { label: "View Events List", view: "view_events" },
        { label: "View All Registrations", view: "view_registrations" }
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
