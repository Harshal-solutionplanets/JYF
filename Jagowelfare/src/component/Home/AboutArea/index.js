import React from 'react'
import { Link } from 'react-router-dom'

// Import Img
import Img1 from "../../../assets/img/common/about.png"
import Img2 from "../../../assets/img/icon/about.png"


import { supabase } from '../../../supabase'

const AboutAres = () => {
    const [config, setConfig] = React.useState({
        heading: "Welcome to JYF",
        title: "Serving Humanity Through <span class='heading_highlight'>Compassion</span>",
        para1: "We are the largest crowdfunding",
        para2: "At Jain Youth Foundation (JYF), our volunteers are inspired by Jain values of Ahimsa (non-violence), compassion, service, and unity.",
        para3: "Through our various initiatives, we focus on healthcare, food support, education, and humanitarian services, impacting thousands of lives every year.",
        image_url: Img1,
        image_url_2: Img1,
    });

    React.useEffect(() => {
        const fetchConfig = async () => {
            const { data } = await supabase.from('site_config').select('*').eq('key', 'home_intro').single();
            if (data && data.value) {
                setConfig(data.value);
            }
        };
        fetchConfig();
    }, []);

    return (
        <>
            <section id="about_area" className="section_padding_bottom">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-12 col-sm-12 col-12">
                            <div className="about_img_wrapper">

                                <div className="about_area_heading">
                                    <img src={Img2} alt="img" />
                                    <h3>{config.heading}</h3>
                                </div>
                                <div className="about_img_large">
                                    <img src={config.image_url || Img1} alt="img" style={{ objectFit: 'contain', width: '100%', height: 'auto', maxHeight: '500px', backgroundColor: '#f8f9fa' }} />
                                </div>
                                <div className="about_img_small animate__animated animate__fadeInDown">
                                    <img src={config.image_url_2 || Img1} alt="img" />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-sm-12 col-12">
                            <div className="about_area_main_text">
                                <div className="about_area_heading_two">
                                    <h2
                                        dangerouslySetInnerHTML={{ __html: (config.title || "Serving Humanity Through <span class='heading_highlight'>Compassion</span>").replace('Compassion', "<span class='heading_highlight'>Compassion</span>").replace('Humanity', "<span class='heading_highlight'>Humanity</span>").replace('poverty', "<span class='heading_highlight'>poverty</span>") }}
                                        style={{ color: "#1f2230", lineHeight: "1.3", fontWeight: "700", marginBottom: "15px" }}>
                                    </h2>
                                </div>

                                <h4 className="text-theme mb-2"
                                    style={{ fontSize: "22px", color: "#ca1e14", fontWeight: "700" }}
                                    dangerouslySetInnerHTML={{ __html: config.para1 }}
                                ></h4>

                                <div className="about_area_para pt-2">
                                    <div
                                        className="mb-4"
                                        dangerouslySetInnerHTML={{ __html: config.para2 }}
                                    ></div>
                                    {config.para3 && (
                                        <div
                                            dangerouslySetInnerHTML={{ __html: config.para3 }}
                                        ></div>
                                    )}
                                </div>

                                <div className="about_vedio_area mt-5">
                                    <Link to="/about" className="btn btn_theme btn_md me-4" style={{ borderRadius: "5px", padding: "15px 35px" }}>Learn more</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default AboutAres
