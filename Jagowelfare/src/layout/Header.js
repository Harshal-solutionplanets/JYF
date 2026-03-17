import React from "react";
import { Link } from "react-router-dom";
import logo from ".././assets/img/logo.png";
import SearchIcon from ".././assets/img/icon/search_icon.png";
// import logoBlack from ".././assets/img/logo_black.png";
import { HeaderData } from "./HeaderData";

const Header = () => {
  return (
    <>
       <header className="main_header_arae">
        {/* <!-- Top Bar --> */}
        <div className="topbar-area">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6 col-md-6">
                        <ul className="topbar-list">

                            <li><Link to="#!"><i className="fa fa-envelope"></i><span>contact@domain.com</span></Link>
                            </li>
                            <li><Link to="#!"><i className="fa fa-phone"></i><span>+011 234 567 89</span></Link></li>
                            <li><Link to="#!"><span>Faqs</span></Link></li>
                        </ul>
                    </div>
                    <div className="col-lg-6 col-md-6">
                        <ul className="topbar-list-right">
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
        {/* <!-- Navbar Bar --> */}
        <div className="navbar-area">
            <div className="main-responsive-nav">
                <div className="container">
                    <div className="main-responsive-menu">
                        <div className="logo">
                            <Link to="/">
                                <img src={logo} alt="logo" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="main-navbar">
                <div className="container">
                    <nav className="navbar navbar-expand-md navbar-light">
                        <Link className="navbar-brand" to="/">
                            <img src={logo} alt="logo" />
                        </Link>
                        <div className="collapse navbar-collapse mean-menu" id="navbarSupportedContent">
                            <ul className="navbar-nav">
                            {HeaderData.map((data, index)=>(
                                <li className="nav-item" key={index}>
                                    <Link to={data.link} className="nav-link">
                                        {data.menu} {data.submenu && (  <i className="fas fa-angle-down"></i> )}
                                    </Link>
                                    {data.submenu && (
                                        <ul className="dropdown-menu">
                                            {data.subMenuitem.map((data1, index1)=>(
                                                <li className="nav-item" key={index1}>
                                                <Link to={data1.linkL} className="nav-link">{data1.subItem}</Link>
                                            </li>
                                            ))}
                                        
                                    </ul> 
                                    ) }
                                </li>
                            ))}
                               
                            </ul>
                            <div className="others-options d-flex align-items-center">
                                <div className="option-item">
                                    <Link to="#!" className="search-box"> <img src={SearchIcon}
                                            alt="icon" /></Link>
                                </div>
                                <div className="option-item">
                                    <Link to="/make-donation" className="btn btn_navber">Donate now</Link>
                                </div>
                            </div>
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
                            <div className="option-item">
                                    <Link to="#!" className="search-box"> <img src={SearchIcon}
                                            alt="icon" /></Link>
                                </div>
                                <div className="option-item">
                                    <Link to="/make-donation" className="btn btn_navber">Donate now</Link>
                                </div>
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
