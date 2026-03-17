import React from 'react'
// import Link
import { Link } from 'react-router-dom'
import Img1 from "../../assets/img/common/error.png"

const ErrorArea = () => {
  return (
    <>
         <section id="error_area" className="section_padding">
        <h2 className="d-none">Heading</h2>
        <div className="container">
            <div className="row">
                <div className="col-lg-8 offset-lg-2">
                    <div className="error_area_content text-center">
                        <img src={Img1} alt="img" />
                        <Link to="/" className="btn btn_theme btn_md">Back to home</Link>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </>
  )
}

export default ErrorArea