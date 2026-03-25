import React from 'react'
// Import CommonBanner Area
import CommonBanner from '../component/Common/CommonBanner'
// Import NewsDetailsArea Area
import NewsDetailsArea from '../component/NewsDetails'


const NewsDetailsPage = () => {
  const [title, setTitle] = React.useState("News Details");
  return (
    <>
         <CommonBanner heading={title} pagination={title}/>
         <NewsDetailsArea onTitleFetch={setTitle}/>
    </>
  )
}

export default NewsDetailsPage