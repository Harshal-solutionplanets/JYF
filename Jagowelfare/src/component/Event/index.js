import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabase";
import Iconclock from "../../assets/img/icon/clock.png";
import IconMap from "../../assets/img/icon/map.png";
import IconDate from "../../assets/img/icon/date.png";
import { extractDescription } from "../../utils/eventHelper";
import { formatDate } from "../../utils/dateFormatter";

function toJsDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDayMonth(d) {
  if (!d) return { day: "--", mon: "---" };
  const day = String(d.getDate()).padStart(2, "0");
  const mon = d.toLocaleString(undefined, { month: "short" });
  return { day, mon };
}

const EventAreaPage = (props) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    const fetchEvents = async () => {
      setLoading(true);
      setError("");
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('startAt', { ascending: true });
        
        if (error) throw error;
        if (alive) setEvents(data || []);
      } catch (e) {
        if (alive) setError(e?.message || "Failed to load events");
      } finally {
        if (alive) setLoading(false);
      }
    };
    fetchEvents();
    return () => { alive = false; };
  }, []);

  const [featured, rest] = useMemo(() => {
    if (!events.length) return [null, []];
    const [first, ...others] = events;
    return [first, others];
  }, [events]);

  return (
    <>
         <section id="upcoming_events" className={ props.padding === true ? "section_padding" : "section_padding_bottom"} >
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3 col-md-12 col-sm-12 col-12">
              <div className="section_heading">
                <h3>Upcoming events</h3>
                <h2>
                  Join our upcoming
                  <span className="color_big_heading">events</span> for contribution
                </h2>
              </div>
            </div>
          </div>
          <div className="row">
            {/* Event Leftside */}
            <div className="col-lg-6">
                {loading ? (
                  <div className="event_left_side_wrapper">
                    <div className="event_content_area big_content_padding">
                      <p>Loading events...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="event_left_side_wrapper">
                    <div className="event_content_area big_content_padding">
                      <p style={{ color: "#b00020" }}>{error}</p>
                    </div>
                  </div>
                ) : featured ? (
                    <div className="event_left_side_wrapper">
                    <div className="event_big_img" >
                      <Link to={`/event/${featured.id}`}>
                        <img src={featured.image_url?.split(',')[0] || ""} alt="img" onError={(e) => { e.currentTarget.style.display = "none"; }} style={{ width: '100%', borderRadius: '10px' }} />
                      </Link>
                    </div>
                    <div className="event_content_area big_content_padding">
                      <div className="event_tag_area">
                        <Link to={`/event/${featured.id}`}>{featured.tag || "#Event"}</Link>
                      </div>
                      <div className="event_heading_area">
                        <div className="event_heading">
                          <h3>
                          <Link to={`/event/${featured.id}`} style={{ lineHeight: '1.2', display: 'block' }}>{featured.title}</Link>
                          </h3>
                        </div>
                        <div className="event_date">
                          <img src={IconDate} alt="icon" />
                          <h6>
                            {(() => {
                              const d = new Date(featured.startAt);
                              const day = String(d.getDate()).padStart(2, '0');
                              const mon = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                              return <>{day} <span style={{fontSize: '10px'}}>{mon}</span></>;
                            })()}
                          </h6>
                        </div>
                      </div>
                      <div className="event_para" style={{ marginBottom: "20px" }}>
                        <p 
                          style={{ fontSize: "16px", lineHeight: "1.7", color: "#666" }}
                          dangerouslySetInnerHTML={{ __html: extractDescription(featured.description) }}
                        ></p>
                      </div>
                      <div className="event_boxed_bottom_wrapper">
                        <div className="row">
                          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                            <div className="event_bottom_boxed">
                              <div className="event_bottom_icon">
                                <img src={IconMap} alt="icon" />
                              </div>
                              <div className="event_bottom_content">
                                <h5>Location:</h5>
                                <p>{featured.venue || "-"}</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                            <div className="event_bottom_boxed">
                              <div className="event_bottom_icon">
                                <img src={Iconclock} alt="icon" />
                              </div>
                              <div className="event_bottom_content">
                                <h5>Starts at:</h5>
                                <p>{(() => {
                                  const d = toJsDate(featured.startAt);
                                  return d ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-";
                                })()}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="event_button">
                      <Link to={`/event/${featured.id}`}  className="btn btn_md btn_theme"> View details </Link>
                      </div>
                    </div>
              </div>
                ) : <p className="text-center w-100">No events found.</p>}
            </div>

             {/* Event Rightside */}
             <div className="col-lg-6">
             {rest.map((ev)=>(
               <div className="event_left_side_wrapper mb-4" key={ev.id}>
                     <div className="event_content_area small_content_padding" style={{ position: 'relative' }}>
                     <div className="event_big_img" style={{ marginBottom: '15px' }}>
                       <Link to={`/event/${ev.id}`}>
                         <img src={ev.image_url?.split(',')[0] || ""} alt="img" onError={(e) => { e.currentTarget.style.display = "none"; }} style={{ width: '100%', borderRadius: '10px' }} />
                       </Link>
                     </div>

                     {/* Floating Date Circle */}
                     <div className="event_date_circle" style={{
                       position: 'absolute',
                       top: '15px',
                       right: '15px',
                       background: 'linear-gradient(135deg, #e33129, #f27234)',
                       color: '#fff',
                       width: '60px',
                       height: '60px',
                       borderRadius: '50%',
                       display: 'flex',
                       flexDirection: 'column',
                       alignItems: 'center',
                       justifyContent: 'center',
                       boxShadow: '0 4px 15px rgba(227, 49, 41, 0.4)',
                       zIndex: 10
                     }}>
                       <span style={{ fontSize: '18px', fontWeight: '800', lineHeight: '1' }}>
                         {(() => {
                           const d = toJsDate(ev.startAt);
                           return d ? d.getDate() : "--";
                         })()}
                       </span>
                       <span style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>
                         {(() => {
                           const d = toJsDate(ev.startAt);
                           return d ? d.toLocaleString('en-US', { month: 'short' }) : "---";
                         })()}
                       </span>
                     </div>

                     <div className="event_tag_area">
                       <Link to={`/event/${ev.id}`}>{ev.tag || "#Event"}</Link>
                     </div>
                     <div className="event_heading_area">
                       <div className="event_heading">
                         <h3>
                           <Link to={`/event/${ev.id}`}>
                            {ev.title}
                           </Link>
                         </h3>
                       </div>
                     </div>
                     <div className="event_para" style={{ 
                       display: '-webkit-box', 
                       WebkitBoxOrient: 'vertical', 
                       WebkitLineClamp: 3, 
                       overflow: 'hidden',
                       marginBottom: '20px'
                     }}>
                       <p 
                         style={{ fontSize: "15px", lineHeight: "1.6", color: "#666" }}
                         dangerouslySetInnerHTML={{ __html: extractDescription(ev.description) }}
                       ></p>
                     </div>
                     <div className="event_boxed_bottom_wrapper">
                       <div className="row">
                         <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                           <div className="event_bottom_boxed">
                             <div className="event_bottom_icon">
                               <img src={IconMap} alt="icon" />
                             </div>
                             <div className="event_bottom_content">
                               <h5>Location:</h5>
                               <p>{ev.venue || "-"}</p>
                             </div>
                           </div>
                         </div>
                         <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                           <div className="event_bottom_boxed">
                             <div className="event_bottom_icon">
                               <img src={Iconclock} alt="icon" />
                             </div>
                             <div className="event_bottom_content">
                               <h5>Starts at:</h5>
                               <p>{(() => {
                                 const d = toJsDate(ev.startAt);
                                 return d ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-";
                               })()}</p>
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
            </div>
             </div>
                ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default EventAreaPage