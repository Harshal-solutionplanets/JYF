import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabase";
import BulletIcon from "../../assets/img/icon/round.png"

const SideBar = ({ currentCause }) => {
    const [otherCauses, setOtherCauses] = useState([]);

    useEffect(() => {
        const fetchOthers = async () => {
            try {
                const { data, error } = await supabase
                    .from('causes')
                    .select('*')
                    .neq('id', currentCause?.id || '')
                    .limit(4);
                
                if (error) throw error;
                setOtherCauses(data || []);
            } catch (err) {
                console.error("Error fetching other causes:", err);
            }
        };
        fetchOthers();
    }, [currentCause]);

    if (!currentCause) return null;

    // Check if Stats at a Glance has any data
    const hasStats = currentCause.infoval1 || currentCause.infoval2 || currentCause.infoval3;

    return (
        <div className="col-lg-4">
            <div className="sidebar_first">
                {/* Stats at a Glance - Conditional Rendering */}
                {hasStats && (
                    <div className="project_organizer_wrapper sidebar_boxed" style={{ padding: "20px", borderRadius: "12px", border: "1px solid #eee", marginBottom: "30px", boxShadow: "none" }}>
                        <div className="project_organizer_text" style={{ padding: 0 }}>
                            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px", color: "var(--black-color)", borderBottom: "1px solid #eee", paddingBottom: "12px" }}>Stats at a Glance</h3>
                            <ul style={{ listStyle: "none", padding: 0 }}>
                                {currentCause.infoval1 && (
                                    <li style={{ marginBottom: "15px", display: "flex", alignItems: "flex-start", borderBottom: "1px solid #f9f9f9", paddingBottom: "10px" }}>
                                        <img src={BulletIcon} alt="bullet" style={{ width: "12px", marginRight: "10px", marginTop: "6px", opacity: "0.8", filter: "brightness(0.6)" }} />
                                        <span style={{ color: "#444", fontWeight: "600", wordBreak: "break-word" }}>
                                            {currentCause.infoval1}
                                        </span>
                                    </li>
                                )}
                                {currentCause.infoval2 && (
                                    <li style={{ marginBottom: "15px", display: "flex", alignItems: "flex-start", borderBottom: "1px solid #f9f9f9", paddingBottom: "10px" }}>
                                        <img src={BulletIcon} alt="bullet" style={{ width: "12px", marginRight: "10px", marginTop: "6px", opacity: "0.8", filter: "brightness(0.6)" }} />
                                        <span style={{ color: "#444", fontWeight: "600", wordBreak: "break-word" }}>
                                            {currentCause.infoval2}
                                        </span>
                                    </li>
                                )}
                                {currentCause.infoval3 && (
                                    <li style={{ marginBottom: "0px", display: "flex", alignItems: "flex-start", paddingBottom: "0px" }}>
                                        <img src={BulletIcon} alt="bullet" style={{ width: "12px", marginRight: "10px", marginTop: "6px", opacity: "0.8", filter: "brightness(0.6)" }} />
                                        <span style={{ color: "#444", fontWeight: "600", wordBreak: "break-word" }}>
                                            {currentCause.infoval3}
                                        </span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Other Causes - Conditional Rendering & Description Update */}
                {otherCauses.length > 0 && (
                    <div className="recent_causes_wrapper sidebar_boxed" style={{ padding: "20px", borderRadius: "12px", border: "1px solid #eee", boxShadow: "none", marginBottom: "30px" }}>
                        <div className="sidebar_heading_main" style={{ marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "12px" }}>
                            <h3 style={{ fontSize: "18px", fontWeight: "700" }}>Other Causes</h3>
                        </div>
                        {otherCauses.map((item, index) => {
                            const firstImg = (item.image_url || "").split(',')[0];
                            return (
                                <div className="recent_donet_item" key={item.id} style={{ marginBottom: index === otherCauses.length - 1 ? 0 : "20px", display: "flex", gap: "15px" }}>
                                    <div className="recent_donet_img">
                                        <Link to={`/cause-details/${item.id}`}>
                                            <img 
                                                src={firstImg} 
                                                alt="other-cause" 
                                                style={{ width: "80px", height: "70px", borderRadius: "10px", objectFit: "cover" }} 
                                            />
                                        </Link>
                                    </div>
                                    <div className="recent_donet_text">
                                        <div className="sidebar_inner_heading">
                                            <h4 style={{ fontSize: "15px", margin: 0, fontWeight: "700", lineHeight: "1.4" }}>
                                                <Link to={`/cause-details/${item.id}`} style={{ color: "#333" }}>{item.title}</Link>
                                            </h4>
                                        </div>
                                        <div 
                                            style={{ 
                                                fontSize: "13px", 
                                                color: "#444", 
                                                marginTop: "4px", 
                                                maxHeight: "36px", 
                                                overflow: "hidden", 
                                                textOverflow: "ellipsis", 
                                                display: "-webkit-box", 
                                                WebkitLineClamp: "2", 
                                                WebkitBoxOrient: "vertical",
                                                fontWeight: "500"
                                            }}
                                            dangerouslySetInnerHTML={{ __html: item.description }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Share Section */}
                <div className="share_sidebar_wrapper sidebar_boxed" style={{ padding: "20px", borderRadius: "12px", border: "1px solid #eee", boxShadow: "none" }}>
                    <div className="sidebar_heading_main" style={{ marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "12px" }}>
                        <h3 style={{ fontSize: "18px", fontWeight: "700" }}>Join our community</h3>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
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
    );
};

export default SideBar;
