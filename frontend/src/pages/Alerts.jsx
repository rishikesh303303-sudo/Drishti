import { useMemo, useState } from "react";
import { useEffect } from "react";
import {
  getAlerts,
  approveAlert as apiApprove,
  rejectAlert as apiReject,
  dispatchAlert as apiDispatch,
  markAlertActioned as apiActioned,
} from "../lib/api";

const COLUMN_META = [
  { id: "draft", title: "Draft", icon: "file" },
  { id: "approved", title: "Approved", icon: "shield" },
  { id: "dispatched", title: "Dispatched", icon: "plane" },
  { id: "actioned", title: "Actioned", icon: "check" },
];

function timeAgo(dateString) {
  if (!dateString) return "";
  const diffMs = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diffMs / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function toCard(alert) {
  return {
    id: alert.id,
    priority: (alert.priority || "MEDIUM").toUpperCase(),
    zone: alert.zone_name || `Zone ${alert.zone_id}`,
    description: alert.message || "",
    time: timeAgo(alert.created_at),
    avatars: ["MP", "DL"],
    extra: "",
    status: alert.status,
  };
}

function buildColumns(alerts) {
  return COLUMN_META.map((meta) => ({
    ...meta,
    cards: alerts.filter((a) => a.status === meta.id).map(toCard),
  }));
}

const initialColumns = COLUMN_META.map((meta) => ({ ...meta, cards: [] }));

const icons = {
  eye: (
    <>
      <path d="M3 12s3.4-6 9-6 9 6 9 6-3.4 6-9 6-9-6-9-6Z" />
      <circle cx="12" cy="12" r="2.7" />
      <path d="m5 4 3 2M19 4l-3 2" />
    </>
  ),
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.5" />
      <path d="m16 16 4.2 4.2" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" />
    </>
  ),
  file: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </>
  ),
  shield: (
    <>
      <path d="m12 3 7 3v5c0 4.6-3 8.2-7 10-4-1.8-7-5.4-7-10V6l7-3Z" />
      <path d="m9.5 12 1.7 1.7 3.5-3.5" />
    </>
  ),
  plane: <path d="m3 11 18-8-6.4 18-3.6-7-8-3Zm8 3 5-6" />,
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.7 2.7L16 9.5" />
    </>
  ),
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  alert: (
    <>
      <path d="m12 3 9 17H3L12 3Z" />
      <path d="M12 9v4M12 16h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  close: (
    <>
      <path d="m6 6 12 12M18 6 6 18" />
    </>
  ),
  chat: (
    <>
      <path d="M4 5h16v11H8l-4 4V5Z" />
      <path d="M8 9h8M8 12h5" />
    </>
  ),
  network: (
    <>
      <circle cx="5" cy="12" r="2" />
      <circle cx="19" cy="6" r="2" />
      <circle cx="19" cy="18" r="2" />
      <path d="m7 11 10-4M7 13l10 4" />
    </>
  ),
  building: (
    <>
      <path d="M4 21V5l8-3 8 3v16M8 9h.01M12 9h.01M16 9h.01M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  chevron: <path d="m7 9 5 5 5-5" />,
  more: (
    <>
      <circle cx="5" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="19" cy="12" r="1" fill="currentColor" />
    </>
  ),
};

function Icon({ name, size = 18, strokeWidth = 1.8 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

function Header() {
  const [search, setSearch] = useState("");
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark">
          <Icon name="eye" size={36} strokeWidth={1.6} />
        </div>
        <strong>DRISHTI</strong>
        <span className="role">
          <i />
          14C Admin
        </span>
      </div>
      <div className="sync">
        <i /> <b>1,204 zones monitored</b>
        <em>•</em> last sync 12s ago
      </div>
      <div className="header-tools">
        <label className="header-search">
          <Icon name="search" size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search case ID / zone / location..."
          />
        </label>
        <button className="bell" aria-label="Notifications">
          <Icon name="bell" size={22} />
          <sup>3</sup>
        </button>
        <div className="avatar top-avatar">SA</div>
      </div>
    </header>
  );
}

function SelectFilter({ label, value, options, onChange }) {
  return (
    <label className="select-filter">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <Icon name="chevron" size={16} />
    </label>
  );
}

function FilterBar({ filters, setFilters }) {
  const clear = () =>
    setFilters({
      search: "",
      priority: "All Priorities",
      zone: "All Zones",
      date: "Last 24 Hours",
    });
  return (
    <div className="filter-bar">
      <label className="search-immersive">
        <Icon name="search" size={21} />
        <input
          value={filters.search}
          onChange={(event) =>
            setFilters({ ...filters, search: event.target.value })
          }
          placeholder="Search alerts by case ID, zone, or keyword..."
        />
      </label>
      <SelectFilter
        label="Priority"
        value={filters.priority}
        onChange={(value) => setFilters({ ...filters, priority: value })}
        options={["All Priorities", "Critical", "HIGH", "MEDIUM", "LOW"]}
      />
      <SelectFilter
        label="Zone"
        value={filters.zone}
        onChange={(value) => setFilters({ ...filters, zone: value })}
        options={[
          "All Zones",
          "North Delhi Zone 14",
          "East Delhi Zone 07",
          "South Delhi Zone 21",
          "Central Delhi Zone 03",
          "West Delhi Zone 09",
        ]}
      />
      <SelectFilter
        label="Date Range"
        value={filters.date}
        onChange={(value) => setFilters({ ...filters, date: value })}
        options={[
          "Last 1 Hour",
          "Last 3 Hours",
          "Last 24 Hours",
          "Custom Range",
        ]}
      />
      <button className="clear-filter" onClick={clear}>
        <Icon name="filter" size={16} />
        Clear Filters
      </button>
    </div>
  );
}

function PriorityBadge({ priority }) {
  return (
    <span className={`priority ${priority.toLowerCase()}`}>{priority}</span>
  );
}
function AvatarStack({ avatars, extra }) {
  return (
    <div className="avatar-stack">
      {avatars.map((avatar, index) => (
        <span key={avatar} className={`mini-avatar a${index}`}>
          {avatar}
        </span>
      ))}
      <b>{extra}</b>
    </div>
  );
}

function AlertCard({
  alert,
  columnId,
  selected,
  onSelect,
  onApprove,
  onDragStart,
  onMenu,
}) {
  return (
    <article
      className={`alert-card ${selected ? "selected" : ""}`}
      draggable={columnId !== "draft" && columnId !== "actioned"}
      onDragStart={(event) => onDragStart(event, alert, columnId)}
      onClick={() => onSelect(alert)}
    >
      <div className="card-top">
        <PriorityBadge priority={alert.priority} />
        <span className="case-id">{alert.id}</span>
      </div>
      <h3>{alert.zone}</h3>
      <p>{alert.description}</p>
      <div className="card-bottom">
        <AvatarStack avatars={alert.avatars} extra={alert.extra} />
        <span className="card-time">{alert.time}</span>
        <button
          className="more-button"
          onClick={(event) => {
            event.stopPropagation();
            onMenu(alert.id);
          }}
          aria-label={`Actions for ${alert.id}`}
        >
          <Icon name="more" size={16} />
        </button>
      </div>
      {alert.menuOpen && (
        <div className="card-menu" onClick={(event) => event.stopPropagation()}>
          {columnId === "draft" && (
            <button onClick={() => onApprove(alert)}>Approve Alert</button>
          )}
          <button onClick={() => onSelect(alert)}>View Details</button>
        </div>
      )}
    </article>
  );
}

function KanbanColumn({
  column,
  visibleCards,
  selectedId,
  onSelect,
  onApprove,
  onDragStart,
  onDrop,
  onMenu,
}) {
  return (
    <section
      className={`kanban-column ${column.id}`}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => onDrop(event, column.id)}
    >
      <header className="column-header">
        <div className="column-icon">
          <Icon name={column.icon} size={22} />
        </div>
        <h2>{column.title}</h2>
        <span className="column-count">{column.cards.length}</span>
      </header>
      <div className="column-cards">
        {visibleCards.length ? (
          visibleCards.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              columnId={column.id}
              selected={selectedId === alert.id}
              onSelect={onSelect}
              onApprove={onApprove}
              onDragStart={onDragStart}
              onMenu={onMenu}
            />
          ))
        ) : (
          <div className="empty-column">No alerts match your filters</div>
        )}
      </div>
    </section>
  );
}

function WorkflowBoard({
  columns,
  filteredColumns,
  selectedId,
  setSelectedId,
  approveAlert,
  moveAlert,
  setMenuOpen,
}) {
  const [dragged, setDragged] = useState(null);
  const onDragStart = (event, alert, from) => {
    setDragged({ alert, from });
    event.dataTransfer.effectAllowed = "move";
  };
  const onDrop = (event, to) => {
    event.preventDefault();
    if (!dragged || dragged.from === to) return;
    const allowed =
      (dragged.from === "approved" && to === "dispatched") ||
      (dragged.from === "dispatched" && to === "actioned");
    if (allowed) moveAlert(dragged.alert.id, dragged.from, to);
    setDragged(null);
  };
  return (
    <>
      <div className="board">
        <div className="board-grid">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              visibleCards={filteredColumns[column.id]}
              selectedId={selectedId}
              onSelect={(alert) => setSelectedId(alert.id)}
              onApprove={approveAlert}
              onDragStart={onDragStart}
              onDrop={onDrop}
              onMenu={setMenuOpen}
            />
          ))}
        </div>
      </div>
      <div className="helper-strip">
        <span>
          <Icon name="info" size={17} />
          Drag cards to move between columns (Draft → Approved requires
          approval)
        </span>
        <span className="showing">
          Showing 10 of 24 alerts <button aria-label="Previous page">‹</button>
          <button aria-label="Next page">›</button>
        </span>
      </div>
    </>
  );
}

function DetailHeader({ alert, onClose }) {
  return (
    <div className="drawer-header">
      <div className="drawer-title-row">
        <PriorityBadge priority={alert.priority} />
        <h2>{alert.zone}</h2>
        <span className="case-id">{alert.id}</span>
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Close alert details"
        >
          <Icon name="close" size={18} />
        </button>
      </div>
      <p>
        Created {alert.time} <i>•</i> Last updated 1h ago
      </p>
    </div>
  );
}

function AlertDetails({ alert }) {
  return (
    <section className="drawer-section inset">
      <h3>
        <Icon name="bell" size={17} />
        Alert Details
      </h3>
      <p>
        Multiple cash-out transactions detected in Zone GHY-14. High risk of
        fraud activity. Please deploy patrol unit and monitor nearby ATMs.
      </p>
    </section>
  );
}

const risks = [
  ["chat", "Complaint surge", "+21%", "pink", "78%"],
  ["network", "Network risk", "+17%", "purple", "66%"],
  ["building", "ATM density", "+12%", "blue", "49%"],
  ["clock", "Historical cash-out rate", "+8%", "amber", "32%"],
];
function RiskBreakdown() {
  return (
    <section className="drawer-section risk-section">
      <div className="section-heading">
        <h3>
          <Icon name="network" size={17} />
          Risk Breakdown
        </h3>
        <button>View details →</button>
      </div>
      {risks.map(([icon, label, percentage, tone, width]) => (
        <div className="risk-row" key={label}>
          <div className={`risk-icon ${tone}`}>
            <Icon name={icon} size={15} />
          </div>
          <span>{label}</span>
          <div className="risk-track">
            <i className={tone} style={{ width }} />
          </div>
          <b>{percentage}</b>
        </div>
      ))}
    </section>
  );
}

function SuggestedActions() {
  const [checks, setChecks] = useState([true, true, false]);
  const [approval, setApproval] = useState(true);
  const labels = [
    "Increase ATM monitoring",
    "Deploy patrol unit",
    "Notify nodal bank contact",
  ];
  return (
    <section className="drawer-section suggested">
      <h3>
        <Icon name="shield" size={17} />
        Suggested Actions
      </h3>
      {labels.map((label, index) => (
        <label className="check-row" key={label}>
          <input
            type="checkbox"
            checked={checks[index]}
            onChange={() =>
              setChecks(
                checks.map((checked, item) =>
                  item === index ? !checked : checked,
                ),
              )
            }
          />
          <span className="custom-check">✓</span>
          {label}
        </label>
      ))}
      <label className="toggle-row">
        <button
          className={`toggle ${approval ? "on" : ""}`}
          onClick={() => setApproval(!approval)}
          aria-label="Toggle senior officer approval"
        >
          <i />
        </button>
        Requires senior officer approval <Icon name="info" size={14} />
      </label>
    </section>
  );
}

const recipients = [
  ["MP", "MP Police", "Sent", "green"],
  ["DL", "Delhi Police", "Seen", "blue"],
  ["UP", "UP Bank", "Acknowledged", "orange"],
  ["IN", "I4C Node", "Action Taken", "purple"],
];
function SharedWith() {
  return (
    <section className="drawer-section shared">
      <div className="section-heading">
        <h3>
          <Icon name="shield" size={17} />
          Shared With
        </h3>
        <button>View all →</button>
      </div>
      <div className="recipient-row">
        {recipients.map(([initials, name, status, tone]) => (
          <div className="recipient" key={name}>
            <span className="recipient-avatar">{initials}</span>
            <strong>{name}</strong>
            <small className={tone}>
              <i />
              {status}
            </small>
          </div>
        ))}
      </div>
    </section>
  );
}

function AddRecipient() {
  const [term, setTerm] = useState("");
  const [selected, setSelected] = useState(["Maharashtra", "Uttar Pradesh"]);
  const states = [
    "Maharashtra",
    "Karnataka",
    "Gujarat",
    "Uttar Pradesh",
    "Rajasthan",
    "West Bengal",
  ];
  const shown = states.filter((state) =>
    state.toLowerCase().includes(term.toLowerCase()),
  );
  const toggle = (state) =>
    setSelected(
      selected.includes(state)
        ? selected.filter((item) => item !== state)
        : [...selected, state],
    );
  return (
    <section className="drawer-section add-recipient">
      <div className="section-heading">
        <h3>
          <Icon name="plus" size={17} />
          Add Recipient
        </h3>
        <button
          onClick={() =>
            setSelected(selected.length === states.length ? [] : states)
          }
        >
          Select All
        </button>
      </div>
      <label className="recipient-search">
        <Icon name="search" size={16} />
        <input
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Search states, banks or I4C nodes..."
        />
      </label>
      <div className="state-grid">
        {shown.map((state) => (
          <label key={state}>
            <input
              type="checkbox"
              checked={selected.includes(state)}
              onChange={() => toggle(state)}
            />
            <span className="custom-check">✓</span>
            {state}
          </label>
        ))}
      </div>
    </section>
  );
}

function AlertDrawer({ alert, onClose, onDispatch }) {
  return (
    <aside className="drawer">
      <DetailHeader alert={alert} onClose={onClose} />
      <div className="drawer-scroll">
        <AlertDetails alert={alert} />
        <RiskBreakdown />
        <SuggestedActions />
        <SharedWith />
        <AddRecipient />
      </div>
      <div className="drawer-actions">
        <button className="btn-3d" onClick={onDispatch}>
          Dispatch <Icon name="arrow" size={16} />
        </button>
        <button className="btn-ghost">Save as Draft</button>
      </div>
    </aside>
  );
}

function Alerts() {
  const [columns, setColumns] = useState(initialColumns);
  const [filters, setFilters] = useState({
    search: "",
    priority: "All Priorities",
    zone: "All Zones",
    date: "Last 24 Hours",
  });
  const [selectedId, setSelectedId] = useState(null);
  useEffect(() => {
    getAlerts()
      .then((data) => {
         console.log("ALERTS DATA:", data);
        const cols = buildColumns(data);
        setColumns(cols);
        const firstCard = cols.flatMap((c) => c.cards)[0];
        if (firstCard) setSelectedId(firstCard.id);
      })
      .catch((err) => console.error("Failed to load alerts:", err));
  }, []);
  const selectedAlert =
    columns
      .flatMap((column) => column.cards)
      .find((alert) => alert.id === selectedId) ||
    columns.flatMap((column) => column.cards)[0];
  const filteredColumns = useMemo(
    () =>
      Object.fromEntries(
        columns.map((column) => [
          column.id,
          column.cards.filter((alert) => {
            const term = filters.search.toLowerCase();
            const matchesTerm =
              !term ||
              `${alert.id} ${alert.zone} ${alert.description}`
                .toLowerCase()
                .includes(term);
            const matchesPriority =
              filters.priority === "All Priorities" ||
              alert.priority === filters.priority ||
              (filters.priority === "Critical" && alert.priority === "HIGH");
            const matchesZone =
              filters.zone === "All Zones" || alert.zone === filters.zone;
            return matchesTerm && matchesPriority && matchesZone;
          }),
        ]),
      ),
    [columns, filters],
  );
  const approveAlert = (alert) => {
    apiApprove(alert.id)
      .then(() => {
        setColumns(
          columns.map((column) =>
            column.id === "draft"
              ? {
                  ...column,
                  cards: column.cards.filter((item) => item.id !== alert.id),
                }
              : column.id === "approved"
                ? { ...column, cards: [alert, ...column.cards] }
                : column,
          ),
        );
        setSelectedId(alert.id);
      })
      .catch((err) => alert("Failed to approve: " + err.message));
  };
  const moveAlert = (id, from, to) => {
    const alert = columns
      .find((column) => column.id === from)
      ?.cards.find((item) => item.id === id);
    if (!alert) return;

    const apiCall =
      to === "dispatched"
        ? apiDispatch(id)
        : to === "actioned"
          ? apiActioned(id)
          : Promise.resolve();

    apiCall
      .then(() => {
        setColumns(
          columns.map((column) =>
            column.id === from
              ? {
                  ...column,
                  cards: column.cards.filter((item) => item.id !== id),
                }
              : column.id === to
                ? { ...column, cards: [...column.cards, alert] }
                : column,
          ),
        );
      })
      .catch((err) => console.error(`Failed to move alert to ${to}:`, err));
  };
  const setMenuOpen = (id) =>
    setColumns(
      columns.map((column) => ({
        ...column,
        cards: column.cards.map((alert) => ({
          ...alert,
          menuOpen: alert.id === id ? !alert.menuOpen : false,
        })),
      })),
    );
  const dispatch = () => {
    const location = columns
      .find((column) => column.id === "approved")
      ?.cards.some((alert) => alert.id === selectedId)
      ? "approved"
      : null;
    if (location) moveAlert(selectedId, location, "dispatched");
  };
  return (
    <>
      <style>{styles}</style>
      <main className="app-shell">
        <Header />
        <div className="workspace">
          <section className="board-area">
            <div className="page-intro">
              <h1>Alerts &amp; Workflow</h1>
              <p>Manage, track and dispatch alerts across jurisdictions</p>
            </div>
            <FilterBar filters={filters} setFilters={setFilters} />
            <WorkflowBoard
              columns={columns}
              filteredColumns={filteredColumns}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              approveAlert={approveAlert}
              moveAlert={moveAlert}
              setMenuOpen={setMenuOpen}
            />
          </section>
          {selectedAlert && (
            <AlertDrawer
              alert={selectedAlert}
              onClose={() => setSelectedId(null)}
              onDispatch={dispatch}
            />
          )}
        </div>
      </main>
    </>
  );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  font-family: Inter, Arial, sans-serif;
  color: hsl(258 35% 14%);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  --primary: hsl(262 72% 46%);
  --indigo: hsl(243 68% 52%);
  --muted: hsl(258 10% 52%);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background: radial-gradient(circle at 12% 18%, hsla(262, 80%, 70%, .16) 0%, transparent 42%), 
              radial-gradient(circle at 88% 12%, hsla(243, 75%, 60%, .14) 0%, transparent 46%), 
              radial-gradient(circle at 50% 85%, hsla(280, 70%, 65%, .1) 0%, transparent 55%), 
              hsl(250 30% 98%);
}

button, input, select {
  font: inherit;
}

button {
  cursor: pointer;
}

.app-shell {
  max-width: 1500px;
  margin: auto;
  padding: 16px 22px 20px;
  width: 100%;
}

.topbar {
  height: 47px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 315px;
}

.brand-mark {
  width: 55px;
  height: 40px;
  display: grid;
  place-items: center;
  position: relative;
  color: #2737e3;
}

.brand-mark:before, .brand-mark:after {
  content: '';
  position: absolute;
  border-radius: 50%;
  border: 2px solid #2ecbfa;
  transform: rotate(-18deg);
}

.brand-mark:before {
  width: 46px;
  height: 24px;
}

.brand-mark:after {
  width: 35px;
  height: 17px;
  border-color: #6742f4;
}

.brand-mark svg {
  z-index: 1;
}

.brand > strong {
  font: 700 28px/1 Georgia, serif;
  letter-spacing: -1.8px;
  color: #111c75;
}

.role {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 15px;
  border: 1px solid #dbe0ff;
  border-radius: 999px;
  background: rgba(255, 255, 255, .62);
  color: #15258a;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 6px 17px rgba(75, 74, 182, .1);
}

.role i, .sync > i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #16d5bf;
  box-shadow: 0 0 8px #20d5d0;
}

.sync {
  display: flex;
  align-items: center;
  gap: 11px;
  color: #29399f;
  font: 11px 'JetBrains Mono', monospace;
  white-space: nowrap;
}

.sync b {
  font-weight: 500;
}

.sync em {
  font-style: normal;
  color: #5361c2;
}

.header-tools {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-search {
  height: 37px;
  width: 232px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  gap: 9px;
  border: 1px solid #d3d9ff;
  border-radius: 999px;
  background: rgba(255, 255, 255, .56);
  color: #263aca;
  box-shadow: 0 6px 15px rgba(91, 90, 187, .08);
}

.header-search input {
  border: 0;
  outline: 0;
  background: transparent;
  color: #1e2d98;
  width: 100%;
  font-size: 10px;
}

.header-search input::placeholder {
  color: #7580bd;
}

.bell {
  position: relative;
  padding: 4px;
  border: 0;
  background: transparent;
  color: #1429ad;
}

.bell sup {
  position: absolute;
  top: -3px;
  right: -7px;
  padding: 2px 5px;
  border-radius: 999px;
  background: #f13574;
  color: white;
  font-size: 10px;
}

.avatar {
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  font-weight: 600;
}

.top-avatar {
  width: 34px;
  height: 34px;
  background: linear-gradient(145deg, #6576c8, #25358c);
  font-size: 11px;
  box-shadow: 0 4px 10px rgba(59, 62, 148, .2);
}

/* Workspace Grid: Default poori width lega, jab drawer khulega tabhi 2 columns honge */
.workspace {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  margin-top: 9px;
  width: 100%;
}

.workspace.has-drawer {
  grid-template-columns: minmax(0, 2.12fr) minmax(395px, .88fr);
}

.board-area {
  min-width: 0;
  width: 100%;
}

.page-intro {
  padding: 0 14px 10px;
}

.page-intro h1 {
  margin: 0;
  color: #101c72;
  font: 700 30px/1.2 Georgia, serif;
  letter-spacing: -.8px;
}

.page-intro p {
  margin: 4px 0 0;
  color: #5362b1;
  font-size: 12px;
}

.filter-bar {
  display: grid;
  grid-template-columns: minmax(260px, 1.8fr) 1fr 1fr 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 9px;
  border: 1px solid rgba(130, 139, 230, .19);
  border-radius: 13px;
  background: rgba(255, 255, 255, .55);
  box-shadow: 0 8px 22px rgba(108, 101, 200, .1), inset 0 1px rgba(255, 255, 255, .8);
  backdrop-filter: blur(18px);
  width: 100%;
}

.search-immersive {
  height: 42px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  border: 1px solid #d6dcfb;
  border-radius: 11px;
  background: #f4f5fd;
  color: #5a62bb;
  box-shadow: inset 0 2px 8px rgba(87, 88, 168, .08), 0 2px 8px rgba(101, 97, 197, .05);
  transition: .2s;
}

.search-immersive:focus-within {
  border-color: #8d7be9;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(121, 87, 231, .11), inset 0 2px 8px rgba(87, 88, 168, .05);
  color: #6034d8;
}

.search-immersive input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: #1d2c94;
  font-size: 11px;
}

.search-immersive input::placeholder {
  color: #7b83b6;
}

.select-filter {
  height: 42px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 5px 27px 4px 13px;
  border: 1px solid #dce0fa;
  border-radius: 11px;
  background: rgba(255, 255, 255, .55);
  color: #6874b6;
}

.select-filter span {
  font-size: 9px;
}

.select-filter select {
  appearance: none;
  width: 100%;
  border: 0;
  outline: 0;
  color: #1e2b8e;
  background: transparent;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}

.select-filter > svg {
  position: absolute;
  right: 10px;
  bottom: 10px;
  color: #2335ba;
  pointer-events: none;
}

.clear-filter {
  height: 42px;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 13px;
  border: 1px solid #c9d0f7;
  border-radius: 11px;
  background: rgba(255, 255, 255, .48);
  color: #2739b2;
  font-size: 10px;
  white-space: nowrap;
}

.clear-filter:hover {
  background: #f0efff;
}

.board {
  margin-top: 12px;
  padding: 10px;
  border: 1px solid rgba(137, 145, 227, .19);
  border-radius: 14px 14px 0 0;
  background: rgba(255, 255, 255, .37);
  box-shadow: 0 8px 22px rgba(110, 101, 199, .08);
  min-height: 571px;
  width: 100%;
}

.board-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 9px;
  height: 100%;
}

.kanban-column {
  min-width: 0;
  min-height: 551px;
  padding: 7px;
  border-radius: 12px;
  border: 1px solid rgba(140, 150, 230, .17);
  background: linear-gradient(180deg, rgba(247, 247, 255, .77), rgba(239, 242, 255, .45));
  transition: .2s;
}

.kanban-column.approved {
  background: linear-gradient(180deg, rgba(244, 243, 255, .78), rgba(235, 239, 255, .48));
}

.kanban-column.dispatched {
  background: linear-gradient(180deg, rgba(238, 248, 255, .73), rgba(232, 242, 255, .43));
}

.kanban-column.actioned {
  background: linear-gradient(180deg, rgba(235, 252, 249, .76), rgba(227, 248, 246, .44));
}

.kanban-column:has(.alert-card[draggable="true"]:active) {
  border-color: #927ae8;
}

.column-header {
  height: 43px;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 4px 6px;
}

.column-icon {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: #e9edff;
  color: #283abf;
}

.approved .column-icon {
  color: #4c31df;
  background: #ece8ff;
}

.dispatched .column-icon {
  color: #2569df;
  background: #e6f3ff;
}

.actioned .column-icon {
  color: #08a98e;
  background: #dff8f1;
}

.column-header h2 {
  margin: 0;
  flex: 1;
  color: #111e73;
  font: 700 18px Georgia, serif;
  letter-spacing: -.4px;
}

.column-count {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e8ecff;
  color: #2739bf;
  font: 600 11px 'JetBrains Mono', monospace;
}

.actioned .column-count {
  background: #d9f7f0;
  color: #089f89;
}

.column-cards {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.alert-card {
  position: relative;
  padding: 10px 10px 9px;
  border: 1px solid rgba(153, 162, 230, .22);
  border-radius: 11px;
  background: rgba(255, 255, 255, .78);
  box-shadow: 0 5px 12px rgba(85, 92, 181, .1);
  transition: transform .18s, box-shadow .18s, border-color .18s;
  cursor: pointer;
}

.alert-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 17px rgba(85, 92, 181, .14);
}

.alert-card.selected {
  border-color: #8065ed;
  box-shadow: 0 0 0 2px rgba(128, 101, 237, .15), 0 7px 17px rgba(85, 92, 181, .13);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
}

.priority {
  display: inline-flex;
  align-items: center;
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 8px;
  font-weight: 700;
  line-height: 1;
  border: 1px solid;
}

.priority.high {
  color: #f33478;
  background: #ffedf3;
  border-color: #ffbfd5;
}

.priority.medium {
  color: #c77906;
  background: #fff6df;
  border-color: #ffe0a0;
}

.priority.low {
  color: #1487d8;
  background: #e9f7ff;
  border-color: #b5e3ff;
}

.case-id {
  font: 500 9px 'JetBrains Mono', monospace;
  color: #364ab5;
  white-space: nowrap;
}

.alert-card h3 {
  margin: 8px 0 4px;
  color: #14257c;
  font: 700 18px Georgia, serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.alert-card p {
  height: 29px;
  margin: 0;
  color: #5265ad;
  font-size: 11px;
  line-height: 1.55;
  overflow: hidden;
}

.card-bottom {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 8px;
}

.avatar-stack {
  display: flex;
  align-items: center;
  flex: 1;
}

.mini-avatar {
  width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
  margin-left: -4px;
  border: 2px solid white;
  border-radius: 50%;
  color: #fff;
  font-size: 6px;
  font-weight: 700;
  background: linear-gradient(145deg, #b68265, #3b5b9f);
  box-shadow: 0 2px 5px rgba(35, 45, 116, .2);
}

.mini-avatar:first-child {
  margin-left: 0;
}

.mini-avatar.a1 {
  background: linear-gradient(145deg, #e38e84, #6b4697);
}

.mini-avatar.a2 {
  background: linear-gradient(145deg, #44b5c4, #3d5aca);
}

.avatar-stack b {
  margin-left: 3px;
  padding: 4px 5px;
  border-radius: 10px;
  background: #e8ecff;
  color: #4253b3;
  font: 500 7px 'JetBrains Mono', monospace;
}

.card-time {
  color: #6d7ab6;
  font: 12px 'JetBrains Mono', monospace;
  white-space: nowrap;
}

.more-button {
  padding: 2px;
  border: 0;
  background: transparent;
  color: #2339bb;
}

.card-menu {
  position: absolute;
  right: 8px;
  bottom: 30px;
  z-index: 8;
  display: flex;
  flex-direction: column;
  min-width: 108px;
  padding: 4px;
  border: 1px solid #ccd3f6;
  border-radius: 8px;
  background: white;
  box-shadow: 0 6px 18px rgba(71, 73, 159, .2);
}

.card-menu button {
  padding: 7px 8px;
  border: 0;
  border-radius: 5px;
  text-align: left;
  background: transparent;
  color: #2739a9;
  font-size: 12px;
}

.card-menu button:hover {
  background: #f1efff;
}

.empty-column {
  padding: 28px 9px;
  text-align: center;
  color: #8790bd;
  font-size: 12px;
}

.helper-strip {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 0 15px;
  border: 1px solid rgba(137, 145, 227, .19);
  border-top: 0;
  border-radius: 0 0 13px 13px;
  background: rgba(255, 255, 255, .5);
  color: #6875b2;
  font-size: 12px;
  width: 100%;
}

.helper-strip > span:first-child {
  display: flex;
  align-items: center;
  gap: 8px;
}

.helper-strip svg {
  color: #2e45bf;
}

.showing {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.showing button {
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #4255bb;
  font-size: 18px;
}

.drawer {
  height: calc(100vh - 72px);
  min-height: 700px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(129, 140, 224, .27);
  border-radius: 15px;
  background: linear-gradient(150deg, rgba(255, 255, 255, .78), rgba(245, 246, 255, .68));
  box-shadow: 0 12px 30px rgba(92, 85, 192, .15), inset 0 1px rgba(255, 255, 255, .9);
  backdrop-filter: blur(20px);
}

.drawer-header {
  padding: 14px 13px 11px;
  border-bottom: 1px solid #dde2f7;
}

.drawer-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.drawer-title-row h2 {
  min-width: 0;
  flex: 1;
  margin: 0;
  color: #111c6e;
  font: 700 15px Georgia, serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.drawer-title-row .priority {
  font-size: 12px;
}

.drawer-title-row .case-id {
  font-size: 12px;
}

.close-button {
  padding: 3px;
  border: 0;
  background: transparent;
  color: #172eb1;
}

.drawer-header p {
  margin: 9px 0 0 1px;
  color: #7180b9;
  font-size: 12px;
}

.drawer-header p i {
  margin: 0 7px;
  font-style: normal;
}

.drawer-scroll {
  overflow: auto;
  flex: 1;
  padding: 0 10px;
}

.drawer-section {
  padding: 12px 2px;
  border-bottom: 1px solid #dfe3f7;
}

.drawer-section h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 9px;
  color: #131e70;
  font: 700 14px Georgia, serif;
}

.drawer-section h3 svg {
  color: #3a3fd0;
}

.inset {
  margin-top: 10px;
  padding: 12px;
  border: 1px solid #dce1fa;
  border-radius: 11px;
  background: rgba(255, 255, 255, .45);
  box-shadow: inset 0 1px 5px rgba(89, 89, 175, .04);
}

.inset p {
  margin: 0;
  color: #5366ac;
  font-size: 12px;
  line-height: 1.55;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-heading button {
  border: 0;
  background: transparent;
  color: #2a3fbe;
  font-size: 12px;
}

.risk-row {
  display: grid;
  grid-template-columns: 25px 1fr 1.25fr 28px;
  align-items: center;
  gap: 7px;
  margin: 10px 0;
  color: #5364ae;
  font-size: 12px;
}

.risk-icon {
  width: 25px;
  height: 25px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #f0edff;
  color: #5b35cf;
}

.risk-icon.pink {
  color: #f03376;
  background: #ffe8f0;
}

.risk-icon.blue {
  color: #2675da;
  background: #e6f3ff;
}

.risk-icon.amber {
  color: #ecaa24;
  background: #fff5de;
}

.risk-track {
  height: 7px;
  border-radius: 8px;
  background: #e9ebf9;
  overflow: hidden;
}

.risk-track i {
  display: block;
  height: 100%;
  border-radius: 8px;
}

.risk-track i.pink {
  background: linear-gradient(90deg, #ef3074, #af4fe6);
}

.risk-track i.purple {
  background: linear-gradient(90deg, #5930d9, #805cf4);
}

.risk-track i.blue {
  background: linear-gradient(90deg, #2868dc, #32b9ed);
}

.risk-track i.amber {
  background: linear-gradient(90deg, #f0a620, #ffc74d);
}

.risk-row b {
  color: #1f35bb;
  font: 600 9px 'JetBrains Mono', monospace;
  text-align: right;
}

.suggested h3 {
  margin-bottom: 8px;
}

.check-row, .toggle-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
  color: #5364ae;
  font-size: 12px;
}

.check-row input, .state-grid input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.custom-check {
  width: 14px;
  height: 14px;
  display: grid;
  place-items: center;
  flex: none;
  border: 1px solid #aeb9eb;
  border-radius: 3px;
  color: transparent;
  background: white;
  font-size: 12px;
}

.check-row input:checked + .custom-check, .state-grid input:checked + .custom-check {
  border-color: #6741e5;
  background: #6241e3;
  color: white;
}

.toggle-row {
  margin-top: 12px;
}

.toggle {
  width: 31px;
  height: 17px;
  padding: 2px;
  border: 0;
  border-radius: 999px;
  background: #d4d9ed;
}

.toggle i {
  display: block;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 3px rgba(42, 40, 120, .25);
  transition: .2s;
}

.toggle.on {
  background: linear-gradient(90deg, #7942e6, #4422c9);
}

.toggle.on i {
  transform: translateX(14px);
}

.toggle-row svg {
  color: #4459be;
}

.recipient-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
}

.recipient {
  min-width: 0;
  padding: 7px 4px 5px;
  border: 1px solid #e0e5fa;
  border-radius: 8px;
  background: rgba(255, 255, 255, .48);
}

.recipient-avatar {
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  margin-bottom: 4px;
  border-radius: 50%;
  background: #e9e8ff;
  color: #5d35ce;
  font: 700 9px 'JetBrains Mono', monospace;
}

.recipient strong {
  display: block;
  overflow: hidden;
  color: #243897;
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.recipient small {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 5px;
  font-size: 12px;
  white-space: nowrap;
}

.recipient small i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}

.recipient small.green {
  color: #13ad8e;
}

.recipient small.blue {
  color: #3989e5;
}

.recipient small.orange {
  color: #e9a928;
}

.recipient small.purple {
  color: #6e4be2;
}

.recipient-search {
  height: 32px;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 9px;
  margin: 9px 0 8px;
  border: 1px solid #d8def8;
  border-radius: 9px;
  background: #f5f6fd;
  color: #4f61bd;
  box-shadow: inset 0 2px 6px rgba(86, 87, 170, .06);
}

.recipient-search input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: #243897;
  font-size: 12px;
}

.state-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px 7px;
}

.state-grid label {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #5263ad;
  font-size: 12px;
  white-space: nowrap;
}

.drawer-actions {
  display: grid;
  grid-template-columns: 1.16fr 1fr;
  gap: 10px;
  padding: 11px 12px;
  border-top: 1px solid #dfe3f7;
  background: rgba(255, 255, 255, .36);
}

.btn-3d, .btn-ghost {
  height: 39px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border-radius: 11px;
  font-size: 11px;
  font-weight: 600;
}

.btn-3d {
  border: 0;
  color: white;
  background: linear-gradient(145deg, #693bef, #3414c8);
  box-shadow: 0 4px 0 #b6a4f2, 0 8px 14px rgba(66, 31, 201, .25);
  transition: .18s transform, .18s box-shadow;
}

.btn-3d:hover {
  transform: translateY(-2px);
}

.btn-3d:active {
  transform: translateY(3px);
  box-shadow: 0 1px 0 #b6a4f2;
}

.btn-ghost {
  border: 1px solid #816ce9;
  color: #3428ae;
  background: rgba(255, 255, 255, .5);
}

.btn-ghost:hover {
  background: #f1efff;
}

:focus-visible {
  outline: 3px solid rgba(112, 77, 230, .45);
  outline-offset: 2px;
}

@media(max-width: 1200px) {
  .app-shell {
    padding: 14px;
  }
  .workspace.has-drawer {
    grid-template-columns: minmax(0, 1.85fr) minmax(360px, .95fr);
  }
  .brand {
    min-width: auto;
  }
  .sync {
    display: none;
  }
  .header-search {
    width: 200px;
  }
  .filter-bar {
    grid-template-columns: minmax(220px, 1.6fr) repeat(3, 1fr);
  }
  .clear-filter {
    grid-column: 5;
  }
  .board {
    overflow-x: auto;
  }
  .board-grid {
    min-width: 680px;
  }
  .drawer {
    min-height: 700px;
  }
}

@media(max-width: 900px) {
  .workspace {
    grid-template-columns: 1fr !important;
  }
  .drawer {
    height: auto;
    min-height: 700px;
    max-height: none;
  }
  .board-grid {
    min-width: 0;
  }
  .board {
    overflow: visible;
  }
  .header-search {
    display: none;
  }
  .filter-bar {
    grid-template-columns: 1fr 1fr;
  }
  .search-immersive {
    grid-column: 1 / -1;
  }
  .clear-filter {
    grid-column: auto;
  }
  .board-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .kanban-column {
    min-height: 400px;
  }
}

@media(max-width: 600px) {
  .app-shell {
    padding: 10px;
  }
  .brand > strong {
    font-size: 22px;
  }
  .role {
    display: none;
  }
  .header-tools {
    gap: 8px;
  }
  .page-intro h1 {
    font-size: 26px;
  }
  .filter-bar {
    grid-template-columns: 1fr;
  }
  .search-immersive, .clear-filter {
    grid-column: auto;
  }
  .board {
    padding: 7px;
  }
  .board-grid {
    grid-template-columns: 1fr;
  }
  .kanban-column {
    min-height: auto;
  }
  .helper-strip {
    height: auto;
    align-items: flex-start;
    flex-direction: column;
    padding: 10px;
  }
  .recipient-row {
    grid-template-columns: repeat(2, 1fr);
  }
  .state-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
`;

export default Alerts;
