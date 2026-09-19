import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getZones, createComplaint } from "../lib/api";
import {
  Bell,
  Check,
  ChevronDown,
  Crosshair,
  FileText,
  Info,
  Lightbulb,
  MapPin,
  Phone,
  Search,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";


 

function Complaint() {
    const navigate = useNavigate(); 
  const [zones, setZones] = useState([]);
  const [zoneId, setZoneId] = useState("");
  const [category, setCategory] = useState("UPI Fraud");
  const [complainantName, setComplainantName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("idle");

  const categories = [
  "UPI Fraud",
  "Investment Scam",
  "Loan App Fraud",
  "ATM Cash-out",
  "Phishing",
  "Job Fraud",
  "OTP Fraud",
  "Other",
];

  useEffect(() => {
    getZones().then((availableZones) => {
      setZones(availableZones);
      setZoneId(availableZones[0]?.id ?? "");
    });
  }, []);

  const selectedZone = useMemo(
    () => zones.find((zone) => zone.id === zoneId) ?? zones[0],
    [zoneId, zones],
  );

    const submitComplaint = async (event) => {
    event.preventDefault();
    setStatus("loading");
    try {
      await createComplaint({ zone_id: zoneId, crime_category: category });
      setStatus("success");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1100);
    } catch (err) {
      console.error(err);
      setStatus("idle");
      alert("Failed to file complaint: " + err.message);
    }
  };

  const risk = selectedZone?.risk_score ?? 0.78;
  const confidence = selectedZone?.confidence ?? 81;
  const riskLabel = risk >= 0.7 ? "HIGH" : "MEDIUM";

  return (
    <div className="app-shell">
      <style>{styles}</style>
      <div className="ambient ambient-sky" />
      <div className="ambient ambient-lavender" />
      <div className="ambient ambient-mint" />
      <div className="wave-lines" />

      <header className="topbar">
        <div className="brand-mark" aria-label="Drishti">
          <span className="brand-eye">
            <span />
          </span>
          <span>DRISHTI</span>
        </div>
        <div className="topbar-actions">
          <button className="back-link" type="button">
            <span>←</span> Back to Dashboard
          </button>
          <div className="account-area">
            <button
              className="notification-button"
              type="button"
              aria-label="Notifications"
            >
              <Bell size={20} strokeWidth={1.8} />
              <span className="notification-badge">3</span>
            </button>
            <div className="profile-avatar">RS</div>
            <div className="profile-copy">
              <strong>Rishesh Singh</strong>
              <span>LEA Officer</span>
            </div>
            <ChevronDown className="profile-chevron" size={16} />
          </div>
        </div>
      </header>

      <main className="page-content">
        <section className="title-area">
          <h1>File New Complaint</h1>
          <p>
            Report a cybercrime complaint. DRISHTI will recalculate the affected
            zone&apos;s risk in real time.
          </p>
        </section>

        <div className="content-grid">
          <form className="form-card soft-card" onSubmit={submitComplaint}>
            <div className="field-group">
              <label htmlFor="zone">
                <MapPin size={16} /> Select Zone *
              </label>
              <div className="select-wrap">
                <Search size={17} />
                <select
                  id="zone"
                  value={zoneId}
                  onChange={(event) => setZoneId(event.target.value)}
                  required
                >
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} — Risk {zone.risk_score.toFixed(2)}
                    </option>
                  ))}
                </select>
                <ChevronDown size={17} />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="category">
                <ShieldCheck size={16} /> Crime Category *
              </label>
              <div className="select-wrap">
                <ShieldCheck size={16} />
                <select
                  id="category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  {categories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <ChevronDown size={17} />
              </div>
            </div>

            <div className="field-group complainant-group">
              <label>
                <UserRound size={16} /> Complainant Details (Optional)
              </label>
              <div className="two-column">
                <div className="input-wrap">
                  <UserRound size={16} />
                  <input
                    aria-label="Name"
                    placeholder="Enter complainant name"
                    value={complainantName}
                    onChange={(event) => setComplainantName(event.target.value)}
                  />
                  <small>Enter complainant name</small>
                </div>
                <div className="input-wrap">
                  <Phone size={16} />
                  <input
                    aria-label="Phone / Contact"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                  />
                  <small>Enter phone number</small>
                </div>
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="description">
                <FileText size={16} /> Incident Description *
              </label>
              <div className="textarea-wrap">
                <textarea
                  id="description"
                  required
                  placeholder="Describe what happened..."
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
            </div>

            <div className="field-group amount-group">
              <label htmlFor="amount">
                <span className="rupee-icon">₹</span> Amount Involved (Optional)
              </label>
              <div className="input-wrap single-line">
                <span className="rupee-prefix">₹</span>
                <input
                  id="amount"
                  type="number"
                  min="0"
                  placeholder="Amount lost (if any)"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                />
              </div>
            </div>

            <button
              className={`submit-button ${status}`}
              type="submit"
              disabled={status !== "idle"}
            >
              {status === "loading" && <span className="spinner" />}
              {status === "success" && <Check size={20} />}
              {status === "loading" ? (
                "Filing..."
              ) : status === "success" ? (
                "Filed"
              ) : (
                <>
                  <Send size={19} /> File Complaint
                </>
              )}
            </button>
          </form>

          <aside className="preview-card">
            <div className="preview-heading">
              <Crosshair size={27} strokeWidth={2} />
              <div>
                <h2>Live Impact Preview</h2>
                <p>Based on selected zone&apos;s current risk profile</p>
              </div>
            </div>

            <div className="risk-panel">
              <div
                className="risk-gauge"
                style={{ "--risk-angle": `${risk * 360}deg` }}
              >
                <div className="risk-gauge-inner">
                  <strong>{risk.toFixed(2)}</strong>
                </div>
              </div>
              <div className="risk-copy">
                <span className="overline">Current Risk</span>
                <strong className="risk-value">{risk.toFixed(2)}</strong>
                <em className="risk-badge">({riskLabel})</em>
              </div>
            </div>

            <div className="confidence-section">
              <div className="confidence-head">
                <ShieldCheck size={24} strokeWidth={2} />
                <div className="confidence-head-copy">
                  <span className="overline">Confidence</span>
                  <strong>{confidence}%</strong>
                </div>
              </div>
              <div className="confidence-bar">
                <span style={{ width: `${confidence}%` }} />
              </div>
            </div>

            <div className="details-section">
              <h3>
                <Info size={23} strokeWidth={2} /> Zone Details
              </h3>
              <div className="detail-row">
                <span>Zone Name</span>
                <strong>{selectedZone?.name ?? "North Delhi Zone 14"}</strong>
              </div>
              <div className="detail-row">
                <span>Risk Score</span>
                <strong className="critical">
                  {risk.toFixed(2)} ({risk >= 0.7 ? "High" : "Medium"})
                </strong>
              </div>
              <div className="detail-row">
                <span>Last Updated</span>
                <strong>
                  {selectedZone?.updated ?? "18 Aug 2026, 03:42 PM"}
                </strong>
              </div>
            </div>

            <div className="info-box">
              <Lightbulb size={22} strokeWidth={2} />
              <p>
                Filing this complaint may help recalculate the zone&apos;s risk
                score in real time and trigger further monitoring.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <div className="system-status">
        <span className="status-dot" />
        <div>
          <strong>System Online</strong>
          <small>Last updated: 18 Aug 2026, 04:13 PM</small>
        </div>
      </div>
    </div>
  );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700&display=swap');
:root { font-family: 'Manrope', sans-serif; color: #15314b; background: #f8fafc; font-synthesis: none; }
* { box-sizing: border-box; }
body { margin: 0; min-width: 320px; }
button, input, select, textarea { font: inherit; }
button { border: 0; cursor: pointer; }
.app-shell { min-height: 100vh; overflow: hidden; position: relative; background: #f8fafc; padding: 22px 28px 38px; }
.ambient { border-radius: 50%; filter: blur(18px); opacity: .48; pointer-events: none; position: absolute; }
.ambient-sky { background: #dceeff; height: 310px; left: -150px; top: -105px; width: 310px; }
.ambient-lavender { background: #e9e2ff; bottom: -170px; left: -135px; height: 320px; width: 320px; opacity: .34; }
.ambient-mint { background: #d8f7f4; bottom: -160px; right: -90px; height: 300px; width: 300px; opacity: .3; }
.wave-lines { bottom: -30px; height: 180px; left: -30px; opacity: .21; position: absolute; transform: rotate(-7deg); width: 440px; background: repeating-radial-gradient(ellipse at 0 100%, transparent 0 18px, #b5c9e9 19px 20px, transparent 21px 37px); pointer-events: none; }
.topbar, .page-content { margin: 0 auto; max-width: 1390px; position: relative; z-index: 1; }
.topbar { align-items: center; display: flex; justify-content: space-between; min-height: 54px; }
.brand-mark { align-items: center; color: #154b7c; display: flex; font-size: 25px; font-weight: 800; gap: 10px; letter-spacing: -.8px; }
.brand-eye { align-items: center; border: 2px solid #17609a; border-radius: 50% / 60%; display: flex; height: 27px; justify-content: center; position: relative; transform: rotate(-8deg); width: 29px; }
.brand-eye:before { border: 1.5px solid #25b2be; border-radius: 50%; content: ''; height: 12px; width: 18px; }
.brand-eye span { background: #17609a; border-radius: 50%; height: 5px; position: absolute; width: 5px; }
.topbar-actions { align-items: center; display: flex; gap: 35px; }
.back-link { background: transparent; color: #315e8b; font-size: 15px; font-weight: 600; padding: 10px 0; }
.back-link span { font-size: 22px; margin-right: 8px; vertical-align: -1px; }
.account-area { align-items: center; display: flex; gap: 11px; }
.notification-button { background: rgba(255,255,255,.66); border-radius: 50%; color: #204b71; height: 40px; position: relative; width: 40px; }
.notification-badge { background: #ee5f58; border: 2px solid #f8fafc; border-radius: 50%; color: white; font-size: 10px; font-weight: 800; height: 17px; line-height: 14px; position: absolute; right: -1px; top: -4px; width: 17px; }
.profile-avatar { align-items: center; background: #5d7390; border: 2px solid #e3eaf2; border-radius: 50%; color: white; display: flex; font-size: 12px; font-weight: 700; height: 36px; justify-content: center; width: 36px; }
.profile-copy { display: flex; flex-direction: column; gap: 2px; }
.profile-copy strong { font-size: 12px; font-weight: 800; }
.profile-copy span { color: #7290af; font-size: 11px; }
.profile-chevron { color: #204b71; margin-left: 2px; }
.title-area { margin: 19px 0 22px; }
.title-area h1 { color: #15314b; font-family: 'Playfair Display', serif; font-size: clamp(42px, 4vw, 57px); letter-spacing: -1.7px; line-height: 1.08; margin: 0 0 5px; }
.title-area p { color: #587490; font-size: 15px; margin: 0; }
.content-grid { align-items: start; display: grid; gap: 28px; grid-template-columns: minmax(0, 1.67fr) minmax(360px, .92fr); }
.soft-card { background: rgba(255,255,255,.8); border: 1px solid rgba(226,235,244,.92); border-radius: 25px; box-shadow: 0 20px 48px rgba(49,80,111,.09), inset 0 1px 1px rgba(255,255,255,.95); }
.form-card { padding: 28px 35px 31px; }
.field-group { margin-bottom: 19px; }
.field-group label { align-items: center; color: #4b6f95; display: flex; font-size: 12px; font-weight: 600; gap: 10px; margin: 0 0 8px; }
.field-group label svg { color: #234f7d; }
.select-wrap, .input-wrap, .textarea-wrap { align-items: center; background: #f4f7fa; border: 1px solid #e8eef4; border-radius: 15px; box-shadow: inset 0 5px 13px rgba(70,99,124,.08), 0 1px 2px rgba(255,255,255,.9); color: #567692; display: flex; min-height: 35px; padding: 0 14px; }
.select-wrap { gap: 10px; }
.select-wrap select { appearance: none; background: transparent; border: 0; color: #274c70; flex: 1; font-size: 12px; font-weight: 600; outline: none; }
.select-wrap svg:last-child { color: #4c6f91; }
.two-column { display: grid; gap: 17px; grid-template-columns: 1fr 1fr; }
.input-wrap { align-items: flex-start; flex-wrap: wrap; gap: 9px; min-height: 62px; padding: 9px 12px 7px; }
.input-wrap input, .textarea-wrap textarea { background: transparent; border: 0; color: #254a6c; flex: 1; min-width: 0; outline: none; }
.input-wrap input { font-size: 12px; height: 20px; }
.input-wrap input::placeholder, .textarea-wrap textarea::placeholder { color: #88a2bd; opacity: 1; }
.input-wrap small { color: #91a8be; flex-basis: 100%; font-size: 10px; margin-left: 25px; margin-top: -4px; }
.textarea-wrap { align-items: stretch; min-height: 72px; padding: 10px 14px; }
.textarea-wrap textarea { font-size: 12px; min-height: 50px; resize: vertical; }
.single-line { align-items: center; flex-wrap: nowrap; min-height: 37px; padding: 5px 14px; }
.rupee-prefix, .rupee-icon { color: #3c6083; font-size: 16px; }
.submit-button { align-items: center; background: #e2725b; border-radius: 18px; box-shadow: 0 7px 0 #c85849, 0 13px 20px rgba(211,93,72,.19), inset 0 1px rgba(255,255,255,.28); color: #fffaf4; display: flex; font-size: 16px; font-weight: 800; gap: 12px; justify-content: center; margin-top: 25px; min-height: 46px; transition: transform .18s ease, box-shadow .18s ease; width: 100%; }
.submit-button:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 9px 0 #c85849, 0 16px 24px rgba(211,93,72,.22), inset 0 1px rgba(255,255,255,.3); }
.submit-button:active:not(:disabled) { transform: translateY(4px); box-shadow: 0 3px 0 #c85849, 0 8px 14px rgba(211,93,72,.15); }
.submit-button.loading { background: #d87864; cursor: wait; }
.submit-button.success { background: #16a34a; box-shadow: 0 7px 0 #13823c, 0 13px 20px rgba(22,163,74,.15); }
.spinner { border: 2px solid rgba(255,255,255,.4); border-radius: 50%; border-top-color: #fff; height: 17px; width: 17px; animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.preview-card { background: #fff; border: 1px solid #e3ecf5; border-radius: 26px; box-shadow: 0 18px 45px rgba(21,49,75,.07), inset 0 1px 1px rgba(255,255,255,.96); padding: 34px 33px 36px; }
.preview-heading { align-items: flex-start; display: flex; gap: 14px; }
.preview-heading > svg { color: #15314b; flex: 0 0 auto; }
.preview-heading h2 { color: #15314b; font-family: 'Playfair Display', serif; font-size: 31px; font-weight: 600; letter-spacing: -.3px; line-height: 1.12; margin: 0 0 9px; }
.preview-heading p { color: #6b8298; font-size: 13px; margin: 0; }
.overline { color: #6b8298; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
.risk-panel { align-items: center; background: #fff7f4; border: 1px solid #f5dad3; border-radius: 21px; box-shadow: 0 8px 20px rgba(226,114,91,.08), inset 0 1px #fff; display: flex; gap: 28px; margin-top: 30px; padding: 26px 25px; }
.risk-gauge { align-items: center; background: conic-gradient(#e2725b 0 var(--risk-angle), #f6ddd7 var(--risk-angle) 360deg); border-radius: 50%; display: flex; flex: 0 0 auto; height: 118px; justify-content: center; padding: 13px; position: relative; width: 118px; }
.risk-gauge:after { background: #fffaf8; border-radius: 50%; content: ''; inset: 13px; position: absolute; }
.risk-gauge-inner { align-items: center; background: #fffaf8; border-radius: 50%; display: flex; height: 92px; justify-content: center; position: relative; width: 92px; z-index: 1; }
.risk-gauge-inner strong { color: #e2725b; font-size: 30px; font-weight: 700; }
.risk-copy { flex: 1; padding-top: 4px; }
.risk-copy .overline { display: block; }
.risk-value { color: #15314b; display: block; font-size: 30px; font-weight: 700; line-height: 1.1; margin-top: 8px; }
.risk-badge { color: #e2725b; display: block; font-size: 15px; font-style: normal; font-weight: 700; margin-top: 3px; }
.confidence-section { margin-top: 30px; padding-top: 26px; border-top: 1px solid #eef2f7; }
.confidence-head { align-items: center; display: flex; gap: 12px; margin-bottom: 16px; }
.confidence-head svg { color: #15314b; flex: 0 0 auto; }
.confidence-head-copy { flex: 1; }
.confidence-head-copy .overline { display: block; }
.confidence-head-copy strong { color: #15314b; font-size: 19px; font-weight: 700; display: block; margin-top: 2px; }
.confidence-bar { background: #e6eef3; border-radius: 999px; height: 8px; overflow: hidden; }
.confidence-bar span { background: #2ec4a6; border-radius: inherit; height: 100%; display: block; }
.details-section { margin-top: 32px; }
.details-section h3 { align-items: center; color: #15314b; display: flex; font-size: 17px; font-weight: 600; gap: 11px; margin: 0 0 6px; }
.details-section h3 svg { color: #15314b; }
.detail-row { align-items: center; border-bottom: 1px solid #eef2f7; display: flex; justify-content: space-between; min-height: 45px; }
.detail-row span { color: #6b8298; font-size: 13px; }
.detail-row strong { color: #15314b; font-size: 14px; font-weight: 600; text-align: right; }
.detail-row strong.critical { color: #e2725b; }
.info-box { align-items: flex-start; background: #eef8ff; border: 1px solid #ddecf8; border-radius: 17px; display: flex; gap: 14px; margin-top: 26px; padding: 17px 18px; }
.info-box svg { color: #2563eb; flex: 0 0 auto; }
.info-box p { color: #4787b4; font-size: 13px; line-height: 1.5; margin: 0; }
.system-status { align-items: center; bottom: 15px; display: flex; gap: 9px; left: max(28px, calc((100vw - 1390px) / 2)); position: absolute; z-index: 1; }
.status-dot { background: #17c9a4; border: 3px solid #bdf5e9; border-radius: 50%; height: 12px; width: 12px; }
.system-status div { display: flex; flex-direction: column; gap: 2px; }
.system-status strong { color: #168e94; font-size: 11px; }
.system-status small { color: #7c9bb7; font-size: 9px; }
@media (max-width: 900px) { .app-shell { padding: 18px 20px 35px; } .content-grid { grid-template-columns: 1fr; } .preview-card { max-width: none; } .system-status { left: 20px; position: relative; bottom: auto; margin-top: 26px; } }
@media (max-width: 600px) { .topbar { align-items: flex-start; flex-direction: column; gap: 14px; } .topbar-actions { flex-direction: column-reverse; align-items: flex-start; gap: 12px; width: 100%; } .account-area { align-self: flex-end; margin-top: -57px; } .title-area { margin-top: 32px; } .title-area h1 { font-size: 43px; } .title-area p { line-height: 1.55; } .form-card, .preview-card { padding: 23px 18px 25px; } .two-column { grid-template-columns: 1fr; gap: 12px; } .preview-heading h2 { font-size: 25px; } .risk-panel { gap: 16px; padding: 18px 14px; } .risk-gauge { height: 96px; width: 96px; padding: 11px; } .risk-gauge-inner { height: 74px; width: 74px; } .risk-gauge-inner strong { font-size: 24px; } .risk-value { font-size: 26px; } .detail-row { gap: 14px; min-height: 42px; } }
`;

export default Complaint;
