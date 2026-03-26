import React from 'react'
// Import CommonBanner Area
import CommonBanner from '../component/Common/CommonBanner'
// import Testmonials
import Testimonials from '../component/About/Testimonials'

const TestimonialPage = () => {
  return (
    <>
     <CommonBanner heading="Testimonials" pagination="Testimonials"/>
     <Testimonials/>
    </>
  )
}

export default TestimonialPage