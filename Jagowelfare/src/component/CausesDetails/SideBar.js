import React from "react";
import { Link } from "react-router-dom";
// Import All Data
import OrganImg from "../../assets/img/sidebar/project_organizer.png"

// Import Recent Data
import Recent1 from "../../assets/img/sidebar/rec-donet-1.png"
import Recent2 from "../../assets/img/sidebar/rec-donet-2.png"
import Recent3 from "../../assets/img/sidebar/rec-donet-3.png"
import Recent4 from "../../assets/img/sidebar/rec-donet-4.png"
import Recent5 from "../../assets/img/sidebar/rec-donet-5.png"
// Import Recent Causes
import ReceCauses1 from "../../assets/img/sidebar/rec-cas-1.png"
import ReceCauses2 from "../../assets/img/sidebar/rec-cas-2.png"
import ReceCauses3 from "../../assets/img/sidebar/rec-cas-3.png"
import ReceCauses4 from "../../assets/img/sidebar/rec-cas-4.png"
// Import Social Icom
import facebook from "../../assets/img/icon/facebook.png"
import instagram from "../../assets/img/icon/instagram.png"
import twitter from "../../assets/img/icon/twitter.png"
import linkedin from "../../assets/img/icon/linkedin.png"
import tag from "../../assets/img/icon/tag.png"
import map from "../../assets/img/icon/map.png"
import cal from "../../assets/img/icon/cal.png"




const SideBar = () => {
    const RecentData =[
        {
           img:Recent1,
           heading:"Mike richard",
           price:"$300.00",
           propsan:"Business man",
           time:"2 hours ago"
        },
        {
            img:Recent2,
            heading:"Jenifar lawrence",
            price:"$400.00",
            propsan:"Entrepreneur",
            time:"7 hours ago"
         },
         {
            img:Recent3,
            heading:"David jovan",
            price:"$250.00",
            propsan:"Manager",
            time:"3 hours 25 min ago"
         },
         {
            img:Recent4,
            heading:"Calvin roy",
            price:"$100.00",
            propsan:"Student",
            time:"4 hours ago"
         },
         {
            img:Recent5,
            heading:"Julia flora",
            price:"$500.00",
            propsan:"House wife",
            time:"5 hours ago"
         },

    ]

    const CausesData =[
        {
           img:ReceCauses1,
           heading:"Stop early marriage and educate your girl child",
           time:"3rd January, 2022"
        },
        {
            img:ReceCauses2,
            heading:"Ensure a secure and free life for the wild animal",
            time:"10th January, 2022"
         },
         {
            img:ReceCauses3,
            heading:"Ensure pure and mineral drinking water for rural people",
            time:"15th January, 2022"
         },
         {
            img:ReceCauses4,
            heading:"Collect fund for drinking water & healthy food",
            time:"30th Dec, 2021"
         },
      

    ]
  return (
    <>
      <div class="col-lg-4">
        <div class="sidebar_first">
          <div class="project_organizer_wrapper sidebar_boxed">
            <div class="project_organizer_img">
              <img src={OrganImg} alt="img" />
            </div>
            <div class="project_organizer_text">
              <h5>Project organizer:</h5>
              <h3>Polin sarika</h3>
              <p>Manager at ABC company</p>
              <ul>
                <li>
                  <img src={tag} alt="icon" /> Category:
                  <span>Education</span>
                </li>
                <li>
                  <img src={map} alt="icon" /> Location:
                  <span>Niger, Nigeria</span>
                </li>
                <li>
                  <img src={cal} alt="icon" /> Date:
                  <span>20 Dec, 2021</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="project_recentdonet_wrapper sidebar_boxed">
            <div class="sidebar_heading_main">
              <h3>Recent donations</h3>
            </div>
            {RecentData.map((data, index)=>(
                 <div class="recent_donet_item" key={index}>
                 <div class="recent_donet_img">
                   <Link to="/cause-details">
                     <img src={data.img} alt="img" />
                   </Link>
                 </div>
                 <div class="recent_donet_text">
                   <div class="sidebar_inner_heading">
                     <h4>
                       <Link to="/cause-details">{data.heading}</Link>
                     </h4>
                     <h5>{data.price}</h5>
                   </div>
                   <p>{data.propsan}</p>
                   <h6>{data.time}</h6>
                 </div>
               </div>
            ))}
          </div>
          <div class="recent_causes_wrapper sidebar_boxed">
            <div class="sidebar_heading_main">
              <h3>Recent causes</h3>
            </div>
            {CausesData.map((data1, index1) =>(
                <div class="recent_donet_item" key={index1}>
                <div class="recent_donet_img">
                  <Link to="/cause-details">
                    <img src={data1.img} alt="img" />
                  </Link>
                </div>
                <div class="recent_donet_text">
                  <div class="sidebar_inner_heading">
                    <h4>
                      <Link to="/cause-details">
                        {data1.heading}
                      </Link>
                    </h4>
                  </div>
                  <h6>{data1.time}</h6>
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
                <li>
                  <Link to="#">
                    <img src={facebook} alt="icon" />
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    <img src={instagram} alt="icon" />
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    <img src={twitter} alt="icon" />
                  </Link>
                </li>
                <li>
                  <Link to="#">
                    <img src={linkedin} alt="icon" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
