import React from 'react'
import { Link } from 'react-router-dom'
// Import Img
import Img1 from "../../assets/img/common/about.png"
import Img2 from "../../assets/img/icon/about.png"
// import Commonent
import ReadyHelp from './ReadyHelp'
import PartnerArea from '../Home/Partner'
import Newsletter from './Newsletter'
import Testimonials from './Testimonials'

import { supabase } from '../../supabase'

const AboutArea = () => {
    const [config, setConfig] = React.useState({
        image_url: Img1
    });

    React.useEffect(() => {
        const fetchConfig = async () => {
            const { data } = await supabase.from('site_config').select('*').eq('key', 'home_intro').single();
            if (data && data.value) {
                setConfig(data.value);
            }
        };
        fetchConfig();
    }, []);

  return (
    <>
   <section id="about_area" className="section_padding">
        <div className="container">
            <div className="row">
                <div className="col-lg-6 col-md-12 col-sm-12 col-12">
                    <div className="about_area_img">
                        <img src={config.image_url || Img1} alt="img" />
                    </div>
                </div>
                <div className="col-lg-6 col-md-12 col-sm-12 col-12">
                    <div className="about_area_main_text">
                        <div className="about_area_heading">
                            <img src={Img2} alt="img" />
                            <h3>Welcome to JYF</h3>
                        </div>
                        <div className="about_area_heading_two">
                            <h2>Serving Humanity Through <span className="color_big_heading">Compassion</span></h2>
                        </div>
                        <div className="about_area_para">
                            <p>At Jain Youth Foundation (JYF), our volunteers are inspired by Jain values of Ahimsa (non-violence), compassion, service, and unity. While the foundation is run by members of the Jain community, our initiatives are dedicated to the welfare of society at large, helping people across communities.</p>
                            <p>Through our various initiatives, we focus on healthcare, food support, education, and humanitarian services, impacting thousands of lives every year.</p>
                        </div>
                        <div className="about_vedio_area">
                            <Link to="/contact" className="btn btn_theme btn_md">Contact us</Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col-lg-12">
                    <div className="about_area_main_text">
                        <div className="about_area_heading">
                            <h3>Our Philosophy</h3>
                        </div>
                        <div className="about_area_heading_two">
                            <h2>Unity in <span className="color_big_heading">CommUNITY</span></h2>
                        </div>
                        <div className="about_area_para">
                            <p>At Jain Youth Foundation, we believe that true service transcends community boundaries.</p>
                            <p>While our volunteers are rooted in Jain values, our mission is to serve humanity as a whole, guided by compassion, non-violence, and unity.</p>
                            <p>Together, we strive to build a society where care, kindness, and community support uplift every life.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <ReadyHelp/>
    <PartnerArea/>
    {/* <Newsletter/> */}
    {/* <Testimonials/> */}

    </>
  )
}

export default AboutArea