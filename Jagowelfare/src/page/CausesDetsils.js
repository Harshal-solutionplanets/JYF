import React from 'react'
// Import CommonBanner
import CommonBanner from '../component/Common/CommonBanner'
// Import Cause details 
import CausesDetailsArea from '../component/CausesDetails'

const CausesDetsils = () => {
  const [title, setTitle] = React.useState("Cause details");
  return (
    <>
        <CommonBanner heading={title} pagination={title}/>
        <CausesDetailsArea onTitleFetch={setTitle}/>
    </>
  )
}

export default CausesDetsils