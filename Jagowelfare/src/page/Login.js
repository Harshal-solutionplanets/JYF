import React from 'react'
// Import CommonBanner Area
import CommonBanner from '../component/Common/CommonBanner'
// Import Login
import LoginArea from '../component/Login'

const LoginPage = () => {
  return (
    <>
        <CommonBanner heading="Login" pagination="Login"/>
        <LoginArea/>
    </>
  )
}

export default LoginPage