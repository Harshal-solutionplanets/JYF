import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../supabase'
import SideBar from './SideBar'

const CausesDetailsArea = () => {
    const { id } = useParams();
    const [cause, setCause] = useState(null);
    const [loading, setLoading] = useState(true);

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
                                <div className="details_big_img">
                                    <img 
                                        src={mainImage} 
                                        alt="Main Cause img" 
                                        style={{ width: "100%", borderRadius: "20px", display: "block" }} 
                                    />
                                    {/* Removed Tag Badge here as requested */}
                                </div>
                                <div className="details_text_wrapper">
                                    <h2 style={{ marginTop: "30px", fontSize: "36px", fontWeight: "800" }}>{cause.title}</h2>
                                    
                                    <div 
                                        style={{ fontSize: "18px", color: "#555", marginBottom: "40px", lineHeight: "1.8" }}
                                        dangerouslySetInnerHTML={{ __html: cause.description }} 
                                    />

                                    <div 
                                        style={{ lineHeight: "1.8" }}
                                        dangerouslySetInnerHTML={{ __html: cause.content }} 
                                    />

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