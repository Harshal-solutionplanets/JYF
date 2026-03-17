import React from 'react'
// import Link
import { Link } from 'react-router-dom'
// Import Data
import { CausesData } from './data'


const CausesArea = () => {
  return (
    <>
     <section id="trending_causes_main" class="section_padding">
        <div class="container">
            <div class="row">
                <div class="col-lg-6 offset-lg-3 col-md-12 col-sm-12 col-12">
                    <div class="section_heading">
                        <h3>Trending causes</h3>
                        <h2> We are always where other people <span class="color_big_heading">need</span> help</h2>
                    </div>
                </div>
            </div>
            <div class="row">
                {CausesData.map((data, index)=>(
                     <div class="col-lg-4 col-md-12 col-sm-12 col-12" key={index}>
                     <div class="case_boxed_wrapper">
                         <div class="case_boxed_img">
                             <Link to="/cause-details"><img src={data.img} alt="img" /></Link>
                             <span class="causes_badge bg-theme">{data.category}</span>
                         </div>
                         <div class="causes_boxed_text">
                             <div class="class-full causes_pro_bar progress_bar">
                                 <div class="class-full-bar-box">
                                     <h3 class="h3-title">Goal: <span>{data.goal}</span></h3>
                                     <div class="class-full-bar-percent">
                                         <h2><span class="counting-data" data-count="85">85</span>
                                             <span>%</span>
                                         </h2>
                                     </div>
                                 </div>
                             </div>
                             <h3><Link to="/cause-details">{data.heading}</Link></h3>
                             <p>{data.para}</p>
                             <div class="causes_boxed_bottom_wrapper">
                                 <div class="row">
                                     <div class="col-lg-6 col-md-6 col-sm-6 col-6">
                                         <div class="casuses_bottom_boxed">
                                             <div class="casuses_bottom_icon">
                                                 <img src={data.DateIcon} alt="icon" />
                                             </div>
                                             <div class="casuses_bottom_content">
                                                 <h5>Date:</h5>
                                                 <p>20 Dec, 2021</p>
                                             </div>
                                         </div>
                                     </div>
                                     <div class="col-lg-6 col-md-6 col-sm-6 col-6">
                                         <div class="casuses_bottom_boxed casuses_left_padding">
                                             <div class="casuses_bottom_icon">
                                                 <img src={data.IconAdmin} alt="icon" />
                                             </div>
                                             <div class="casuses_bottom_content">
                                                 <h5>By:</h5>
                                                 <p>Admin</p>
                                             </div>
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
    </section>
    </>
  )
}

export default CausesArea