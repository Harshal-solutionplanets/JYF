import React from 'react'
// Import Link
import { Link } from 'react-router-dom'
// Import Arrow
import Arrow from "../../assets/img/icon/arrow.png"

const CommonBanner = (props) => {
  return (
    <>
        <section id="common_banner_area">
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                    <div className="commn_banner_page">
                        <h2><span className="color_big_heading">{props.heading}</span></h2>
                        <ul className="breadcrumb_wrapper">
                            <li className="breadcrumb_item"><Link to="./">Home</Link></li>
                            <li className="breadcrumb_item"><img src={Arrow} alt="img" /></li>
                            <li className="breadcrumb_item active">{props.pagination}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </>
  )
}

export default CommonBanner