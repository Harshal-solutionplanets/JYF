import React from 'react'
// import Link
import { Link } from 'react-router-dom'
// import Img
import img1 from "../../assets/img/icon/about.png"

const Newsletter = () => {
  return (
    <>
         <section id="newletter_banner">
        <div className="container">
            <div className="row align-items-center">
                <div className="col-lg-6">
                    <div className="newletter_text">
                        <h4><img src={img1} alt="img" /> Join the community</h4>
                        <h2>Let’s make a bold move to bring
                            the <span className="color_big_heading">difference</span> of others live</h2>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="newletter_button">
                        <Link to="#!" className="btn news_btn btn_theme">Become a volunteer</Link>
                    </div>
                </div>
            </div>
        </div>

    </section>
    </>
  )
}

export default Newsletter