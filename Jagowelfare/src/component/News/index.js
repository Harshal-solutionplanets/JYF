import React from 'react'
// Import Data
import { NewsAreaData } from './data'
// Import Link
import { Link } from 'react-router-dom'


const NewsArea = () => {
  return (
    <>
        <section id="main_blog_area" class="section_padding">
        <div class="container">
            <div class="row">
                <div class="col-lg-6 offset-lg-3 col-md-12 col-sm-12 col-12">
                    <div class="section_heading">
                        <h3>Our latest news</h3>
                        <h2>Read and <span class="color_big_heading">explore</span> your
                            knowledge through our news
                        </h2>
                    </div>
                </div>
            </div>
            <div className="row">
                {NewsAreaData.map((data, index)=>(
                     <div className="col-lg-4" key={index}>
                     <div className="blog_card_wrapper">
                         <div className="blog_card_img">
                             <Link to="/news-details"><img src={data.img} alt="img" /></Link>
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

export default NewsArea