import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/img/logo.png";
import { supabase } from "../../supabase";
import { formatDate } from "../../utils/dateFormatter";
import AdminAddEvent from "./AdminAddEvent";
import AdminAddCause from "./AdminAddCause";
import AdminAddGallery from "./AdminAddGallery";
import AdminAddNews from "./AdminAddNews";
import AdminAddSupporter from "./AdminAddSupporter";
import AdminAddTeam from "./AdminAddTeam";
import AdminAddTestimonial from "./AdminAddTestimonial";
import AdminViewEvents from "./AdminViewEvents";
import AdminViewCauses from "./AdminViewCauses";
import AdminViewNews from "./AdminViewNews";
import AdminViewRegistrations from "./AdminViewRegistrations";
import AdminQRScanner from "./AdminQRScanner";
import AdminDashboardUpdates from "./AdminDashboardUpdates";
import AdminViewGallery from "./AdminViewGallery";
import AdminViewAlbums from "./AdminViewAlbums";
import AdminViewSupporter from "./AdminViewSupporter";
import AdminViewTeam from "./AdminViewTeam";
import AdminViewTestimonials from "./AdminViewTestimonials";
import { useAuth } from "../../auth/AuthProvider";

const DashboardOverview = () => {
  return (
    <div className="text-center py-5">
      <h4 className="text-muted">Welcome to the Admin Dashboard. Select an option from the sidebar to manage content.</h4>
    </div>
  );
};

const MasterManagementView = ({ type, title, masters, onAdd, onDelete, onUpdate, onReorder, value, setValue, placeholder }) => {
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);

  const startEdit = (m) => {
    setEditingId(m.id);
    setEditingValue(m.value);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
  };

  const saveEdit = () => {
    if (editingValue.trim()) {
      onUpdate(editingId, editingValue.trim());
      setEditingId(null);
      setEditingValue("");
    }
  };

  const filteredMasters = masters.filter(m => m.type === type);

  const onDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e, index) => {
    e.preventDefault();
  };

  const onDrop = async (e, index) => {
    e.preventDefault();
    if (draggedIndex === index) return;

    const newMasters = [...filteredMasters];
    const itemToMove = newMasters.splice(draggedIndex, 1)[0];
    newMasters.splice(index, 0, itemToMove);
    
    // Call reorder handler
    onReorder(newMasters);
    setDraggedIndex(null);
  };

  return (
    <div style={{ backgroundColor: "#fff", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div>
          <h3 style={{ margin: 0, fontWeight: "800", color: "#222" }}>{title}</h3>
          <p style={{ margin: 0, fontSize: "12px", color: "#ca1e14", marginTop: "5px" }}>Tip: Drag any row to reorder items</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "40px", maxWidth: "400px" }}>
        <input
          type="text"
          placeholder={placeholder || `Enter new ${title}...`}
          style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "12px 15px", width: "100%", fontSize: "15px" }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onAdd(type, value, setValue)}
        />
        <button
          onClick={() => onAdd(type, value, setValue)}
          className="btn btn_theme"
          style={{ padding: "0 25px", borderRadius: "8px", fontWeight: "700" }}
        >
          ADD
        </button>
      </div>

      <div style={{ backgroundColor: "#fcfcfc", borderRadius: "15px", border: "1px solid #eee", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f4f6f9", borderBottom: "1px solid #eee" }}>
              <th style={{ padding: "15px 20px", textAlign: "left", color: "#666", textTransform: "uppercase", fontSize: "13px", width: "40px" }}></th>
              <th style={{ padding: "15px 20px", textAlign: "left", color: "#666", textTransform: "uppercase", fontSize: "13px" }}>Types</th>
              <th style={{ padding: "15px 20px", textAlign: "right", color: "#666", textTransform: "uppercase", fontSize: "13px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredMasters.map((m, index) => (
              <tr 
                key={m.id} 
                draggable
                onDragStart={(e) => onDragStart(e, index)}
                onDragOver={(e) => onDragOver(e, index)}
                onDrop={(e) => onDrop(e, index)}
                style={{ 
                  borderBottom: "1px solid #eee",
                  cursor: "grab",
                  backgroundColor: draggedIndex === index ? "#f9f9f9" : "transparent"
                }}
              >
                <td style={{ padding: "15px 20px", color: "#ccc" }}>
                  <i className="fas fa-grip-vertical"></i>
                </td>
                <td style={{ padding: "15px 20px", fontWeight: "600", color: "#333" }}>
                  {editingId === m.id ? (
                    <input 
                      type="text" 
                      value={editingValue} 
                      onChange={(e) => setEditingValue(e.target.value)} 
                      style={{ border: "1px solid #ddd", borderRadius: "4px", padding: "5px 10px", width: "100%" }}
                      autoFocus
                    />
                  ) : (
                    m.value
                  )}
                </td>
                <td style={{ padding: "15px 20px", textAlign: "right" }}>
                  <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                    {editingId === m.id ? (
                      <>
                        <button onClick={saveEdit} style={{ background: "none", border: "none", color: "#28a745", cursor: "pointer", fontSize: "18px" }}>
                          <i className="fas fa-check"></i>
                        </button>
                        <button onClick={cancelEdit} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "18px" }}>
                          <i className="fas fa-times"></i>
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(m)} style={{ background: "none", border: "none", color: "#f39c12", cursor: "pointer", fontSize: "18px" }}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button onClick={() => onDelete(m.id)} style={{ background: "none", border: "none", color: "#ca1e14", cursor: "pointer", fontSize: "18px" }}>
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredMasters.length === 0 && (
              <tr>
                <td colSpan="3" style={{ padding: "30px", textAlign: "center", color: "#999" }}>No items found. Add one above.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const isScannerOnly = user?.email === 'jainyouthfoundation9@gmail.com';

  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState({});
  const [activeView, setActiveView] = useState(isScannerOnly ? "qr_scanner" : "dashboard");
  const [categoryInput, setCategoryInput] = useState("");
  const [seatTierInput, setSeatTierInput] = useState("");
  const [honoraryInput, setHonoraryInput] = useState("");
  const [masters, setMasters] = useState([]);
  const [openSubMenus, setOpenSubMenus] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchMasters = async () => {
    try {
      const { data, error } = await supabase.from('masters').select('*').order('priority', { ascending: false }).order('created_at', { ascending: false });
      if (error) {
        console.warn("Priority column might be missing. Using date sorting.", error);
        const { data: fallback, error: fallbackError } = await supabase.from('masters').select('*').order('created_at', { ascending: false });
        if (fallbackError) throw fallbackError;
        setMasters(fallback || []);
      } else {
        setMasters(data || []);
      }
    } catch (e) {
      console.error("Error fetching masters:", e);
    }
  };

  useEffect(() => {
    fetchMasters();
  }, []);


  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const [editingEvent, setEditingEvent] = useState(null);
  const [editingCause, setEditingCause] = useState(null);

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setActiveView("edit_event");
  };

  const handleEditCause = (cause) => {
    setEditingCause(cause);
    setActiveView("edit_cause");
  };

  const [editingTeam, setEditingTeam] = useState(null);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  const [editingSupporter, setEditingSupporter] = useState(null);

  const handleEditSupporter = (supporter) => {
    setEditingSupporter(supporter);
    setActiveView("edit_supporter");
  };

  const handleEditTeam = (member) => {
    setEditingTeam(member);
    setActiveView("edit_team");
  };

  const handleEditTestimonial = (testimonial) => {
    setEditingTestimonial(testimonial);
    setActiveView("edit_testimonial");
  };

  const handleAddMaster = async (type, value, setInput) => {
    if (!value.trim()) return;
    try {
      const { data: lastItem } = await supabase.from('masters').select('priority').order('priority', { ascending: false }).limit(1);
      const nextPriority = lastItem && lastItem[0] ? (lastItem[0].priority || 0) + 1 : 1;

      const { error } = await supabase.from('masters').insert([{ type, value: value.trim(), priority: nextPriority }]);
      if (error) throw error;
      alert(`New ${type.replace("_", " ")} added: ${value}`);
      setInput("");
      fetchMasters();
    } catch (e) {
      console.error(e);
      alert("Error adding master.");
    }
  };

  const handleUpdateMaster = async (id, newValue) => {
    try {
      const { error } = await supabase.from('masters').update({ value: newValue }).eq('id', id);
      if (error) throw error;
      fetchMasters();
    } catch (e) {
      console.error(e);
      alert("Error updating master.");
    }
  };

  const handleReorderMasters = async (newOrderedList) => {
    try {
      // Optimistic update
      setMasters(prev => {
        const otherTypes = prev.filter(p => !newOrderedList.find(n => n.id === p.id));
        const updatedList = [...otherTypes, ...newOrderedList];
        return updatedList.sort((a,b) => (b.priority || 0) - (a.priority || 0));
      });

      const updates = newOrderedList.map((m, i) => ({
        id: m.id,
        priority: newOrderedList.length - i
      }));

      for (const update of updates) {
        await supabase.from('masters').update({ priority: update.priority }).eq('id', update.id);
      }
      fetchMasters();
    } catch (e) {
      console.error("Master reorder failed", e);
    }
  };

  const handleDeleteMaster = async (id) => {
    if (!window.confirm("Are you sure you want to delete this master?")) return;
    try {
      const { error } = await supabase.from('masters').delete().eq('id', id);
      if (error) throw error;
      fetchMasters();
    } catch (e) {
      console.error(e);
    }
  };

  const getViewTitle = () => {
    const titles = {
        "dashboard": "Dashboard Overview",
        "add_events": "Add New Event",
        "view_events": "Manage Events",
        "edit_event": "Edit Event",
        "add_causes": "Post a Cause",
        "view_causes": "All Causes",
        "add_gallery": "Add Gallery Image",
        "view_gallery": "Gallery Management",
        "view_albums": "Manage Albums",
        "add_news": "Publish News Article",
        "view_news": "Article History",
        "add_team": "Add Team Member",
        "view_team": "Manage Team Members",
        "edit_team": "Edit Team Member",
        "add_testimonials": "Add Testimonial",
        "view_testimonials": "Manage Testimonials",
        "edit_testimonial": "Edit Testimonial",
        "add_supporter": "Add Supporter",
        "view_supporter": "Manage Supporters",
        "edit_supporter": "Edit Supporter",
        "view_registrations": "Event Registrations",
        "manage_master_cat": "Event Category Master",
        "manage_master_seat": "Seats Type Master",
        "manage_honorary": "Honorary Volunteers Master",
        "dashboard_updates": "Global Site Updates",
        "qr_scanner": "QR Entry Scanner"
    };
    return titles[activeView] || activeView.replace("_", " ").toUpperCase();
  };



  const renderContent = () => {
    switch (activeView) {
      case "qr_scanner":
        return <AdminQRScanner />;
      case "add_events":
        return <AdminAddEvent onPublish={() => setActiveView("dashboard")} />;
      case "edit_event":
        return <AdminAddEvent eventData={editingEvent} onPublish={() => { setEditingEvent(null); setActiveView("view_events"); }} />;
      case "view_events":
        return <AdminViewEvents onEdit={handleEditEvent} />;
      case "add_causes": 
        return <AdminAddCause onPublish={() => setActiveView("dashboard")} />;
      case "edit_cause":
        return <AdminAddCause causeData={editingCause} onPublish={() => { setEditingCause(null); setActiveView("view_causes"); }} />;
      case "view_causes": 
        return <AdminViewCauses onEdit={handleEditCause} />;
      case "add_gallery": return <AdminAddGallery onPublish={() => setActiveView("dashboard")} />;
      case "view_gallery": return <AdminViewGallery />;
      case "view_albums": return <AdminViewAlbums />;
      case "add_news": return <AdminAddNews onPublish={() => setActiveView("dashboard")} />;
      case "view_news": return <AdminViewNews />;
      case "add_team": return <AdminAddTeam onPublish={() => setActiveView("dashboard")} />;
      case "edit_team": return <AdminAddTeam teamData={editingTeam} onPublish={() => { setEditingTeam(null); setActiveView("view_team"); }} />;
      case "view_team": return <AdminViewTeam onEdit={handleEditTeam} />;
      case "add_testimonials": return <AdminAddTestimonial onPublish={() => setActiveView("dashboard")} />;
      case "edit_testimonial": return <AdminAddTestimonial testimonialData={editingTestimonial} onPublish={() => { setEditingTestimonial(null); setActiveView("view_testimonials"); }} />;
      case "view_testimonials": return <AdminViewTestimonials onEdit={handleEditTestimonial} />;
      case "add_supporter": return <AdminAddSupporter onPublish={() => setActiveView("dashboard")} />;
      case "edit_supporter": return <AdminAddSupporter supporterData={editingSupporter} onPublish={() => { setEditingSupporter(null); setActiveView("view_supporter"); }} />;
      case "view_supporter": return <AdminViewSupporter onEdit={handleEditSupporter} />;
      case "view_registrations": return <AdminViewRegistrations />;
      case "manage_master_cat": return <MasterManagementView type="event_category" title="Event Category Master" masters={masters} onAdd={handleAddMaster} onDelete={handleDeleteMaster} onUpdate={handleUpdateMaster} onReorder={handleReorderMasters} value={categoryInput} setValue={setCategoryInput} placeholder="Enter new Category..." />;
      case "manage_master_seat": return <MasterManagementView type="seat_tier" title="Seats Type Master" masters={masters} onAdd={handleAddMaster} onDelete={handleDeleteMaster} onUpdate={handleUpdateMaster} onReorder={handleReorderMasters} value={seatTierInput} setValue={setSeatTierInput} placeholder="Enter new Seat Type..." />;
      case "manage_honorary": return <MasterManagementView type="honorary_volunteer" title="Honorary Volunteers Management" masters={masters} onAdd={handleAddMaster} onDelete={handleDeleteMaster} onUpdate={handleUpdateMaster} onReorder={handleReorderMasters} value={honoraryInput} setValue={setHonoraryInput} placeholder="Enter Name..." />;
      case "dashboard_updates": return <AdminDashboardUpdates />;
      default:
        return <DashboardOverview />;
    }
  };


  const navItemStyle = {
    padding: "12px 20px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#222",
    fontWeight: "600",
    fontSize: "14px",
    transition: "0.2s"
  };

  const subItemStyle = {
    padding: "10px 25px 10px 55px",
    cursor: "pointer",
    display: "block",
    color: "#666",
    fontSize: "13px",
    fontWeight: "500",
    borderLeft: "3px solid transparent",
    transition: "0.2s"
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
    {
      title: "Gallery", icon: "fas fa-images", key: "gallery",
      subs: [
        { label: "Add Gallery", view: "add_gallery" },
        { label: "View All Images", view: "view_gallery" },
        { label: "View Albums", view: "view_albums" }
      ]
    },
    {
      title: "Team Members", icon: "fas fa-users", key: "team",
      subs: [
        { label: "Add Member", view: "add_team" },
        { label: "View Team List", view: "view_team" }
      ]
    },
    {
      title: "Our Supporters", icon: "fas fa-handshake", key: "supporters",
      subs: [
        { label: "Add Supporter", view: "add_supporter" },
        { label: "View Supporters List", view: "view_supporter" }
      ]
    },
    {
      title: "Testimonials", icon: "fas fa-comment-dots", key: "testimonials",
      subs: [
        { label: "Add Testimonial", view: "add_testimonials" },
        { label: "View Testimonial List", view: "view_testimonials" }
      ]
    },
    { title: "Dashboard Updates", icon: "fas fa-edit", key: "dashboard_updates", view: "dashboard_updates" },
    { title: "Master Management", icon: "fas fa-cogs", key: "master_mgmt", isMaster: true },
  ];


  return (
    <div style={{ display: "flex", flexWrap: isMobile ? "wrap" : "nowrap", height: isMobile ? "auto" : "100vh", backgroundColor: "#f4f6f9", overflow: isMobile ? "visible" : "hidden" }}>
      {(!isScannerOnly || !isMobile) && (
        <aside style={{ 
          width: isMobile ? "100%" : "280px", 
          backgroundColor: "#ffffff", 
          boxShadow: "2px 0 10px rgba(0,0,0,0.05)", 
          display: "flex", 
          flexDirection: "column",
          borderBottom: isMobile ? "1px solid #eee" : "none" 
        }}>
        <div style={{ padding: "25px 20px", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #eaeaea" }}>
          <img src={logo} alt="Logo" style={{ maxWidth: "160px" }} />
        </div>
        <div style={{ padding: "25px 0", flex: 1, overflowY: "auto" }}>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {!isScannerOnly && (
              <li onClick={() => setActiveView("dashboard")} style={navItemStyle}>
                <span style={{ display: "flex", alignItems: "center" }}>
                  <i className="fas fa-home" style={{ width: "35px", color: "#ca1e14" }}></i> Dashboard
                </span>
              </li>
            )}
            {!isScannerOnly && menuItems.map((item) => (
              <li key={item.key}>
                <div onClick={() => toggleMenu(item.key)} style={navItemStyle}>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <i className={item.icon} style={{ width: "35px", color: "#ca1e14" }}></i> {item.title}
                  </span>
                  <i className={`fas fa-chevron-${openMenus[item.key] ? "down" : "right"}`} style={{ fontSize: "12px", color: "#999" }}></i>
                </div>
                {openMenus[item.key] && (
                  <div style={{ backgroundColor: "#f9f9f9" }}>
                    {item.isMaster ? (
                      <div style={{ padding: "0 0 10px 0" }}>
                        <div
                          onClick={() => setActiveView("manage_master_cat")}
                          style={{ ...subItemStyle, display: "flex", justifyContent: "space-between", alignItems: "center", color: activeView === "manage_master_cat" ? "#ca1e14" : "#444", fontWeight: "600" }}
                        >
                          <span>Event Category</span>
                        </div>
                        <div
                          onClick={() => setActiveView("manage_master_seat")}
                          style={{ ...subItemStyle, display: "flex", justifyContent: "space-between", alignItems: "center", color: activeView === "manage_master_seat" ? "#ca1e14" : "#444", fontWeight: "600", borderTop: "1px solid #eee", paddingTop: "10px", marginTop: "5px" }}
                        >
                          <span>Seats Type Master</span>
                        </div>
                        <div
                          onClick={() => setActiveView("manage_honorary")}
                          style={{ ...subItemStyle, display: "flex", justifyContent: "space-between", alignItems: "center", color: activeView === "manage_honorary" ? "#ca1e14" : "#444", fontWeight: "600", borderTop: "1px solid #eee", paddingTop: "10px", marginTop: "5px" }}
                        >
                          <span>Honorary Volunteers</span>
                        </div>
                      </div>
                    ) : item.view ? (
                      <div onClick={() => setActiveView(item.view)} style={{ ...subItemStyle, color: activeView === item.view ? "#ca1e14" : "#666", borderLeftColor: activeView === item.view ? "#ca1e14" : "transparent" }}>Updates Overview</div>
                    ) : item.subs ? (
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
            <li onClick={() => setActiveView("qr_scanner")} style={{ ...navItemStyle, backgroundColor: activeView === "qr_scanner" ? "#fff5f5" : "transparent" }}>
              <span style={{ display: "flex", alignItems: "center" }}>
                <i className="fas fa-qrcode" style={{ width: "35px", color: "#ca1e14" }}></i> Entry QR Scanner
              </span>
            </li>

          </ul>
        </div>
      </aside>
      )}
      <main style={{ flex: 1, padding: isMobile ? "20px" : "50px", overflowY: "auto", width: "100%" }}>
        <div style={{ 
          display: "flex", 
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between", 
          alignItems: isMobile ? "flex-start" : "center", 
          marginBottom: "40px",
          gap: isMobile ? "20px" : "0"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <h2 style={{ color: "#222", margin: 0, fontWeight: "800", fontSize: "28px" }}>{getViewTitle()}</h2>
            {activeView !== "dashboard" && !isScannerOnly && (
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
