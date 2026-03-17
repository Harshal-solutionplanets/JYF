import React from 'react'
// Import Sidebar
import EventDetailSidebar from './Sidebar'
// Import BigImg
import BigImg from "../../assets/img/causes/details-big.png"
import causesImg from "../../assets/img/causes/details-small-1.png"
import causesImg1 from "../../assets/img/causes/details-small-2.png"





const EventDetailsArea = () => {

  return (
    <>
          <section id="trending_causes_main" class="section_padding">
        <div class="container">
            <div class="row" id="counter">
                <div class="col-lg-8">
                    <div class="details_wrapper_area">
                        <div class="details_big_img">
                            <img src={BigImg} alt="img" />
                        </div>
                        <div class="details_text_wrapper">
                            <a href="events.html" class="tags_noted">#FoodCamp</a>
                            <h2>Healthy food and nutritions awreness campaign december</h2>
                            <p>
                                Lorem ipsum dolor sit amet, cibo mundi ea duo, vim exerci phaedrum. There are many
                                variations of passages of Lorem Ipsum available but the majority.
                            </p>
                            <p>
                                If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't
                                anything embarrang hidden in the middle of text. All the Lorem Ipsum generators on the
                                Internet tend to repeat predefined chunks as necessary, making this the first true.
                            </p>
                            <h3>We want to ensure the education for the kids.</h3>
                            <p>
                                Lorem ipsum dolor sit amet, cibo mundi ea duo, vim exerci phaedrum. There are many
                                variations of passages of Lorem Ipsum available, but the majority have alteration in
                                some injected or words which don't look even slightly believable.
                            </p>
                            <ul>
                                <li><i class="fas fa-circle"></i> Lorem ipsum dolor sit amet, cibo mundi ea duo, vim
                                    exerci phaedrum.</li>
                                <li><i class="fas fa-circle"></i> There are many variations of passages of Lorem Ipsum.
                                </li>
                                <li><i class="fas fa-circle"></i> Available but the majority have alteration in some
                                    injected or words.</li>
                                <li><i class="fas fa-circle"></i> There are many variations of passages of Lorem Ipsum
                                    which don't look even slightly
                                    believable.</li>
                            </ul>
                            <div class="row">
                                <div class="col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div class="details_small_img">
                                        <img src={causesImg} alt="img" />
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div class="details_small_img">
                                        <img src={causesImg1} alt="img" />
                                    </div>
                                </div>
                            </div>
                            <p>
                                Lorem ipsum dolor sit amet, cibo mundi ea duo, vim exerci phaedrum. There are many
                                variations of passages of Lorem Ipsum available, but the majority have alteration in
                                some injected or words which don't look even slightly believable.
                            </p>
                        </div>
                    </div>
                </div>
               <EventDetailSidebar/>
            </div>
        </div>
    </section>
    </>
  )
}

export default EventDetailsArea