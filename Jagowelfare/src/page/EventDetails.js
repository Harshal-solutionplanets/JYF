import React from 'react'
// Import CommonBanner Area
import CommonBanner from '../component/Common/CommonBanner'
// import Events Details
import EventDetailsArea from '../component/EventDetails'

const EventDetailsPage = () => {
  const [title, setTitle] = React.useState("Event Details");
  return (
    <>
      <CommonBanner heading={title} pagination={title}/>
      <EventDetailsArea onTitleFetch={setTitle}/>
    </>
  )
}

export default EventDetailsPage