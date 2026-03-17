import React from 'react'
// Import CommonBanner
import CommonBanner from '../component/Common/CommonBanner'
// import ContactArea
import ContactArea from '../component/Contact'

const ContactPage = () => {
  return (
    <>
        <CommonBanner heading="Contact" pagination="Contact"/>
        <ContactArea/>
    </>
  )
}

export default ContactPage