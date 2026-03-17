import React from 'react'
// Import CommonBanner
import CommonBanner from '../component/Common/CommonBanner'
// Import Error Area
import ErrorArea from '../component/Error'

const Error = () => {
  return (
    <>
        <CommonBanner heading="404 Error" pagination="404 Error"/>
        <ErrorArea/>
    </>
  )
}

export default Error