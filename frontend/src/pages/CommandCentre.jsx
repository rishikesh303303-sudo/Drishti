import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Crosshair,
  Info,
  LocateFixed,
  Map as MapIcon,
  MapPinned,
  Minus,
  Navigation,
  Plus,
  Shield,
  Satellite,
  Send,
  Zap,
} from "lucide-react";

const markers = [
  { name: "Pitampura", risk: "0.82", tone: "critical", x: "44%", y: "16%" },
  { name: "ATM 002", risk: "0.41", tone: "low", x: "67%", y: "24%" },
  { name: "ATM 003", risk: "0.36", tone: "low", x: "31%", y: "43%" },
  { name: "ATM 004", risk: "0.67", tone: "medium", x: "44%", y: "63%" },
  { name: "ATM 005", risk: "0.73", tone: "critical", x: "65%", y: "58%" },
  { name: "ATM 006", risk: "0.52", tone: "low", x: "58%", y: "82%" },
];

const activity = [
  ["08:42 AM", "Complaint filed", "(UPI Fraud)", "low"],
  ["09:16 AM", "ATM cash-out", "(ATM 004)", "medium"],
  ["09:48 AM", "Network anomaly", "(Zone GHY-14)", "critical"],
  ["10:23 AM", "New complaint", "(Loan App Fraud)", "low"],
  ["11:07 AM", "Cash-out detected", "(ATM 001)", "medium"],
];

function Card({ children, className = "" }) {
  return <section className={`glass-card ${className}`}>{children}</section>;
}

function RiskBar({ label, value, color, amount }) {
  return (
    <div className="risk-row">
      <span>{label}</span>
      <div className="risk-track">
        <div className={`risk-fill ${color}`} style={{ width: `${value}%` }} />
      </div>
      <strong>{amount}</strong>
    </div>
  );
}

function MapMarker({ marker, selected, onSelect }) {
  return (
    <button
      className={`map-marker ${selected ? "selected" : ""}`}
      style={{ left: marker.x, top: marker.y }}
      onClick={() => onSelect(marker)}
      aria-label={`Select ${marker.name}, risk ${marker.risk}`}
    >
      <span className={`marker-pin ${marker.tone}`}>
        <span />
      </span>
      <span className="marker-label">
        <b>{marker.name}</b>
        <small>Risk {marker.risk}</small>
      </span>
    </button>
  );
}

export default function Commandcentre() {
  const [view, setView] = useState("Map");
  const [priority, setPriority] = useState("High");
  const [checks, setChecks] = useState({
    monitoring: true,
    patrol: true,
    contact: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [approvalRequired, setApprovalRequired] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showAllActivity, setShowAllActivity] = useState(false);

  const toggleCheck = (key) =>
    setChecks((current) => ({ ...current, [key]: !current[key] }));
  const visibleActivity = showAllActivity
    ? [...activity, ["11:42 AM", "Patrol assigned", "(Zone GHY-14)", "low"]]
    : activity;

  return (
    <main className="command-page">
      <div className="page-shell">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <span>
            <ArrowLeft size={16} /> Command Centre
          </span>
          <ArrowRight size={14} />
          <strong>Zone GHY-14</strong>
        </nav>

        <div className="dashboard-grid">
          <div className="left-column">
            <Card className="zone-header">
              <div className="zone-number">01</div>
              <div className="zone-heading">
                <div className="title-line">
                  <h1>North Delhi Zone 14</h1>
                  <span className="risk-pill">HIGH RISK</span>
                </div>
                <div className="zone-meta">
                  <span>
                    <Navigation size={17} /> Delhi NCR
                  </span>
                  <i />
                  <span>
                    <MapPinned size={17} /> Zone ID: GHY-14
                  </span>
                  <i />
                  <span>
                    <Shield size={17} /> Risk Score: 0.78
                  </span>
                </div>
              </div>
              <div className="header-actions">
                <button className="button secondary" onClick={() => setZoom(1)}>
                  Zoom to District
                </button>
                <button
                  className="button primary"
                  onClick={() => setZoom(1.28)}
                >
                  Zoom to Zone
                </button>
              </div>
            </Card>

            <Card className="map-card">
              <div
                className="map-surface"
                style={{
                  "--map-zoom": zoom,
                  filter:
                    view === "Satellite"
                      ? "saturate(1.35) contrast(.9) hue-rotate(10deg)"
                      : "none",
                }}
              >
                <div className="map-grid" />
                <div className="roads road-one" />
                <div className="roads road-two" />
                <div className="roads road-three" />
                <div className="district-label rohini">Rohini</div>
                <div className="district-label pitampura">Pitampura</div>
                <div className="district-label north-delhi">North Delhi</div>
                <div className="district-label punjabi">Punjabi Bagh</div>
                <div className="district-label shalimar">Shalimar Bagh</div>
                <div className="district-label kirti">Kirti Nagar</div>
                <div className="district-label noida">Noida</div>
                <div className="district-label faridabad">Faridabad</div>
                <div className="zone-shape" />
                {markers.map((marker) => (
                  <MapMarker
                    key={marker.name}
                    marker={marker}
                    selected={selectedMarker?.name === marker.name}
                    onSelect={setSelectedMarker}
                  />
                ))}
                <div className="zone-center">
                  <div className="big-pin critical">
                    <span />
                  </div>
                  <div>
                    <b>
                      {selectedMarker ? selectedMarker.name : "Zone GHY-14"}
                    </b>
                    <small>
                      {selectedMarker
                        ? `Risk ${selectedMarker.risk}`
                        : "Risk 0.78 — HIGH"}
                    </small>
                  </div>
                </div>
                <div className="map-switcher">
                  <button
                    className={view === "Map" ? "active" : ""}
                    onClick={() => setView("Map")}
                  >
                    <MapIcon size={17} /> Map
                  </button>
                  <button
                    className={view === "Satellite" ? "active" : ""}
                    onClick={() => setView("Satellite")}
                  >
                    <Satellite size={17} /> Satellite
                  </button>
                </div>
                <div className="map-controls">
                  <button
                    aria-label="Zoom in"
                    onClick={() =>
                      setZoom((value) => Math.min(value + 0.12, 1.6))
                    }
                  >
                    <Plus size={20} />
                  </button>
                  <button
                    aria-label="Zoom out"
                    onClick={() =>
                      setZoom((value) => Math.max(value - 0.12, 0.75))
                    }
                  >
                    <Minus size={20} />
                  </button>
                  <button
                    aria-label="Center map"
                    onClick={() => {
                      setZoom(1);
                      setSelectedMarker(null);
                    }}
                  >
                    <LocateFixed size={18} />
                  </button>
                </div>
                <div className="map-legend">
                  <span>
                    <i className="dot low" /> Low
                  </span>
                  <span>
                    <i className="dot medium" /> Medium
                  </span>
                  <span>
                    <i className="dot critical" /> Critical
                  </span>
                </div>
              </div>
            </Card>

            <Card className="activity-card">
              <div className="section-heading">
                <h2>Recent Activity</h2>
                <button
                  className="view-all"
                  onClick={() => setShowAllActivity((value) => !value)}
                >
                  {showAllActivity ? "Show Less" : "View All"}{" "}
                  <ArrowRight size={15} />
                </button>
              </div>
              <div className="activity-list" id="activity">
                {visibleActivity.map(([time, title, detail, tone]) => (
                  <div className="activity-item" key={time}>
                    <span className={`activity-dot ${tone}`} />
                    <time>{time}</time>
                    <p>
                      {title}
                      <br />
                      <small>{detail}</small>
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <aside className="right-column">
            <Card className="breakdown-card">
              <h2>Why This Zone?</h2>
              <h3>Risk Breakdown</h3>
              <RiskBar
                label="Complaint surge"
                value={64}
                color="pink"
                amount="+21%"
              />
              <RiskBar
                label="Network risk"
                value={54}
                color="purple"
                amount="+17%"
              />
              <RiskBar
                label="ATM density"
                value={40}
                color="blue"
                amount="+12%"
              />
              <RiskBar
                label="Historical cash-out rate"
                value={27}
                color="orange"
                amount="+8%"
              />
              <div className="confidence">
                <span>Confidence</span>
                <div className="risk-track">
                  <div className="risk-fill purple" style={{ width: "81%" }} />
                </div>
                <strong>81%</strong>
              </div>
            </Card>

            <Card className="alert-card">
              <h2>
                <Shield size={23} /> Create Alert
              </h2>
              <label>Alert type</label>
              <div className="select-field">
                Bank Monitoring <ChevronDown size={18} />
              </div>
              <label>Priority</label>
              <div className="priority-row">
                {["Standard", "High", "Critical"].map((item) => (
                  <button
                    key={item}
                    className={
                      priority === item
                        ? `priority ${item.toLowerCase()} selected`
                        : `priority ${item.toLowerCase()}`
                    }
                    onClick={() => setPriority(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <label>Message</label>
              <div className="message-box">
                High risk activity detected in Zone GHY-14. Multiple complaints
                and unusual cash-out patterns observed.
                <br />
                Recommend immediate monitoring and patrol deployment.
                <span>142/500</span>
              </div>
              <label>Suggested actions</label>
              <div className="check-list">
                {[
                  ["monitoring", "Increase ATM monitoring"],
                  ["patrol", "Deploy patrol unit"],
                  ["contact", "Notify nodal bank contact"],
                ].map(([key, text]) => (
                  <button key={key} onClick={() => toggleCheck(key)}>
                    <span
                      className={`checkbox ${checks[key] ? "checked" : ""}`}
                    >
                      {checks[key] && <Check size={13} />}
                    </span>
                    {text}
                  </button>
                ))}
              </div>
              <div className="approval">
                <button
                  className={`toggle ${approvalRequired ? "on" : ""}`}
                  onClick={() => setApprovalRequired((value) => !value)}
                  aria-pressed={approvalRequired}
                >
                  <span />
                </button>{" "}
                Requires senior officer approval <Info size={14} />
              </div>
              <div className="alert-actions">
                <button
                  className="button primary"
                  onClick={() => {
                    setSubmitted(true);
                    setDraftSaved(false);
                  }}
                >
                  {submitted ? "Alert Submitted" : "Submit Alert"}{" "}
                  <Send size={15} />
                </button>
                <button
                  className="button secondary"
                  onClick={() => {
                    setDraftSaved(true);
                    setSubmitted(false);
                  }}
                >
                  {draftSaved ? "Draft Saved" : "Save as Draft"}
                </button>
              </div>
            </Card>
          </aside>
        </div>
      </div>

      <style jsx global>{`
        @import "tailwindcss";
        @import "tw-animate-css";
        @import "shadcn/tailwind.css";

        :root {
          color-scheme: light;
          --ink: #151870;
          --muted: #4f5ab4;
          --purple: #5524dd;
          --pink: #f10e79;
          --line: #cbd4fa;
        }
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          color: var(--ink);
          background: #f1f3ff;
          font-family: Georgia, "Times New Roman", serif;
        }
        button,
        select {
          font: inherit;
          color: inherit;
        }
        button {
          cursor: pointer;
          border: 0;
        }
        .command-page {
          min-height: 100vh;
          padding: 24px 38px 38px;
          background: radial-gradient(
            circle at 18% 15%,
            #fff 0,
            #eef0ff 44%,
            #f7efff 100%
          );
        }
        .page-shell {
          margin: auto;
        }
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 0 0 16px;
          color: #2932bd;
          font-family: Arial, sans-serif;
          font-size: 15px;
        }
        .breadcrumb span {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .breadcrumb strong {
          font-size: 16px;
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: minmax(0, 2.05fr) minmax(350px, 0.95fr);
          gap: 20px;
        }
        .left-column,
        .right-column {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .glass-card {
          border: 1px solid rgba(189, 199, 245, 0.85);
          border-radius: 14px;
          background: linear-gradient(
            140deg,
            rgba(255, 255, 255, 0.96),
            rgba(244, 246, 255, 0.82)
          );
          box-shadow:
            0 8px 22px rgba(80, 91, 190, 0.11),
            inset 0 1px 0 white;
        }
        .zone-header {
          min-height: 92px;
          padding: 18px;
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .zone-number {
          width: 53px;
          height: 54px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          color: #fff;
          font: bold 25px Georgia;
          background: linear-gradient(145deg, #8054ff, #3514c6);
          box-shadow: 0 8px 14px #7665dc70;
        }
        .zone-heading {
          flex: 1;
        }
        .title-line {
          display: flex;
          gap: 14px;
          align-items: center;
        }
        .title-line h1 {
          margin: 0;
          font-size: 27px;
          letter-spacing: -0.5px;
          color: var(--ink);
        }
        .risk-pill {
          padding: 6px 14px;
          border-radius: 18px;
          background: #ffdbea;
          color: #eb1878;
          font: bold 12px Arial;
        }
        .zone-meta {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 9px;
          color: #3643b6;
          font: 15px Arial;
        }
        .zone-meta span {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .zone-meta i {
          height: 20px;
          border-left: 1px solid #cdd3f2;
        }
        .header-actions {
          display: flex;
          gap: 13px;
        }
        .button {
          height: 41px;
          padding: 0 28px;
          border-radius: 15px;
          font-weight: bold;
          font-size: 14px;
          border: 1px solid #b5bdf7;
          background: #fff;
          box-shadow: 0 5px 12px #6670bc1a;
          white-space: nowrap;
        }
        .button.primary {
          color: #fff;
          border-color: #5322dc;
          background: linear-gradient(145deg, #7a4cff, #4318d5);
          box-shadow: 0 6px 12px #4a20d95c;
        }
        .button.secondary {
          color: #2e2db1;
        }
        .map-card {
          padding: 4px;
          height: 558px;
          overflow: hidden;
        }
        .map-surface {
          position: relative;
          height: 100%;
          overflow: hidden;
          border-radius: 11px;
          transform: scale(var(--map-zoom, 1));
          transform-origin: center;
          transition:
            transform 0.35s ease,
            filter 0.35s ease;
          background-color: #e9f1ff;
          background-image:
            linear-gradient(
              28deg,
              transparent 45%,
              #c6d8f879 46%,
              transparent 47%
            ),
            linear-gradient(
              112deg,
              transparent 47%,
              #c6d8f879 48%,
              transparent 49%
            ),
            linear-gradient(8deg, transparent 49%, #fff8 50%, transparent 51%),
            repeating-linear-gradient(
              135deg,
              #ffffff55 0 2px,
              transparent 2px 17px
            ),
            repeating-linear-gradient(
              35deg,
              #d0e2f755 0 2px,
              transparent 2px 22px
            );
        }
        .map-grid {
          position: absolute;
          inset: 0;
          opacity: 0.34;
          background-image:
            linear-gradient(#aac3eb55 1px, transparent 1px),
            linear-gradient(90deg, #aac3eb55 1px, transparent 1px);
          background-size: 38px 38px;
          transform: rotate(-7deg) scale(1.15);
        }
        .roads {
          position: absolute;
          background: #fff9;
          border: 2px solid #bfd6f5aa;
          transform: rotate(-25deg);
        }
        .road-one {
          width: 130%;
          height: 12px;
          left: -10%;
          top: 42%;
        }
        .road-two {
          width: 100%;
          height: 9px;
          left: 12%;
          top: 62%;
          transform: rotate(35deg);
        }
        .road-three {
          width: 90%;
          height: 8px;
          left: 0;
          top: 25%;
          transform: rotate(75deg);
        }
        .district-label {
          position: absolute;
          color: #26338b;
          font-weight: bold;
          font-size: 20px;
        }
        .rohini {
          left: 16%;
          top: 20%;
        }
        .pitampura {
          left: 40%;
          top: 7%;
        }
        .north-delhi {
          right: 16%;
          top: 12%;
        }
        .punjabi {
          left: 10%;
          top: 39%;
        }
        .shalimar {
          right: 8%;
          top: 38%;
        }
        .kirti {
          left: 11%;
          top: 76%;
        }
        .noida {
          right: 11%;
          top: 69%;
        }
        .faridabad {
          left: 62%;
          bottom: 3%;
        }
        .zone-shape {
          position: absolute;
          left: 34%;
          top: 20%;
          width: 42%;
          height: 66%;
          background: radial-gradient(
            circle at 48% 46%,
            #ef298d9a,
            #e747bd55 42%,
            #db7bde1c 72%
          );
          clip-path: polygon(
            20% 4%,
            60% 0,
            76% 18%,
            100% 48%,
            80% 77%,
            50% 100%,
            16% 82%,
            0 52%,
            8% 19%
          );
          border: 2px solid #ef1684;
          filter: drop-shadow(0 0 12px #f431aa88);
        }
        .map-switcher {
          position: absolute;
          left: 18px;
          top: 17px;
          display: flex;
          background: #fff9;
          border-radius: 25px;
          padding: 3px;
          box-shadow: 0 4px 10px #6681b333;
        }
        .map-switcher button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 20px;
          border-radius: 21px;
          background: transparent;
          color: #26309e;
        }
        .map-switcher button.active {
          background: linear-gradient(145deg, #7751fb, #4b1bd8);
          color: white;
          box-shadow: 0 4px 9px #4c2bd066;
        }
        .map-controls {
          position: absolute;
          right: 14px;
          top: 17px;
          display: flex;
          flex-direction: column;
          background: #fff9;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 10px #6681b333;
        }
        .map-controls button {
          width: 42px;
          height: 38px;
          background: #fff9;
          color: #14248d;
          border-bottom: 1px solid #dae0fa;
          display: grid;
          place-items: center;
        }
        .map-controls button:last-child {
          border: 0;
          height: 45px;
        }
        .map-legend {
          position: absolute;
          bottom: 17px;
          left: 16px;
          display: flex;
          gap: 22px;
          padding: 15px 20px;
          border-radius: 18px;
          background: #fff9;
          box-shadow: 0 5px 14px #6d80c633;
          font: 14px Arial;
          color: #303ba8;
        }
        .map-legend span {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .dot {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: inline-block;
          box-shadow:
            inset 0 0 0 4px #fff,
            0 2px 8px #426;
        }
        .dot.low,
        .marker-pin.low {
          background: #16a8eb;
        }
        .dot.medium,
        .marker-pin.medium {
          background: #6337ec;
        }
        .dot.critical,
        .marker-pin.critical {
          background: #ed147d;
        }
        .map-marker {
          position: absolute;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          gap: 6px;
          z-index: 3;
        }
        .marker-pin {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          box-shadow:
            0 0 0 5px #fff8,
            0 3px 8px #435;
        }
        .marker-pin span,
        .big-pin span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #fff;
        }
        .marker-label,
        .zone-center {
          padding: 7px 12px;
          border-radius: 12px;
          background: #ffffffdc;
          box-shadow: 0 5px 12px #6874b52b;
          display: flex;
          flex-direction: column;
          white-space: nowrap;
          font-family: Arial;
        }
        .marker-label b {
          font-size: 14px;
          color: #19208d;
        }
        .marker-label small {
          color: #4b51b4;
          font-size: 12px;
        }
        .zone-center {
          position: absolute;
          left: 49%;
          top: 48%;
          transform: translate(-50%, -50%);
          flex-direction: row;
          align-items: center;
          gap: 9px;
          padding: 12px 17px;
          z-index: 4;
        }
        .zone-center b,
        .zone-center small {
          display: block;
        }
        .zone-center b {
          font-size: 15px;
        }
        .zone-center small {
          color: #e8117b;
          margin-top: 3px;
        }
        .big-pin {
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: grid;
          place-items: center;
          background: #ed147d;
          box-shadow: 0 3px 9px #d2167e66;
        }
        .big-pin span {
          transform: rotate(45deg);
        }
        .section-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 20px 7px;
        }
        .section-heading h2,
        .breakdown-card h2 {
          margin: 0;
          font-size: 25px;
          color: var(--ink);
        }
        .section-heading a {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #3223bf;
          font: 14px Arial;
        }
        .activity-card {
          padding-bottom: 10px;
        }
        .activity-list {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          padding: 10px 18px 0;
        }
        .activity-item {
          min-height: 65px;
          padding: 0 10px;
          border-left: 1px solid #ccd5f7;
          position: relative;
          font-family: Arial;
        }
        .activity-item:first-child {
          border: 0;
        }
        .activity-dot {
          position: absolute;
          left: -7px;
          top: -2px;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 1px 5px #445;
        }
        .activity-dot.low {
          background: #0b9de8;
        }
        .activity-dot.medium {
          background: #6838ed;
        }
        .activity-dot.critical {
          background: #ef147c;
        }
        .activity-item time {
          color: #5363c0;
          font-size: 13px;
        }
        .activity-item p {
          margin: 6px 0 0;
          color: #4251af;
          font-size: 13px;
          line-height: 1.35;
        }
        .activity-item small {
          font-size: 13px;
        }
        .right-column {
          gap: 12px;
        }
        .breakdown-card {
          padding: 12px 18px 17px;
        }
        .breakdown-card h3 {
          margin: 7px 0 16px;
          font-size: 16px;
        }
        .risk-row,
        .confidence {
          display: grid;
          grid-template-columns: 135px 1fr 40px;
          align-items: center;
          gap: 10px;
          margin: 15px 0;
          font: 13px Arial;
          color: #3e4aaf;
        }
        .risk-row strong,
        .confidence strong {
          font-size: 15px;
          color: #171ca0;
        }
        .risk-track {
          height: 13px;
          border-radius: 10px;
          background: #dce3fa;
          overflow: hidden;
        }
        .risk-fill {
          height: 100%;
          border-radius: 10px;
        }
        .risk-fill.pink {
          background: linear-gradient(90deg, #ed087c, #ce62f0);
        }
        .risk-fill.purple {
          background: linear-gradient(90deg, #5230e6, #8d5cee);
        }
        .risk-fill.blue {
          background: linear-gradient(90deg, #0789e3, #4dc8ee);
        }
        .risk-fill.orange {
          background: linear-gradient(90deg, #fb9e40, #ffc36c);
        }
        .confidence {
          grid-template-columns: 135px 1fr 40px;
          margin: 20px 0 3px;
        }
        .alert-card {
          padding: 12px 19px 18px;
        }
        .alert-card h2 {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 0 13px;
          font-size: 24px;
          color: var(--ink);
        }
        .alert-card h2 svg {
          color: #3427be;
        }
        .alert-card label {
          display: block;
          margin: 11px 0 4px;
          font-size: 15px;
        }
        .select-field,
        .message-box {
          border: 1px solid #c5cef7;
          border-radius: 13px;
          background: #fbfcff;
          padding: 9px 13px;
          font: 15px Arial;
          color: #252b8c;
        }
        .select-field {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .priority-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
        }
        .priority {
          height: 40px;
          border-radius: 13px;
          background: #eef2ff;
          border: 1px solid #d5dcf9;
          font-size: 13px;
        }
        .priority.high.selected {
          background: linear-gradient(145deg, #8152ff, #481bd7);
          color: #fff;
          box-shadow: 0 4px 8px #5926d65c;
        }
        .priority.critical {
          background: #ff147c;
          color: #fff;
        }
        .priority.critical.selected {
          box-shadow: 0 4px 8px #f6177b55;
        }
        .message-box {
          height: 87px;
          position: relative;
          font-size: 13px;
          line-height: 1.4;
          color: #5361bd;
        }
        .message-box span {
          position: absolute;
          right: 10px;
          bottom: 6px;
          font-size: 11px;
        }
        .check-list {
          display: flex;
          flex-direction: column;
          gap: 7px;
          font: 13px Arial;
          color: #3b45b2;
        }
        .check-list button {
          display: flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          text-align: left;
        }
        .checkbox {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          border: 1px solid #b7c3fa;
          display: grid;
          place-items: center;
        }
        .checkbox.checked {
          background: #5934dc;
          color: #fff;
        }
        .approval {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 15px 0;
          font: 13px Arial;
          color: #3541b0;
        }
        .approval svg {
          margin-left: 2px;
        }
        .toggle {
          width: 39px;
          height: 24px;
          border-radius: 14px;
          background: #d9def7;
          padding: 3px;
        }
        .toggle.on {
          background: #6330e2;
        }
        .toggle span {
          display: block;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #fff;
          transform: translateX(14px);
        }
        .alert-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }
        .alert-actions .button {
          height: 44px;
        }
        .alert-actions .primary {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }
        .map-marker {
          padding: 0;
          background: transparent;
        }
        .map-marker.selected .marker-label {
          outline: 2px solid #f10e79;
          transform: scale(1.05);
        }
        .view-all {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 0;
          background: transparent;
          color: #3223bf;
          font: 14px Arial;
        }
        .toggle {
          cursor: pointer;
        }
        .button:active,
        .priority:active,
        .map-controls button:active {
          transform: translateY(1px);
        }
        @media (max-width: 1000px) {
          .command-page {
            padding: 18px;
          }
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          .map-card {
            height: 500px;
          }
          .right-column {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
          .alert-card {
            grid-column: span 2;
          }
          .title-line h1 {
            font-size: 22px;
          }
        }
        @media (max-width: 650px) {
          .command-page {
            padding: 12px;
          }
          .zone-header {
            align-items: flex-start;
            flex-wrap: wrap;
          }
          .header-actions {
            width: 100%;
          }
          .header-actions .button {
            flex: 1;
            padding: 0 8px;
          }
          .zone-meta {
            flex-wrap: wrap;
            gap: 7px;
            font-size: 12px;
          }
          .zone-meta i {
            display: none;
          }
          .title-line {
            flex-wrap: wrap;
          }
          .map-card {
            height: 420px;
          }
          .district-label {
            font-size: 14px;
          }
          .map-marker {
            transform: translate(-50%, -50%) scale(0.8);
          }
          .right-column {
            display: flex;
          }
          .alert-card {
            grid-column: auto;
          }
          .activity-list {
            overflow-x: auto;
            grid-template-columns: repeat(5, 145px);
          }
          .activity-card {
            overflow: hidden;
          }
          .risk-row,
          .confidence {
            grid-template-columns: 105px 1fr 35px;
            font-size: 11px;
          }
        }
      `}</style>
    </main>
  );
}
