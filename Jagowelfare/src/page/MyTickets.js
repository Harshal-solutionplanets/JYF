import React, { useEffect, useState } from "react";
import CommonBanner from "../component/Common/CommonBanner";
import QRCode from "react-qr-code";
import { apiFetch } from "../api";
import { useAuth } from "../auth/AuthProvider";
import { Link } from "react-router-dom";

const MyTicketsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      setTickets([]);
      return;
    }
    let alive = true;
    setLoading(true);
    setError("");
    apiFetch("/my/tickets")
      .then((r) => {
        if (!alive) return;
        setTickets(r.tickets || []);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e?.message || "Failed to load tickets");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [user, authLoading]);

  return (
    <>
      <CommonBanner heading="My Tickets" pagination="My Tickets" />
      <section className="section_padding">
        <div className="container">
          {!user ? (
            <p>
              Please <Link to="/login">login</Link> to view your tickets.
            </p>
          ) : loading ? (
            <p>Loading tickets...</p>
          ) : error ? (
            <p style={{ color: "#b00020" }}>{error}</p>
          ) : tickets.length === 0 ? (
            <p>
              No tickets yet. Browse <Link to="/event">events</Link> to register.
            </p>
          ) : (
            <div className="row">
              {tickets.map((t) => (
                <div className="col-lg-6 col-md-12" key={`${t.eventId}:${t.ticket?.id}`}>
                  <div className="details_wrapper_area" style={{ padding: 20, marginBottom: 20 }}>
                    <h3 style={{ marginBottom: 6 }}>{t.event?.title || "Event"}</h3>
                    <p style={{ marginBottom: 12 }}>{t.event?.venue || "-"}</p>
                    <div style={{ background: "white", padding: 12, display: "inline-block" }}>
                      <QRCode value={t.qrPayload} size={180} />
                    </div>
                    <p style={{ marginTop: 10, wordBreak: "break-all" }}>
                      <strong>Ticket ID:</strong> {t.ticket?.id}
                    </p>
                    <p style={{ marginTop: 6 }}>
                      <Link className="btn btn_md btn_theme" to={`/event/${t.eventId}`}>
                        View event
                      </Link>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default MyTicketsPage;

