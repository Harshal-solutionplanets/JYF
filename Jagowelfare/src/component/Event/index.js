import React from 'react'
import { Link } from 'react-router-dom'
// import Data
import { EventsDatas } from './data'
// Import Img
import BigImg from '../../assets/img/event/event-big.png'
// Import Icon
import Iconclock from "../../assets/img/icon/clock.png"
import IconMap from "../../assets/img/icon/map.png"
import IconDate from "../../assets/img/icon/date.png"


const EventAreaPage = (props) => {
    const  bigEvents =[
        {
            heading:"Healthy food and nutritions awreness campaign december",
            category:"#FoodCamp",
            img:BigImg,
            para:`Lorem ipsum dolor sit amet, consectetur notted adipisicing elit sed do eiusmod
            tempor. Lorem ipsum dolor sit amet, consectetur notted duber
            adipisicing elit sed do eiusmod tempor.`,
            IconClock:Iconclock,
            IconMap:IconMap,
            IconDate:IconDate
        }
        
     ]
  return (
    <>
         <section id="upcoming_events" className={ props.padding === true ? "section_padding" : "section_padding_bottom"} >
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3 col-md-12 col-sm-12 col-12">
              <div className="section_heading">
                <h3>Upcoming events</h3>
                <h2>
                  Join our upcoming
                  <span className="color_big_heading">events</span> for contribution
                </h2>
              </div>
            </div>
          </div>
          <div className="row">
            {/* Event Leftside */}
            <div className="col-lg-6">
                {bigEvents.map((data, index1)=>(
                    <div className="event_left_side_wrapper" key={index1}>
                    <div className="event_big_img" >
                      <Link to="/event-details">
                        <img src={data.img} alt="img" />
                      </Link>
                    </div>
                    <div className="event_content_area big_content_padding">
                      <div className="event_tag_area">
                        <Link to="/event-details">{data.category}</Link>
                      </div>
                      <div className="event_heading_area">
                        <div className="event_heading">
                          <h3>
                          <Link to="/event-details">{data.heading}</Link>
                          </h3>
                        </div>
                        <div className="event_date">
                          <img src={data.IconDate} alt="icon" />
                          <h6>
                            20 <span>Dec</span>
                          </h6>
                        </div>
                      </div>
                      <div className="event_para">
                        <p>{data.para}</p>
                      </div>
                      <div className="event_boxed_bottom_wrapper">
                        <div className="row">
                          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                            <div className="event_bottom_boxed">
                              <div className="event_bottom_icon">
                                <img src={data.IconMap} alt="icon" />
                              </div>
                              <div className="event_bottom_content">
                                <h5>Location:</h5>
                                <p>Montgomery, Alabama.</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                            <div className="event_bottom_boxed">
                              <div className="event_bottom_icon">
                                <img src={data.IconClock} alt="icon" />
                              </div>
                              <div className="event_bottom_content">
                                <h5>Starts at:</h5>
                                <p>10 am</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="event_button">
                      <Link to="/event"  className="btn btn_md btn_theme"> Join event </Link>
                      </div>
                    </div>
              </div>
                ))}
            </div>

             {/* Event Rightside */}
             <div className="col-lg-6">
             {EventsDatas.map((datas, indexs)=>(
               <div className="event_left_side_wrapper" key={indexs}>
                     <div className="event_content_area small_content_padding">
                     <div className="event_tag_area">
                       <Link to="/event-details">{datas.category}</Link>
                     </div>
                     <div className="event_heading_area">
                       <div className="event_heading">
                         <h3>
                           <Link to="/event-details">
                            {datas.heading}
                           </Link>
                         </h3>
                       </div>
                       <div className="event_date">
                         <img src={datas.IconDate} alt="icon" />
                         <h6>
                           20 <span>Dec</span>
                         </h6>
                       </div>
                     </div>
                     <div className="event_para">
                       <p>{datas.para}</p>
                     </div>
                     <div className="event_boxed_bottom_wrapper">
                       <div className="row">
                         <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                           <div className="event_bottom_boxed">
                             <div className="event_bottom_icon">
                               <img src={datas.IconMap} alt="icon" />
                             </div>
                             <div className="event_bottom_content">
                               <h5>Location:</h5>
                               <p>Montgomery, Alabama.</p>
                             </div>
                           </div>
                         </div>
                         <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                           <div className="event_bottom_boxed">
                             <div className="event_bottom_icon">
                               <img src={datas.IconClock} alt="icon" />
                             </div>
                             <div className="event_bottom_content">
                               <h5>Starts at:</h5>
                               <p>10 am</p>
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
            </div>
             </div>
                ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default EventAreaPage