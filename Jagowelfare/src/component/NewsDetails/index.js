import React from "react";
import { Link } from "react-router-dom";
import NewsSidebar from "./Sidebar";
// Import BigImg
import BigImg from "../../assets/img/causes/details-big.png";
import causesImg from "../../assets/img/causes/details-small-1.png";
import causesImg1 from "../../assets/img/causes/details-small-2.png";
import PdfIcon from "../../assets/img/icon/pdf.png";
import PostImg from "../../assets/img/common/post-1.png";
import PostImg1 from "../../assets/img/common/post-2.png";
const NewsDetailsArea = () => {
  return (
    <>
      <section id="news_details_main" className="section_padding">
        <div className="container">
          <div className="row" id="counter">
            <div className="row" id="counter">
              <div className="col-lg-8">
                <div className="details_wrapper_area">
                  <div className="details_big_img">
                    <img src={BigImg} alt="img" />
                    <span className="causes_badge bg-yellow">Education</span>
                  </div>
                  <div className="details_text_wrapper">
                    <h2>Give children a good education and a better life</h2>
                    <p>
                      Lorem ipsum dolor sit amet, cibo mundi ea duo, vim exerci
                      phaedrum. There are many variations of passages of Lorem
                      Ipsum available but the majority.
                    </p>
                    <p>
                      If you are going to use a passage of Lorem Ipsum, you need
                      to be sure there isn't anything embarrang hidden in the
                      middle of text. All the Lorem Ipsum generators on the
                      Internet tend to repeat predefined chunks as necessary,
                      making this the first true.
                    </p>
                    <h3>We want to ensure the education for the kids.</h3>
                    <p>
                      Lorem ipsum dolor sit amet, cibo mundi ea duo, vim exerci
                      phaedrum. There are many variations of passages of Lorem
                      Ipsum available, but the majority have alteration in some
                      injected or words which don't look even slightly
                      believable.
                    </p>
                    <ul>
                      <li>
                        <i className="fas fa-circle"></i> Lorem ipsum dolor sit
                        amet, cibo mundi ea duo, vim exerci phaedrum.
                      </li>
                      <li>
                        <i className="fas fa-circle"></i> There are many variations
                        of passages of Lorem Ipsum.
                      </li>
                      <li>
                        <i className="fas fa-circle"></i> Available but the majority
                        have alteration in some injected or words.
                      </li>
                      <li>
                        <i className="fas fa-circle"></i> There are many variations
                        of passages of Lorem Ipsum which don't look even
                        slightly believable.
                      </li>
                    </ul>
                    <div className="row">
                      <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="details_small_img">
                          <img src={causesImg} alt="img" />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="details_small_img">
                          <img src={causesImg1} alt="img" />
                        </div>
                      </div>
                    </div>
                    <p>
                      Lorem ipsum dolor sit amet, cibo mundi ea duo, vim exerci
                      phaedrum. There are many variations of passages of Lorem
                      Ipsum available, but the majority have alteration in some
                      injected or words which don't look even slightly
                      believable.
                    </p>
                  </div>
                  <div className="download_pdf_area">
                    <div className="pdf_download_left">
                      <img src={PdfIcon} alt="icon" />
                      <h4>Children education manual .pdf</h4>
                    </div>
                    <div className="pdf_download_right">
                      <Link to="#!" className="btn btn_md btn_theme">
                        Download now
                      </Link>
                    </div>
                  </div>
                  <div className="comment_area_details">
                    <h3>2 Comments</h3>
                    <div className="post_comment_wrapper">
                      <div className="post_comment_item">
                        <div className="post_comment_img">
                          <img src={PostImg} alt="img" />
                        </div>
                        <div className="post_comment_text">
                          <div className="post_names_replay">
                            <h5>James martin</h5>
                            <a href="#!">
                              <i className="fas fa-reply"></i>Reply
                            </a>
                          </div>
                          <p>
                            Lorem ipsum dolor sit amet, cibo mundi ea duo, vim
                            exerci phaedrum. There are many variations of
                            passages of Lorem Ipsum available but the majority.
                          </p>
                        </div>
                      </div>
                      <div className="post_comment_item">
                        <div className="post_comment_img">
                          <img src={PostImg1} alt="img" />
                        </div>
                        <div className="post_comment_text">
                          <div className="post_names_replay">
                            <h5>James martin</h5>
                            <a href="#!">
                              <i className="fas fa-reply"></i>Reply
                            </a>
                          </div>
                          <p>
                            Lorem ipsum dolor sit amet, cibo mundi ea duo, vim
                            exerci phaedrum. There are many variations of
                            passages of Lorem Ipsum available but the majority.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="comment_form_area">
                    <h3>Leave a comment</h3>
                    <div className="comment_form">
                      <form action="#!" id="comment_form">
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="form-group">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Enter full name"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="form-group">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Enter email address"
                                required
                              />
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="form-group">
                              <textarea
                                rows="5"
                                placeholder="Write your comments"
                                className="form-control"
                                required
                              ></textarea>
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="submit_btn">
                              <button className="btn btn_theme btn_md">
                                Submit comment
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <NewsSidebar />
            </div>
            <div className="col-lg-4"></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NewsDetailsArea;
