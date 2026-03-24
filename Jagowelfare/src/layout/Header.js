import React from "react";
import { Link } from "react-router-dom";
import logo from ".././assets/img/logo.jpeg";
import { HeaderData } from "./HeaderData";
import { useAuth } from "../auth/AuthProvider";
import { supabase } from "../supabase";

const Header = () => {
    const { user, isStaff } = useAuth();
    return (
        <>
            <header className="main_header_arae">
                <div className="topbar-area">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 col-md-6">
                                <ul className="topbar-list">
                                    <li><Link to="#!"><i className="fa fa-envelope"></i><span>contact@domain.com</span></Link></li>
                                    <li><Link to="#!"><i className="fa fa-phone"></i><span>+011 234 567 89</span></Link></li>
                                    <li><Link to="#!"><span>Faqs</span></Link></li>
                                </ul>
                            </div>
                            <div className="col-lg-6 col-md-6">
                                <ul className="topbar-list-right">
                                    <li><Link to="#!"><i className="fab fa-facebook"></i></Link></li>
                                    <li><Link to="#!"><i className="fab fa-twitter-square"></i></Link></li>
                                    <li><Link to="#!"><i className="fab fa-instagram"></i></Link></li>
                                    <li><Link to="#!"><i className="fab fa-linkedin"></i></Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="navbar-area">
                    <div className="main-responsive-nav">
                        <div className="container">
                            <div className="main-responsive-menu">
                                <div className="logo">
                                    <Link to="/">
                                        <img src={logo} alt="logo" style={{ maxWidth: "120px", height: "auto", marginLeft: "-10px" }} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="main-navbar">
                        <div className="container">
                            <nav className="navbar navbar-expand-md navbar-light">
                                <Link className="navbar-brand" to="/">
                                    <img src={logo} alt="logo" style={{ maxWidth: "120px", height: "auto", marginLeft: "-10px" }} />
                                </Link>

                                <div className="collapse navbar-collapse mean-menu" id="navbarSupportedContent" style={{ justifyContent: "flex-end" }}>
                                    <ul className="navbar-nav ms-auto">
                                        {HeaderData.map((data, index) => (
                                            <li className="nav-item" key={index}>
                                                <Link to={data.link} className="nav-link">
                                                    {data.menu} {data.submenu && (<i className="fas fa-angle-down"></i>)}
                                                </Link>
                                                {data.submenu && (
                                                    <ul className="dropdown-menu">
                                                        {data.subMenuitem
                                                            .filter(sub => sub.subItem !== "Scanner")
                                                            .map((data1, index1) => (
                                                                <li className="nav-item" key={index1}>
                                                                    <Link to={data1.linkL} className="nav-link">{data1.subItem}</Link>
                                                                </li>
                                                            ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}

                                        {isStaff && (
                                            <li className="nav-item">
                                                {/* Button removed from here, kept in dropdown */}
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </nav>
                        </div>
                    </div>

                    <div className="others-option-for-responsive">
                        <div className="container">
                            <div className="dot-menu">
                                <div className="inner">
                                    <div className="circle circle-one"></div>
                                    <div className="circle circle-two"></div>
                                    <div className="circle circle-three"></div>
                                </div>
                            </div>
                            <div className="container">
                                <div className="option-inner">
                                    <div className="others-options d-flex align-items-center">
                                        {user ? (
                                            <div className="option-item">
                                                <button
                                                    type="button"
                                                    className="btn btn_navber"
                                                    onClick={() => {
                                                        supabase.auth.signOut().then(() => {
                                                            window.location.href = "/";
                                                        });
                                                    }}
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
