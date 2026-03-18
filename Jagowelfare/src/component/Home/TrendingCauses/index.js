import React, { useEffect, useState } from "react";
// Import Link
import { Link } from "react-router-dom";
import { supabase } from "../../../supabase";

// Fallback icons
import DateIconFallback from "../../../assets/img/icon/date.png";
import IconAdminFallback from "../../../assets/img/icon/user.png";

const TrendingCauses = () => {
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const fetchCauses = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("causes")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(3);
        if (error) throw error;
        if (alive) setCauses(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (alive) setLoading(false);
      }
    };
    fetchCauses();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <section
        id="trending_causes"
        className="section_after section_padding bg-color"
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3 col-md-12 col-sm-12 col-12">
              <div className="section_heading">
                <h3>Trending causes</h3>
                <h2>
                  We are always where other people
                  <span className="color_big_heading">need</span> help
                </h2>
              </div>
            </div>
          </div>
          <div className="row">
            {loading ? (
              <div className="col-12 text-center"><p>Loading causes...</p></div>
            ) : causes.length === 0 ? (
              <div className="col-12 text-center"><p>No trending causes uploaded yet.</p></div>
            ) : (
              causes.map((data) => {
                const percentage = data.goal > 0 ? Math.min(Math.round(((data.raised || 0) / data.goal) * 100), 100) : 0;
                
                return (
                <div className="col-lg-4 col-md-12 col-sm-12 col-12" key={data.id}>
                  <div className="case_boxed_wrapper">
                    <div className="case_boxed_img">
                      <Link to="/cause-details">
                        <img src={data.imageUrl} alt="img" style={{height: "250px", objectFit: "cover", width: "100%"}} />
                      </Link>
                      <span className="causes_badge bg-theme">
                        {data.tag || "#Cause"}
                      </span>
                    </div>
                    <div className="causes_boxed_text">
                      <div className="class-full causes_pro_bar progress_bar">
                        <div className="class-full-bar-box">
                          <h3 className="h3-title">
                            Goal: <span>${data.goal}</span>
                          </h3>
                          <div className="class-full-bar-percent">
                            <h2>
                              <span className="counting-data" data-count={percentage}>
                                {percentage}
                              </span>
                              <span>%</span>
                            </h2>
                          </div>
                        </div>
                      </div>
                      <h3>
                        <Link to="/cause-details">{data.title}</Link>
                      </h3>
                      <p>{data.description}</p>
                      <div className="causes_boxed_bottom_wrapper">
                        <div className="row">
                          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                            <div className="casuses_bottom_boxed">
                              <div className="casuses_bottom_icon">
                                <img src={DateIconFallback} alt="icon" style={{width: 25}} />
                              </div>
                              <div className="casuses_bottom_content">
                                <h5>Date:</h5>
                                <p>{new Date(data.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                            <div className="casuses_bottom_boxed casuses_left_padding">
                              <div className="casuses_bottom_icon">
                                <img src={IconAdminFallback} alt="icon" style={{width: 25}} />
                              </div>
                              <div className="casuses_bottom_content">
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
              )})
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default TrendingCauses;
