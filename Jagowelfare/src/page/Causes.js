import React from 'react'
// Import CommonBanner
import CommonBanner from '../component/Common/CommonBanner'
// import Causes Area
import CausesArea from '../component/Causes'


const Causes = () => {
  return (
    <>
        <CommonBanner heading="Causes" pagination="Causes"/>
        <CausesArea/>
    </>
  )
}

export default Causes