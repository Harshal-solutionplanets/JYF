import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../../supabase";

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
          .order("created_at", { ascending: false });
        // Removed .limit(3) based on user's request to see all added causes
        
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
                <h3>Guided by our philosophy “Unity in CommUNITY"</h3>
                <h2>
                  We are always where other people need help
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
                const firstImage = (data.image_url || "").split(',')[0];
                return (
                <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-4 d-flex align-items-stretch" key={data.id}>
                  <div className="case_boxed_wrapper" style={{ height: "100%", width: "100%", background: "#fff", borderRadius: "15px", overflow: "hidden", border: "1px solid #eee", display: "flex", flexDirection: "column" }}>
                    <div className="case_boxed_img">
                      <Link to={`/cause-details/${data.id}`}>
                        <img src={firstImage} alt="img" style={{height: "260px", objectFit: "cover", width: "100%"}} />
                      </Link>
                    </div>
                    <div className="causes_boxed_text" style={{ padding: "20px", flex: "1 1 auto", display: "flex", flexDirection: "column" }}>
                      <h3 style={{ fontSize: "20px", marginBottom: "12px" }}>
                        <Link to={`/cause-details/${data.id}`} style={{ color: "#222", fontWeight: "700" }}>{data.title}</Link>
                      </h3>
                      <div 
                        style={{ color: "#666", fontSize: "14px", marginTop: "0px", lineHeight: "1.6" }}
                        dangerouslySetInnerHTML={{ __html: data.description }} 
                      />
                      <div style={{ marginTop: "auto", paddingTop: "20px" }}>
                        <Link to={`/cause-details/${data.id}`} className="btn btn_theme btn_sm" style={{ width: "100%", borderRadius: "10px" }}>
                          Read More
                        </Link>
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
