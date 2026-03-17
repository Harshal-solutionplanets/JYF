import React from 'react'
// import Link
import { Link } from 'react-router-dom'

const LoginArea = () => {
  return (
    <>
     <section id="login_arae" className="section_padding">
        <div className="container">
            <div className="row">
                <div className="col-lg-6 offset-lg-3 col-md-12 col-sm-12 col-12">
                    <div className="section_heading">
                        <h3>Login your account</h3>
                        <h2>Join our
                            <span className="color_big_heading">community</span>
                            to help peoples
                        </h2>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-6 offset-lg-3">
                    <div className="author_form_area">
                        <form action="#!" id="author_form">
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Enter user name" required />
                            </div>
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Enter password" required />
                            </div>
                            <div className="author_submit_form">
                                <button className="btn btn_theme btn_md">Login</button>
                                <p>Dont have an account? <Link to="/register">Register now</Link></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </>
  )
}

export default LoginArea