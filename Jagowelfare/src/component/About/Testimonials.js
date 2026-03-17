import React from 'react'
//  OwlCarousel Slider Import
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
// Import Data
import img1 from "../../assets/img/testimonial/test-1.png"
import icon from "../../assets/img/common/quot.png"

const Testimonials = () => {
    // Data
    const TestimonialsData =[
        {
            img:img1,
            para:`Lorem ipsum dolor sit amet, consectetur notted adipisicing elit sed do eiusm tempor
            incididunt ut labore et simply free text dolore magna aliqua andhn.`,
            icon:icon,
            name:"Adam brown",
            des:"Investor"
        },
        {
            img:img1,
            para:`Lorem ipsum dolor sit amet, consectetur notted adipisicing elit sed do eiusm tempor
            incididunt ut labore et simply free text dolore magna aliqua andhn.`,
            icon:icon,
            name:"Adam brown",
            des:"Investor"
        },
        {
            img:img1,
            para:`Lorem ipsum dolor sit amet, consectetur notted adipisicing elit sed do eiusm tempor
            incididunt ut labore et simply free text dolore magna aliqua andhn.`,
            icon:icon,
            name:"Adam brown",
            des:"Investor"
        },
        {
            img:img1,
            para:`Lorem ipsum dolor sit amet, consectetur notted adipisicing elit sed do eiusm tempor
            incididunt ut labore et simply free text dolore magna aliqua andhn.`,
            icon:icon,
            name:"Adam brown",
            des:"Investor"
        },
        {
            img:img1,
            para:`Lorem ipsum dolor sit amet, consectetur notted adipisicing elit sed do eiusm tempor
            incididunt ut labore et simply free text dolore magna aliqua andhn.`,
            icon:icon,
            name:"Adam brown",
            des:"Investor"
        },
        {
            img:img1,
            para:`Lorem ipsum dolor sit amet, consectetur notted adipisicing elit sed do eiusm tempor
            incididunt ut labore et simply free text dolore magna aliqua andhn.`,
            icon:icon,
            name:"Adam brown",
            des:"Investor"
        },
        {
            img:img1,
            para:`Lorem ipsum dolor sit amet, consectetur notted adipisicing elit sed do eiusm tempor
            incididunt ut labore et simply free text dolore magna aliqua andhn.`,
            icon:icon,
            name:"Adam brown",
            des:"Investor"
        },
        {
            img:img1,
            para:`Lorem ipsum dolor sit amet, consectetur notted adipisicing elit sed do eiusm tempor
            incididunt ut labore et simply free text dolore magna aliqua andhn.`,
            icon:icon,
            name:"Adam brown",
            des:"Investor"
        },
        {
            img:img1,
            para:`Lorem ipsum dolor sit amet, consectetur notted adipisicing elit sed do eiusm tempor
            incididunt ut labore et simply free text dolore magna aliqua andhn.`,
            icon:icon,
            name:"Adam brown",
            des:"Investor"
        },
        {
            img:img1,
            para:`Lorem ipsum dolor sit amet, consectetur notted adipisicing elit sed do eiusm tempor
            incididunt ut labore et simply free text dolore magna aliqua andhn.`,
            icon:icon,
            name:"Adam brown",
            des:"Investor"
        },


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
          items: 4,
        },
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
                    {TestimonialsData.map((data, index)=>(
                          <div className="testimonial_wrapper_boxed" key={index}>
                          <img src={data.img} alt="img" />
                          <p>{data.para}</p>
                          <div className="test_author">
                              <img src={data.icon} alt="img" />
                              <h4>{data.name}</h4>
                              <h5>{data.des}</h5>
                          </div>
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

export default Testimonials