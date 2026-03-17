import React from 'react'
// Import CommonBanner Area
import CommonBanner from '../component/Common/CommonBanner'
// Import Register Area
import RegisterArea from '../component/Register'


const RegisterPage = () => {
  return (
    <>
     <CommonBanner heading="Register" pagination="Register"/>
     <RegisterArea/>
    </>
  )
}

export default RegisterPage