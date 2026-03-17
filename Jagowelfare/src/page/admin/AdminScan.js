import React, { useEffect, useRef, useState } from "react";
import CommonBanner from "../../component/Common/CommonBanner";
import { apiFetch } from "../../api";

// html5-qrcode is installed as a dependency and works in-browser.
import { Html5Qrcode } from "html5-qrcode";

export default function AdminScanPage() {
  const [eventId, setEventId] = useState("");
  const [status, setStatus] = useState("");
  const [lastResult, setLastResult] = useState(null);
  const [scanning, setScanning] = useState(false);

  const scannerRef = useRef(null);
  const scannerId = "jyf-qr-scanner";

  useEffect(() => {
    scannerRef.current = new Html5Qrcode(scannerId);
    return () => {
      const s = scannerRef.current;
      scannerRef.current = null;
      if (s) {
        s.stop().catch(() => {});
        s.clear().catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function start() {
    if (!eventId) {
      setStatus("Please enter an eventId to start scanning.");
      return;
    }
    const s = scannerRef.current;
    if (!s) return;
    setLastResult(null);
    setStatus("");
    setScanning(true);
    try {
      const cams = await Html5Qrcode.getCameras();
      const camId = cams?.[0]?.id;
      if (!camId) throw new Error("No camera found");

      await s.start(
        camId,
        { fps: 10, qrbox: 240 },
        async (decodedText) => {
          // Debounce by stopping briefly after each successful decode.
          try {
            await s.pause(true);
            setStatus("Validating...");
            const result = await apiFetch("/admin/scan", {
              method: "POST",
              body: { eventId, qrPayload: decodedText }
            });
            setLastResult(result);
            setStatus(result.ok ? "Check-in success" : `Rejected: ${result.status}`);
          } catch (e) {
            setLastResult({ ok: false, status: "error", error: e?.message || "Scan failed" });
            setStatus(e?.message || "Scan failed");
          } finally {
            // Resume scanning after a short delay to avoid duplicate reads.
            setTimeout(() => {
              s.resume();
            }, 1200);
          }
        },
        () => {}
      );
      setStatus("Scanning started.");
    } catch (e) {
      setStatus(e?.message || "Failed to start scanner");
      setScanning(false);
    }
  }

  async function stop() {
    const s = scannerRef.current;
    if (!s) return;
    try {
      await s.stop();
      await s.clear();
    } finally {
      setScanning(false);
      setStatus("Scanning stopped.");
    }
  }

  return (
    <>
      <CommonBanner heading="Admin Scan" pagination="Admin Scan" />
      <section className="section_padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="author_form_area">
                <div className="form-group">
                  <input
                    className="form-control"
                    placeholder="Event ID (Firestore doc id)"
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                    disabled={scanning}
                  />
                </div>

                <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                  {!scanning ? (
                    <button className="btn btn_theme btn_md" type="button" onClick={start}>
                      Start scanning
                    </button>
                  ) : (
                    <button className="btn btn_theme btn_md" type="button" onClick={stop}>
                      Stop
                    </button>
                  )}
                </div>

                {status ? <p>{status}</p> : null}

                <div id={scannerId} style={{ width: "100%", maxWidth: 520 }} />

                {lastResult ? (
                  <pre style={{ marginTop: 12, background: "#111", color: "#fff", padding: 12, overflowX: "auto" }}>
{JSON.stringify(lastResult, null, 2)}
                  </pre>
                ) : null}
              </div>
            </div>
            <div className="col-lg-4">
              <div className="details_wrapper_area" style={{ padding: 16 }}>
                <h4>Tips</h4>
                <ul style={{ marginBottom: 0 }}>
                  <li>Use a staff/admin account.</li>
                  <li>Enter the correct Firestore event document id.</li>
                  <li>Ensure camera permission is allowed in the browser.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

