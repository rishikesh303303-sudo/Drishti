import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Drishtilogo.png";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  Home,
  MapPin,
  Menu,
  Search,
  Settings,
  Shield,
  Siren,
  TrendingUp,
  X,
} from "lucide-react";
import { getComplaintsOverview, getComplaintsByCategory, getTopZones } from "../lib/api"; 

const categoryStyles = {
  "UPI Fraud": { tone: "blue", icon: Shield },
  "Loan App Fraud": { tone: "purple", icon: BriefcaseBusiness },
  "Investment Scam": { tone: "cyan", icon: TrendingUp },
  "OTP Fraud": { tone: "violet", icon: FileText },
  "SIM Swap Fraud": { tone: "orange", icon: Home },
};
const defaultCategoryStyle = { tone: "gray", icon: Activity };

const riskTone = (level) => (level === "high" || level === "critical" ? "pink" : "orange");
const activities = [
  ["08:42 AM", "Complaint filed", "(UPI Fraud)", "blue"],
  ["09:16 AM", "ATM cash-out", "(ATM 004)", "purple"],
  ["09:48 AM", "Network anomaly", "(Zone GHY-14)", "pink"],
  ["10:23 AM", "New complaint", "(Loan App Fraud)", "blue"],
  ["11:07 AM", "Cash-out detected", "(ATM 001)", "purple"],
];

export default function Dashboard() {
    const navigate = useNavigate();
  const [active, setActive] = useState("Home"),
    [query, setQuery] = useState(""),
    [slide, setSlide] = useState(0),
    [notice, setNotice] = useState(""),
    [expanded, setExpanded] = useState(null),
    [menu, setMenu] = useState(false),
    [dragStart, setDragStart] = useState(null),
    [dragOffset, setDragOffset] = useState(0);
    const [overview, setOverview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [attention, setAttention] = useState([]);
    const nav = [
    ["Home", Home, "/dashboard"],
    ["Command Centre", Settings, "/command-centre"],
    ["Cases", ClipboardList, "/cases"],
    ["Alerts", Bell, "/alerts"],
    ["Investigations", Search, "/case-detail"],
    ["Reports", FileText, "/reports"],
    ["Analytics", BarChart3, "/analytics"],
    ["Audit Logs", FileText, "/audit"],
    ["Settings", Settings, "/settings"],
  ];
  const moveSlide = (direction) =>
    setSlide((value) => (value + direction + 4) % 4);
  useEffect(() => {
    const timer = setInterval(() => setSlide((value) => (value + 1) % 4), 4200);
    return () => clearInterval(timer);
  }, []);
    useEffect(() => {
    getComplaintsOverview().then(setOverview);
  }, []);

  useEffect(() => {
    getComplaintsByCategory().then((data) => {
      const total = data.reduce((sum, c) => sum + c.count, 0);
      const mapped = data.map(({ category, count }) => {
        const pct = total > 0 ? ((count / total) * 100).toFixed(1) + "%" : "0%";
        const style = categoryStyles[category] || defaultCategoryStyle;
        return [category, count.toLocaleString(), pct, style.tone, style.icon];
      });
      setCategories(mapped);
    });
  }, []);

  useEffect(() => {
    getTopZones(3).then((zones) => {
      const mapped = zones.map((z, i) => [
        String(i + 1).padStart(2, "0"),
        z.name,
        z.risk_score.toFixed(2),
        Math.round(z.confidence * 100) + "%",
        `+${z.complaint_surge_pct}%`,
        `+${z.network_risk_pct}%`,
        z.risk_level.toUpperCase(),
        riskTone(z.risk_level),
      ]);
      setAttention(mapped);
    });
  }, []);
  const startDrag = (event) => {
    setDragStart(event.clientX);
    setDragOffset(0);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const dragCard = (event) => {
    if (dragStart !== null) setDragOffset(event.clientX - dragStart);
  };
  const endDrag = () => {
    if (dragStart !== null) {
      if (Math.abs(dragOffset) > 45) moveSlide(dragOffset < 0 ? 1 : -1);
      setDragStart(null);
      setDragOffset(0);
    }
  };
  const notify = (text) => setNotice(text);
  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setMenu(!menu)}>
          <Menu />
        </button>
        <div className="brand">
          <img src={logo} alt="DRISHTI" className="eye-logo" />
          <strong>DRISHTI</strong>
        </div>
        <div className="admin-pill">
          <i /> I4C Admin
        </div>
        <div className="sync">
          <i /> 1,204 zones monitored <b>•</b> last sync 12s ago
        </div>
        <div className="top-actions">
          <label className="search">
            <Search size={19} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search case ID / zone / location..."
            />
          </label>
          <button
            className="bell"
            onClick={() => notify("You have 3 new alerts")}
          >
            <Bell />
            <em>3</em>
          </button>
          <button className="avatar">SA</button>
        </div>
      </header>
      <div className={`layout ${menu ? "menu-open" : ""}`}>
        <aside className="sidebar">
          <nav>
            {nav.map(([name, I, path]) => (
              <button
                key={name}
                className={active === name ? "active" : ""}
                onClick={() => {
                  setActive(name);
                  navigate(path);
                }}
              >
                <I size={21} />
                <span>{name}</span>
                {name === "Alerts" && <b>3</b>}
              </button>
            ))}
          </nav>
          <div className="safer">
            <Shield size={35} />
            <strong>Safer Communities</strong>
            <small>Stronger India</small>
            <div className="wave" />
          </div>
        </aside>
        <section className="content">
                    <div className="welcome" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1>Good morning, Officer RISHI</h1>
             <p>
  {new Date().toLocaleDateString('en-US', { 
    weekday: 'short', 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  })} • Shift: 08:00 AM – 04:00 PM
</p>
            </div>
            <button className="live-button" onClick={() => navigate("/complaint")}>
              + File New Complaint
            </button>
          </div>
          <section
            className="stat-viewport"
            onPointerDown={startDrag}
            onPointerMove={dragCard}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={endDrag}
            style={{ cursor: dragStart === null ? "grab" : "grabbing" }}
          >
            <div
              className="stat-slider"
              style={{
                transform: `translateX(calc(${slide * -25}% + ${dragOffset}px))`,
              }}
            >
                            <Stat n="01" label="Total Active Cases" value={overview?.total_active ?? "—"} tone="blue" arrow />
              <Stat n="02" label="New / Unassigned" value={overview?.new_unassigned ?? "—"} tone="lavender" />
              <Stat n="03" label="Under Investigation" value={overview?.under_investigation ?? "—"} tone="cyan" />
              <Stat n="04" label="Pending Approval" value={overview?.pending_approval ?? "—"} tone="pink" />
                           <Stat n="01" label="Total Active Cases" value={overview?.total_active ?? "—"} tone="blue" arrow />
              <Stat n="02" label="New / Unassigned" value={overview?.new_unassigned ?? "—"} tone="lavender" />
              <Stat n="03" label="Under Investigation" value={overview?.under_investigation ?? "—"} tone="cyan" />
              <Stat n="04" label="Pending Approval" value={overview?.pending_approval ?? "—"} tone="pink" />
            </div>
          </section>
          <div className="slider-controls">
            <button onClick={() => moveSlide(-1)}>
              <ChevronLeft />
            </button>
            <div>
              {[0, 1, 2, 3].map((i) => (
                <i
                  key={i}
                  className={slide === i ? "selected" : ""}
                  onClick={() => setSlide(i)}
                />
              ))}
            </div>
            <button onClick={() => moveSlide(1)}>
              <ChevronRight />
            </button>
          </div>
          <div className="main-grid">
            <div className="left-column">
              <section className="card">
                <Title
                  text="Breakdown by Crime Category"
                  action="View All Categories"
                  onClick={() => notify("Showing all crime categories")}
                />
                <div className="category-list">
                  {categories.map(([name, num, pct, tone, I]) => (
                    <button
                      className="category-row"
                      key={name}
                      onClick={() => notify(`${name}: ${num} cases`)}
                    >
                      <span className={`cat-icon ${tone}`}>
                        <I size={17} />
                      </span>
                      <span className="cat-name">{name}</span>
                      <span className="bar">
                        <i
                          className={tone}
                          style={{
                            width:
                              pct === "36%"
                                ? "82%"
                                : pct === "25.1%"
                                  ? "64%"
                                  : pct === "15.2%"
                                    ? "43%"
                                    : pct === "10.5%"
                                      ? "29%"
                                      : pct === "6.6%"
                                        ? "20%"
                                        : "19%",
                          }}
                        />
                      </span>
                      <strong>{num}</strong>
                      <small>{pct}</small>
                    </button>
                  ))}
                </div>
              </section>
              <section className="card recent">
                <Title
                  text="Recent Activity"
                  action="View All"
                  onClick={() => notify("Showing all recent activity")}
                />
                <div className="timeline">
                  {activities.map(([time, title, detail, color]) => (
                    <button
                      className="event"
                      key={time}
                      onClick={() => notify(`${title} at ${time}`)}
                    >
                      <i className={color} />
                      <time>{time}</time>
                      <span>
                        {title}
                        <br />
                        <small>{detail}</small>
                      </span>
                    </button>
                  ))}
                </div>
              </section>
              <button
                className="live-button"
                onClick={() => {
                  setActive("Command Centre");
                  notify("Opening live command centre");
                }}
              >
                <MapPin /> Open Live Command Centre <ArrowRight size={16} />
              </button>
            </div>
            <section className="card attention">
              <Title
                text="Needs Your Attention Today"
                action="View All"
                onClick={() => notify("Showing all attention items")}
              />
              <div className="attention-list">
                {attention.map((item, i) => (
                  <Attention
                    key={item[0]}
                    item={item}
                    open={expanded === i}
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    notify={notify}
                  />
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
      {notice && (
        <button className="toast" onClick={() => setNotice("")}>
          <Bell size={16} />
          {notice}
          <X size={14} />
        </button>
      )}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap");
        * {
          box-sizing: border-box;
        }
        html,
        body {
          width: 100%;
          overflow-x: hidden;
        }
        body {
          margin: 0;
          background: linear-gradient(125deg, #f5f7ff, #eef2ff 45%, #fff2fb);
          color: #101d68;
          font-family: "DM Sans", Arial, sans-serif;
        }
        button {
          font: inherit;
          color: inherit;
          cursor: pointer;
          border: 0;
          transition:
            transform 0.18s ease,
            box-shadow 0.18s ease,
            filter 0.18s ease;
        }
        button:hover {
          transform: translateY(-2px);
        }
        button:active {
          transform: translateY(2px);
        }
        .app-shell {
          width: 100%;
          min-height: 100vh;
          padding: 0;
        }
        .topbar {
          height: 68px;
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 0 24px;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 15px;
          min-width: 255px;
        }
        .brand strong {
          font: 700 39px "Playfair Display";
          letter-spacing: -2px;
          color: #07175f;
        }
        .eye-logo {
  width: 115px;
  height: 100px;
  object-fit: contain;
}
        .admin-pill {
          padding: 9px 14px;
          border: 1px solid #dbe3ff;
          border-radius: 22px;
          background: #f8faff;
          box-shadow: 0 4px 13px #bec7ef45;
          font-size: 13px;
          color: #27369c;
        }
        .live-button,
        .alert-button,
        .stat,
        .priority,
        .sidebar nav button,
        .slider-controls button,
        .cat-icon,
        .attention-item {
          box-shadow:
            0 6px 0 #b6bdf0,
            0 11px 20px #7180ce2e;
        }
        .live-button:active,
        .alert-button:active,
        .stat:active,
        .priority:active,
        .sidebar nav button:active,
        .slider-controls button:active {
          box-shadow:
            0 2px 0 #929be0,
            0 5px 10px #7180ce2e;
        }
        .live-button,
        .alert-button {
          background: linear-gradient(145deg, #3168ff, #087be6);
          color: white;
          font-weight: 700;
        }
        .admin-pill i,
        .sync i {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: #12c4bd;
          border-radius: 50%;
          margin-right: 7px;
        }
        .sync {
          margin: auto;
          font-size: 13px;
          color: #10237c;
        }
        .sync b {
          padding: 0 12px;
        }
        .top-actions {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .search {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 300px;
          background: linear-gradient(145deg, #ffffff, #edf2ff);
          border: 1px solid #cbd6ff;
          border-radius: 24px;
          padding: 10px 15px;
          color: #1528a2;
          box-shadow:
            inset 0 2px 4px #fff,
            inset 0 -3px 7px #c8d2f8,
            0 6px 14px #9aa9e833;
          transition:
            width 0.25s ease,
            box-shadow 0.2s ease,
            transform 0.2s ease;
        }
        .search:focus-within {
          width: 350px;
          transform: translateY(-2px);
          box-shadow:
            inset 0 2px 4px #fff,
            0 0 0 4px #aebcff66,
            0 10px 22px #7186dd40;
        }
        .search input {
          border: 0;
          outline: 0;
          background: transparent;
          width: 100%;
          font: 600 12px Arial;
          color: #14257e;
        }
        .search input::placeholder {
          color: #6875b2;
        }
        .bell,
        .avatar,
        .mobile-menu {
          background: transparent;
          position: relative;
        }
        .bell em {
          position: absolute;
          right: -7px;
          top: -8px;
          background: #e71958;
          color: white;
          border-radius: 20px;
          font-size: 11px;
          font-style: normal;
          width: 20px;
          height: 20px;
          line-height: 20px;
        }
        .avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #6071bd;
          color: white;
          font-weight: 700;
        }
        .layout {
          display: flex;
          gap: 20px;
        }
        .sidebar {
          width: 246px;
          min-height: calc(100vh - 95px);
          border-radius: 18px;
          padding: 16px 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: linear-gradient(145deg, #fff8ffb8, #edf2ffdd);
          box-shadow: 0 5px 20px #bec8ef36;
        }
        .sidebar nav {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .sidebar nav button {
          height: 53px;
          border-left: 4px solid transparent;
          border-radius: 0 15px 15px 0;
          background: transparent;
          display: flex;
          align-items: center;
          gap: 17px;
          padding: 0 20px;
          color: #203598;
          font-size: 15px;
          text-align: left;
          position: relative;
        }
        .sidebar nav button:hover,
        .sidebar nav button.active {
          background: linear-gradient(100deg, #eef0ff, #e1e5ff);
          border-left-color: #7546fc;
          color: #091ab0;
        }
        .sidebar nav button b {
          position: absolute;
          right: 20px;
          background: #ef1763;
          color: white;
          border-radius: 50%;
          font-size: 12px;
          width: 27px;
          height: 27px;
          text-align: center;
          line-height: 27px;
        }
        .safer {
          margin: 15px 10px 0;
          padding: 14px 17px 17px;
          border: 1px solid #d7e0fe;
          border-radius: 16px;
          background: linear-gradient(145deg, #f7fcff, #e9f3ff);
          overflow: hidden;
          color: #1228ad;
        }
        .safer strong,
        .safer small {
          display: block;
          margin-left: 48px;
        }
        .safer strong {
          font-size: 12px;
          margin-top: -30px;
        }
        .safer small {
          font-size: 11px;
          color: #6072bc;
          margin-top: 4px;
        }
        .safer svg {
          float: left;
        }
        .wave {
          height: 29px;
          margin: 13px -18px -18px;
          background: linear-gradient(
            170deg,
            transparent 35%,
            #a5e0ff 36%,
            #ced7ff 58%,
            transparent 59%
          );
        }
        .content {
          flex: 1;
          min-width: 0;
        }
        .welcome {
          padding: 5px 4px 18px;
        }
        .welcome h1 {
          margin: 0;
          font: 700 32px "Playfair Display";
          color: #071258;
        }
        .welcome p {
          margin: 6px 0 0;
          color: #172eaa;
          font-size: 16px;
        }
        .welcome p b {
          padding: 0 9px;
        }
        .stat-slider {
          display: grid;
          grid-template-columns: 1.1fr 1.22fr 1.1fr 1.1fr;
          gap: 10px;
        }
        .stat {
          height: 91px;
          border-radius: 17px;
          padding: 19px 24px;
          display: flex;
          align-items: center;
          gap: 22px;
          border: 1px solid white;
          box-shadow: 0 8px 22px #a6b3ea60;
          position: relative;
          overflow: hidden;
        }
        .stat .num {
          font-size: 23px;
          border: 1px solid #ffffffaa;
          border-radius: 12px;
          padding: 8px 10px;
        }
        .stat label {
          display: block;
          font-size: 14px;
          font-weight: 600;
        }
        .stat strong {
          display: block;
          font-size: 29px;
          margin-top: 2px;
        }
        .stat.lavender {
          background: linear-gradient(110deg, #efedff, #be9bf5);
          color: #3a19b3;
        }
        .stat.blue {
          background: linear-gradient(110deg, #4e75ee, #12a5ef);
          color: #fff;
          box-shadow: 0 10px 25px #4331d994;
        }
        .stat.cyan {
          background: linear-gradient(110deg, #d6f5ff, #a8def7);
          color: #08318f;
        }
        .stat.pink {
          background: linear-gradient(110deg, #ffe7f5, #f7b7db);
          color: #5c147a;
        }
        .stat .arrow {
          font-size: 32px;
          margin-left: auto;
        }
        .slider-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 42px;
          gap: 25px;
        }
        .slider-controls button {
          background: transparent;
          color: #80a4ee;
        }
        .slider-controls div {
          display: flex;
          gap: 8px;
        }
        .slider-controls i {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #b9ccf1;
        }
        .slider-controls i.selected {
          background: #6532de;
          box-shadow: 0 0 0 3px #d9d4ff;
        }
        .main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.62fr) minmax(370px, 1fr);
          gap: 16px;
        }
        .left-column,
        .attention-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .card {
          background: linear-gradient(140deg, #ffffffdb, #f8faffc9);
          border: 1px solid #d7e1fc;
          border-radius: 15px;
          box-shadow: 0 6px 18px #adbaf044;
          padding: 14px 20px;
        }
        .card-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }
        .card h2 {
          font: 700 21px "Playfair Display";
          color: #07135d;
          margin: 0;
        }
        .card-title button {
          background: transparent;
          color: #122eda;
          font: 12px Arial;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .category-row {
          width: 100%;
          height: 43px;
          border-top: 1px solid #dfe4fa;
          background: transparent;
          display: flex;
          align-items: center;
          gap: 13px;
          color: #081779;
          text-align: left;
        }
        .category-row:first-child {
          border-top: 0;
        }
        .cat-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #dbe7ff;
          color: #1150de;
        }
        .cat-name {
          width: 183px;
          font-size: 14px;
        }
        .bar {
          height: 17px;
          background: #e4eafa;
          border-radius: 12px;
          flex: 1;
          overflow: hidden;
        }
        .bar i {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #1a79ed, #13c5e5);
        }
        .bar i.purple,
        .bar i.violet {
          background: linear-gradient(90deg, #5530eb, #ad6ce8);
        }
        .bar i.orange {
          background: #ffa70f;
        }
        .bar i.gray {
          background: #8ca1d4;
        }
        .category-row strong {
          width: 45px;
          font-size: 14px;
        }
        .category-row small {
          width: 45px;
          color: #5969b4;
          font-size: 12px;
        }
        .recent {
          padding-bottom: 21px;
        }
        .timeline {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          padding: 19px 7px 0;
          position: relative;
        }
        .timeline:before {
          content: "";
          height: 2px;
          position: absolute;
          left: 10px;
          right: 10px;
          top: 20px;
          background: #dce4fc;
        }
        .event {
          position: relative;
          background: transparent;
          border: 0;
          border-left: 1px solid #d2ddfb;
          text-align: left;
          padding: 23px 10px 0;
          color: #22379e;
        }
        .event:first-child {
          border-left: 0;
        }
        .event i {
          position: absolute;
          top: 14px;
          left: -5px;
          width: 11px;
          height: 11px;
          border-radius: 50%;
          z-index: 1;
          background: #1488ec;
        }
        .event i.purple {
          background: #5f35e8;
        }
        .event i.pink {
          background: #ef1a6c;
        }
        .event time {
          font-size: 12px;
          display: block;
          margin-bottom: 5px;
        }
        .event span {
          font-size: 13px;
          line-height: 1.65;
        }
        .live-button {
          height: 45px;
          border: 1.5px solid #5035ee;
          background: #fff9;
          border-radius: 24px;
          color: #3520db;
          font-weight: 600;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 26px;
          width: max-content;
        }
        .attention {
          padding-bottom: 19px;
        }
        .attention-item {
          border: 1px solid #d9e2fc;
          border-left: 5px solid #f0256a;
          border-radius: 13px;
          padding: 12px 16px 12px 22px;
          box-shadow: 0 5px 12px #c1caea40;
          background: #ffffff92;
        }
        .attention-item.orange {
          border-left-color: #1691ef;
        }
        .attention-head {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .attention-num {
          background: #ffe1f0;
          color: #ca246c;
          font-weight: 700;
          border-radius: 9px;
          padding: 7px 9px;
        }
        .orange .attention-num {
          background: #dff1ff;
          color: #126bce;
        }
        .attention-head strong {
          font: 700 16px "Playfair Display";
          color: #0e1c6e;
        }
        .risk-badge {
          margin-left: auto;
          color: white;
          border-radius: 16px;
          padding: 7px 14px;
          font-size: 11px;
          font-weight: 700;
          background: #f2225e;
        }
        .orange .risk-badge {
          background: #ffad16;
        }
        .attention-metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-top: 10px;
        }
        .metric {
          border-right: 1px solid #d7dff5;
          color: #5364b6;
          font-size: 12px;
        }
        .metric:last-child {
          border: 0;
        }
        .metric strong {
          display: block;
          color: #ef195d;
          font-size: 25px;
          line-height: 1.1;
        }
        .orange .metric strong {
          color: #ee9c0d;
        }
        .confidence {
          display: flex;
          align-items: end;
          gap: 10px;
        }
        .confidence div {
          height: 9px;
          border-radius: 8px;
          background: #dce5fb;
          flex: 1;
          margin-bottom: 5px;
        }
        .confidence i {
          display: block;
          height: 100%;
          background: linear-gradient(90deg, #1786ee, #bc57ed);
          border-radius: inherit;
        }
        .attention-note {
          font-size: 12px;
          color: #334ab0;
          margin: 8px 0;
        }
        .alert-button {
          width: 100%;
          border: 0;
          border-radius: 19px;
          background: linear-gradient(90deg, #0785ed, #118bed);
          color: #fff;
          height: 41px;
          font-size: 14px;
          font-weight: 700;
          margin-top: 9px;
        }
        .attention-extra {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.25s ease;
          color: #3e52ae;
          font-size: 12px;
        }
        .attention-item.open .attention-extra {
          max-height: 50px;
        }
        .toast {
          position: fixed;
          right: 25px;
          bottom: 25px;
          border: 0;
          border-radius: 12px;
          background: #1729a0;
          color: white;
          padding: 13px 17px;
          box-shadow: 0 8px 25px #1928a055;
          display: flex;
          align-items: center;
          gap: 9px;
          z-index: 20;
        }
        .toast svg:last-child {
          margin-left: 8px;
        }
        .mobile-menu {
          display: none;
          background: transparent;
        }
        .stat-viewport {
          overflow: hidden;
          margin: 0 -4px;
          padding: 0 4px;
          touch-action: pan-y;
        }
        .stat-slider {
          display: flex;
          gap: 12px;
          transition: transform 0.38s cubic-bezier(0.22, 0.61, 0.36, 1);
          will-change: transform;
        }
        .stat-slider > .stat {
          flex: 0 0 calc((100% - 36px) / 4);
        }
        @media (max-width: 1200px) and (min-width: 701px) {
          .app-shell {
            padding: 0;
          }
          .topbar {
            height: 48px;
            gap: 10px;
            padding: 0 14px;
          }
          .brand {
            min-width: 185px;
            gap: 9px;
          }
          .brand strong {
            font-size: 29px;
          }
          .eye-logo {
            width: 50px;
            height: 30px;
          }
          .admin-pill {
            padding: 7px 10px;
            font-size: 11px;
          }
          .sync {
            font-size: 11px;
          }
          .top-actions {
            gap: 8px;
          }
          .search {
            width: 220px;
            padding: 8px 11px;
          }
          .search:focus-within {
            width: 260px;
          }
          .layout {
            gap: 10px;
          }
          .sidebar {
            width: 180px;
            padding: 12px 8px;
          }
          .sidebar nav button {
            padding: 10px 11px;
            font-size: 11px;
            gap: 10px;
          }
          .sidebar nav button svg {
            width: 17px;
            height: 17px;
          }
          .safer {
            padding: 12px 8px;
            font-size: 10px;
          }
          .content {
            min-width: 0;
          }
          .welcome {
            padding: 10px 4px 12px;
          }
          .welcome h1 {
            font-size: 30px;
          }
          .welcome p {
            font-size: 13px;
          }
          .stat-slider {
            gap: 8px;
          }
          .stat {
            height: 78px;
            padding: 11px 12px;
            gap: 10px;
          }
          .stat .num {
            font-size: 18px;
            padding: 7px 9px;
          }
          .stat label {
            font-size: 11px;
          }
          .stat strong {
            font-size: 22px;
          }
          .main-grid {
            gap: 12px;
          }
          .card {
            padding: 14px;
          }
          .card-title h2 {
            font-size: 18px;
          }
          .category-row {
            gap: 8px;
            padding: 7px 4px;
          }
          .cat-name {
            width: 105px;
            font-size: 12px;
          }
          .bar {
            height: 13px;
          }
          .category-row strong {
            font-size: 12px;
            width: 42px;
          }
          .category-row small {
            font-size: 11px;
            width: 32px;
          }
          .attention-item {
            padding: 12px;
          }
          .attention-head strong {
            font-size: 13px;
          }
          .metric {
            font-size: 11px;
          }
          .metric strong {
            font-size: 21px;
          }
          .attention-note {
            font-size: 11px;
          }
          .alert-button {
            padding: 10px;
            font-size: 11px;
          }
          .timeline {
            gap: 6px;
          }
          .event {
            padding: 10px 5px 4px;
            font-size: 11px;
          }
          .event time {
            font-size: 10px;
          }
          .live-button {
            padding: 10px 16px;
            font-size: 12px;
          }
        }
        @media (max-width: 1120px) and (min-width: 701px) {
          .sidebar {
            width: 180px;
          }
          .brand {
            min-width: 185px;
          }
          .sync {
            display: none;
          }
          .main-grid {
            grid-template-columns: 1fr;
          }
          .attention-list {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
          }
          .stat-slider {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      @media (max-width: 700px) {
  .app-shell { padding: 10px; }

  /* ---------- Topbar ---------- */
  .topbar { height: 58px; padding: 0 4px; gap: 10px; }
  .mobile-menu { display: block; flex: none; padding: 6px; }
  .brand { min-width: 0; gap: 8px; }
  .brand strong { font-size: 24px; letter-spacing: -1px; }
  .eye-logo { width: 38px; height: 38px; }
  .admin-pill, .search, .sync { display: none; }
  .top-actions { margin-left: auto; gap: 14px; }
  .avatar { width: 38px; height: 38px; font-size: 13px; }

  /* ---------- Sidebar (hamburger menu) ---------- */
  .layout { display: block; }
  .sidebar { display: none; width: 100%; min-height: 0; margin-bottom: 12px; padding: 10px 0; }
  .layout.menu-open .sidebar { display: flex; }
  .sidebar nav { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding-right: 8px; }
  .sidebar nav button { height: 46px; padding: 0 10px; gap: 9px; font-size: 13px; }
  .sidebar nav button svg { width: 18px; height: 18px; flex: none; }
  .sidebar nav button span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sidebar nav button b { right: 8px; width: 21px; height: 21px; line-height: 21px; font-size: 11px; }
  .safer { display: none; }

  /* ---------- Welcome ---------- */
  .welcome { flex-direction: column; align-items: stretch !important; gap: 12px; padding: 4px 2px 12px; }
  .welcome h1 { font-size: 22px; line-height: 1.25; }
  .welcome p { font-size: 12px; line-height: 1.5; }

  /* ---------- Stat cards: slider ki jagah 2x2 grid ---------- */
  .stat-viewport { margin: 0; padding: 0; touch-action: auto; cursor: default !important; }
  .stat-slider {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    transform: none !important; /* inline transform ko override karne ke liye */
    transition: none;
  }
  .stat-slider > .stat:nth-child(n + 5) { display: none; } /* duplicate 4 cards hide */
  .stat-slider > .stat { min-width: 0; }
  .stat { height: auto; min-height: 84px; padding: 12px; gap: 10px; border-radius: 15px; }
  .stat > div { min-width: 0; }
  .stat .num { font-size: 15px; padding: 5px 7px; border-radius: 9px; }
  .stat label { font-size: 11px; line-height: 1.25; }
  .stat strong { font-size: 22px; }
  .stat .arrow { display: none; }
  .slider-controls { display: none; }

  /* ---------- Main grid & cards ---------- */
  .main-grid { display: flex; flex-direction: column; gap: 12px; }
  .left-column, .attention-list { gap: 12px; }
  .card { padding: 13px; }
  .card h2 { font-size: 17px; }
  .card-title { gap: 8px; margin-bottom: 8px; }
  .card-title h2 { flex: 1; min-width: 0; line-height: 1.2; }
  .card-title button { flex: none; white-space: nowrap; font-size: 11px; }

  /* ---------- Category rows: 2 line layout ---------- */
  .category-row {
    display: grid;
    grid-template-columns: 30px minmax(0, 1fr) auto auto;
    grid-template-areas:
      "icon name num pct"
      ".    bar  bar bar";
    column-gap: 10px;
    row-gap: 6px;
    height: auto;
    padding: 9px 0;
  }
  .category-row .cat-icon { grid-area: icon; width: 30px; height: 30px; box-shadow: 0 2px 0 #b6bdf0, 0 5px 9px #7180ce2e; }
  .category-row .cat-name { grid-area: name; width: auto; font-size: 13px; }
  .category-row strong { grid-area: num; width: auto; font-size: 13px; text-align: right; }
  .category-row small { grid-area: pct; width: 40px; font-size: 11px; text-align: right; }
  .category-row .bar { grid-area: bar; flex: none; height: 8px; }

  /* ---------- Recent Activity: vertical timeline ---------- */
  .recent { padding-bottom: 13px; overflow: hidden; }
  .timeline { display: flex; flex-direction: column; overflow: visible; padding: 2px 0 0 6px; }
  .timeline:before { left: 10.5px; right: auto; width: 2px; height: auto; top: 20px; bottom: 20px; }
  .event { display: flex; align-items: baseline; gap: 12px; border-left: 0; padding: 8px 0 8px 22px; }
  .event i { top: 50%; left: 0; margin-top: -6px; }
  .event time { display: block; flex: none; width: 62px; margin: 0; font-size: 12px; }
  .event span { font-size: 13px; line-height: 1.45; }

  /* ---------- Needs Your Attention ---------- */
  .attention { padding-bottom: 13px; }
  .attention-item { padding: 12px 12px 12px 16px; }
  .attention-head { gap: 8px; }
  .attention-head strong { min-width: 0; font-size: 14px; line-height: 1.25; }
  .attention-num { flex: none; padding: 6px 8px; font-size: 13px; }
  .risk-badge { flex: none; padding: 6px 10px; font-size: 10px; }
  .attention-metrics { gap: 10px; }
  .metric strong { font-size: 22px; }
  .metric.confidence { display: block; }
  .metric.confidence div { margin: 6px 0 0; }
  .attention-note { display: flex; align-items: flex-start; gap: 6px; line-height: 1.4; }
  .attention-note svg { flex: none; margin-top: 1px; }
  .attention-item.open .attention-extra { max-height: 80px; }
  .alert-button { height: 40px; font-size: 13px; }

  /* ---------- Buttons & toast ---------- */
  .live-button { width: 100%; justify-content: center; padding: 0 16px; font-size: 13px; }
  .toast { left: 12px; right: 12px; bottom: 12px; font-size: 13px; }
  .toast svg:last-child { margin-left: auto; }
}
      `}</style>
    </main>
  );
}
function Stat({ n, label, value, tone, arrow }) {
  return (
    <div className={`stat ${tone}`}>
      <span className="num">{n}</span>
      <div>
        <label>{label}</label>
        <strong>{value}</strong>
      </div>
      {arrow && <span className="arrow">→</span>}
    </div>
  );
}
function Title({ text, action, onClick }) {
  return (
    <div className="card-title">
      <h2>{text}</h2>
      <button onClick={onClick}>
        {action} <ArrowRight size={14} />
      </button>
    </div>
  );
}
function Attention({ item, open, onClick, notify }) {
  const [n, title, score, confidence, surge, network, level, tone] = item;
  return (
    <article
      className={`attention-item ${tone === "orange" ? "orange" : ""} ${open ? "open" : ""}`}
      onClick={onClick}
    >
      <div className="attention-head">
        <span className="attention-num">{n}</span>
        <strong>{title}</strong>
        <span className="risk-badge">{level}</span>
      </div>
      <div className="attention-metrics">
        <div className="metric">
          Risk Score<strong>{score}</strong>
        </div>
        <div className="metric confidence">
          Confidence<strong>{confidence}</strong>
          <div>
            <i style={{ width: confidence }} />
          </div>
        </div>
      </div>
      <p className="attention-note">
        <AlertTriangle size={15} /> Complaint surge {surge}, network risk{" "}
        {network}
      </p>
      <div className="attention-extra">
        Review the zone activity and create a monitoring alert for this
        location.
      </div>
      <button
        className="alert-button"
        onClick={(e) => {
          e.stopPropagation();
          notify(`Creating alert for ${title}`);
        }}
      >
        View &amp; Create Alert →
      </button>
    </article>
  );
}
