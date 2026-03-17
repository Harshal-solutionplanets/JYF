import React from 'react'
import { Link } from 'react-router-dom'


const DonationArea = () => {
  return (
    <>
     <section id="donate_area">
        <div className="container">
            <div className="row">
                <div className="col-lg-6 offset-lg-3">
                    <div className="donate_text">
                        <h3>We are here to stop poverty</h3>
                        <h2>
                            We are fundraising for the <span className="color_big_heading">people</span> who are
                            fighting against poverty
                        </h2>
                        <Link to="/make-donation" className="btn btn_md btn_theme">Donate now</Link>
                    </div>
                </div>
            </div>
        </div>
    </section>

    </>
  )
}

export default DonationArea