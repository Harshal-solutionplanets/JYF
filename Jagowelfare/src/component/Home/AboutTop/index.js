import React from 'react'
// import Link
import { Link } from 'react-router-dom'
// import Img
import RoundImg from "../../../assets/img/icon/round.png"
import img1 from "../../../assets/img/icon/sm-book.png"
import img2 from "../../../assets/img/icon/hand-love.png"
import img3 from "../../../assets/img/icon/sm-heart.png"
import img4 from "../../../assets/img/icon/sm-restaurant.png"

const AboutTopArea = () => {
    const AboutData = [
        {
            img: img3,
            heading: "Healthcare",
            roundImg: RoundImg,
            class: "about_top_boxed bg_three h-100",
            link: "/healthcare"
        },
        {
            img: img4,
            heading: "Food support",
            roundImg: RoundImg,
            class: "about_top_boxed bg_four h-100",
            link: "/food-support"
        },
        {
            img: img1,
            heading: "Education",
            roundImg: RoundImg,
            class: "about_top_boxed bg_one h-100",
            link: "/education"
        },
        {
            img: img2,
            heading: "Humanitarian services",
            roundImg: RoundImg,
            class: "about_top_boxed bg_two h-100",
            link: "/humanitarian-services"
        },

    ]
    return (
        <>
            <section id="about_top_area" className="section_padding">
                <div className="container">
                    <div className="row">
                        {AboutData.map((data, index) => (
                            <div className="col-lg-3 col-md-6 col-sm-12 col-12" key={index}>
                                <Link to={data.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className={data.class}>
                                        <div className="about_top_boxed_icon">
                                            <img src={data.img} alt="img" />
                                        </div>
                                        <div className="about_top_boxed_text">
                                            <p>{data.para}</p>
                                            <h3>{data.heading}</h3>
                                        </div>
                                        <div className="about_top_boxed_vector">
                                            <img src={data.roundImg} alt="img" />
                                        </div>
                                    </div>
                                </Link>
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