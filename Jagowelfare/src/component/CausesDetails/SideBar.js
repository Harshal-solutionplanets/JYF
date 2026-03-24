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
                    <div className="project_organizer_wrapper sidebar_boxed" style={{ padding: "25px", borderRadius: "15px", border: "1px solid #f0f0f0", marginBottom: "30px" }}>
                        <div className="project_organizer_text" style={{ padding: 0 }}>
                            <h3 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "20px", color: "#e33129" }}>Stats at a Glance</h3>
                            <ul style={{ listStyle: "none", padding: 0 }}>
                                {currentCause.infoval1 && (
                                    <li style={{ marginBottom: "15px", display: "flex", alignItems: "flex-start", borderBottom: "1px solid #f9f9f9", paddingBottom: "10px" }}>
                                        <img src={BulletIcon} alt="bullet" style={{ width: "12px", marginRight: "10px", marginTop: "6px" }} />
                                        <span style={{ color: "#333", fontWeight: "600", wordBreak: "break-word" }}>
                                            {currentCause.infoval1}
                                        </span>
                                    </li>
                                )}
                                {currentCause.infoval2 && (
                                    <li style={{ marginBottom: "15px", display: "flex", alignItems: "flex-start", borderBottom: "1px solid #f9f9f9", paddingBottom: "10px" }}>
                                        <img src={BulletIcon} alt="bullet" style={{ width: "12px", marginRight: "10px", marginTop: "6px" }} />
                                        <span style={{ color: "#333", fontWeight: "600", wordBreak: "break-word" }}>
                                            {currentCause.infoval2}
                                        </span>
                                    </li>
                                )}
                                {currentCause.infoval3 && (
                                    <li style={{ marginBottom: "0px", display: "flex", alignItems: "flex-start", paddingBottom: "0px" }}>
                                        <img src={BulletIcon} alt="bullet" style={{ width: "12px", marginRight: "10px", marginTop: "6px" }} />
                                        <span style={{ color: "#333", fontWeight: "600", wordBreak: "break-word" }}>
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
                    <div className="recent_causes_wrapper sidebar_boxed" style={{ padding: "25px", borderRadius: "15px", border: "1px solid #f0f0f0" }}>
                        <div className="sidebar_heading_main" style={{ marginBottom: "20px" }}>
                            <h3 style={{ fontSize: "20px", fontWeight: "800" }}>Other Causes</h3>
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
                                                fontSize: "12px", 
                                                color: "#999", 
                                                marginTop: "4px", 
                                                maxHeight: "36px", 
                                                overflow: "hidden", 
                                                textOverflow: "ellipsis", 
                                                display: "-webkit-box", 
                                                WebkitLineClamp: "2", 
                                                WebkitBoxOrient: "vertical" 
                                            }}
                                            dangerouslySetInnerHTML={{ __html: item.description }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SideBar;
