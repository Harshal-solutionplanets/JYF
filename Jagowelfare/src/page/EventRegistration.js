import React from "react";
import CommonBanner from "../component/Common/CommonBanner";
import EventRegistrationArea from "../component/EventRegistration";

const EventRegistrationPage = () => {
  const [title, setTitle] = React.useState("Event Registration");
  return (
    <>
      <CommonBanner heading={title} pagination={title} />
      <EventRegistrationArea onTitleFetch={setTitle} />
    </>
  );
};

export default EventRegistrationPage;
