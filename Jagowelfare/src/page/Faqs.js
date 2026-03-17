import React from 'react'
// Import CommonBanner Area
import CommonBanner from '../component/Common/CommonBanner'
// import Faqs
import FaqsArea from '../component/Faqs'

const FaqsPage = () => {
  return (
    <>
        <CommonBanner heading="Faqs" pagination="Faqs"/>
        <FaqsArea/>
    </>
  )
}

export default FaqsPage