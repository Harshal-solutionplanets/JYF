import React from 'react'
// Import Link
import { Link } from 'react-router-dom'
// import Data
import { GalleryData } from './data'


const GalleryArea = () => {
  return (
    <>
      <section id="gallery_grid_area" className="section_padding">
        <div className="container">
            <div className="row">
                <div className="col-lg-6 offset-lg-3 col-md-12 col-sm-12 col-12">
                    <div className="section_heading">
                        <h3>Gallery</h3>
                        <h2> Explore our <span className="color_big_heading">gallery</span> to know
                            how we works</h2>
                    </div>
                </div>
            </div>
            <div className="row popup-gallery">
                {GalleryData.map((data, index)=>(
                    <div className="col-lg-4 co-md-6 col-sm-12 col-12" key={index}>
                    <div className="gallery_item">
                        <img src={data.img} alt="img" />
                        <div className="gallery_overlay">
                            <Link to="#!"><img src={data.icon} alt="icon" /></Link>
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

export default GalleryArea