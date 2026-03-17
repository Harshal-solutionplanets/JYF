import React from 'react'
// Import CommonBanner Area
import CommonBanner from '../component/Common/CommonBanner'
// import Events Details
import EventDetailsArea from '../component/EventDetails'

const EventDetailsPage = () => {
  return (
    <>
      <CommonBanner heading="Event details" pagination="Event details"/>
      <EventDetailsArea/>
    </>
  )
}

export default EventDetailsPage