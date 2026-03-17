import React from "react";
// import Banner Img
import BannerImg from "../../../assets/img/banner/banner.png"
import Element1 from "../../../assets/img/banner/element-1.png"
import Element2 from "../../../assets/img/banner/element-2.png"
import Element3 from "../../../assets/img/banner/element-3.png"


const HomeBanner = () => {
  return (
    <>
        <section id="home_one_banner">
        <div className="container">
            <div className="row align-items-center">
                <div className="col-lg-6">
                    <div className="banner_one_text">
                        <h1><span><span className="color_big">Share</span> your love to</span> make someone’s life better</h1>
                        <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
                            printer took a type and scrambled.</p>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="banner_one_img">
                        <img src={BannerImg} alt="img" />
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
