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
        // Try sorting by priority first
        const { data, error } = await supabase
          .from("causes")
          .select("*")
          .order("priority", { ascending: false })
          .order("created_at", { ascending: false });

        if (error) {
            // Fallback for missing priority column
            const { data: fallbackData, error: fallbackError } = await supabase
                .from("causes")
                .select("*")
                .order("created_at", { ascending: false });
            if (fallbackError) throw fallbackError;
            if (alive) setCauses(fallbackData || []);
        } else {
            if (alive) setCauses(data || []);
        }
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
                <h3>   Guided by our philosophy “Unity in CommUNITY"</h3>
                <h2>
                  We are always where other people <span className="highlight_yellow">need</span> help
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
                          <img src={firstImage} alt="img" style={{ height: "260px", objectFit: "contain", width: "100%", backgroundColor: "#f8f9fa" }} />
                        </Link>
                      </div>
                      <div className="causes_boxed_text" style={{ padding: "20px", flex: "1 1 auto", display: "flex", flexDirection: "column" }}>
                        <h3 style={{ fontSize: "22px", marginBottom: "12px", marginTop: "5px" }}>
                          <Link to={`/cause-details/${data.id}`} style={{ color: "var(--black-color)", fontWeight: "600", display: "block", lineHeight: "1.3" }}>{data.title}</Link>
                        </h3>
                        <div
                          className="description_tight"
                          style={{ color: "var(--paragraph-color)", fontSize: "15px", marginBottom: "20px", fontWeight: "400" }}
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
                )
              })
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default TrendingCauses;
