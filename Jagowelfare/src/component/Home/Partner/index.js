import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../../supabase'

//  OwlCarousel Slider Import
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

const PartnerArea = () => {
    const [logoData, setLogoData] = useState([]);

    useEffect(() => {
        const fetchSupporters = async () => {
            try {
                // Try sorting by priority first
                const { data, error } = await supabase.from('supporters').select('*').order('priority', { ascending: false }).order('created_at', { ascending: false });
                
                if (error) {
                    console.warn("Priority column might be missing. Falling back to date sorting.", error);
                    const { data: fallbackData, error: fallbackError } = await supabase.from('supporters').select('*').order('created_at', { ascending: false });
                    if (!fallbackError && fallbackData) setLogoData(fallbackData);
                } else if (data) {
                    setLogoData(data);
                }
            } catch (err) {
                console.error("Error fetching supporters:", err);
            }
        };
        fetchSupporters();
    }, []);

    // Slider Handelar
    let responsive = {
        0: {
          items: 2,
        },
        600: {
          items: 3,
        },
        960: {
          items: 4,
        },
        1200: {
          items: 6,
        },
      };

  return (
    <>
     <section id="partner_area" className="section_padding_bottom">
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                    <div className="section_heading text-center" style={{ marginBottom: "40px" }}>
                        <h2 style={{ fontSize: "30px", fontWeight: "800", color: "#222", position: "relative" }}>
                            Our <span className="color_big_heading">Supporters</span>
                        </h2>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <div className="partner_slider_wrapper">
                    {logoData.length > 0 && (
                        <OwlCarousel
                            className="owl-theme"
                            responsive={responsive}
                            autoplay={true}
                            autoplayHoverPause={true}
                            autoplayTimeout={2500}
                            loop={logoData.length > 5}
                            margin={30}
                            nav={false}
                            dots={false}
                        >
                            {logoData.map((data, index)=>(
                                <div className="partner_logo" key={index} style={{ textAlign: "center", padding: "10px", border: "1px solid #f0f0f0", borderRadius: "10px", backgroundColor: "#fff" }}>
                                    {data.website_url ? (
                                        <a href={data.website_url} target="_blank" rel="noopener noreferrer">
                                            <img src={data.image_url} alt={data.name} style={{ width: "auto", maxWidth: "100%", height: "80px", objectFit: "contain", display: "inline-block" }} />
                                        </a>
                                    ) : (
                                        <img src={data.image_url} alt={data.name} style={{ width: "auto", maxWidth: "100%", height: "80px", objectFit: "contain", display: "inline-block" }} />
                                    )}
                                    {data.name && <p style={{ fontSize: "12px", marginTop: "10px", color: "#666", fontWeight: "600" }}>{data.name}</p>}
                                </div>
                            ))}
                        </OwlCarousel>
                    )}
                    </div>
                </div>
            </div>
        </div>
    </section>
    </>
  )
}

export default PartnerArea