import React from "react";
import { Link } from "react-router-dom";
import CommonBanner from "../../component/Common/CommonBanner";

const AdminDashboardPage = () => {
  return (
    <>
      <CommonBanner heading="Admin Dashboard" pagination="Admin Dashboard" />
      <section id="admin_dashboard" className="section_padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="about_top_boxed bg_one">
                <div className="about_top_boxed_icon">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <div className="about_top_boxed_text">
                  <h3>Manage Events</h3>
                  <p>Create, update, and manage your organization events.</p>
                  <Link to="/admin/events" className="btn btn_theme btn_md mt-3">Go to Events</Link>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="about_top_boxed bg_two">
                <div className="about_top_boxed_icon">
                  <i className="fas fa-qrcode"></i>
                </div>
                <div className="about_top_boxed_text">
                  <h3>QR Scanner</h3>
                  <p>Scan and validate tickets for ongoing events.</p>
                  <Link to="/admin/scan" className="btn btn_theme btn_md mt-3">Start Scanning</Link>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="about_top_boxed bg_three">
                <div className="about_top_boxed_icon">
                  <i className="fas fa-users-cog"></i>
                </div>
                <div className="about_top_boxed_text">
                  <h3>Settings</h3>
                  <p>General administrative settings and user management.</p>
                  <Link to="#!" className="btn btn_theme btn_md mt-3">Coming Soon</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminDashboardPage;
