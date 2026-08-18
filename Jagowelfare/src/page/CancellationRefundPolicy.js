import React from 'react'
import CommonBanner from '../component/Common/CommonBanner'
import CancellationRefundPolicyArea from '../component/CancellationRefundPolicy'

const CancellationRefundPolicy = () => {
  return (
    <>
      <CommonBanner heading="Cancellation & Refund Policy" pagination="Cancellation & Refund Policy"/>
      <CancellationRefundPolicyArea/>
    </>
  )
}

export default CancellationRefundPolicy
