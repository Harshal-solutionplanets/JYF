import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabase'

const CausesArea = () => {
    const [causes, setCauses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let alive = true;
        const fetchCauses = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('causes')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                if (alive) setCauses(data || []);
            } catch (err) {
                console.error(err);
            } finally {
                if (alive) setLoading(false);
            }
        };
        fetchCauses();
        return () => { alive = false; };
    }, []);

    return (
        <>
            <section id="trending_causes_main" className="section_padding">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 offset-lg-3 col-md-12 col-sm-12 col-12">
                            <div className="section_heading">
                                <h3>   Guided by our philosophy “Unity in CommUNITY"</h3>
                                <h2>   We are always where other people <span className="color_big_heading">need</span> help</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {loading ? (
                            <div className="col-12 text-center"><p>Loading causes...</p></div>
                        ) : causes.length === 0 ? (
                            <div className="col-12 text-center"><p>No causes available.</p></div>
                        ) : (
                            causes.map((data) => {
                                const firstImage = (data.image_url || "").split(',')[0];
                                return (
                                    <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-4 d-flex align-items-stretch" key={data.id}>
                                        <div className="case_boxed_wrapper" style={{ height: "100%", width: "100%", border: "1px solid #f0f0f0", borderRadius: "20px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                                            <div className="case_boxed_img">
                                                <Link to={`/cause-details/${data.id}`}>
                                                    <img src={firstImage} alt="img" style={{ height: "300px", objectFit: "cover", width: "100%" }} />
                                                </Link>
                                            </div>
                                            <div className="causes_boxed_text" style={{ padding: "20px", flex: "1 1 auto", display: "flex", flexDirection: "column" }}>
                                                <h3 style={{ fontSize: "20px", marginBottom: "12px" }}>
                                                    <Link to={`/cause-details/${data.id}`} style={{ color: "#222", fontWeight: "700" }}>{data.title}</Link>
                                                </h3>
                                                <div
                                                    className="description_tight"
                                                    style={{ color: "#666", fontSize: "14px", margin: "0px" }}
                                                    dangerouslySetInnerHTML={{ __html: data.description }}
                                                />
                                                <div style={{ marginTop: "auto", paddingTop: "20px" }}>
                                                    <Link to={`/cause-details/${data.id}`} className="btn btn_theme btn_md" style={{ width: "100%", borderRadius: "10px" }}>
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
    )
}

export default CausesArea