import React from 'react'
// Import CommonBanner Area
import CommonBanner from '../component/Common/CommonBanner'
// Import News
import NewsArea from '../component/News'

const NewsPage = () => {
  return (
    <>
        <CommonBanner heading="News" pagination="News"/>
        <NewsArea/>
    </>
  )
}

export default NewsPage