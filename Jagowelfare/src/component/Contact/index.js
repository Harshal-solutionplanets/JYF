import React, { useState, useEffect } from 'react'
// import Link
import { Link } from 'react-router-dom'
import { supabase } from '../../supabase'
// import Icon
import Map from "../../assets/img/icon/sm-location.png"
import Mail from "../../assets/img/icon/email-color.png"
import Phone from "../../assets/img/icon/phon-color.png"

const ContactArea = () => {
    const [contact, setContact] = useState({
        phones: ["70 45 70 75 00", "", ""],
        emails: ["info@jainyouth.in", "", ""],
        address: "21/B, Shanti Bhuvan Shopping Centre, 2nd Floor, JD Road, Above 396 Bus Stop, Mulund (W), Mumbai-80."
    });

    useEffect(() => {
        const fetchContact = async () => {
            const { data } = await supabase.from('site_config').select('*').eq('key', 'site_contact').single();
            if (data && data.value) {
                setContact(data.value);
            }
        };
        fetchContact();
    }, []);

    const phones = (contact.phones || []).filter(p => p && p.trim() !== "");
    const emails = (contact.emails || []).filter(e => e && e.trim() !== "");

    const cleanPhone = (p) => p.replace(/[^0-9]/g, '');

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
                            stay update
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
                                <p>{contact.address}</p>
                            </div>
                        </div>
                        <div className="contact_left_item">
                            <div className="contact_left_icon">
                                <img src={Mail} alt="icon" />
                            </div>
                            <div className="contact_left_text">
                                <h3>Email:</h3>
                                {emails.map((e, idx) => (
                                    <Link key={idx} to={`mailto:${e}`} style={{ display: "block" }}>{e}</Link>
                                ))}
                            </div>
                        </div>
                        <div className="contact_left_item">
                            <div className="contact_left_icon">
                                <img src={Phone} alt="icon" />
                            </div>
                            <div className="contact_left_text">
                                <h3>Phone number:</h3>
                                {phones.map((p, idx) => (
                                    <Link key={idx} to={`tel:+91${cleanPhone(p)}`} style={{ display: "block" }}>+91 {p}</Link>
                                ))}
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