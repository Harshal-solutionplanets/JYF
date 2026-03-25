import React from "react";
// import Banner Img
import BannerImg from "../../../assets/img/banner/banner.png"
import Element1 from "../../../assets/img/banner/element-1.png"
import Element2 from "../../../assets/img/banner/element-2.png"
import Element3 from "../../../assets/img/banner/element-3.png"


import { supabase } from "../../../supabase";

const HomeBanner = () => {
    const [config, setConfig] = React.useState({
        title: "Unity in commUNITY",
        description: "Jain Youth Foundation is dedicated to empowering lives through service and welfare. Join us in making a difference.",
        image_url: BannerImg,
    });

    React.useEffect(() => {
        const fetchConfig = async () => {
            const { data } = await supabase.from('site_config').select('*').eq('key', 'home_hero').single();
            if (data && data.value) {
                setConfig(data.value);
            }
        };
        fetchConfig();
    }, []);

    return (
        <>
            <section id="home_one_banner">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="banner_one_text animate__animated animate__fadeInLeft">
                                <h1 
                                    style={{ fontSize: "75px", lineHeight: "1.2", fontWeight: "800" }}
                                    dangerouslySetInnerHTML={{ __html: (config.title || "Unity in commUNITY").replace('JYF', "<span class='heading_highlight'>JYF</span>").replace('Humanity', "<span class='heading_highlight'>Humanity</span>").replace('Compassion', "<span class='heading_highlight'>Compassion</span>") }}
                                >
                                </h1>
                                <div className="banner_para mt-4" 
                                     style={{ fontSize: "20px", color: "#666", lineHeight: "1.6" }}
                                     dangerouslySetInnerHTML={{ __html: config.description }}>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="banner_one_img">
                                <img src={config.image_url || BannerImg} alt="img" style={{ width: "619px", height: "684px", objectFit: "cover" }} />
                                <div className="banner_element">
                                    <img src={Element1} alt="icon" className="element_1 shape-1" />
                                    <img src={Element2} alt="icon" className="element_2 shape-2" />
                                    <img src={Element3} alt="icon" className="element_3 shape-3" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomeBanner;
