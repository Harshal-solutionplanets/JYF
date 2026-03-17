import React from 'react'
// Import CommonBanner Area
import CommonBanner from '../component/Common/CommonBanner'
// import Privacy Policy 
import PrivacyPolicyArea from '../component/PrivacyPolicy'

const PrivacyPolicy = () => {
  return (
    <>
      <CommonBanner heading="Privacy Policy" pagination="Privacy Policy"/>
      <PrivacyPolicyArea/>
    </>
  )
}

export default PrivacyPolicy