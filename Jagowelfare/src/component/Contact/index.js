import React from 'react'
// import Link
import { Link } from 'react-router-dom'
// import Icon
import Map from "../../assets/img/icon/sm-location.png"
import Mail from "../../assets/img/icon/email-color.png"
import Phone from "../../assets/img/icon/phon-color.png"



const ContactArea = () => {
  return (
    <>
         <section id="contact_arae_main" className="section_padding">
        <div className="container">
            <div className="row">
                <div className="col-lg-6 offset-lg-3 col-md-12 col-sm-12 col-12">
                    <div className="section_heading">
                        <h3>Contact with us</h3>
                        <h2>Get in
                            <span className="color_big_heading">touch</span>with us &
                            stay updates
                        </h2>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-6">
                    <div className="contact_area_left">
                        <div className="contact_left_item">
                            <div className="contact_left_icon">
                                <img src={Map} alt="icon" />
                            </div>
                            <div className="contact_left_text">
                                <h3>Address:</h3>
                                <p>107, Broklyn Golden Road Street. New York, <br /> United States of America</p>
                            </div>
                        </div>
                        <div className="contact_left_item">
                            <div className="contact_left_icon">
                                <img src={Mail} alt="icon" />
                            </div>
                            <div className="contact_left_text">
                                <h3>Email:</h3>
                                <Link to="mailto:support@domain.com">support@domain.com</Link>
                                <Link to="mailto:support@domain.com">contact@domain.com</Link>
                            </div>
                        </div>
                        <div className="contact_left_item">
                            <div className="contact_left_icon">
                                <img src={Phone} alt="icon" />
                            </div>
                            <div className="contact_left_text">
                                <h3>Phone number:</h3>
                                <Link to="tel:+01-123-456-789">+01 123 456 789</Link>
                                <Link to="tel:+01-123-456-789">+02 345 678 901</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="contact_form_Wrapper">
                        <h3>Leave us a message</h3>
                        <form action="#!" id="contact_form">
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Your full name*" required />
                            </div>
                            <div className="form-group">
                                <input type="email" className="form-control" placeholder="Your email address*" required />
                            </div>
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Subject**" required />
                            </div>
                            <div className="form-group">
                                <textarea className="form-control" rows="6" placeholder="Message*" required></textarea>
                            </div>
                            <div className="contact_submit_form">
                                <button className="btn btn_theme btn_md">Send message</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </>
  )
}

export default ContactArea