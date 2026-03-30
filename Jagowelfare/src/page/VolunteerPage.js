import React from 'react'
import CommonBanner from '../component/Common/CommonBanner'
import VolunteerArea from '../component/Volunteer/VolunteerArea'

const VolunteerPage = () => {
  return (
    <>
     <CommonBanner heading="Volunteer Team" pagination="Volunteer"/>
     <VolunteerArea/>
    </>
  )
}

export default VolunteerPage
