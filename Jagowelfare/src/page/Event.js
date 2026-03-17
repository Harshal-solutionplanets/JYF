import React from 'react'
// Import CommonBanner Area
import CommonBanner from '../component/Common/CommonBanner'
// import Events
import EventAreaPage from '../component/Event'

const EventMainPage = () => {
  return (
    <>
       <CommonBanner heading="Events" pagination="Events"/>
      <EventAreaPage padding={true}/>
    </>
  )
}

export default EventMainPage