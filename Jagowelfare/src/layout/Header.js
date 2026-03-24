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
                                    <li><Link to="#!"><i className="fab fa-facebook"></i></Link></li>
                                    <li><Link to="#!"><i className="fab fa-twitter-square"></i></Link></li>
                                    <li><Link to="#!"><i className="fab fa-instagram"></i></Link></li>
                                    <li><Link to="#!"><i className="fab fa-linkedin"></i></Link></li>
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
                                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 text-start">
                                        {HeaderData.map((data, index) => (
                                            <li className="nav-item dropdown" key={index}>
                                                <Link 
                                                    to={data.link} 
                                                    className={`nav-link ${data.submenu ? 'dropdown-toggle' : ''}`}
                                                    onClick={() => !data.submenu && setIsMenuOpen(false)}
                                                >
                                                    {data.menu}
                                                </Link>
                                                {data.submenu && (
                                                    <ul className="dropdown-menu border-0 shadow-sm">
                                                        {data.subMenuitem
                                                            .filter(sub => sub.subItem !== "Scanner")
                                                            .map((data1, index1) => (
                                                                <li key={index1}>
                                                                    <Link 
                                                                        to={data1.linkL} 
                                                                        className="dropdown-item py-2"
                                                                        onClick={() => setIsMenuOpen(false)}
                                                                    >
                                                                        {data1.subItem}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}

                                        {user && (
                                            <li className="nav-item mt-2 mt-lg-0">
                                                <button
                                                    type="button"
                                                    className="btn btn_theme btn_sm w-100"
                                                    onClick={() => {
                                                        supabase.auth.signOut().then(() => {
                                                            window.location.href = "/";
                                                        });
                                                    }}
                                                >
                                                    Logout
                                                </button>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>

            <style>{`
                .navbar-collapse.show {
                    background: #fff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    margin-top: 10px;
                }
                .nav-link { font-weight: 500; font-size: 16px; color: #333 !important; }
                .nav-item { padding: 5px 0; }
                @media (max-width: 991px) {
                    .navbar-collapse {
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        z-index: 1000;
                        width: 100%;
                    }
                }
            `}</style>
        </>
    );
};

export default Header;
