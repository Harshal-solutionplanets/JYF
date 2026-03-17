import React from 'react'
// import Data
import { TeamDatas } from './data'
const TeamArea = () => {

  return (
    <>
      <section id="volunteer_area_main" className="section_padding">
        <div className="container">
            <div className="row">
                <div className="col-lg-6 offset-lg-3 col-md-12 col-sm-12 col-12">
                    <div className="section_heading">
                        <h3>Ready to help</h3>
                        <h2> We have thousands of happy
                            volunteer to <span className="color_big_heading">help</span> you</h2>
                    </div>
                </div>
            </div>
            <div className="row">
                {TeamDatas.map((data, index)=>(
                     <div className="col-lg-3 col-md-4 col-sm-6 col-12" key={index}>
                     <div className="volunteer_wrapper">
                         <div className="volunteer_img">
                             <img src={data.img} alt="img" />
                             <div className="volunteer_icon">
                                 <ul>
                                     <li>
                                         <a href="#!"><i className="fab fa-facebook"></i></a>
                                     </li>
                                     <li>
                                         <a href="#!"><i className="fab fa-twitter-square"></i></a>
                                     </li>
                                     <li>
                                         <a href="#!"><i className="fab fa-instagram"></i></a>
                                     </li>
                                     <li>
                                         <a href="#!"><i className="fab fa-linkedin"></i></a>
                                     </li>
                                 </ul>
                             </div>
                         </div>
 
                         <div className="volunteer_text">
                             <h3><a href="#!">{data.name}</a></h3>
                             <p>{data.title}</p>
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

export default TeamArea