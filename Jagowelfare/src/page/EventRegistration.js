import React from "react";
import CommonBanner from "../component/Common/CommonBanner";
import EventRegistrationArea from "../component/EventRegistration";

const EventRegistrationPage = () => {
  return (
    <>
      <CommonBanner heading="Event Registration" pagination="Event Registration" />
      <EventRegistrationArea />
    </>
  );
};

export default EventRegistrationPage;
