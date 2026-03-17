import React from 'react'
// Import CommonBanner
import CommonBanner from '../component/Common/CommonBanner'
// Import Cause details 
import CausesDetailsArea from '../component/CausesDetails'

const CausesDetsils = () => {
  return (
    <>
        <CommonBanner heading="Cause details" pagination="Cause details"/>
        <CausesDetailsArea/>
    </>
  )
}

export default CausesDetsils