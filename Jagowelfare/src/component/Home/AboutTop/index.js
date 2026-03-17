import React from 'react'
// import Link
import { Link } from 'react-router-dom'
// import Img
import RoundImg from "../../../assets/img/icon/round.png"
import img1 from "../../../assets/img/icon/book.png"
import img2 from "../../../assets/img/icon/paint.png"
import img3 from "../../../assets/img/icon/heart.png"
import img4 from "../../../assets/img/icon/restaurant.png"

const AboutTopArea = () => {
    const AboutData =[
        {
            img:img1,
            para:"Donate for",
            heading:"Children education",
            roundImg:RoundImg,
            class:"about_top_boxed bg_one"
        },
        {
            img:img2,
            para:"Donate for",
            heading:"Clean mineral water",
            roundImg:RoundImg,
            class:"about_top_boxed bg_two"
        },
        {
            img:img3,
            para:"Donate for",
            heading:"Surgery & treatment",
            roundImg:RoundImg,
            class:"about_top_boxed bg_three"
        },
        {
            img:img4,
            para:"Donate for",
            heading:"Children education",
            roundImg:RoundImg,
            class:"about_top_boxed bg_four"
        },
  
    ]
  return (
    <>
      <section id="about_top_area" className="section_padding">
        <div className="container">
            <div className="row">
                {AboutData.map((data, index) =>  (
                    <div className="col-lg-3 col-md-6 col-sm-12 col-12"  key={index}>
                    <div className={data.class}>
                        <div className="about_top_boxed_icon">
                            <img src={data.img} alt="img" />
                        </div>
                        <div className="about_top_boxed_text">
                            <p>{data.para}</p>
                            <h3>{data.heading}</h3>
                            <Link to="/about">More details...</Link>
                        </div>
                        <div className="about_top_boxed_vector">
                            <img src={data.roundImg} alt="img" />
                        </div>
                    </div>
                </div>
               )
                )}
               
            </div>
        </div>
    </section>
    </>
  )
}

export default AboutTopArea