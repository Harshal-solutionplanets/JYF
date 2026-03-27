import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NewsSidebar from "./Sidebar";
import { supabase } from "../../supabase";

const NewsDetailsArea = ({ onTitleFetch }) => {
  const { id } = useParams();
  const [news, setNews] = useState(null);

  useEffect(() => {
    if (news && onTitleFetch) {
      onTitleFetch(news.title);
    }
  }, [news, onTitleFetch]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("news")
          .select("*")
          .eq("id", id)
          .single();
        if (error) throw error;
        setNews(data);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  if (loading) return <section className="section_padding text-center"><h3>Loading...</h3></section>;
  if (!news) return <section className="section_padding text-center"><h3>Article not found</h3></section>;

  const firstImg = (news.image_url || "").split(",")[0];

  return (
    <>
      <section id="news_details_main" className="section_padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="details_wrapper_area">
                <div className="details_big_img" style={{ backgroundColor: "#fbfbfb", borderRadius: "15px", overflow: "hidden", border: "1px solid #eee" }}>
                  <img src={firstImg} alt="img" style={{ width: "100%", height: "auto", maxHeight: "450px", objectFit: "contain" }} />
                  <span className="causes_badge bg-yellow" style={{ position: "absolute", top: "20px", left: "20px" }}>{news.tag || "#News"}</span>
                </div>
                
                <div className="details_text_wrapper details_main_content">
                  <style dangerouslySetInnerHTML={{ __html: `
                        .details_main_content p, 
                        .details_main_content li { 
                            margin-bottom: 8px !important; 
                            margin-top: 0 !important; 
                            line-height: 1.6 !important;
                            color: #444;
                            font-size: 17px;
                            position: relative;
                            display: block;
                            list-style: none;
                        }
                        
                        .details_main_content h2 { 
                            font-size: 36px; 
                            color: #2a283e; 
                            font-weight: 700; 
                            margin-bottom: 20px;
                        }
                        .details_main_content h4 { 
                            margin-top: 25px !important; 
                            margin-bottom: 12px !important; 
                            font-size: 22px; 
                            color: #2a283e; 
                            font-weight: 700; 
                        }
                        .details_main_content div { margin-bottom: 0 !important; }
                  `}} />
                  
                  <h2>{news.title}</h2>
                  <div dangerouslySetInnerHTML={{ __html: news.content }} />
                  
                  {/* Removed Gallery, PDF, and Comments per user request */}
                </div>
              </div>
            </div>
            <NewsSidebar news={news} />
          </div>
        </div>
      </section>
    </>
  );
};

export default NewsDetailsArea;
