import React from 'react'
// import Sidebar
import Sidebar from './Sidebar'

const MakeDonationArea = () => {
  return (
    <>
        <section id="make_donation_area" className="section_padding">
        <div className="container">
            <div className="row">
                <div className="col-lg-6 offset-lg-3 col-md-12 col-sm-12 col-12">
                    <div className="section_heading">
                        <h3>Make a donation</h3>
                        <h2><span className="color_big_heading">Donate</span> now to help the <br/> people</h2>
                    </div>
                </div>
            </div>
            <div className="row" id="counter">
                <div className="col-lg-8">
                    <div className="details_wrapper_area">
                        <div className="donet_amount_area doner_content_pbottom">
                            <h3>Enter your donation amount</h3>
                            <div className="input_donet_amount">
                                <span>$</span>
                                <input type="number" />
                            </div>
                        </div>
                        <form action="#!" id="donet_amount_main_form">
                            <div className="donet_amount_form_area doner_content_pbottom">
                                <h3>Enter your donation amount</h3>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <input type="text" className="form-control" placeholder="Enter fast name*"
                                                required />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <input type="text" className="form-control" placeholder="Enter last name*"
                                                required />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <input type="email" className="form-control" placeholder="Enter email address"
                                                required />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <input type="text" className="form-control" placeholder="Enter phone number*"
                                                required />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <input type="text" className="form-control" placeholder="Enter address"
                                                required />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <select className="form-control">
                                                <option>Country</option>
                                                <option>Bangladesh</option>
                                                <option>India</option>
                                                <option>Pakistan</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="form-group">
                                            <textarea rows="7" className="form-control" placeholder="Write your comment"
                                                required></textarea>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="donet_amount_form_area doner_content_pbottom">
                                <h3>Enter your donation amount</h3>
                                <div className="payment_donet_area">
                                    <div className="payment_option_area">
                                        <ul>
                                            <li><img src="assets/img/icon/visa.png" alt="icon" /></li>
                                            <li><img src="assets/img/icon/skill.png" alt="icon" /></li>
                                            <li><img src="assets/img/icon/master.png" alt="icon" /></li>
                                            <li><img src="assets/img/icon/paypal.png" alt="icon" /></li>
                                        </ul>
                                    </div>
                                    <div className="payment_option_input">
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <div className="form-group">
                                                    <input type="text" className="form-control"
                                                        placeholder="Account holder name*" required />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="form-group">
                                                    <input type="text" className="form-control" placeholder="Card number*"
                                                        required />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="form-group">
                                                    <input type="text" className="form-control" placeholder="Expire date*"
                                                        required />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="form-group">
                                                    <input type="text" className="form-control" placeholder="CVV*"
                                                        required />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                            <div className="payment_amount_submit">
                                <button className="btn btn_theme btn_md">Donate now</button>
                            </div>
                        </form>
                    </div>
                </div>
                <Sidebar/>
            </div>
        </div>
    </section>
    </>
  )
}

export default MakeDonationArea