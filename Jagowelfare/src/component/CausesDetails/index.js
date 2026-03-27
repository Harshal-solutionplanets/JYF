import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../supabase'
import SideBar from './SideBar'

const CausesDetailsArea = ({ onTitleFetch }) => {
    const { id } = useParams();
    const [cause, setCause] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (cause && onTitleFetch) {
            onTitleFetch(cause.title);
        }
    }, [cause, onTitleFetch]);

    useEffect(() => {
        const fetchCause = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('causes')
                    .select('*')
                    .eq('id', id)
                    .single();
                
                if (error) throw error;
                setCause(data);
            } catch (err) {
                console.error("Error fetching cause details:", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchCause();
    }, [id]);

    if (loading) return (
        <section className="section_padding">
            <div className="container text-center"><h3>Loading Details...</h3></div>
        </section>
    );

    if (!cause) return (
        <section className="section_padding">
            <div className="container text-center"><h3>Cause record not found.</h3></div>
        </section>
    );

    const images = (cause.image_url || "").split(",");
    const mainImage = images[0];

    return (
        <>
            <section id="trending_causes_main" className="section_padding">
                <div className="container">
                    <div className="row" id="counter">
                        <div className="col-lg-8">
                            <div className="details_wrapper_area">
                                <div className="details_big_img" style={{
                                    width: "100%",
                                    borderRadius: "15px",
                                    overflow: "hidden",
                                    marginBottom: "35px",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
                                }}>
                                    <img 
                                        src={mainImage} 
                                        alt="Main Cause img" 
                                        style={{ width: "100%", height: "auto", minHeight: "250px", maxHeight: "550px", objectFit: "contain", backgroundColor: "#f8f9fa" }} 
                                    />
                                </div>
                                <div className="details_text_wrapper">
                                    <h2 style={{ fontSize: "32px", fontWeight: "700", color: "#2a283e", marginBottom: "8px", lineHeight: "1.2" }}>{cause.title}</h2>
                                    
                                    <div 
                                        className="cause_subtitle"
                                        style={{ fontSize: "16px", color: "#818090", marginBottom: "15px", fontWeight: "600", lineHeight: "1.4", borderLeft: "4px solid var(--accent-color)", paddingLeft: "15px" }}
                                    >
                                        <style dangerouslySetInnerHTML={{ __html: `
                                            .cause_subtitle p, .cause_subtitle div { margin-bottom: 2px !important; margin-top: 0 !important; line-height: 1.3 !important; }
                                            .cause_subtitle ul { list-style: none !important; padding-left: 0 !important; margin-bottom: 5px !important; }
                                            .cause_subtitle ul li { position: relative; padding-left: 15px !important; margin-bottom: 2px !important; line-height: 1.4 !important; }
                                            .cause_subtitle ul li::before { 
                                                content: "•"; color: #ca1e14; font-weight: bold; display: inline-block; 
                                                width: 15px; margin-left: -15px; font-size: 18px; vertical-align: middle; 
                                            }
                                        `}} />
                                        <div dangerouslySetInnerHTML={{ __html: cause.description }} />
                                    </div>

                                    <div 
                                        className="details_main_content"
                                        style={{ fontSize: "16px", color: "#818090", lineHeight: "1.5", fontWeight: "400" }}
                                    >
                                        <style dangerouslySetInnerHTML={{ __html: `
                                            .details_main_content p, 
                                            .details_main_content li { 
                                                margin-bottom: 2px !important; 
                                                margin-top: 0 !important; 
                                                line-height: 1.35 !important;
                                                color: #444;
                                                font-size: 17px;
                                                position: relative;
                                                display: block;
                                                list-style: none;
                                            }
                                            
                                            .details_main_content h4 { 
                                                margin-top: 15px !important; 
                                                margin-bottom: 10px !important; 
                                                font-size: 22px; 
                                                color: #2a283e; 
                                                font-weight: 700; 
                                            }
                                            .details_main_content div { margin-bottom: 0 !important; }
                                            .details_main_content ul { margin-bottom: 8px; padding-left: 0; list-style: none; }
                                            .details_main_content ul li::before { 
                                                content: "•"; color: #ca1e14; font-weight: bold; display: inline-block; 
                                                width: 15px; margin-left: -15px; font-size: 18px; vertical-align: middle; 
                                            }
                                        `}} />
                                        <div dangerouslySetInnerHTML={{ __html: cause.content }} />
                                    </div>

                                    {/* Small images, PDF area, and comments areas removed as requested */}
                                </div>
                            </div>
                        </div>
                        <SideBar currentCause={cause} />
                    </div>
                </div>
            </section>
        </>
    )
}

export default CausesDetailsArea