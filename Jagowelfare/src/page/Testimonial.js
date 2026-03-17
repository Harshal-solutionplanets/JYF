import React from 'react'
// Import CommonBanner Area
import CommonBanner from '../component/Common/CommonBanner'
// import Testmonials
import Testimonials from '../component/About/Testimonials'

const TestimonialPage = () => {
  return (
    <>
     <CommonBanner heading="Testmonials" pagination="Testmonials"/>
     <Testimonials/>
    </>
  )
}

export default TestimonialPage