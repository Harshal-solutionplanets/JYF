import React from "react";
import { Routes, Route } from "react-router-dom";
// Import CopyRight Page
import CopyRight from "./layout/CopyRight";
// Import Footer Page
import Footer from "./layout/Footer";
// Import CtaArea Page
import CtaArea from "./layout/CtaArea";
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


const App = () => {
  return (
    <>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/event" element={<EventMainPage />} />
        <Route path="/event-details" element={<EventDetailsPage />} />
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
        <Route path="/faqs" element={<FaqsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-service" element={<TermsServicePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Error />} />
      </Routes>
    <CtaArea/>
    <Footer/>
    <CopyRight/>
   
    </>
   
  );
}

export default App;
