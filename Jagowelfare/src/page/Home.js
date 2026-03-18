import React from 'react'
import HomeBanner from '../component/Home/Banner'
import AboutTopArea from '../component/Home/AboutTop'
import AboutAres from '../component/Home/AboutArea'
import TrendingCauses from '../component/Home/TrendingCauses'
import EventAreaPage from '../component/Event';
import DonationArea from '../component/Home/Donation'
import PartnerArea from '../component/Home/Partner'
import CounterArea from '../component/Home/Counter'
import NewsAres from '../component/Home/NewsArea'
const Home = () => {
  return (
    <>
       <HomeBanner/> 
       <AboutTopArea/>
       <AboutAres/>
       <TrendingCauses/>
       <EventAreaPage/>
       <DonationArea/>
       <PartnerArea/>
       <CounterArea/>
       <NewsAres/>
    </>
  )
}

export default Home