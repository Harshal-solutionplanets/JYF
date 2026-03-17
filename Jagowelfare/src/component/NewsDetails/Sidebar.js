import React from "react";
// Import link
import { Link } from "react-router-dom";
// Import Social Icom
import facebook from "../../assets/img/icon/facebook.png";
import instagram from "../../assets/img/icon/instagram.png";
import twitter from "../../assets/img/icon/twitter.png";
import linkedin from "../../assets/img/icon/linkedin.png";
import tag from "../../assets/img/icon/tag.png";
import map from "../../assets/img/icon/map.png";
import cal from "../../assets/img/icon/cal.png";
// Import Img
import Organize from "../../assets/img/sidebar/project_organizer.png"
import img1 from "../../assets/img/sidebar/rec-cas-1.png";
import img2 from "../../assets/img/sidebar/rec-cas-2.png";
import img3 from "../../assets/img/sidebar/rec-cas-3.png";
import img4 from "../../assets/img/sidebar/rec-cas-4.png";

const NewsSidebar = () => {
  const ReceData = [
    {
      img: img1,
      title: `Stop early marriage and educate
            your girl child`,
      date: "3rd January, 2022",
    },
    {
      img: img2,
      title: `Ensure a secure and free life for the wild animal`,
      date: "10th January, 2022",
    },
    {
      img: img3,
      title: `Ensure pure and mineral drinking water for rural people`,
      date: "15th January, 2022",
    },
    {
      img: img4,
      title: `Collect fund for drinking water & healthy food`,
      date: "30th Dec, 2021",
    },
  ];

  return (
    <>
      <div class="col-lg-4">
        <div class="sidebar_first">
          <div class="project_organizer_wrapper sidebar_boxed">
            <div class="project_organizer_img">
              <img src={Organize} alt="img" />
            </div>
            <div class="project_organizer_text">
              <h5>Writte by:</h5>
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
          <div class="recent_causes_wrapper sidebar_boxed">
            <div class="sidebar_heading_main">
              <h3>Recent news</h3>
            </div>
            {ReceData.map((data, index) => (
              <div class="recent_donet_item" key={index}>
                <div class="recent_donet_img">
                  <Link to="#!">
                    <img src={data.img} alt="img" />
                  </Link>
                </div>
                <div class="recent_donet_text">
                  <div class="sidebar_inner_heading">
                    <h4>
                      <Link to="#!">{data.title}</Link>
                    </h4>
                  </div>
                  <h6>{data.date}</h6>
                </div>
              </div>
            ))}
          </div>
          <div class="share_causes_wrapper sidebar_boxed">
            <div class="sidebar_heading_main">
              <h3>Popular tags</h3>
            </div>
            <div class="popular_tags">
              <ul>
                <li>
                  <Link to="#!">Poverty</Link>
                </li>
                <li>
                  <Link to="#!">Education</Link>
                </li>
                <li>
                  <Link to="#!">Children education</Link>
                </li>
                <li>
                  <Link to="#!">Food</Link>
                </li>
                <li>
                  <Link to="#!">Health care</Link>
                </li>
                <li>
                  <Link to="#!">Welfare</Link>
                </li>
                <li>
                  <Link to="#!">Donation people</Link>
                </li>
                <li>
                  <Link to="#!">Charity fund</Link>
                </li>
              </ul>
            </div>
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

export default NewsSidebar;
