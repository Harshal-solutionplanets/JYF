import React from 'react'
// import Link
import { Link } from 'react-router-dom'
// import Sidebar
import SideBar from './SideBar'
// Import BigImg
import BigImg from "../../assets/img/causes/details-big.png"
import causesImg from "../../assets/img/causes/details-small-1.png"
import causesImg1 from "../../assets/img/causes/details-small-2.png"
import PdfIcon from "../../assets/img/icon/pdf.png"
import PostImg from "../../assets/img/common/post-1.png"
import PostImg1 from "../../assets/img/common/post-2.png"

const CausesDetailsArea = () => {

  return (
    <>
          <section id="trending_causes_main" class="section_padding">
        <div class="container">
            <div class="row" id="counter">
                <div class="col-lg-8">
                    <div class="details_wrapper_area">
                        <div class="details_big_img">
                            <img src={BigImg} alt="img" />
                            <span class="causes_badge bg-yellow">Education</span>
                        </div>
                        <div class="details_text_wrapper">
                            <h2>Give children a good education and
                                a better life</h2>
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
                        <div class="download_pdf_area">
                            <div class="pdf_download_left">
                                <img src={PdfIcon} alt="icon" />
                                <h4>Children education manual .pdf</h4>
                            </div>
                            <div class="pdf_download_right">
                                <Link to="#!" class="btn btn_md btn_theme">Download now</Link>
                            </div>
                        </div>
                        <div class="comment_area_details">
                            <h3>2 Comments</h3>
                            <div class="post_comment_wrapper">
                                <div class="post_comment_item">
                                    <div class="post_comment_img">
                                        <img src={PostImg} alt="img" />
                                    </div>
                                    <div class="post_comment_text">
                                        <div class="post_names_replay">
                                            <h5>James martin</h5>
                                            <a href="#!"><i class="fas fa-reply"></i>Reply</a>
                                        </div>
                                        <p>Lorem ipsum dolor sit amet, cibo mundi ea duo, vim exerci phaedrum. There are
                                            many variations of passages of Lorem Ipsum available but the majority.</p>
                                    </div>
                                </div>
                                <div class="post_comment_item">
                                    <div class="post_comment_img">
                                        <img src={PostImg1} alt="img" />
                                    </div>
                                    <div class="post_comment_text">
                                        <div class="post_names_replay">
                                            <h5>James martin</h5>
                                            <a href="#!"><i class="fas fa-reply"></i>Reply</a>
                                        </div>
                                        <p>Lorem ipsum dolor sit amet, cibo mundi ea duo, vim exerci phaedrum. There are
                                            many variations of passages of Lorem Ipsum available but the majority.</p>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div class="comment_form_area">
                            <h3>Leave a comment</h3>
                            <div class="comment_form">
                                <form action="#!" id="comment_form">
                                    <div class="row">
                                        <div class="col-lg-6">
                                            <div class="form-group">
                                                <input type="text" class="form-control" placeholder="Enter full name"
                                                    required />
                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="form-group">
                                                <input type="text" class="form-control"
                                                    placeholder="Enter email address" required />
                                            </div>
                                        </div>
                                        <div class="col-lg-12">
                                            <div class="form-group">
                                                <textarea rows="5" placeholder="Write your comments"
                                                    class="form-control" required></textarea>
                                            </div>
                                        </div>
                                        <div class="col-lg-12">
                                            <div class="submit_btn">
                                                <button class="btn btn_theme btn_md">Submit comment</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
               <SideBar/>
            </div>
        </div>
    </section>
    </>
  )
}

export default CausesDetailsArea