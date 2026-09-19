import { useRef, useState } from "react";

const events = [
  {
    id: "filed",
    icon: "file",
    tone: "violet",
    title: "Complaint filed",
    time: "08:42 AM",
    date: "16 Jun 2025",
    summary: "UPI Fraud reported by victim (Ref: 7f3e1a2...)",
  },
  {
    id: "drafted",
    icon: "alert",
    tone: "violet",
    title: "Alert drafted",
    time: "09:12 AM",
    date: "16 Jun 2025",
    summary: "Auto-generated alert created by system",
  },
  {
    id: "approved",
    icon: "check",
    tone: "green",
    title: "Alert approved",
    time: "09:28 AM",
    date: "16 Jun 2025",
    summary: "Approved by Rohit Singh (Senior Officer)",
  },
  {
    id: "dispatched",
    icon: "plane",
    tone: "blue",
    title: "Alert dispatched",
    time: "09:45 AM",
    date: "16 Jun 2025",
    summary: "Sent to Delhi Police (North), UP Police, and I4C",
  },
  {
    id: "actioned",
    icon: "action",
    tone: "amber",
    title: "Action taken",
    time: "11:20 AM",
    date: "16 Jun 2025",
    summary: "Account frozen & mule accounts flagged",
    detail: [
      "LEA: Delhi Police (North)",
      "Action: Account frozen & mule accounts flagged",
      "Officer: Priya Sharma",
    ],
  },
  {
    id: "outcome",
    icon: "target",
    tone: "muted",
    title: "Outcome recorded",
    time: "",
    date: "",
    summary: "Awaiting final report from investigating officer",
    pending: true,
  },
];

const evidence = [
  {
    id: "image",
    name: "IMG_7823.jpg",
    size: "2.4 MB",
    type: "Image",
    icon: "image",
    tone: "photo",
  },
  {
    id: "pdf",
    name: "complaint.pdf",
    size: "1.2 MB",
    type: "PDF",
    icon: "pdf",
    tone: "paper",
  },
  {
    id: "audio",
    name: "call_recording.mp3",
    size: "8.7 MB",
    type: "Audio",
    icon: "audio",
    tone: "wave",
  },
  {
    id: "chat",
    name: "chat_export.txt",
    size: "4.1 MB",
    type: "Chat export",
    icon: "chat",
    tone: "chat-preview",
  },
];

const initialNotes = [
  {
    initials: "RS",
    name: "Rohit Singh",
    time: "11:32 AM",
    text: "Contacted victim. Confirmed transaction details. Shared with Delhi Police (North).",
    tone: "man",
  },
  {
    initials: "PS",
    name: "Priya Sharma",
    time: "12:15 PM",
    text: "Mule account identified. Requesting bank to freeze account. Evidence attached.",
    tone: "woman",
  },
  {
    initials: "AV",
    name: "Amit Verma",
    time: "01:07 PM",
    text: "Coordination with UP Police initiated for cross-state tracking.",
    tone: "man-two",
  },
];

const icons = {
  arrowLeft: <path d="M19 12H5m6 6-6-6 6-6" />,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  eye: (
    <>
      <path d="M3 12s3.4-6 9-6 9 6 9 6-3.4 6-9 6-9-6-9-6Z" />
      <circle cx="12" cy="12" r="2.7" />
    </>
  ),
  shield: (
    <>
      <path d="m12 3 7 3v5c0 4.6-3 8.2-7 10-4-1.8-7-5.4-7-10V6l7-3Z" />
      <path d="m9.5 12 1.7 1.7 3.5-3.5" />
    </>
  ),
  file: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </>
  ),
  alert: (
    <>
      <path d="m12 3 9 17H3L12 3Z" />
      <path d="M12 9v4M12 16h.01" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.7 2.7L16 9.5" />
    </>
  ),
  plane: <path d="m3 11 18-8-6.4 18-3.6-7-8-3Zm8 3 5-6" />,
  action: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3 2M4 4l2 2" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  chevron: <path d="m7 9 5 5 5-5" />,
  upload: (
    <>
      <path d="M12 16V4m0 0L7 9m5-5 5 5" />
      <path d="M5 15v4h14v-4" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8" cy="9" r="1.5" />
      <path d="m4 18 5-5 3 3 3-4 5 6" />
    </>
  ),
  pdf: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v5h5" />
      <path d="M8 17h8M8 13h4" />
    </>
  ),
  audio: (
    <>
      <path d="M9 18V6l10-2v12" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="16" cy="16" r="3" />
    </>
  ),
  chat: (
    <>
      <path d="M4 5h16v11H8l-4 4V5Z" />
      <path d="M8 9h8M8 12h5" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  more: (
    <>
      <circle cx="5" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="19" cy="12" r="1" fill="currentColor" />
    </>
  ),
  history: (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5M12 7v5l3 2" />
    </>
  ),
  send: <path d="m4 4 17 8-17 8 3-8-3-8Zm3 8h14" />,
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3 2.5-5 6-5s6 2 6 5M17 11a3 3 0 0 0 0-6M18 15c2.2.2 3.5 1.8 3.5 4" />
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

function Breadcrumbs() {
  return (
    <nav className="breadcrumbs">
      <button aria-label="Back to case list">
        <Icon name="arrowLeft" size={17} />
      </button>
      <span>Case List</span>
      <b>›</b>
      <strong>Case DRS-45821</strong>
    </nav>
  );
}

function Overview() {
  const [assigned, setAssigned] = useState(false);
  return (
    <section className="overview glass">
      <div className="case-identity">
        <div className="case-icon">
          <Icon name="shield" size={25} />
        </div>
        <div>
          <div className="case-line">
            <strong>DRS-45821</strong>
            <span className="risk-badge">HIGH RISK</span>
          </div>
          <p>
            North Delhi Zone 14 <i>•</i> UPI Fraud <i>•</i> Filed: 2h ago
          </p>
        </div>
      </div>
      <div className="overview-metrics">
        <div>
          <small>Risk Score</small>
          <strong className="danger-number">0.78</strong>
        </div>
        <div>
          <small>Confidence</small>
          <strong>81%</strong>
        </div>
        <div className="confidence-bar">
          <span />
        </div>
      </div>
      <div className="assign-actions">
        <button className="btn-3d" onClick={() => setAssigned(true)}>
          {assigned ? "Assigned to me" : "Assign to me"}
        </button>
        <button className="btn-ghost">
          <Icon name="users" size={15} />
          Reassign
        </button>
      </div>
    </section>
  );
}

function TimelineEvent({ event, expanded, onToggle }) {
  return (
    <article
      className={`timeline-event ${event.pending ? "pending" : ""} ${expanded ? "expanded" : ""}`}
    >
      <div className={`event-icon ${event.tone}`}>
        <Icon name={event.icon} size={17} />
      </div>
      <div className="event-content">
        <button className="event-head" onClick={onToggle}>
          <strong>{event.title}</strong>
          {event.pending ? (
            <span className="pending-pill">Pending</span>
          ) : (
            <span className="event-meta">
              {event.time} <i>•</i> {event.date}
            </span>
          )}
          <Icon name="chevron" size={16} />
        </button>
        {event.pending ? <p>{event.summary}</p> : <p>{event.summary}</p>}
        {expanded && event.detail && (
          <div className="event-detail">
            {event.detail.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function Timeline() {
  const [expanded, setExpanded] = useState(["actioned"]);
  const toggle = (id) =>
    setExpanded(
      expanded.includes(id)
        ? expanded.filter((item) => item !== id)
        : [...expanded, id],
    );
  return (
    <section className="timeline-panel glass">
      <h2>Case Timeline</h2>
      <div className="timeline-list">
        {events.map((event) => (
          <TimelineEvent
            key={event.id}
            event={event}
            expanded={expanded.includes(event.id)}
            onToggle={() => toggle(event.id)}
          />
        ))}
      </div>
    </section>
  );
}

function EvidencePreview({ item }) {
  return (
    <div className={`evidence-preview ${item.tone}`}>
      {item.tone === "photo" && (
        <>
          <div className="phone-screen">
            <span>UPI</span>
            <b>₹ 18,500</b>
            <i>Payment successful</i>
          </div>
          <div className="photo-hand" />
        </>
      )}
      {item.tone === "paper" && (
        <div className="paper-lines">
          <b>Complaint Details</b>
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
      )}
      {item.tone === "wave" && (
        <div className="waveform">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      )}
      {item.tone === "chat-preview" && (
        <div className="chat-bubbles">
          <i>Transaction?</i>
          <b>Yes, sent it.</b>
          <i>Received.</i>
        </div>
      )}
      <span className="type-icon">
        <Icon name={item.icon} size={14} />
      </span>
    </div>
  );
}

function EvidenceCard({ item, onOpen }) {
  return (
    <button className="evidence-card" onClick={() => onOpen(item)}>
      <EvidencePreview item={item} />
      <div className="evidence-info">
        <div>
          <strong>{item.name}</strong>
          <small>{item.size}</small>
        </div>
        <Icon name="more" size={15} />
      </div>
    </button>
  );
}

function Lightbox({ item, onClose }) {
  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.name} preview`}
      onClick={onClose}
    >
      <div
        className="lightbox-card"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="lightbox-close"
          onClick={onClose}
          aria-label="Close preview"
        >
          <Icon name="close" />
        </button>
        <EvidencePreview item={item} />
        <h3>{item.name}</h3>
        <p>
          {item.type} evidence preview · {item.size}
        </p>
        {item.type === "Audio" && (
          <div className="audio-controls">
            <button>▶</button>
            <div>
              <span />
              <span />
            </div>
            <small>00:18 / 02:42</small>
          </div>
        )}
        {item.type === "PDF" && (
          <div className="pdf-view">
            <b>Complaint Details</b>
            <p>
              UPI Fraud complaint filed by victim. Reference number 7f3e1a2...
            </p>
            <i />
            <i />
            <i />
          </div>
        )}
        {item.type === "Chat export" && (
          <div className="chat-view">
            <span>Victim: I sent the payment to the account.</span>
            <b>Suspect: Please share the confirmation.</b>
            <span>Victim: The amount has been deducted.</span>
          </div>
        )}
      </div>
    </div>
  );
}

function EvidencePanel() {
  const fileRef = useRef(null);
  const [items, setItems] = useState(evidence);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const upload = (file) => {
    if (!file) return;
    const valid = ["image/", "audio/", "application/pdf", "text/"].some(
      (type) => file.type.startsWith(type),
    );
    if (!valid || file.size > 50 * 1024 * 1024) return;
    setUploading(true);
    window.setTimeout(() => {
      setItems([
        ...items,
        {
          id: file.name,
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          type: file.type.startsWith("image/")
            ? "Image"
            : file.type.startsWith("audio/")
              ? "Audio"
              : file.type === "application/pdf"
                ? "PDF"
                : "Chat export",
          icon: file.type.startsWith("image/")
            ? "image"
            : file.type.startsWith("audio/")
              ? "audio"
              : file.type === "application/pdf"
                ? "pdf"
                : "chat",
          tone: file.type.startsWith("image/")
            ? "photo"
            : file.type.startsWith("audio/")
              ? "wave"
              : file.type === "application/pdf"
                ? "paper"
                : "chat-preview",
        },
      ]);
      setUploading(false);
    }, 450);
  };
  return (
    <>
      <section className="evidence-panel glass">
        <h2>Evidence &amp; Attachments</h2>
        <button
          className="upload-zone"
          onClick={() => fileRef.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            upload(event.dataTransfer.files[0]);
          }}
        >
          <Icon name="upload" size={28} />
          <strong>
            {uploading
              ? "Adding evidence..."
              : "Drag and drop files here, or click to upload"}
          </strong>
          <small>Images, PDFs, audio, chat exports (Max 50MB each)</small>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,application/pdf,audio/*,text/*"
          hidden
          onChange={(event) => upload(event.target.files[0])}
        />
        <div className="evidence-grid">
          {items.map((item) => (
            <EvidenceCard item={item} onOpen={setPreview} key={item.id} />
          ))}
          <button
            className="add-evidence"
            onClick={() => fileRef.current?.click()}
          >
            <Icon name="plus" size={21} />
            <span>Add more</span>
          </button>
        </div>
      </section>
      {preview && <Lightbox item={preview} onClose={() => setPreview(null)} />}
    </>
  );
}

function NoteAvatar({ initials, tone }) {
  return <span className={`note-avatar ${tone}`}>{initials}</span>;
}
function Notes() {
  const [notes, setNotes] = useState(initialNotes);
  const [draft, setDraft] = useState("");
  const addNote = () => {
    const text = draft.trim();
    if (!text) return;
    setNotes([
      ...notes,
      {
        initials: "SA",
        name: "Sahil Anand",
        time: "Now",
        text,
        tone: "current",
      },
    ]);
    setDraft("");
  };
  return (
    <section className="notes-panel glass">
      <h2>Investigation Notes</h2>
      <div className="notes-list">
        {notes.map((note) => (
          <article className="note" key={`${note.name}-${note.text}`}>
            <NoteAvatar initials={note.initials} tone={note.tone} />
            <div>
              <div className="note-meta">
                <strong>{note.name}</strong>
                <small>
                  {note.time} <i>•</i> 16 Jun 2025
                </small>
              </div>
              <p>{note.text}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="note-input">
        <NoteAvatar initials="SA" tone="current" />
        <label>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && addNote()}
            placeholder="Add a note... (This cannot be edited or deleted)"
          />
        </label>
        <button
          className="send-button"
          onClick={addNote}
          aria-label="Send note"
        >
          <Icon name="send" size={16} />
        </button>
      </div>
    </section>
  );
}

function VersionHistory() {
  const [open, setOpen] = useState(false);
  return (
    <section className={`version-history glass ${open ? "open" : ""}`}>
      <button className="version-toggle" onClick={() => setOpen(!open)}>
        <span className="history-icon">
          <Icon name="history" size={19} />
        </span>
        <span>
          <strong>Version History</strong>
          <small>View all changes made to this case record</small>
        </span>
        <Icon name="chevron" size={18} />
      </button>
      {open && (
        <div className="history-list">
          <div>
            <strong>Rohit Singh</strong>
            <small>16 Jun 2025, 09:28 AM</small>
            <p>Alert status changed from Drafted to Approved.</p>
          </div>
          <div>
            <strong>Priya Sharma</strong>
            <small>16 Jun 2025, 11:20 AM</small>
            <p>Added action taken details.</p>
          </div>
        </div>
      )}
    </section>
  );
}

function Audit() {
  return (
    <>
      <style>{styles}</style>
      <main className="app-shell">
        <Breadcrumbs />
        <Overview />
        <div className="workspace">
          <div className="left-column">
            <Timeline />
          </div>
          <div className="right-column">
            <EvidencePanel />
            <Notes />
            <VersionHistory />
          </div>
        </div>
      </main>
    </>
  );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
:root{font-family:Inter,Arial,sans-serif;color:hsl(258 35% 14%);font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;--bg:hsl(250 30% 98%);--primary:hsl(262 72% 46%);--indigo:hsl(243 68% 52%);--muted:hsl(258 10% 52%);--border:hsl(258 20% 88%)}*{box-sizing:border-box}body{margin:0;min-width:320px;min-height:100vh;background:radial-gradient(circle at 12% 18%,hsla(262,80%,70%,.16) 0%,transparent 42%),radial-gradient(circle at 88% 12%,hsla(243,75%,60%,.14) 0%,transparent 46%),radial-gradient(circle at 50% 85%,hsla(280,70%,65%,.10) 0%,transparent 55%),var(--bg)}button,input{font:inherit}button{cursor:pointer}.app-shell{max-width:1500px;margin:auto;padding:22px 31px 24px}.glass{background:linear-gradient(125deg,rgba(255,255,255,.79),rgba(255,255,255,.56));border:1px solid rgba(255,255,255,.82);box-shadow:0 12px 32px hsla(258,40%,40%,.08),0 2px 8px hsla(258,40%,40%,.04);backdrop-filter:blur(18px)}.breadcrumbs{width:max-content;display:flex;align-items:center;gap:12px;height:33px;padding:0 13px;border:1px solid #d9d9ff;border-radius:999px;background:rgba(255,255,255,.65);box-shadow:0 5px 15px rgba(84,73,180,.1);color:#3645a4;font-size:10px}.breadcrumbs button{display:grid;place-items:center;padding:0;border:0;background:transparent;color:#5430d6}.breadcrumbs b{color:#9299cc;font-size:15px;font-weight:400}.breadcrumbs strong{color:#2435a1}.overview{height:95px;display:grid;grid-template-columns:1.55fr 1.08fr 1fr;align-items:center;gap:15px;margin-top:9px;padding:12px 17px;border-radius:15px}.case-identity{display:flex;align-items:center;gap:18px}.case-icon{width:52px;height:52px;display:grid;place-items:center;flex:none;border-radius:50%;color:white;background:linear-gradient(145deg,#7441ee,#3a1bc9);box-shadow:0 7px 14px rgba(77,35,199,.3),inset 0 1px rgba(255,255,255,.45)}.case-line{display:flex;align-items:center;gap:12px}.case-line strong{color:#0d1b72;font:700 26px Georgia,serif;letter-spacing:-.7px}.risk-badge{padding:6px 12px;border-radius:999px;color:#f02f72;background:#ffeaf2;border:1px solid #ffcade;font-size:10px;font-weight:700}.case-identity p{margin:7px 0 0;color:#5364a9;font-size:11px}.case-identity p i,.drawer-header i{margin:0 8px;color:#8e98cb;font-style:normal}.overview-metrics{height:54px;display:grid;grid-template-columns:1fr 1fr 1.4fr;align-items:center;border-left:1px solid #e1e4f7;border-right:1px solid #e1e4f7}.overview-metrics>div{padding-left:17px}.overview-metrics small{display:block;margin-bottom:5px;color:#5967b5;font-size:9px}.overview-metrics strong{color:#102fbd;font:500 27px 'JetBrains Mono',monospace;letter-spacing:-2px}.overview-metrics .danger-number{color:#f03570}.confidence-bar{height:7px;margin:16px 16px 0 12px;border-radius:7px;background:#e1e5fb;overflow:hidden}.confidence-bar span{display:block;width:81%;height:100%;border-radius:7px;background:linear-gradient(90deg,#6b36df,#4968e8);box-shadow:0 0 8px rgba(97,54,225,.42)}.assign-actions{display:flex;justify-content:flex-end;gap:13px}.btn-3d,.btn-ghost{height:40px;display:flex;align-items:center;justify-content:center;gap:7px;border-radius:11px;font-size:11px;font-weight:600}.btn-3d{min-width:145px;border:0;color:white;background:linear-gradient(145deg,#7039ed,#3814c7);box-shadow:0 4px 0 #b8a8f2,0 8px 15px rgba(65,34,197,.27);transition:.18s transform,.18s box-shadow}.btn-3d:hover{transform:translateY(-2px)}.btn-3d:active{transform:translateY(3px);box-shadow:0 1px 0 #b8a8f2}.btn-ghost{min-width:125px;border:1px solid #866ee7;color:#3033ad;background:rgba(255,255,255,.5);box-shadow:0 3px 7px rgba(81,70,171,.08)}.btn-ghost:hover{background:#f2efff}.workspace{display:grid;grid-template-columns:minmax(0,1.48fr) minmax(480px,.98fr);gap:15px;margin-top:14px}.left-column,.right-column{min-width:0}.timeline-panel{height:624px;padding:13px 14px;border-radius:15px}.timeline-panel h2,.evidence-panel h2,.notes-panel h2{margin:0;color:#101c6f;font:700 24px Georgia,serif;letter-spacing:-.8px}.timeline-list{position:relative;margin-top:9px;padding:1px 0}.timeline-list:before{content:'';position:absolute;top:34px;bottom:32px;left:22px;width:2px;background:linear-gradient(#7750eb,#5874eb 65%,#c8cde4)}.timeline-event{position:relative;display:flex;gap:12px;min-height:81px;padding:11px 4px 10px 0}.event-icon{z-index:1;width:34px;height:34px;display:grid;place-items:center;flex:none;border:3px solid rgba(255,255,255,.92);border-radius:50%;color:white;box-shadow:0 3px 8px rgba(66,60,155,.18)}.event-icon.violet{background:linear-gradient(145deg,#7a3eed,#4e1dcc)}.event-icon.green{background:linear-gradient(145deg,#22c89c,#06a986)}.event-icon.blue{background:linear-gradient(145deg,#4a8cff,#275ad8)}.event-icon.amber{background:linear-gradient(145deg,#ffc046,#eda51b)}.event-icon.muted{background:#adb4cf}.event-content{flex:1;min-width:0;padding:0 6px 9px;border-bottom:1px solid #e3e6f8}.event-head{width:100%;display:flex;align-items:center;gap:12px;padding:0;border:0;background:transparent;text-align:left;color:#122175}.event-head strong{font:700 13px Georgia,serif}.event-meta{color:#6877bd;font:9px 'JetBrains Mono',monospace;white-space:nowrap}.event-meta i{font-style:normal;margin:0 5px;color:#a2a9d4}.event-head>svg{margin-left:auto;flex:none;color:#1c35bd;transition:transform .18s}.expanded .event-head>svg{transform:rotate(180deg)}.event-content>p{margin:9px 0 0;color:#5264ae;font-size:10px}.pending .event-content{opacity:.95}.pending .event-head strong{color:#5966a6}.pending-pill{padding:4px 10px;border-radius:10px;color:#e9b5d2;background:#fff0f7;font-size:8px}.event-detail{display:flex;flex-direction:column;gap:6px;margin-top:10px;padding:10px 12px;border:1px solid #e0e2fa;border-radius:9px;background:linear-gradient(105deg,#f1efff,#f7f7ff);color:#4b5fac;font-size:9px;line-height:1.3;animation:reveal .2s ease-out}@keyframes reveal{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}.right-column{display:flex;flex-direction:column;gap:10px}.evidence-panel{padding:13px;border-radius:15px}.upload-zone{width:100%;height:91px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;margin-top:10px;border:1px dashed #8da4ff;border-radius:11px;background:linear-gradient(120deg,#f6f7ff,#f1f4ff);color:#4568df;box-shadow:inset 0 1px 8px rgba(88,105,224,.05);transition:.2s}.upload-zone:hover{border-color:#6e43e5;background:#f7f4ff;box-shadow:0 0 0 3px rgba(107,69,229,.1)}.upload-zone strong{font-size:10px;font-weight:600}.upload-zone small{font-size:8px;color:#7180c5}.evidence-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:9px;margin-top:10px}.evidence-card,.add-evidence{min-width:0;padding:0;border:1px solid #dce2fa;border-radius:9px;overflow:hidden;background:rgba(255,255,255,.58);text-align:left;box-shadow:0 3px 8px rgba(85,91,181,.08);transition:.18s}.evidence-card:hover,.add-evidence:hover{transform:translateY(-2px);border-color:#8c7aed;box-shadow:0 7px 15px rgba(75,60,176,.15)}.evidence-preview{height:74px;position:relative;display:grid;place-items:center;overflow:hidden}.evidence-preview.photo{background:linear-gradient(140deg,#31536c,#a9744a 50%,#263e58)}.phone-screen{width:52px;height:67px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;border:2px solid #b3c6df;border-radius:7px;transform:rotate(10deg);background:linear-gradient(#23355e,#101e44);color:white;box-shadow:0 3px 10px rgba(18,24,52,.4)}.phone-screen span{font-size:7px}.phone-screen b{font:700 9px 'JetBrains Mono',monospace}.phone-screen i{font-size:5px;color:#8be6c8;font-style:normal}.photo-hand{position:absolute;right:-5px;bottom:-18px;width:54px;height:68px;border-radius:50% 45% 0 0;background:#b77952;transform:rotate(-20deg);opacity:.8}.evidence-preview.paper{background:linear-gradient(135deg,#dde6ff,#f7f8ff)}.paper-lines{width:61px;height:66px;padding:9px 7px;background:white;box-shadow:0 3px 6px rgba(69,81,155,.12);transform:rotate(3deg)}.paper-lines b{display:block;color:#5e6db4;font-size:5px;margin-bottom:6px}.paper-lines i{display:block;width:100%;height:3px;margin:4px 0;background:#d6def6}.evidence-preview.wave{background:linear-gradient(135deg,#ded7ff,#a99bf4)}.waveform{display:flex;align-items:center;gap:3px;height:38px}.waveform span{width:3px;border-radius:3px;background:#fff}.waveform span:nth-child(1),.waveform span:nth-child(12){height:10px}.waveform span:nth-child(2),.waveform span:nth-child(11){height:18px}.waveform span:nth-child(3),.waveform span:nth-child(10){height:28px}.waveform span:nth-child(4),.waveform span:nth-child(9){height:36px}.waveform span:nth-child(5),.waveform span:nth-child(8){height:22px}.waveform span:nth-child(6),.waveform span:nth-child(7){height:31px}.evidence-preview.chat-preview{background:linear-gradient(135deg,#29334f,#687b8b)}.chat-bubbles{display:flex;flex-direction:column;gap:3px;width:70%;font-size:6px}.chat-bubbles i,.chat-bubbles b{padding:4px 5px;border-radius:5px;font-style:normal;font-weight:500}.chat-bubbles i{align-self:flex-start;background:#e0f0d8;color:#466044}.chat-bubbles b{align-self:flex-end;background:#cfe5ff;color:#386087}.type-icon{position:absolute;right:5px;bottom:5px;display:grid;place-items:center;width:18px;height:18px;border-radius:5px;background:#f53771;color:white;box-shadow:0 2px 5px rgba(50,42,117,.3)}.paper .type-icon{background:#ed3a61}.wave .type-icon{background:#6735dc}.chat-preview .type-icon{background:#2fb981}.evidence-info{display:flex;align-items:center;justify-content:space-between;padding:7px;color:#3348ad}.evidence-info>div{min-width:0}.evidence-info strong{display:block;overflow:hidden;font-size:8px;white-space:nowrap;text-overflow:ellipsis}.evidence-info small{display:block;margin-top:3px;color:#8290c5;font:7px 'JetBrains Mono',monospace}.evidence-info>svg{flex:none;color:#3144b8}.add-evidence{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;min-height:107px;border:1px dashed #aeb9ea;color:#2941bc}.add-evidence span{font-size:9px}.notes-panel{padding:12px 13px;border-radius:15px}.notes-list{margin-top:8px;padding:0 2px;border:1px solid #e0e5f8;border-radius:11px;background:rgba(255,255,255,.39)}.note{display:flex;gap:10px;padding:9px 8px;border-bottom:1px solid #e5e8f8}.note:last-child{border:0}.note-avatar{width:27px;height:27px;display:grid;place-items:center;flex:none;border-radius:50%;color:white;font:700 8px 'JetBrains Mono',monospace;background:linear-gradient(145deg,#3c73aa,#18286c)}.note-avatar.woman{background:linear-gradient(145deg,#d27e89,#563378)}.note-avatar.man-two{background:linear-gradient(145deg,#b9865d,#374e91)}.note-avatar.current{background:linear-gradient(145deg,#6376bf,#263787)}.note>div{min-width:0;flex:1}.note-meta{display:flex;align-items:center;gap:10px}.note-meta strong{color:#253896;font-size:9px}.note-meta small{color:#8290c6;font:7px 'JetBrains Mono',monospace}.note-meta i{font-style:normal;margin:0 4px}.note p{margin:5px 0 0;color:#5267b0;font-size:8px;line-height:1.35}.note-input{display:flex;align-items:center;gap:8px;margin-top:8px}.note-input label{display:flex;align-items:center;flex:1;height:33px;padding:0 11px;border:1px solid #d9dff8;border-radius:9px;background:#f5f6fd;box-shadow:inset 0 2px 7px rgba(86,87,170,.05);transition:.2s}.note-input label:focus-within{background:white;border-color:#865fe0;box-shadow:0 0 0 3px rgba(108,64,222,.11)}.note-input input{width:100%;border:0;outline:0;background:transparent;color:#243897;font-size:8px}.note-input input::placeholder{color:#8591c6}.send-button{width:34px;height:33px;display:grid;place-items:center;border:0;border-radius:10px;color:white;background:linear-gradient(145deg,#7138ee,#3716c9);box-shadow:0 3px 0 #b7a8ef,0 5px 10px rgba(67,31,194,.22)}.version-history{border-radius:13px;overflow:hidden}.version-toggle{width:100%;display:flex;align-items:center;gap:10px;padding:10px 13px;border:0;background:transparent;text-align:left;color:#162a89}.version-toggle>svg{margin-left:auto;transform:rotate(-90deg)}.version-history.open .version-toggle>svg{transform:rotate(0)}.history-icon{display:grid;place-items:center;color:#152eb6}.version-toggle span:nth-child(2){display:flex;flex-direction:column;gap:4px}.version-toggle strong{font:700 12px Georgia,serif}.version-toggle small{color:#7180b8;font-size:8px}.history-list{padding:0 17px 13px 43px;border-top:1px solid #e1e5f8}.history-list>div{padding:9px 0;border-bottom:1px solid #e5e8f8}.history-list>div:last-child{border:0}.history-list strong{display:block;color:#273b9a;font-size:9px}.history-list small{display:block;margin-top:3px;color:#7d8ac0;font:7px 'JetBrains Mono',monospace}.history-list p{margin:4px 0 0;color:#5366ac;font-size:8px}.lightbox{position:fixed;inset:0;z-index:20;display:grid;place-items:center;padding:20px;background:rgba(35,34,91,.22);backdrop-filter:blur(4px)}.lightbox-card{position:relative;width:min(460px,100%);padding:18px;border:1px solid rgba(255,255,255,.9);border-radius:16px;background:linear-gradient(135deg,#fff,#f1f2ff);box-shadow:0 20px 50px rgba(41,33,111,.25)}.lightbox-close{position:absolute;right:12px;top:12px;display:grid;place-items:center;width:28px;height:28px;border:1px solid #d6dcf7;border-radius:50%;background:white;color:#2638af}.lightbox-card>.evidence-preview{height:220px;border-radius:10px;margin-bottom:12px}.lightbox-card h3{margin:0;color:#16277f;font:700 17px Georgia,serif}.lightbox-card>p{margin:5px 0 12px;color:#7180ba;font-size:10px}.audio-controls{display:flex;align-items:center;gap:10px;padding:10px;border:1px solid #d8def7;border-radius:10px;background:#f6f6fd}.audio-controls button{width:29px;height:29px;border:0;border-radius:50%;color:white;background:#6437dc}.audio-controls div{flex:1;height:5px;border-radius:5px;background:linear-gradient(90deg,#6938df 35%,#dde2f7 35%)}.audio-controls small{font:8px 'JetBrains Mono',monospace;color:#6777ba}.pdf-view,.chat-view{padding:13px;border:1px solid #dfe3f7;border-radius:10px;background:white;color:#5264ab;font-size:10px;line-height:1.5}.pdf-view b{display:block;color:#253993;margin-bottom:8px}.pdf-view p{margin:0 0 8px}.pdf-view i{display:block;width:80%;height:5px;margin:6px 0;background:#e1e5f7}.chat-view{display:flex;flex-direction:column;gap:7px}.chat-view span,.chat-view b{padding:7px;border-radius:8px;font-weight:500}.chat-view span{align-self:flex-start;background:#e7f3df}.chat-view b{align-self:flex-end;background:#e3edff}
@media(max-width:1100px){.app-shell{padding:18px}.workspace{grid-template-columns:minmax(0,1.15fr) minmax(390px,.85fr)}.overview{grid-template-columns:1.4fr 1fr 1.05fr}.evidence-grid{grid-template-columns:repeat(3,1fr)}.add-evidence{min-height:107px}}
@media(max-width:820px){.overview{height:auto;grid-template-columns:1fr 1fr;padding:14px}.case-identity{grid-column:1/-1}.assign-actions{grid-column:1/-1;justify-content:flex-start}.workspace{grid-template-columns:1fr}.timeline-panel{height:auto}.evidence-grid{grid-template-columns:repeat(5,1fr)}}
@media(max-width:600px){.app-shell{padding:12px}.breadcrumbs{font-size:9px}.overview{grid-template-columns:1fr}.overview-metrics{border-left:0;border-right:0;border-top:1px solid #e1e4f7;border-bottom:1px solid #e1e4f7;padding:9px 0}.assign-actions{justify-content:stretch}.assign-actions button{flex:1}.case-line strong{font-size:23px}.case-identity p{font-size:9px}.event-head{gap:7px}.event-meta{font-size:8px}.event-content>p{font-size:9px}.evidence-grid{grid-template-columns:repeat(2,1fr)}.add-evidence{min-height:107px}.recipient-row{grid-template-columns:repeat(2,1fr)}}
`;

export default Audit;
