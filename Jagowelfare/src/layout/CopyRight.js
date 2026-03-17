import React from "react";
// import Link
import { Link } from "react-router-dom";

const CopyRight = () => {
  return (
    <>
       <div className="copyright_area">
        <div className="container">
            <div className="row align-items-center">
                <div className="co-lg-6 col-md-6 col-sm-12 col-12">
                    <div className="copyright_left">
                        <p>Copyright © 2024 All Rights Reserved</p>
                    </div>
                </div>
                <div className="co-lg-6 col-md-6 col-sm-12 col-12">
                    <div className="copyright_right">
                        <ul>
                            <li>
                                <Link to="#!"><i className="fab fa-facebook"></i></Link>
                            </li>
                            <li>
                                <Link to="#!"><i className="fab fa-twitter-square"></i></Link>
                            </li>
                            <li>
                                <Link to="#!"><i className="fab fa-instagram"></i></Link>
                            </li>
                            <li>
                                <Link to="#!"><i className="fab fa-linkedin"></i></Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
  );
};

export default CopyRight;
