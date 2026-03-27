import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../../supabase";
// Import Icon
import Iconclock from "../../../assets/img/icon/clock.png"
import IconMap from "../../../assets/img/icon/map.png"
import IconDate from "../../../assets/img/icon/date.png"
import { extractDescription } from "../../../utils/eventHelper";


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
          .order('startAt', { ascending: false })
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


  const formatTime = (dateStr) => {
    if (!dateStr) return "10 am";
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <section id="upcoming_events" className={props.padding === true ? "section_padding" : "section_padding_bottom"} >
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3 col-md-12 col-sm-12 col-12">
              <div className="section_heading">
                <h3 style={{ fontSize: "30px" }}>   Events</h3>
                <h2>
                  Join our
                  <span className="color_big_heading">events</span>
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
                        <img src={featured.image_url?.split(',')[0]} alt="img" style={{ height: "350px", objectFit: "contain", width: "100%", backgroundColor: "#f8f9fa" }} />
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
                              return <>{day} <span style={{ fontSize: '10px' }}>{mon}</span></>;
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
                      {/* Removed big image for rest items to match specific screenshot layout */}

                      {/* Floating Date Circle (matches user's image) */}
                      <div className="event_date_circle" style={{
                        position: 'absolute',
                        top: '40px',
                        right: '0',
                        background: 'linear-gradient(135deg, #e33129, #f27234)',
                        color: '#fff',
                        width: '75px',
                        height: '75px',
                        borderRadius: '40% 60% 70% 30% / 40% 50% 60% 70%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '10px 10px 0px rgba(242, 114, 52, 0.2)',
                        zIndex: 10
                      }}>
                        <span style={{ fontSize: '20px', fontWeight: '800', lineHeight: '1', color: '#fff' }}>
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

                      <div className="event_tag_area" style={{ marginBottom: "5px" }}>
                        <Link to={`/event/${datas.id}`} style={{ color: "#e33129", fontWeight: "700", fontSize: "16px" }}>{datas.tag || "#Event"}</Link>
                      </div>
                      <div className="event_heading_area">
                        <div className="event_heading">
                          <h3 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "10px" }}>
                            <Link to={`/event/${datas.id}`} style={{ color: "#222" }}>
                              {datas.title}
                            </Link>
                          </h3>
                        </div>
                      </div>
                      <div className="event_para" style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                        overflow: 'hidden',
                        marginBottom: '15px',
                        paddingRight: '80px'
                      }}>
                        <p
                          style={{ fontSize: "15px", lineHeight: "1.6", color: "#888" }}
                          dangerouslySetInnerHTML={{ __html: extractDescription(datas.description) }}
                        ></p>
                      </div>
                      <div className="event_boxed_bottom_wrapper" style={{ borderTop: "1px solid #eee", paddingTop: "15px" }}>
                        <div className="row">
                          <div className="col-lg-6 col-md-6 col-sm-6 col-6" style={{ borderRight: "1px solid #eee" }}>
                            <div className="event_bottom_boxed">
                              <div className="event_bottom_icon">
                                <img src={IconMap} alt="icon" style={{ width: "15px" }} />
                              </div>
                              <div className="event_bottom_content">
                                <h5 style={{ fontSize: "13px", color: "#222" }}>Location:</h5>
                                <p style={{ fontSize: "12px" }}>{datas.venue || "TBD"}</p>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                            <div className="event_bottom_boxed" style={{ paddingLeft: "15px" }}>
                              <div className="event_bottom_icon">
                                <img src={Iconclock} alt="icon" style={{ width: "15px" }} />
                              </div>
                              <div className="event_bottom_content">
                                <h5 style={{ fontSize: "13px", color: "#222" }}>Starts at:</h5>
                                <p style={{ fontSize: "12px" }}>{formatTime(datas.startAt || datas.start_at)}</p>
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

