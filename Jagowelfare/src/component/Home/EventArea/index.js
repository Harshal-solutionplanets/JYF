import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../../supabase";
// Import Icon
import Iconclock from "../../../assets/img/icon/clock.png"
import IconMap from "../../../assets/img/icon/map.png"
import IconDate from "../../../assets/img/icon/date.png"
import { extractDescription } from "../../../utils/eventHelper";
import { formatDate } from "../../../utils/dateFormatter";


const EventArea = (props) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('startAt', { ascending: true })
          .limit(4); // Fetch top 4 events
        
        if (error) throw error;
        if (alive) setEvents(data || []);
      } catch (e) {
        console.error("Failed to load events:", e);
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

  const formatDayMonth = (dateStr) => {
    if (!dateStr) return { day: "--", mon: "---" };
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const mon = d.toLocaleString(undefined, { month: "short" });
    return { day, mon };
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "10 am";
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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
          
          {loading ? (
            <div className="row"><div className="col-12 text-center"><p>Loading events...</p></div></div>
          ) : events.length === 0 ? (
            <div className="row"><div className="col-12 text-center"><p>No upcoming events found.</p></div></div>
          ) : (
            <div className="row">
              {/* Event Leftside (Featured Event) */}
              <div className="col-lg-6">
                {featured && (
                  <div className="event_left_side_wrapper">
                    <div className="event_big_img" >
                      <Link to={`/event/${featured.id}`}>
                        <img src={featured.image_url?.split(',')[0]} alt="img" style={{height: "350px", objectFit: "cover", width: "100%"}} />
                      </Link>
                    </div>
                    <div className="event_content_area big_content_padding">
                      <div className="event_tag_area">
                        <Link to={`/event/${featured.id}`}>{featured.tag || "#Event"}</Link>
                      </div>
                      <div className="event_heading_area">
                        <div className="event_heading">
                          <h3>
                            <Link to={`/event/${featured.id}`}>{featured.title}</Link>
                          </h3>
                        </div>
                        <div className="event_date">
                          <img src={IconDate} alt="icon" />
                          <h6>
                            {(() => {
                              const d = new Date(featured.startAt || featured.start_at);
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
                                <p>{featured.venue || "TBD"}</p>
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
                                <p>{formatTime(featured.startAt || featured.start_at)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="event_button">
                        <Link to={`/event/${featured.id}`} className="btn btn_md btn_theme"> Join event </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Event Rightside (List of Events) */}
              <div className="col-lg-6">
                {rest.map((datas) => (
                  <div className="event_left_side_wrapper mb-3" key={datas.id}>
                    <div className="event_content_area small_content_padding" style={{ position: 'relative' }}>
                      <div className="event_big_img" style={{ marginBottom: '15px' }}>
                        <Link to={`/event/${datas.id}`}>
                          <img src={datas.image_url?.split(',')[0]} alt="img" style={{height: "150px", objectFit: "cover", width: "100%", borderRadius: "10px"}} />
                        </Link>
                      </div>

                      {/* Floating Date Circle (matches user's image) */}
                      <div className="event_date_circle" style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'linear-gradient(135deg, #e33129, #f27234)',
                        color: '#white',
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
                        <span style={{ fontSize: '18px', fontWeight: '800', lineHeight: '1', color: '#fff' }}>
                          {(() => {
                            const d = new Date(datas.startAt || datas.start_at);
                            return d.getDate();
                          })()}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: '#fff' }}>
                          {(() => {
                            const d = new Date(datas.startAt || datas.start_at);
                            return d.toLocaleString('en-US', { month: 'short' });
                          })()}
                        </span>
                      </div>

                      <div className="event_tag_area">
                        <Link to={`/event/${datas.id}`}>{datas.tag || "#Event"}</Link>
                      </div>
                      <div className="event_heading_area">
                        <div className="event_heading">
                          <h3>
                            <Link to={`/event/${datas.id}`}>
                              {datas.title}
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
                          dangerouslySetInnerHTML={{ __html: extractDescription(datas.description) }}
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
                                <p>{datas.venue || "TBD"}</p>
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
                                <p>{formatTime(datas.startAt || datas.start_at)}</p>
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
          )}
        </div>
      </section>
    </>
  );
};

export default EventArea;

