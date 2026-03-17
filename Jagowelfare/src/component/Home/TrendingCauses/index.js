import React from "react";
// Import Link
import { Link } from "react-router-dom";
import { TrendingData } from "./data";

const TrendingCauses = () => {
  return (
    <>
      <section
        id="trending_causes"
        className="section_after section_padding bg-color"
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3 col-md-12 col-sm-12 col-12">
              <div className="section_heading">
                <h3>Trending causes</h3>
                <h2>
                  We are always where other people
                  <span className="color_big_heading">need</span> help
                </h2>
              </div>
            </div>
          </div>
          <div className="row">
            {TrendingData.map((data, index) => (
              <div className="col-lg-4 col-md-12 col-sm-12 col-12" key={index}>
                <div className="case_boxed_wrapper">
                  <div className="case_boxed_img">
                    <Link to="/causes">
                      <img src={data.img} alt="img" />
                    </Link>
                    <span className="causes_badge bg-theme">
                      {data.category}
                    </span>
                  </div>
                  <div className="causes_boxed_text">
                    <div className="class-full causes_pro_bar progress_bar">
                      <div className="class-full-bar-box">
                        <h3 className="h3-title">
                          Goal: <span>{data.goal}</span>
                        </h3>
                        <div className="class-full-bar-percent">
                          <h2>
                            <span className="counting-data" data-count="85">
                              75
                            </span>
                            <span>%</span>
                          </h2>
                        </div>
                      </div>
                    </div>
                    <h3>
                      <Link to="/causes">{data.heading}</Link>
                    </h3>
                    <p>{data.para}</p>
                    <div className="causes_boxed_bottom_wrapper">
                      <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                          <div className="casuses_bottom_boxed">
                            <div className="casuses_bottom_icon">
                              <img src={data.DateIcon} alt="icon" />
                            </div>
                            <div className="casuses_bottom_content">
                              <h5>Date:</h5>
                              <p>20 Dec, 2021</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                          <div className="casuses_bottom_boxed casuses_left_padding">
                            <div className="casuses_bottom_icon">
                              <img src={data.IconAdmin} alt="icon" />
                            </div>
                            <div className="casuses_bottom_content">
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
  );
};

export default TrendingCauses;
