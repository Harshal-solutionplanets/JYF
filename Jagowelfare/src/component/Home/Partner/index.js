import React from 'react'
import { Link } from 'react-router-dom'
// Import Partner Logo
import logo1 from "../../../assets/img/partner/logo-1.png"
import logo2 from "../../../assets/img/partner/logo-2.png"
import logo3 from "../../../assets/img/partner/logo-3.png"
import logo4 from "../../../assets/img/partner/logo-4.png"
import logo5 from "../../../assets/img/partner/logo-5.png"
import logo6 from "../../../assets/img/partner/logo-6.png"
import logo7 from "../../../assets/img/partner/logo-7.png"


//  OwlCarousel Slider Import
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";



const PartnerArea = () => {
    // Logo Data
    const logoData = [
        {img:logo1},
        {img:logo2},
        {img:logo3},
        {img:logo4},
        {img:logo5},
        {img:logo6},
        {img:logo7},

    ]
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
     <section id="partner_area">
        <h2 className="d-none">Heading</h2>
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                    <div className="partner_slider_wrapper">
                    <OwlCarousel
                  className="owl-theme"
                  responsive={responsive}
                  autoplay={false}
                  autoplayHoverPause={true}
                  autoplayTimeout={2500}
                  loop={true}
                  margin={10}
                  nav={false}
                  dots={false}
                >
                    {logoData.map((data, index)=>(
                          <div className="partner_logo" key={index}>
                          <Link to="/#"><img src={data.img} alt="img" /></Link>
                      </div>
                    ))}
                </OwlCarousel>
                    </div>
                </div>
            </div>
        </div>
    </section>

    </>
  )
}

export default PartnerArea