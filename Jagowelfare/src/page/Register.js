import React from 'react'
// Import CommonBanner Area
import CommonBanner from '../component/Common/CommonBanner'
// Import Register Area
import RegisterArea from '../component/Register'


const RegisterPage = () => {
  return (
    <>
     <CommonBanner heading="News Details" pagination="News Details"/>
     <RegisterArea/>
    </>
  )
}

export default RegisterPage