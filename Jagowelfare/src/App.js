import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// Import CopyRight Page
import CopyRight from "./layout/CopyRight";
// Import Footer Page
import Footer from "./layout/Footer";
// import CtaArea from "./layout/CtaArea";
// Import Header Page
import Header from "./layout/Header";
// Import Home Page
import Home from "./page/Home";
import About from "./page/About";
import EventMainPage from "./page/Event";
import EventDetailsPage from "./page/EventDetails";
import MakeDonationPage from "./page/MakeDonation";
import BlogMainPage from "./page/Blog";
import Causes from "./page/Causes";
import CausesDetsils from "./page/CausesDetsils";
import GalleryPage from "./page/Gallery";
import NewsPage from "./page/News";
import NewsDetailsPage from "./page/NewsDetails";
import TestimonialPage from "./page/Testimonial";
import TeamPage from "./page/Team";
import LoginPage from "./page/Login";
import RegisterPage from "./page/Register";
import FaqsPage from "./page/Faqs";
import PrivacyPolicy from "./page/PrivacyPolicy";
import TermsServicePage from "./page/TermsService";
import ContactPage from "./page/Contact";
import Error from "./page/Error";
import MyTicketsPage from "./page/MyTickets";
import RequireStaff from "./page/admin/RequireStaff";
import AdminScanPage from "./page/admin/AdminScan";
import AdminDashboardPage from "./page/admin/AdminDashboard";
import AdminEventsPage from "./page/admin/AdminEvents";
import HealthcarePage from "./page/Healthcare";
import FoodSupportPage from "./page/FoodSupport";
import EducationPage from "./page/Education";
import HumanitarianServicesPage from "./page/HumanitarianServices";
import AdminLoginPage from "./page/admin/AdminLogin";
import EventRegistrationPage from "./page/EventRegistration";
import QRScannerPage from "./page/QRScannerPage";



const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Header/>}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/event" element={<EventMainPage />} />
        <Route path="/event/:eventId" element={<EventDetailsPage />} />
        <Route path="/event-registration/:eventId" element={<EventRegistrationPage />} />
        <Route path="/check-in" element={<RequireStaff><QRScannerPage /></RequireStaff>} />
        <Route path="/event-details" element={<Navigate to="/event" replace />} />

        <Route path="/make-donation" element={<MakeDonationPage />} />
        <Route path="/blog" element={<BlogMainPage />} />
        <Route path="/causes" element={<Causes />} />
        <Route path="/cause-details" element={<CausesDetsils />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news-details" element={<NewsDetailsPage />} />
        <Route path="/testimonial" element={<TestimonialPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/my-tickets" element={<MyTicketsPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <RequireStaff>
              <Navigate to="/admin/dashboard" replace />
            </RequireStaff>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <RequireStaff>
              <AdminDashboardPage />
            </RequireStaff>
          }
        />
        <Route
          path="/admin/events"
          element={
            <RequireStaff>
              <AdminEventsPage />
            </RequireStaff>
          }
        />
        <Route
          path="/admin/scan"
          element={
            <RequireStaff>
              <AdminScanPage />
            </RequireStaff>
          }
        />
        <Route path="/faqs" element={<FaqsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-service" element={<TermsServicePage />} />
        <Route path="/healthcare" element={<HealthcarePage />} />
        <Route path="/food-support" element={<FoodSupportPage />} />
        <Route path="/education" element={<EducationPage />} />
        <Route path="/humanitarian-services" element={<HumanitarianServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Error />} />
      </Routes>
      {!isAdminRoute && (
        <>
          <Footer/>

          <CopyRight/>
        </>
      )}
    </>
   
  );
}

export default App;
