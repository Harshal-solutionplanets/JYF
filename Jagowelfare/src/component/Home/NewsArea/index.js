import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../../supabase'

// Fallback icons
import DateIconFallback from "../../../assets/img/icon/date.png"
import IconUserFallback from "../../../assets/img/icon/user.png"

const NewsAres = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const fetchNews = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("news")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(3);
        if (error) throw error;
        if (alive) setNewsList(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (alive) setLoading(false);
      }
    };
    fetchNews();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
         <section id="home_blog_area" className="section_after bg-color">
        <div className="container">
            <div className="row">
                <div className="col-lg-6 offset-lg-3 col-md-12 col-sm-12 col-12">
                    <div className="section_heading">
                        <h3>Our latest news (Supabase)</h3>
                        <h2>Check all
                            <span className="color_big_heading">our latest</span> news and updates
                        </h2>
                    </div>
                </div>
            </div>
            <div className="row">
                {loading ? (
                  <div className="col-12 text-center"><p>Loading news...</p></div>
                ) : newsList.length === 0 ? (
                  <div className="col-12 text-center"><p>No news articles uploaded yet.</p></div>
                ) : (
                  newsList.map((data) => (
                    <div className="col-lg-4" key={data.id}>
                    <div className="blog_card_wrapper mb-30">
                        <div className="blog_card_img">
                            <Link to="/news"><img src={data.imageUrl} alt="img" style={{height: "250px", objectFit: "cover", width: "100%"}} /></Link>
                        </div>
                        <div className="blog_card_text">
                            <div className="blog_card_tags">
                                <Link to="/news-details">{data.tag || "#News"}</Link>
                            </div>
                            <div className="blog_card_heading">
                                <h3><Link to="/news-details">{data.title}</Link></h3>
                                <p>{data.summary}</p>
                            </div>
                            <div className="blog_boxed_bottom_wrapper">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                        <div className="blog_bottom_boxed">
                                            <div className="blog_bottom_icon">
                                                <img src={DateIconFallback} alt="icon" style={{width: 25}} />
                                            </div>
                                            <div className="blog_bottom_content">
                                                <h5>Date:</h5>
                                                <p>{new Date(data.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                        <div className="blog_bottom_boxed blog_left_padding">
                                            <div className="blog_bottom_icon">
                                                <img src={IconUserFallback} alt="icon" style={{width: 25}} />
                                            </div>
                                            <div className="blog_bottom_content">
                                                <h5>By:</h5>
                                                <p>Admin</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
               )))}
            </div>
        </div>
    </section>
    </>
  )
}

export default NewsAres