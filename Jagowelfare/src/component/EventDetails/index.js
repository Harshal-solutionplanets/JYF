import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import EventDetailSidebar from "./Sidebar";
import { apiFetch } from "../../api";
import { useAuth } from "../../auth/AuthProvider";
import { supabase } from "../../supabase";
import { extractDescription } from "../../utils/eventHelper";
import { formatDate } from "../../utils/dateFormatter";

function toJsDate(value) {
  if (!value) return null;
  if (typeof value === "object" && typeof value._seconds === "number") {
    return new Date(value._seconds * 1000);
  }
  if (typeof value === "number") return new Date(value);
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

const EventDetailsArea = ({ onTitleFetch }) => {
  const { eventId } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (event && onTitleFetch) {
      onTitleFetch(event.title);
    }
  }, [event, onTitleFetch]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registering, setRegistering] = useState(false);
  const [registerResult, setRegisterResult] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");

    const fetchEvent = async () => {
      try {
        const { data, error: sbError } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .single();

        if (sbError) throw sbError;
        if (alive) setEvent(data || null);
      } catch (err) {
        if (alive) setError(err?.message || "Failed to load event");
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchEvent();

    return () => {
      alive = false;
    };
  }, [eventId]);

  async function onRegister() {
    if (!user) return;
    setRegistering(true);
    setRegisterResult(null);
    try {
      const r = await apiFetch(`/events/${eventId}/register`, { method: "POST" });
      setRegisterResult(r);
    } catch (e) {
      setRegisterResult({ error: e?.message || "Registration failed" });
    } finally {
      setRegistering(false);
    }
  }

  return (
    <>
      <section id="trending_causes_main" className="section_padding">
        <div className="container">
          <div className="row" id="counter">
            <div className="col-lg-8">
              <div className="details_wrapper_area">
                {loading ? (
                  <div className="details_text_wrapper">
                    <p>Loading event...</p>
                  </div>
                ) : error ? (
                  <div className="details_text_wrapper">
                    <p style={{ color: "#b00020" }}>{error}</p>
                  </div>
                ) : event ? (
                  <>
                    <div className="details_big_img" style={{ backgroundColor: "#fbfbfb", borderRadius: "15px", overflow: "hidden", textAlign: "center", border: "1px solid #eee" }}>
                      <img
                        src={(event.image_url || "").split(",")[0]}
                        alt="img"
                        style={{ width: "100%", height: "auto", maxHeight: "450px", objectFit: "contain", display: "block", margin: "0 auto" }}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                    <div className="details_text_wrapper details_main_content">
                      <style dangerouslySetInnerHTML={{ __html: `
                        .details_main_content p, 
                        .details_main_content li { 
                            margin-bottom: 8px !important; 
                            margin-top: 0 !important; 
                            line-height: 1.6 !important;
                            color: #444;
                            font-size: 17px;
                            position: relative;
                        }
                        .details_main_content p:empty { display: none !important; }
                        
                        .details_main_content h2 { 
                            font-size: 36px; 
                            color: #2a283e; 
                            font-weight: 700; 
                            margin-bottom: 20px;
                        }
                        .details_main_content h4 { 
                            margin-top: 15px !important; 
                            margin-bottom: 10px !important; 
                            font-size: 22px; 
                            color: #2a283e; 
                            font-weight: 700; 
                        }
                        .details_main_content .tags_noted {
                            color: #ca1e14;
                            font-weight: 700;
                            margin-bottom: 10px;
                            display: inline-block;
                        }
                        .details_main_content div { margin-bottom: 0 !important; }
                        .details_main_content ul { margin-bottom: 8px; padding-left: 0; list-style: none; }
                      `}} />
                      <Link to="/event" className="tags_noted">
                        {event.tag || "#Event"}
                      </Link>
                      <h2>{event.title}</h2>
                      
                      <div dangerouslySetInnerHTML={{ __html: event.content || extractDescription(event.description) }} />

                      {event.image_url && event.image_url.split(",").length > 1 && (
                        <div style={{ marginTop: "30px" }}>
                          <h4>Event Gallery</h4>
                          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                            {event.image_url.split(",").slice(1).map((imgUrl, i) => (
                                <img
                                  key={i}
                                  src={imgUrl}
                                  alt={`event-gallery-${i}`}
                                  style={{ width: "160px", height: "120px", objectFit: "cover", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
                                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                                />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
            <EventDetailSidebar event={event} />
          </div>
        </div>
      </section>
    </>
  );
};

export default EventDetailsArea;