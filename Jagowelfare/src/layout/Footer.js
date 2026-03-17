import React from 'react'
// Improt Link
import { Link } from 'react-router-dom'
// import Logo
import logo from "../assets/img/logo.png"
// import Data
import { FooterData } from './FooterData'

const Footer = () => {

  return (
    <>
    <footer id="footer_area">
        <div className="container">
            <div className="row">
                <div className="col-lg-4 col-md-12 col-sm-12 col-12">
                    <div className="footer_area_about">
                        <img src={logo} alt="img" />
                        <p>Lorem ipsum dolor sit amet consec elit sed eiusmod tempor incididunt ut labore etdolore magna
                            aliqua.</p>
                        <h6><strong>Address:</strong> 858 Walnutwood Ave. Webster, NY 14580</h6>
                        <h6><strong>Phone:</strong> <Link to="tel:123-284-2554">+011 234-567-890</Link></h6>
                        <h6><strong>Email:</strong> <Link to="mailto:info@example.com">info@example.com</Link></h6>
                    </div>
                </div>
                {FooterData.map((data, index) =>(
                      <div className="col-lg-2 col-md-6 col-sm-12 col-12" key={index}>
                      <div className="footer_navitem_ara">
                          <h3>{data.heading}</h3>
                          <div className="nav_item_footer">
                              <ul>
                                {data.item.map((datas, index1) =>(
                                    <li key={index1}><Link to={datas.linkL}>{datas.FItem}</Link></li>
                                ))}
                              </ul>
                          </div>
                      </div>
                  </div>
                ))}

                <div className="col-lg-4 col-md-12 col-sm-12 col-12">
                    <div className="footer_navitem_ara">
                        <h3>Latest tweets</h3>
                        <div className="footer_twitter_area"e>
                            <Link to="#!" className="footer_twit_title"><i className="fab fa-twitter"></i> #digitalmarketing</Link>
                            <p>Lorem ipsum dolor sit amet consec elit sed eiusmod tempor incididunt ut labore etdolore
                                magna aliqua. Sit amet consec elit sed eiusmod tempor</p>
                            <Link to="#!" className="footer_twit_two">twitter.com/i/#puredrinkingwater</Link>
                            <h6>December 13, 2021 04:20 PM</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>

    </>
  )
}

export default Footer