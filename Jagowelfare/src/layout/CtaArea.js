import React from 'react'


const CtaArea = () => {
  return (
    <>
     <section id="subscribe_area">
        <div className="container">
            <div className="subscribe_wrapper">
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <div className="subscribe_text">
                            <p>Newsletter</p>
                            <h3>To get weekly & monthly news,
                                <span className="color_big_heading">Subscribe</span> to our newsletter.
                            </h3>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="cta_right_side">
                            <form action="#!" id="subscribe_form">
                                <div className="input-group">
                                    <input type="text" className="form-control" placeholder="Your mail address" required="" />
                                    <button className="btn btn_theme btn_md" type="submit">Subscribe</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </>
  )
}

export default CtaArea