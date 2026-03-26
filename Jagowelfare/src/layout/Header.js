import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from ".././assets/img/logo.jpeg";
import { HeaderData } from "./HeaderData";
import { useAuth } from "../auth/AuthProvider";
import { supabase } from "../supabase";

const Header = () => {
    const { user, isStaff } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <header className="main_header_arae">
                <div className="topbar-area d-none d-lg-block">
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
                                    <li><Link to="https://www.facebook.com/groups/jyf.mulund/" target="_blank"><i className="fab fa-facebook"></i></Link></li>
                                    <li><Link to="https://x.com/jyf_india" target="_blank"><i className="fab fa-x-twitter"></i></Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="navbar-area sticky-top">
                    <div className="container">
                        <nav className="navbar navbar-expand-lg navbar-light py-2">
                            <div className="container-fluid px-0">
                                <Link className="navbar-brand" to="/">
                                    <img src={logo} alt="logo" style={{ maxWidth: "100px", height: "auto" }} />
                                </Link>

                                <button
                                    className="navbar-toggler border-0 shadow-none ps-0"
                                    type="button"
                                    onClick={toggleMenu}
                                    style={{ color: "#ca1e14" }}
                                >
                                    <i className={isMenuOpen ? "fas fa-times fa-lg" : "fas fa-bars fa-lg"}></i>
                                </button>

                                <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarSupportedContent">
                                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0 text-center">
                                        {HeaderData.map((data, index) => (
                                            <li className="nav-item dropdown px-lg-2" key={index}>
                                                <Link
                                                    to={data.link}
                                                    className={`nav-link ${data.submenu ? 'dropdown-toggle' : ''}`}
                                                    onClick={() => !data.submenu && setIsMenuOpen(false)}
                                                    style={{ 
                                                        fontWeight: "600", 
                                                        fontSize: "15px", 
                                                        color: "var(--black-color) !important",
                                                        textTransform: "uppercase",
                                                        letterSpacing: "0.5px"
                                                    }}
                                                >
                                                    {data.menu}
                                                </Link>
                                                {data.submenu && (
                                                    <ul className="dropdown-menu border-0 shadow-lg mt-0">
                                                        {data.subMenuitem
                                                            .filter(sub => sub.subItem !== "Scanner")
                                                            .map((data1, index1) => (
                                                                <li key={index1}>
                                                                    <Link
                                                                        to={data1.linkL}
                                                                        className="dropdown-item py-2 px-4"
                                                                        onClick={() => setIsMenuOpen(false)}
                                                                        style={{ fontWeight: "500", fontSize: "14px" }}
                                                                    >
                                                                        {data1.subItem}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>

            <style>{`
                .main_header_arae {
                    background: #fff;
                    box-shadow: 0 5px 25px rgba(0,0,0,0.05);
                }
                .nav-link { 
                    padding: 25px 15px !important;
                    transition: 0.3s;
                }
                .nav-link:hover {
                    color: var(--main-color) !important;
                }
                .dropdown-menu {
                    border-radius: 0 0 10px 10px;
                    border-top: 3px solid var(--main-color) !important;
                }
                .dropdown-item:hover {
                    background: var(--main-color);
                    color: #fff;
                }
                @media (max-width: 991px) {
                    .navbar-collapse {
                        background: #fff;
                        padding: 20px;
                        border-radius: 10px;
                        margin-top: 15px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    }
                    .nav-link { padding: 10px 0 !important; }
                }
            `}</style>
        </>
    );
};

export default Header;
