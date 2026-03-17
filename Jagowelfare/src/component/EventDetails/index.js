import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import EventDetailSidebar from "./Sidebar";
import { apiFetch } from "../../api";
import { useAuth } from "../../auth/AuthProvider";

function toJsDate(value) {
  if (!value) return null;
  if (typeof value === "object" && typeof value._seconds === "number") {
    return new Date(value._seconds * 1000);
  }
  if (typeof value === "number") return new Date(value);
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

const EventDetailsArea = () => {
  const { eventId } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registering, setRegistering] = useState(false);
  const [registerResult, setRegisterResult] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    apiFetch(`/events/${eventId}`)
      .then((r) => {
        if (!alive) return;
        setEvent(r.event || null);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.message || "Failed to load event");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });
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
                    <div className="details_big_img">
                      <img
                        src={event.heroImageUrl || ""}
                        alt="img"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                    <div className="details_text_wrapper">
                      <Link to="/event" className="tags_noted">
                        {event.tag || "#Event"}
                      </Link>
                      <h2>{event.title}</h2>
                      <p>{event.description}</p>
                      <p>
                        <strong>Venue:</strong> {event.venue || "-"}
                        <br />
                        <strong>Starts:</strong>{" "}
                        {(() => {
                          const d = toJsDate(event.startAt);
                          return d ? d.toLocaleString() : "-";
                        })()}
                        <br />
                        <strong>Ends:</strong>{" "}
                        {(() => {
                          const d = toJsDate(event.endAt);
                          return d ? d.toLocaleString() : "-";
                        })()}
                      </p>

                      <div className="event_button" style={{ marginTop: 16 }}>
                        {!user ? (
                          <Link to="/login" className="btn btn_md btn_theme">
                            Login to register
                          </Link>
                        ) : (
                          <button className="btn btn_md btn_theme" onClick={onRegister} disabled={registering}>
                            {registering ? "Registering..." : "Register & get QR"}
                          </button>
                        )}
                      </div>

                      {registerResult?.error ? (
                        <p style={{ color: "#b00020", marginTop: 10 }}>{registerResult.error}</p>
                      ) : registerResult?.qrPayload ? (
                        <p style={{ marginTop: 10 }}>
                          Registered. View your QR in <Link to="/my-tickets">My Tickets</Link>.
                        </p>
                      ) : null}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
            <EventDetailSidebar />
          </div>
        </div>
      </section>
    </>
  );
};

export default EventDetailsArea;