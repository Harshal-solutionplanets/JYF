import React, { useEffect, useState } from 'react'
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { supabase } from "../../supabase";
import icon from "../../assets/img/common/quot.png"

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
                if (error) throw error;
                setTestimonials(data || []);
            } catch (err) {
                console.error("Error fetching testimonials:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTestimonials();
    }, []);
     let responsive = {
        0: { items: 1 },
        600: { items: 2 },
        1000: { items: 3 },
        1200: { items: 3 },
      };
  return (
    <>
         <section id="testimonial_area" className="section_padding">
        <div className="container">
            <div className="row">
                <div className="col-lg-6 offset-lg-3 col-md-12 col-sm-12 col-12">
                    <div className="section_heading">
                        <h3>Why partner with us?</h3>
                        <h2>What our valuable
                            <span className="color_big_heading">partner</span>
                            think about us
                        </h2>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <div className="testimonial_slider_wrapper">
                    {loading ? (
                        <div className="text-center p-5"><h4>Loading Feedbacks...</h4></div>
                    ) : testimonials.length > 0 ? (
                        <OwlCarousel
                            className="owl-theme"
                            responsive={responsive}
                            autoplay={true}
                            autoplayHoverPause={true}
                            autoplayTimeout={3500}
                            loop={testimonials.length > 1}
                            margin={20}
                            nav={false}
                            dots={true}
                        >
                            {testimonials.map((data, index)=>(
                                <div className="testimonial_wrapper_boxed" key={index} style={{ minHeight: "350px", display: "flex", flexDirection: "column" }}>
                                    <img src={data.image_url || "/default-avatar.png"} alt="img" style={{ width: "100px", height: "100px", borderRadius: "50%", margin: "0 auto", objectFit: "cover" }} />
                                    <div 
                                        style={{ marginTop: "20px", flex: 1 }}
                                        dangerouslySetInnerHTML={{ __html: data.comment }}
                                    />
                                    <div className="test_author" style={{ borderTop: "1px solid #eee", paddingTop: "15px", marginTop: "15px" }}>
                                        <img src={icon} alt="img" style={{ width: "20px", marginBottom: "10px", clear: "both", display: "block" }} />
                                        <h4 style={{ margin: "5px 0" }}>{data.name}</h4>
                                        <h5 style={{ color: "#e33129", fontSize: "14px" }}>{data.role}</h5>
                                    </div>
                                </div>
                            ))}
                        </OwlCarousel>
                    ) : (
                        <div className="text-center p-5 text-muted">No testimonials published yet.</div>
                    )}
                      
                    </div>
                </div>
            </div>
        </div>
    </section>
    </>
  )
}

export default Testimonials