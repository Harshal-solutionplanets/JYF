import React from 'react'
// Import CommonBanner Area
import CommonBanner from '../component/Common/CommonBanner'
// Import About Area
import AboutArea from '../component/About'

const About = () => {
  return (
    <>
    <CommonBanner heading="About" pagination="About"/>
    <AboutArea/>
    </>
  )
}

export default About