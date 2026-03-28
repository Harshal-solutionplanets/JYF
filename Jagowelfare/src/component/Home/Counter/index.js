import React from 'react'
// Import Counter
import { CountUp } from 'use-count-up'
// import Icon
import Icon from "../../../assets/img/icon/heart.png"
import Icon1 from "../../../assets/img/icon/camp.png"
import Icon2 from "../../../assets/img/icon/restaurant.png"
import Icon3 from "../../../assets/img/icon/book.png"

const CounterArea = () => {
    const CounterData = [
        {
            img: Icon,
            count: 56000,
            heading: "Dialysis done",
            suffix: "+"
        },
        {
            img: Icon1,
            count: 1400,
            heading: "Sadhu-Sadhvi Health Checkup",
            suffix: "+"
        },
        {
            img: Icon2,
            count: 75000,
            heading: "Meals Served",
            suffix: "+"
        },
        {
            img: Icon3,
            count: 1,
            heading: "Education Help",
            suffix: " CR +"
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
                                                <h2 className="counter">
                                                    <CountUp isCounting end={data.count} duration={3.2} />
                                                    {data.suffix}
                                                </h2>
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