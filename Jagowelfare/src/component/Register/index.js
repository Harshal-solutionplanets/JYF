import React from 'react'

const RegisterArea = () => {
  return (
    <>
     <section id="login_arae" class="section_padding">
        <div class="container">
            <div class="row">
                <div class="col-lg-6 offset-lg-3 col-md-12 col-sm-12 col-12">
                    <div class="section_heading">
                        <h3>Register your account</h3>
                        <h2>Become a
                            <span class="color_big_heading">member</span>
                            and enhance your hand
                        </h2>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-6 offset-lg-3">
                    <div class="author_form_area">
                        <form action="#!" id="author_form">
                            <div class="form-group">
                                <input type="text" class="form-control" placeholder="Enter full name" required />
                            </div>
                            <div class="form-group">
                                <input type="text" class="form-control" placeholder="Enter email" required />
                            </div>
                            <div class="form-group">
                                <input type="text" class="form-control" placeholder="Enter mobile number" required />
                            </div>
                            <div class="form-group">
                                <input type="text" class="form-control" placeholder="Enter password" required />
                            </div>
                            <div class="author_submit_form">
                                <button class="btn btn_theme btn_md">Register</button>
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

export default RegisterArea