import React from 'react'
// Import Link
import { Link } from 'react-router-dom'
// Import Arrow
import Arrow from "../../assets/img/icon/arrow.png"

import { supabase } from '../../supabase'

const CommonBanner = (props) => {
    const [bgImage, setBgImage] = React.useState("");

    React.useEffect(() => {
        const fetchConfig = async () => {
            const { data } = await supabase.from('site_config').select('*').eq('key', 'page_banners').single();
            if (data && data.value) {
                // Try to find by pagination or heading
                const pageKey = (props.pagination?.toLowerCase() || props.heading?.toLowerCase() || "");
                let banner = data.value[pageKey];

                // Fallback: If 'Cause details' or 'Event details' doesn't have its own banner,
                // fall back to the generic 'causes' or 'events' banner.
                if (!banner || !banner.image_url) {
                    if (pageKey.includes("cause")) banner = data.value["causes"];
                    else if (pageKey.includes("event")) banner = data.value["events"];
                    else if (pageKey.includes("news")) banner = data.value["news"];
                    else if (pageKey.includes("about")) banner = data.value["about"];
                    else if (pageKey.includes("contact")) banner = data.value["contact"];
                    else if (pageKey.includes("team") || pageKey.includes("member") || pageKey.includes("volunter")) banner = data.value["team"];
                    else if (pageKey.includes("testimonial")) banner = data.value["testimonials"];
                }

                if (banner && banner.image_url) {
                    setBgImage(banner.image_url);
                }
            }
        };
        fetchConfig();
    }, [props.pagination, props.heading]);

    const rawKey = (props.pagination?.toLowerCase() || props.heading?.toLowerCase() || "");
    const sectionKey = rawKey.replace(/[^a-z0-z]/g, '');
    const isCause = rawKey.includes("cause") || rawKey.includes("health") || rawKey.includes("education") || rawKey.includes("food") || rawKey.includes("humanitarian") || rawKey.includes("medical") || rawKey.includes("bird") || rawKey.includes("bhojan") || rawKey.includes("kidney") || rawKey.includes("dialysis") || rawKey.includes("camp");

  return (
    <>
        <section id="common_banner_area" className={`banner_section_${sectionKey} ${isCause ? 'is_cause_banner' : ''}`} style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' } : {}}>
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                    <div className="commn_banner_page">
                        <h2><span className="color_big_heading">{props.heading}</span></h2>
                        <ul className="breadcrumb_wrapper">
                            <li className="breadcrumb_item"><Link to="./">Home</Link></li>
                            <li className="breadcrumb_item"><img src={Arrow} alt="img" /></li>
                            <li className="breadcrumb_item active">{props.pagination}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </>
  )
}

export default CommonBanner