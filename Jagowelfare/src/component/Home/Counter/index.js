import React from 'react'
// Import Counter
import { CountUp } from 'use-count-up'
// import Icon
import Icon from "../../../assets/img/icon/camp2.png"
import Icon1 from "../../../assets/img/icon/hand.png"
import Icon2 from "../../../assets/img/icon/mone.png"
import Icon3 from "../../../assets/img/icon/camp.png"

const CounterArea = () => {
    const CounterData =[
        {
            img:Icon,
            count:2348,
            heading:"Total campaign"
        },
        {
            img:Icon1,
            count:1748,
            heading:"Satisfied donors"
        },
        {
            img:Icon2,
            count:4287,
            heading:"Fund raised"
        },
        {
            img:Icon3,
            count:1294,
            heading:"Happy volunteers"
        },

    ]
  return (
    <>
        <section id="counter_area">
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                    <div className="counter_area_wrapper">
                        <div className="row">
                        {CounterData.map((data, index) => (
                                 <div className="col-lg-3 col-md-6 col-sm-6 col-12" key={index}>
                                 <div className="counter_item">
                                     <img src={data.img} alt="icon" />
                                     <h2 className="counter"><CountUp isCounting end={data.count} duration={3.2} /></h2>
                                     <p>{data.heading}</p>
                                 </div>
                             </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </>
  )
}

export default CounterArea