import React from 'react'
// Import CommonBanner Area
import CommonBanner from '../component/Common/CommonBanner'
// Import Gallery
import GalleryArea from '../component/Gallery'

const GalleryPage = () => {
  return (
    <>
      <CommonBanner heading="Gallery" pagination="Gallery"/>
      <GalleryArea/>
    </>
  )
}

export default GalleryPage