import React from 'react'
// Import CommonBanner Area
import CommonBanner from '../component/Common/CommonBanner'
// import MakeDonationArea
import MakeDonationArea from '../component/MakeDonation'


const MakeDonationPage = () => {
  return (
    <>
      <CommonBanner heading="Make a donation" pagination="Make a donation"/>
      <MakeDonationArea/>
    </>
  )
}

export default MakeDonationPage