import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/dateFormatter";
import { supabase } from "../../supabase";
import tagIcon from "../../assets/img/icon/tag.png";
import mapIcon from "../../assets/img/icon/map.png";
import calIcon from "../../assets/img/icon/cal.png";

const NewsSidebar = ({ news }) => {
    const [recentNews, setRecentNews] = useState([]);

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const { data, error } = await supabase
                    .from("news")
                    .select("*")
                    .neq("id", news?.id)
                    .order("created_at", { ascending: false })
                    .limit(4);
                if (error) throw error;
                setRecentNews(data || []);
            } catch (err) {
                console.error("Error fetching recent news:", err);
            }
        };
        if (news?.id) fetchRecent();
    }, [news?.id]);

    if (!news) return null;

  return (
    <>
      <div className="col-lg-4">
        <div className="sidebar_first">
          {/* Author / Organizer Section */}
          <div className="project_organizer_wrapper sidebar_boxed" style={{ padding: "20px", borderRadius: "12px", border: "1px solid #eee", marginBottom: "30px" }}>
            <div className="project_organizer_text">
              <h5 style={{ fontSize: "13px", color: "#ca1e14", fontWeight: "700", textTransform: "uppercase", marginBottom: "10px", letterSpacing: "1px" }}>Written by:</h5>
              <h3 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "5px", textTransform: "lowercase", color: "#222" }}>{news.author_name || "Admin"}</h3>
              {news.author_role && <p style={{ fontSize: "14px", color: "#777", marginBottom: "15px" }}>{news.author_role}</p>}
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", color: "#444" }}>
                  <img src={tagIcon} alt="icon" style={{ width: "16px", opacity: "0.7" }} /> 
                  <strong>Category:</strong> <span style={{ color: "#666" }}>{news.tag || "Education"}</span>
                </li>
                {news.location && (
                    <li style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", color: "#444" }}>
                    <img src={mapIcon} alt="icon" style={{ width: "16px", opacity: "0.7" }} /> 
                    <strong>Location:</strong> <span style={{ color: "#666" }}>{news.location}</span>
                    </li>
                )}
                <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", color: "#444" }}>
                  <img src={calIcon} alt="icon" style={{ width: "16px", opacity: "0.7" }} /> 
                  <strong>Date:</strong> <span style={{ color: "#666" }}>{formatDate(news.created_at)}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Recent News Section */}
          {recentNews.length > 0 && (
            <div className="recent_news_wrapper sidebar_boxed" style={{ padding: "20px", borderRadius: "12px", border: "1px solid #eee", marginBottom: "30px" }}>
                <div className="sidebar_heading_main" style={{ marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "12px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "700", margin: 0 }}>Recent news</h3>
                </div>
                {recentNews.map((item) => (
                    <div key={item.id} style={{ display: "flex", gap: "15px", marginBottom: "20px", alignItems: "center" }}>
                        <Link to={`/news-details/${item.id}`} style={{ width: "70px", height: "70px", flexShrink: 0 }}>
                            <img 
                                src={(item.image_url || "").split(',')[0]} 
                                alt="recent" 
                                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} 
                            />
                        </Link>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: "14px", fontWeight: "700", lineHeight: "1.4", margin: "0 0 5px 0" }}>
                                <Link to={`/news-details/${item.id}`} style={{ color: "#222", textDecoration: "none" }}>{item.title}</Link>
                            </h4>
                            <span style={{ fontSize: "12px", color: "#999" }}>{formatDate(item.created_at)}</span>
                        </div>
                    </div>
                ))}
            </div>
          )}

          <div className="share_sidebar_wrapper sidebar_boxed" style={{ padding: "20px", borderRadius: "12px", border: "1px solid #eee", boxShadow: "none" }}>
                <div className="sidebar_heading_main" style={{ marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "12px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "700", margin: 0 }}>Share</h3>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                    {[
                        { icon: "fab fa-facebook-f", link: "#" },
                        { icon: "fab fa-instagram", link: "#" },
                        { icon: "fab fa-twitter", link: "#" },
                        { icon: "fab fa-linkedin-in", link: "#" }
                    ].map((social, i) => (
                        <a 
                            key={i} 
                            href={social.link} 
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
  );
};

export default NewsSidebar;
