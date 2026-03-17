import React from 'react'
// Import Img
import money from "../../assets/img/icon/money.png"
import setting from "../../assets/img/icon/setting.png"
import hand from "../../assets/img/icon/hand-round.png"
import icon from "../../assets/img/icon/round.png"


const FaqsTop = () => {
  return (
    <>
        <section id="faqs_arae_top" className="section_padding">
        <div className="container">
            <div className="row">
                <div className="col-lg-6 offset-lg-3 col-md-12 col-sm-12 col-12">
                    <div className="section_heading">
                        <h3>Faq</h3>
                        <h2>Ask your any <span className="color_big_heading">question</span> and get the answer</h2>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                    <div className="about_top_boxed bg_one">
                        <div className="about_top_boxed_icon">
                            <img src={money} alt="img" />
                        </div>
                        <div className="about_top_boxed_text">
                            <p>Fund raise</p>
                            <h3>Collect fund and support people</h3>
                            <a href="faqs.html">Learn more...</a>
                        </div>
                        <div className="about_top_boxed_vector">
                            <img src={icon} alt="img" />
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                    <div className="about_top_boxed bg_two">
                        <div className="about_top_boxed_icon">
                            <img src={setting} alt="img" />
                        </div>
                        <div className="about_top_boxed_text">
                            <p>Administration</p>
                            <h3>Ask anything about administrations </h3>
                            <a href="faqs.html">Learn more...</a>
                        </div>
                        <div className="about_top_boxed_vector">
                            <img src={icon} alt="img" />
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                    <div className="about_top_boxed bg_three">
                        <div className="about_top_boxed_icon">
                            <img src={hand} alt="img" />
                        </div>
                        <div className="about_top_boxed_text">
                            <p>Volunteer</p>
                            <h3>Ask your anything about volunteer</h3>
                            <a href="faqs.html">Learn more...</a>
                        </div>
                        <div className="about_top_boxed_vector">
                            <img src={icon} alt="img" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </>
  )
}

export default FaqsTop