import React from 'react'
// import Link
import { Link } from 'react-router-dom'
// Import Icon
import Tags from "../../assets/img/icon/tag.png"
import Map from "../../assets/img/icon/map.png"
import Cal from "../../assets/img/icon/cal.png"
import Mail from "../../assets/img/icon/email.png"
import Phone from "../../assets/img/icon/phone.png"

// Import Social Icom
import facebook from "../../assets/img/icon/facebook.png"
import instagram from "../../assets/img/icon/instagram.png"
import twitter from "../../assets/img/icon/twitter.png"
import linkedin from "../../assets/img/icon/linkedin.png"

// Import Img
import rece1 from "../../assets/img/sidebar/rec-donet-1.png"
import rece2 from "../../assets/img/sidebar/rec-donet-2.png"
import rece3 from "../../assets/img/sidebar/rec-donet-3.png"

const EventDetailSidebar = () => {
    const OrganizerData =[
        {
            img:rece1,
            name:"Mike richard",
            desnation:"Managing director",
            group:"Care NGO ltd."
        },
        {
            img:rece2,
            name:"Jenifar lawrence",
            desnation:"Entrepreneur",
            group:"Entrepreneur"
        },
        {
            img:rece3,
            name:"David jovan",
            desnation:"Manager",
            group:"ABC Company"
        },
    ]
  return (
    <>
         <div class="col-lg-4">
                    <div class="sidebar_first">
                        <div class="sidebar_boxed">
                            <div class="sidebar_heading_main">
                                <h3>Event details</h3>
                            </div>
                            <div class="event_details_list">
                                <ul>
                                    <li><img src={Tags} alt="icon" /> Category: <span>Food and
                                            nutrition</span>
                                    </li>
                                    <li><img src={Map} alt="icon" /> Location: <span>990 Green Hill
                                            Bronx, NY 10458.</span></li>
                                    <li><img src={Cal} alt="icon" /> Date: <span>20 Dec, 2021</span>
                                    </li>
                                    <li><img src={Mail} alt="icon" /> Mail:
                                        <span>registermail@domain.com</span>
                                    </li>
                                    <li><img src={Phone} alt="icon" /> Phone: <span>+880 123 456
                                            789</span>
                                    </li>
                                </ul>
                                <div class="register_now_details">
                                    <Link to="#!" class="btn btn_theme btn_md w-100">Register now</Link>
                                </div>
                            </div>
                         </div>

                        <div class="project_recentdonet_wrapper sidebar_boxed">
                            <div class="sidebar_heading_main">
                                <h3>Event organizer</h3>
                            </div>
                            {OrganizerData.map((data, index)=>(
                                <div class="recent_donet_item" key={index}>
                                <div class="recent_donet_img">
                                    <Link to="/cause-details"><img src={data.img} alt="img" /></Link>
                                </div>
                                <div class="recent_donet_text">
                                    <div class="sidebar_inner_heading">
                                        <h4><Link to="/cause-details">{data.name}</Link></h4>
                                    </div>
                                    <p>{data.desnation}</p>
                                    <h6>{data.group}</h6>
                                </div>
                            </div>
                            ))}
                            
                          
                        </div>
                        <div class="share_causes_wrapper sidebar_boxed">
                            <div class="sidebar_heading_main">
                                <h3>Share causes</h3>
                            </div>
                            <div class="social_icon_sidebar">
                                <ul>
                                    <li><Link to="#!"><img src={facebook} alt="icon" /></Link></li>
                                    <li><Link to="#!"><img src={instagram} alt="icon" /></Link></li>
                                    <li><Link to="#!"><img src={twitter} alt="icon" /></Link></li>
                                    <li><Link to="#!"><img src={linkedin} alt="icon" /></Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
    </>
  )
}

export default EventDetailSidebar