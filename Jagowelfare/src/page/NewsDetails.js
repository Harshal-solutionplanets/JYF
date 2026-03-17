import React from 'react'
// Import CommonBanner Area
import CommonBanner from '../component/Common/CommonBanner'
// Import NewsDetailsArea Area
import NewsDetailsArea from '../component/NewsDetails'


const NewsDetailsPage = () => {
  return (
    <>
         <CommonBanner heading="News Details" pagination="News Details"/>
         <NewsDetailsArea/>
    </>
  )
}

export default NewsDetailsPage