import React from 'react'
import { Link } from 'react-router-dom'

// Import Img
import Img1 from "../../../assets/img/common/about.png"
import Img2 from "../../../assets/img/icon/about.png"


const AboutAres = () => {
  return (
    <>
      <section id="about_area" className="section_padding_bottom">
        <div className="container">
            <div className="row">
                <div className="col-lg-6 col-md-12 col-sm-12 col-12">
                    <div className="about_area_img">
                        <img src={Img1} alt="img" />
                    </div>
                </div>
                <div className="col-lg-6 col-md-12 col-sm-12 col-12">
                    <div className="about_area_main_text">
                        <div className="about_area_heading">
                            <img src={Img2} alt="img" />
                            <h3>Welcome to JYF</h3>
                        </div>
                        <div className="about_area_heading_two">
                            <h2>Serving Humanity Through <span className="color_big_heading">Compassion</span></h2>
                        </div>
                        <div className="about_area_para">
                            <p>At Jain Youth Foundation (JYF), our volunteers are inspired by Jain values of Ahimsa (non-violence), compassion, service, and unity. While the foundation is run by members of the Jain community, our initiatives are dedicated to the welfare of society at large, helping people across communities.</p>
                            <p>Through our various initiatives, we focus on healthcare, food support, education, and humanitarian services, impacting thousands of lives every year.</p>
                        </div>
                        <div className="about_vedio_area">
                            <Link to="/about" className="btn btn_theme btn_md">Learn more</Link>
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