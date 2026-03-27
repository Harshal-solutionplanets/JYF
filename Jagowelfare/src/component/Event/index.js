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


  return (
    <>
      <section id="upcoming_events" className={props.padding === true ? "section_padding" : "section_padding_bottom"} >
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3 col-md-12 col-sm-12 col-12">
              <div className="section_heading">
                <h3 style={{ fontSize: "24px" }}>   Events</h3>
                <h2>
                  Join our
                  <span className="color_big_heading">events</span>
                </h2>
              </div>
            </div>
          </div>
          <div className="row">
            {loading ? (
              <div className="col-12 text-center p-5"><h4>Loading events...</h4></div>
            ) : error ? (
              <div className="col-12 text-center p-5"><h4 style={{ color: "#e33129" }}>{error}</h4></div>
            ) : events.length === 0 ? (
              <div className="col-12 text-center p-5"><h4>No events available.</h4></div>
            ) : (
              events.map((ev) => (
                <div className="col-lg-6 col-md-12 col-sm-12 col-12" key={ev.id}>
                  <div className="event_left_side_wrapper mb-4">
                    <div className="event_content_area small_content_padding" style={{ position: 'relative', backgroundColor: "#fff", borderRadius: "15px", padding: "30px", boxShadow: "0 5px 20px rgba(0,0,0,0.03)" }}>

                      {/* Floating Date Circle */}
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
                            const d = new Date(ev.startAt || ev.start_at);
                            return d.getDate();
                          })()}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: '#fff' }}>
                          {(() => {
                            const d = new Date(ev.startAt || ev.start_at);
                            return d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                          })()}
                        </span>
                      </div>

                      <div className="event_tag_area" style={{ marginBottom: "5px" }}>
                        <Link to={`/event/${ev.id}`} style={{ color: "#e33129", fontWeight: "700", fontSize: "16px" }}>{ev.tag || "#Event"}</Link>
                      </div>

                      <div className="event_heading_area">
                        <div className="event_heading">
                          <h3 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "10px" }}>
                            <Link to={`/event/${ev.id}`} style={{ color: "#222" }}>
                              {ev.title}
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
                          dangerouslySetInnerHTML={{ __html: extractDescription(ev.description) }}
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
                                <p style={{ fontSize: "12px" }}>{ev.venue || "TBD"}</p>
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
                                <p style={{ fontSize: "12px" }}>{(() => {
                                  const d = toJsDate(ev.startAt);
                                  return d ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-";
                                })()}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <Link to={`/event/${ev.id}`} className="btn btn_theme btn_sm">View Details</Link>
                      </div>

                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default EventAreaPage