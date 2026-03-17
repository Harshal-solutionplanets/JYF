import React from 'react'
// Import CommonBanner Area
import CommonBanner from '../component/Common/CommonBanner'
// Import CommonBanner Area
import TermsService from '../component/TermsService'

const TermsServicePage = () => {
  return (
    <>
      <CommonBanner heading="Terms Of Service" pagination="Terms Of Service"/>
      <TermsService/>
    </>
  )
}
export default TermsServicePage
