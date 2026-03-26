import React from 'react'
// import Link
import { Link } from 'react-router-dom'
// Import Icon
import Tags from "../../assets/img/icon/tag.png"
import Map from "../../assets/img/icon/map.png"
import Cal from "../../assets/img/icon/cal.png"
import Mail from "../../assets/img/icon/email.png"
import Phone from "../../assets/img/icon/phone.png"

// Import Social Icom
import facebook from "../../assets/img/icon/facebook.png"
import instagram from "../../assets/img/icon/instagram.png"
import twitter from "../../assets/img/icon/twitter.png"
import linkedin from "../../assets/img/icon/linkedin.png"

// Import Img
import rece1 from "../../assets/img/sidebar/rec-donet-1.png"
import rece2 from "../../assets/img/sidebar/rec-donet-2.png"
import rece3 from "../../assets/img/sidebar/rec-donet-3.png"

import { formatDate } from "../../utils/dateFormatter";

const EventDetailSidebar = ({ event }) => {
    if (!event) return null;

    const formattedDate = formatDate(event.startAt || event.start_at);

    const organizers = [];
    if (event.organizerName) {
        organizers.push({
            img: event.organizerImageUrl || rece1,
            name: event.organizerName,
            desnation: event.organizerRole || "Organizer",
            group: event.organizerCompany || ""
        });
    } else {
        // Fallback or empty
        organizers.push({
            img: rece1,
            name: "Mike richard",
            desnation: "Managing director",
            group: "Care NGO ltd."
        });
    }

  return (
    <>
         <div className="col-lg-4">
                    <div className="sidebar_first">
                        <div className="sidebar_boxed" style={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                            <div className="sidebar_heading_main">
                                <h3 style={{ fontWeight: "800", fontSize: "22px" }}>Event details</h3>
                            </div>
                            <div className="event_details_list">
                                <ul>
                                    <li>
                                        <img src={Tags} alt="icon" /> 
                                        <strong>Category:</strong> <span>{event.category || event.tag || "Charity"}</span>
                                    </li>
                                    <li>
                                        <img src={Map} alt="icon" /> 
                                        <strong>Location:</strong> <span>{event.venue || "Global"}</span>
                                    </li>
                                    <li>
                                        <img src={Cal} alt="icon" /> 
                                        <strong>Date:</strong> <span>{formattedDate}</span>
                                    </li>
                                    {event.contactEmail && (
                                        <li>
                                            <img src={Mail} alt="icon" /> 
                                            <strong>Mail:</strong> <span>{event.contactEmail}</span>
                                        </li>
                                    )}
                                    {event.contactPhone && (
                                        <li>
                                            <img src={Phone} alt="icon" /> 
                                            <strong>Phone:</strong> <span>{event.contactPhone}</span>
                                        </li>
                                    )}
                                </ul>
                                <div className="register_now_details" style={{ marginTop: "20px" }}>
                                    <Link to={`/event-registration/${event.id}`} className="btn btn_theme btn_md w-100" style={{ borderRadius: "10px", fontWeight: "700" }}>Register now</Link>
                                </div>

                            </div>
                         </div>

                        <div className="project_recentdonet_wrapper sidebar_boxed" style={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", marginTop: "30px" }}>
                            <div className="sidebar_heading_main">
                                <h3 style={{ fontWeight: "800", fontSize: "22px" }}>Event organizer</h3>
                            </div>
                            {organizers.map((data, index) => (
                                <div className="recent_donet_item" key={index} style={{ borderBottom: index < organizers.length - 1 ? "1px solid #f0f0f0" : "none", paddingBottom: "15px", marginBottom: "15px" }}>
                                <div className="recent_donet_img" style={{ width: "70px", height: "70px", borderRadius: "12px", overflow: "hidden" }}>
                                    <img src={data.img} alt="img" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                                <div className="recent_donet_text">
                                    <div className="sidebar_inner_heading">
                                        <h4 style={{ margin: "0", fontWeight: "700" }}>{data.name}</h4>
                                    </div>
                                    <p style={{ margin: "2px 0", color: "#666", fontSize: "14px" }}>{data.desnation}</p>
                                    <h6 style={{ color: "#e33129", margin: "0", fontSize: "13px", fontWeight: "600" }}>{data.group}</h6>
                                </div>
                            </div>
                            ))}
                            
                          
                        </div>
                        {/* Share Section - Unified Design */}
                        <div className="share_sidebar_wrapper sidebar_boxed" style={{ padding: "20px", borderRadius: "12px", border: "1px solid #eee", boxShadow: "none", marginTop: "30px" }}>
                            <div className="sidebar_heading_main" style={{ marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "12px" }}>
                                <h3 style={{ fontSize: "18px", fontWeight: "700", margin: 0 }}>Join our community</h3>
                            </div>
                            <div style={{ display: "flex", gap: "12px" }}>
                                {[
                                    { icon: "fab fa-facebook-f", link: "https://www.facebook.com/groups/jyf.mulund/" },
                                    { icon: "fab fa-x-twitter", link: "https://x.com/jyf_india" }
                                ].map((social, i) => (
                                    <a 
                                        key={i} 
                                        href={social.link} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ 
                                            width: "40px", 
                                            height: "40px", 
                                            backgroundColor: "#f9f0f0", 
                                            borderRadius: "50%", 
                                            display: "flex", 
                                            alignItems: "center", 
                                            justifyContent: "center", 
                                            color: "#2a283e",
                                            fontSize: "16px",
                                            transition: "all 0.3s"
                                        }}
                                    >
                                        <i className={social.icon}></i>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
    </>
  )
}

export default EventDetailSidebar