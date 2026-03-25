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
                }

                if (banner && banner.image_url) {
                    setBgImage(banner.image_url);
                }
            }
        };
        fetchConfig();
    }, [props.pagination, props.heading]);

  return (
    <>
        <section id="common_banner_area" style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
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