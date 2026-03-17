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
                            <h3>Welcome to Jago</h3>
                        </div>
                        <div className="about_area_heading_two">
                            <h2>A world where <span className="color_big_heading">poverty</span> <br />
                                will not exists</h2>
                            <h3>We are the largest crowdfunding</h3>
                        </div>
                        <div className="about_area_para">
                            <h5>Lorem ipsum dolor sit amet, consectetur notted adipisicing elit sed do
                                eiusmod tempor incididunt ut labore.</h5>
                            <p>Lorem ipsum dolor sit amet, consectetur notted adipisicing elit sed do
                                eiusmod tempor incididunt ut labore et simply free text dolore magna
                                aliqua lonm andhn.</p>
                            <p>Lorem ipsum dolor sit amet, consectetur notted adipisicing elit sed do
                                eiusmod tempor incididunt ut labore et simply.</p>
                        </div>
                        <div className="about_vedio_area">
                            <Link to="/about" className="btn btn_theme btn_md">Learn more</Link>
                            <a href="#!" className="vedio_btn popup-vimeo"><i
                                    className="fa fa-play"></i>How we work</a>
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