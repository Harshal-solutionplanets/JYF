import React from 'react'
import { Link } from 'react-router-dom'
import { NewsData } from './data'




const NewsAres = () => {
  return (
    <>
         <section id="home_blog_area" className="section_after bg-color">
        <div className="container">
            <div className="row">
                <div className="col-lg-6 offset-lg-3 col-md-12 col-sm-12 col-12">
                    <div className="section_heading">
                        <h3>Our latest news</h3>
                        <h2>Check all
                            <span className="color_big_heading">our latest</span> news and updates
                        </h2>
                    </div>
                </div>
            </div>
            <div className="row">
                {NewsData.map((data, index)=>(
                     <div className="col-lg-4" key={index}>
                     <div className="blog_card_wrapper mb-30">
                         <div className="blog_card_img">
                             <Link to="/news"><img src={data.img} alt="img" /></Link>
                         </div>
                         <div className="blog_card_text">
                             <div className="blog_card_tags">
                                 <Link to="/news-details">{data.category}</Link>
                             </div>
                             <div className="blog_card_heading">
                                 <h3><Link to="/news-details">{data.heading}</Link></h3>
                                 <p>{data.para}</p>
                             </div>
                             <div className="blog_boxed_bottom_wrapper">
                                 <div className="row">
                                     <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                         <div className="blog_bottom_boxed">
                                             <div className="blog_bottom_icon">
                                                 <img src={data.IconDate} alt="icon" />
                                             </div>
                                             <div className="blog_bottom_content">
                                                 <h5>Date:</h5>
                                                 <p>20 Dec, 2021</p>
                                             </div>
                                         </div>
                                     </div>
                                     <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                         <div className="blog_bottom_boxed blog_left_padding">
                                             <div className="blog_bottom_icon">
                                                 <img src={data.IconUser} alt="icon" />
                                             </div>
                                             <div className="blog_bottom_content">
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

export default NewsAres