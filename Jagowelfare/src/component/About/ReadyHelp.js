import React from 'react'
// Import Img
import Img1 from "../../assets/img/volunteer/volunteer-1.png"
import Img2 from "../../assets/img/volunteer/volunteer-2.png"
import Img3 from "../../assets/img/volunteer/volunteer-3.png"
import Img4 from "../../assets/img/volunteer/volunteer-4.png"

const ReadyHelp = () => {
    const ReadyData = [
        {
            img:Img1,
            name:"Mark carson",
            title:"Project manager"
        },
        {
            img:Img2,
            name:"Anna naomi",
            title:"Nutritionist"
        },
        {
            img:Img3,
            name:"Graim clair",
            title:"Health advisor"
        },
        {
            img:Img4,
            name:"David smith",
            title:"Teacher"
        }
    ]
  return (
    <>
        <section id="volunteer_area" className="section_after section_padding_top bg-color">
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
                {ReadyData.map((data, index)=>(
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

export default ReadyHelp