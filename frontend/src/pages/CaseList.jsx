import { useMemo, useState } from "react";

const initialCases = [
  {
    id: "DRS-45821",
    category: "UPI Fraud",
    zone: "North Delhi Zone 14",
    status: "High Risk",
    officer: "Rohit Singh",
    initials: "RS",
    tone: "blue",
    updated: "2h ago",
  },
  {
    id: "DRS-45790",
    category: "Loan App Fraud",
    zone: "East Delhi Zone 07",
    status: "Investigating",
    officer: "Priya Sharma",
    initials: "PS",
    tone: "rose",
    updated: "3h ago",
  },
  {
    id: "DRS-45767",
    category: "Investment Scam",
    zone: "South Delhi Zone 21",
    status: "Pending Approval",
    officer: "Amit Verma",
    initials: "AV",
    tone: "brown",
    updated: "4h ago",
  },
  {
    id: "DRS-45712",
    category: "OTP Fraud",
    zone: "West Delhi Zone 09",
    status: "New",
    officer: "Unassigned",
    initials: "",
    tone: "empty",
    updated: "5h ago",
  },
  {
    id: "DRS-45688",
    category: "SIM Swap Fraud",
    zone: "Central Delhi Zone 03",
    status: "Investigating",
    officer: "Neha Kapoor",
    initials: "NK",
    tone: "rose",
    updated: "6h ago",
  },
  {
    id: "DRS-45671",
    category: "UPI Fraud",
    zone: "New Delhi Zone 12",
    status: "Resolved",
    officer: "Sandeep Yadav",
    initials: "SY",
    tone: "blue",
    updated: "7h ago",
  },
  {
    id: "DRS-45632",
    category: "Loan App Fraud",
    zone: "Faridabad Zone 05",
    status: "New",
    officer: "Unassigned",
    initials: "",
    tone: "empty",
    updated: "8h ago",
  },
  {
    id: "DRS-45610",
    category: "Investment Scam",
    zone: "Gurugram Zone 11",
    status: "Pending Approval",
    officer: "Kavita Rao",
    initials: "KR",
    tone: "rose",
    updated: "9h ago",
  },
  {
    id: "DRS-45587",
    category: "OTP Fraud",
    zone: "Noida Zone 06",
    status: "High Risk",
    officer: "Arjun Mehta",
    initials: "AM",
    tone: "blue",
    updated: "10h ago",
  },
  {
    id: "DRS-45541",
    category: "SIM Swap Fraud",
    zone: "Ghaziabad Zone 08",
    status: "Investigating",
    officer: "Pooja Nair",
    initials: "PN",
    tone: "rose",
    updated: "11h ago",
  },
  {
    id: "DRS-45492",
    category: "Phishing",
    zone: "North Delhi Zone 18",
    status: "New",
    officer: "Rakesh Kumar",
    initials: "RK",
    tone: "brown",
    updated: "12h ago",
  },
  {
    id: "DRS-45463",
    category: "Identity Theft",
    zone: "South Delhi Zone 16",
    status: "Resolved",
    officer: "Meera Joshi",
    initials: "MJ",
    tone: "rose",
    updated: "13h ago",
  },
];

const categories = [
  "UPI Fraud",
  "Loan App Fraud",
  "Investment Scam",
  "OTP Fraud",
  "SIM Swap Fraud",
  "Phishing",
  "Identity Theft",
];
const locations = [
  "Delhi NCR",
  "North Delhi",
  "South Delhi",
  "East Delhi",
  "West Delhi",
  "Central Delhi",
  "Gurgaon",
  "Noida",
];
const timeWindows = [
  "Last 1 Hour",
  "Last 3 Hours",
  "Last 24 Hours",
  "Last 7 Days",
  "Custom Range",
];

const icons = {
  calendar: (
    <>
      <rect x="3" y="4.5" width="18" height="17" rx="2" />
      <path d="M7 2.5v4M17 2.5v4M3 9h18M7 13h.01M12 13h.01M17 13h.01M7 17h.01M12 17h.01" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  shield: (
    <>
      <path d="m12 3 7 3v5c0 4.6-3 8.2-7 10-4-1.8-7-5.4-7-10V6l7-3Z" />
      <path d="m9.5 12 1.7 1.7 3.5-3.5" />
    </>
  ),
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.5" />
      <path d="m16 16 4.2 4.2" />
    </>
  ),
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  chevron: <path d="m7 9 5 5 5-5" />,
  sort: (
    <>
      <path d="m9 8 3-3 3 3M12 5v9M15 16l-3 3-3-3M12 19v-4" />
    </>
  ),
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
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

function FilterSelect({ label, value, options, icon, onChange }) {
  return (
    <label className="filter-select">
      <span className="filter-icon">
        <Icon name={icon} size={21} />
      </span>
      <span className="filter-copy">
        <small>{label}</small>
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </span>
      <Icon name="chevron" size={17} />
    </label>
  );
}

function CategoryFilter({ selected, setSelected }) {
  const [open, setOpen] = useState(false);
  const toggle = (category) =>
    setSelected(
      selected.includes(category)
        ? selected.filter((item) => item !== category)
        : [...selected, category],
    );
  return (
    <div className="category-wrap">
      <button className="category-filter" onClick={() => setOpen(!open)}>
        <span className="filter-icon">
          <Icon name="shield" size={21} />
        </span>
        <span className="filter-copy">
          <small>Crime category</small>
          <span className="category-chips">
            <b>
              {selected[0] || "All categories"} <em>×</em>
            </b>
            {selected.length > 1 && (
              <b className="count-chip">+{selected.length - 1}</b>
            )}
          </span>
        </span>
        <Icon name="chevron" size={17} />
      </button>
      {open && (
        <div className="category-menu">
          {categories.map((category) => (
            <label key={category}>
              <input
                type="checkbox"
                checked={selected.includes(category)}
                onChange={() => toggle(category)}
              />
              <span>{selected.includes(category) ? "✓" : ""}</span>
              {category}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterBar({ filters, setFilters, menuOpen, setMenuOpen }) {
  return (
    <section className="filter-bar">
      <FilterSelect
        label="Time window"
        value={filters.time}
        options={timeWindows}
        icon="calendar"
        onChange={(time) => setFilters({ ...filters, time })}
      />
      <FilterSelect
        label="Location"
        value={filters.location}
        options={locations}
        icon="pin"
        onChange={(location) => setFilters({ ...filters, location })}
      />
      <CategoryFilter
        selected={filters.categories}
        setSelected={(categories) => setFilters({ ...filters, categories })}
      />
      <label className="search-immersive">
        <Icon name="search" size={21} />
        <input
          value={filters.search}
          onChange={(event) =>
            setFilters({ ...filters, search: event.target.value })
          }
          placeholder="Search by case ID, zone, or keyword..."
        />
      </label>
      <button className="add-filter" onClick={() => setMenuOpen(!menuOpen)}>
        <Icon name="plus" size={18} />
        Add Filter
      </button>
      {menuOpen && (
        <div className="extra-filter-menu">
          <strong>Additional filters</strong>
          <button>Assigned officer</button>
          <button>Case status</button>
          <button>Evidence type</button>
        </div>
      )}
    </section>
  );
}

function ActiveFilters({ filters, setFilters }) {
  const removeCategory = (category) =>
    setFilters({
      ...filters,
      categories: filters.categories.filter((item) => item !== category),
    });
  const remove = (key) =>
    setFilters({
      ...filters,
      [key]:
        key === "time"
          ? "Last 24 Hours"
          : key === "location"
            ? "Delhi NCR"
            : filters[key],
    });
  const chips = [
    { label: filters.time, key: "time" },
    { label: filters.location, key: "location" },
    ...filters.categories.map((category) => ({
      label: category,
      key: category,
    })),
  ];
  return (
    <div className="active-row">
      <div>
        <strong>Active filters:</strong>
        {chips.map((chip) => (
          <button
            className="active-chip"
            key={chip.key}
            onClick={() =>
              chip.key.startsWith("UPI") || categories.includes(chip.key)
                ? removeCategory(chip.key)
                : remove(chip.key)
            }
          >
            {chip.label}
            <Icon name="close" size={12} />
          </button>
        ))}
      </div>
      <button
        className="clear-all"
        onClick={() =>
          setFilters({
            time: "Last 24 Hours",
            location: "Delhi NCR",
            categories: [],
            search: "",
          })
        }
      >
        Clear all
      </button>
    </div>
  );
}

function CategoryPill({ category }) {
  return (
    <span
      className={`category-pill ${category.toLowerCase().replaceAll(" ", "-").replaceAll("swap-", "")}`}
    >
      {category}
    </span>
  );
}
function StatusBadge({ status }) {
  return (
    <span
      className={`status-badge ${status.toLowerCase().replaceAll(" ", "-")}`}
    >
      {status}
    </span>
  );
}
function Officer({ row, onAssign }) {
  return row.officer === "Unassigned" ? (
    <div className="officer">
      <span className="officer-avatar empty">?</span>
      <span>Unassigned</span>
      <button onClick={onAssign}>Quick Assign</button>
    </div>
  ) : (
    <div className="officer">
      <span className={`officer-avatar ${row.tone}`}>{row.initials}</span>
      <span>{row.officer}</span>
    </div>
  );
}

function CaseRow({ row, checked, onCheck, onAssign, onOpen }) {
  return (
    <tr className={checked ? "checked-row" : ""}>
      <td>
        <label className="check-control">
          <input type="checkbox" checked={checked} onChange={onCheck} />
          <span />
        </label>
      </td>
      <td>
        <button className="case-link" onClick={onOpen}>
          {row.id}
        </button>
      </td>
      <td>
        <CategoryPill category={row.category} />
      </td>
      <td className="zone-cell">{row.zone}</td>
      <td>
        <StatusBadge status={row.status} />
      </td>
      <td>
        <Officer row={row} onAssign={onAssign} />
      </td>
      <td className="updated">{row.updated}</td>
      <td>
        <button
          className="row-action"
          onClick={onOpen}
          aria-label={`Open ${row.id}`}
        >
          <Icon name="arrow" size={16} />
        </button>
      </td>
    </tr>
  );
}

function SortHeader({ label, sortKey, sort, setSort }) {
  const active = sort.key === sortKey;
  return (
    <button
      className={`sort-header ${active ? "active" : ""}`}
      onClick={() =>
        setSort({
          key: sortKey,
          direction: active && sort.direction === "asc" ? "desc" : "asc",
        })
      }
    >
      {label}
      <Icon name="sort" size={14} />
    </button>
  );
}

function Pagination({ page, pageSize, total, setPage, setPageSize }) {
  const pageCount = Math.ceil(total / pageSize);
  const numbers = Array.from(
    { length: Math.min(pageCount, 5) },
    (_, index) => index + 1,
  );
  return (
    <footer className="pagination">
      <span>
        Showing {total ? (page - 1) * pageSize + 1 : 0} -{" "}
        {Math.min(page * pageSize, total)} of 247 cases
      </span>
      <div className="page-controls">
        <label>
          <select
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
          >
            <option value="10">25 per page</option>
            <option value="5">10 per page</option>
          </select>
          <Icon name="chevron" size={14} />
        </label>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          aria-label="Previous page"
        >
          ‹
        </button>
        {numbers.map((number) => (
          <button
            className={page === number ? "page-active" : ""}
            key={number}
            onClick={() => setPage(number)}
          >
            {number}
          </button>
        ))}
        {pageCount > 5 && (
          <>
            <span className="ellipsis">...</span>
            <button onClick={() => setPage(pageCount)}>{pageCount}</button>
          </>
        )}
        <button
          disabled={page === pageCount}
          onClick={() => setPage(page + 1)}
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </footer>
  );
}

function CaseList() {
  const [filters, setFilters] = useState({
    time: "Last 24 Hours",
    location: "Delhi NCR",
    categories: ["UPI Fraud", "Loan App Fraud"],
    search: "",
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [sort, setSort] = useState({ key: "id", direction: "asc" });
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [assigned, setAssigned] = useState([]);
  const filtered = useMemo(
    () =>
      initialCases.filter((row) => {
        const search = filters.search.toLowerCase();
        const matchesSearch =
          !search ||
          `${row.id} ${row.category} ${row.zone} ${row.officer} ${row.status}`
            .toLowerCase()
            .includes(search);
        const matchesLocation =
          filters.location === "Delhi NCR" ||
          row.zone
            .toLowerCase()
            .includes(
              filters.location.toLowerCase().replace("delhi", "").trim(),
            );
        const matchesCategory =
          !filters.categories.length ||
          filters.categories.includes(row.category);
        return matchesSearch && matchesLocation && matchesCategory;
      }),
    [filters],
  );
  const sorted = useMemo(
    () =>
      [...filtered].sort(
        (a, b) =>
          String(a[sort.key]).localeCompare(String(b[sort.key]), undefined, {
            numeric: true,
          }) * (sort.direction === "asc" ? 1 : -1),
      ),
    [filtered, sort],
  );
  const visible = sorted.slice((page - 1) * pageSize, page * pageSize);
  const allVisibleSelected =
    visible.length > 0 && visible.every((row) => selected.includes(row.id));
  const toggleAll = () =>
    setSelected(
      allVisibleSelected
        ? selected.filter((id) => !visible.some((row) => row.id === id))
        : [...new Set([...selected, ...visible.map((row) => row.id)])],
    );
  const assign = (row) => setAssigned([...assigned, row.id]);
  const openCase = (row) => window.alert(`Opening ${row.id} case details`);
  return (
    <>
      <style>{styles}</style>
      <main className="app-shell">
        <header className="page-header">
          <h1>Case List</h1>
          <p>View and manage all cases based on your current filters</p>
        </header>
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
        <ActiveFilters filters={filters} setFilters={setFilters} />
        <section className="table-card">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>
                    <label className="check-control">
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={toggleAll}
                      />
                      <span />
                    </label>
                  </th>
                  <th>
                    <SortHeader
                      label="Case ID"
                      sortKey="id"
                      sort={sort}
                      setSort={setSort}
                    />
                  </th>
                  <th>
                    <SortHeader
                      label="Crime Category"
                      sortKey="category"
                      sort={sort}
                      setSort={setSort}
                    />
                  </th>
                  <th>
                    <SortHeader
                      label="Zone"
                      sortKey="zone"
                      sort={sort}
                      setSort={setSort}
                    />
                  </th>
                  <th>
                    <SortHeader
                      label="Status"
                      sortKey="status"
                      sort={sort}
                      setSort={setSort}
                    />
                  </th>
                  <th>
                    <SortHeader
                      label="Assigned Officer"
                      sortKey="officer"
                      sort={sort}
                      setSort={setSort}
                    />
                  </th>
                  <th>
                    <SortHeader
                      label="Last Updated"
                      sortKey="updated"
                      sort={sort}
                      setSort={setSort}
                    />
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => (
                  <CaseRow
                    key={row.id}
                    row={{
                      ...row,
                      officer: assigned.includes(row.id)
                        ? "Sahil Anand"
                        : row.officer,
                    }}
                    checked={selected.includes(row.id)}
                    onCheck={() =>
                      setSelected(
                        selected.includes(row.id)
                          ? selected.filter((id) => id !== row.id)
                          : [...selected, row.id],
                      )
                    }
                    onAssign={() => assign(row)}
                    onOpen={() => openCase(row)}
                  />
                ))}
              </tbody>
            </table>
            {!visible.length && (
              <div className="no-results">
                No cases match the current filters.
              </div>
            )}
          </div>
          <Pagination
            page={page}
            pageSize={pageSize}
            total={sorted.length}
            setPage={setPage}
            setPageSize={setPageSize}
          />
        </section>
      </main>
    </>
  );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
:root{font-family:Inter,Arial,sans-serif;color:hsl(258 35% 14%);font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;--primary:hsl(262 72% 46%);--indigo:hsl(243 68% 52%);--text:hsl(258 35% 14%)}*{box-sizing:border-box}body{margin:0;min-width:320px;min-height:100vh;background:radial-gradient(circle at 12% 18%,hsla(262,80%,70%,.16) 0%,transparent 42%),radial-gradient(circle at 88% 12%,hsla(243,75%,60%,.14) 0%,transparent 46%),radial-gradient(circle at 50% 85%,hsla(280,70%,65%,.10) 0%,transparent 55%),hsl(250 30% 98%)}button,input,select{font:inherit}button{cursor:pointer}.app-shell{max-width:1500px;margin:0 auto;padding:10px 12px 22px}.page-header{padding:1px 18px 14px}.page-header h1{margin:0;color:#121e75;font:700 38px/1.15 Georgia,serif;letter-spacing:-1px}.page-header p{margin:5px 0 0;color:#2944ae;font-size:14px}.filter-bar{position:relative;display:grid;grid-template-columns:1.08fr 1.12fr 1.36fr 1.7fr auto;gap:14px;align-items:center;padding:15px 17px;border:1px solid rgba(196,203,250,.62);border-radius:15px;background:rgba(255,255,255,.59);box-shadow:0 11px 28px rgba(114,108,203,.1),inset 0 1px rgba(255,255,255,.92);backdrop-filter:blur(18px)}.filter-select,.category-filter{height:57px;position:relative;display:flex;align-items:center;gap:12px;padding:7px 13px;border:1px solid #e1e5fb;border-radius:13px;background:rgba(255,255,255,.73);box-shadow:0 4px 10px rgba(92,94,178,.06);color:#2239ba;text-align:left}.filter-select>svg,.category-filter>svg:last-child{margin-left:auto;flex:none}.filter-icon{width:40px;height:40px;display:grid;place-items:center;flex:none;border-radius:12px;background:#eef1ff;color:#2743e2}.filter-copy{display:flex;flex-direction:column;justify-content:center;min-width:0;flex:1}.filter-copy small{margin-bottom:5px;color:#7985c8;font-size:10px}.filter-copy select{width:100%;border:0;outline:0;appearance:none;color:#1d3090;background:transparent;font-size:12px;font-weight:600;cursor:pointer}.category-wrap{position:relative;min-width:0}.category-filter{width:100%;border:1px solid #e1e5fb;background:rgba(255,255,255,.73)}.category-chips{display:flex;align-items:center;gap:7px}.category-chips b{padding:5px 10px;border-radius:999px;background:#eef2ff;color:#2a42bc;font-size:10px;font-weight:500;white-space:nowrap}.category-chips em{margin-left:6px;color:#4054c9;font-size:13px;font-style:normal}.category-chips .count-chip{background:#f1f4ff;padding:5px 10px}.category-menu,.extra-filter-menu{position:absolute;z-index:10;top:calc(100% + 7px);right:0;min-width:190px;padding:8px;border:1px solid #d3d9f8;border-radius:12px;background:rgba(255,255,255,.97);box-shadow:0 14px 28px rgba(73,73,160,.18)}.category-menu label{display:flex;align-items:center;gap:8px;padding:8px;color:#3344a4;font-size:10px;border-radius:7px}.category-menu label:hover{background:#f0f1ff}.category-menu input{accent-color:#5e37d9}.search-immersive{height:57px;display:flex;align-items:center;gap:12px;padding:0 17px;border:1px solid #d8defb;border-radius:999px;background:#f7f8ff;color:#3450d4;box-shadow:inset 0 3px 9px rgba(91,91,173,.07),0 5px 12px rgba(91,88,182,.06);transition:.22s}.search-immersive:focus-within{background:#fff;border-color:#9275ed;box-shadow:0 0 0 4px rgba(121,87,231,.12),0 8px 20px rgba(101,80,191,.09);color:#5e35d9}.search-immersive input{width:100%;border:0;outline:0;background:transparent;color:#1d2e98;font-size:12px}.search-immersive input::placeholder{color:#7a86bf}.add-filter{height:50px;display:flex;align-items:center;gap:8px;padding:0 20px;border:1px solid #8560ff;border-radius:13px;background:rgba(255,255,255,.66);color:#1e32ae;font-size:12px;font-weight:600;box-shadow:0 4px 0 rgba(183,165,250,.45),0 7px 14px rgba(90,66,197,.12);transition:.18s}.add-filter:hover{transform:translateY(-2px);background:#f8f5ff}.extra-filter-menu{top:calc(100% + 5px);right:17px;display:flex;flex-direction:column;gap:3px}.extra-filter-menu strong{padding:7px;color:#253998;font-size:10px}.extra-filter-menu button{padding:7px;border:0;border-radius:6px;background:transparent;text-align:left;color:#5767b2;font-size:10px}.extra-filter-menu button:hover{background:#eff1ff}.active-row{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:47px;padding:0 18px;color:#243ba7;font-size:11px}.active-row>div{display:flex;align-items:center;flex-wrap:wrap;gap:11px}.active-row strong{font-weight:600}.active-chip{display:flex;align-items:center;gap:7px;padding:6px 11px;border:1px solid #d5defb;border-radius:999px;background:rgba(255,255,255,.51);color:#3852b7;font-size:10px;box-shadow:0 2px 7px rgba(81,89,176,.06)}.active-chip svg{color:#3951bf}.clear-all{padding:4px;border:0;background:transparent;color:#1d42c1;font-size:11px;text-decoration:underline}.table-card{overflow:hidden;border:1px solid rgba(255,255,255,.88);border-radius:20px;background:rgba(255,255,255,.75);box-shadow:0 13px 32px rgba(108,100,194,.12),inset 0 1px rgba(255,255,255,.95);backdrop-filter:blur(17px)}.table-scroll{overflow-x:auto;padding:8px 13px 0}table{width:100%;min-width:980px;border-collapse:collapse}th{height:42px;padding:0 9px;border-bottom:1px solid #e4e7f7;color:#1d2f91;text-align:left;font-size:11px;font-weight:600;white-space:nowrap}th:first-child,td:first-child{width:42px;padding-left:10px}td{height:47px;padding:0 9px;border-bottom:1px solid rgba(226,230,248,.65);color:#5266af;font-size:11px;white-space:nowrap}tbody tr{transition:.16s;background:rgba(255,255,255,.11)}tbody tr:hover,tbody tr.checked-row{background:rgba(241,243,255,.72)}tbody tr:last-child td{border-bottom:0}.sort-header{display:flex;align-items:center;gap:7px;padding:0;border:0;background:transparent;color:inherit;font-size:11px;font-weight:600}.sort-header svg{color:#5471d4}.sort-header.active{color:#152a91}.check-control{display:block;width:18px;height:18px;position:relative}.check-control input{position:absolute;opacity:0}.check-control span{display:block;width:18px;height:18px;border:2px solid #c4cff6;border-radius:5px;background:#fff}.check-control input:checked+span{border-color:#663add;background:#663add;box-shadow:inset 0 0 0 3px white}.case-link{padding:0;border:0;background:transparent;color:#263bb2;font:600 12px 'JetBrains Mono',monospace}.case-link:hover{text-decoration:underline}.category-pill{display:inline-flex;padding:5px 12px;border-radius:999px;color:#2b48b6;font-size:10px;font-weight:500;box-shadow:inset 0 1px rgba(255,255,255,.74),0 2px 5px rgba(74,81,178,.08)}.category-pill.upi-fraud{background:#ede9ff}.category-pill.loan-app-fraud{background:#c7f1ff;color:#1578b9}.category-pill.investment-scam{background:#c1f7f5;color:#147e95}.category-pill.otp-fraud{background:#dce4ff;color:#3256bd}.category-pill.sim-fraud{background:#ffe28b;color:#b77700}.category-pill.phishing{background:#e8ddff;color:#7042c1}.category-pill.identity-theft{background:#d5edff;color:#3275ad}.zone-cell{color:#5164ad}.status-badge{display:inline-flex;padding:6px 13px;border-radius:999px;font-size:10px;font-weight:600;box-shadow:inset 0 1px rgba(255,255,255,.55),0 3px 7px rgba(66,74,170,.12)}.status-badge.high-risk{color:#fff;background:linear-gradient(90deg,#f4387d,#f45b99)}.status-badge.investigating{color:#fff;background:linear-gradient(90deg,#7542e7,#8765ed)}.status-badge.pending-approval{color:#c77700;background:linear-gradient(90deg,#ffd66b,#ffcf4d)}.status-badge.new{color:#267bb5;background:linear-gradient(90deg,#c6efff,#b4e5ff)}.status-badge.resolved{color:#fff;background:linear-gradient(90deg,#11c39e,#18c9ad)}.officer{display:flex;align-items:center;gap:8px;color:#334797}.officer-avatar{width:29px;height:29px;display:grid;place-items:center;flex:none;border-radius:50%;border:2px solid #fff;color:#fff;font:600 8px 'JetBrains Mono',monospace;box-shadow:0 2px 5px rgba(46,54,119,.18);background:linear-gradient(145deg,#517db0,#162c68)}.officer-avatar.rose{background:linear-gradient(145deg,#e19491,#7e356a)}.officer-avatar.brown{background:linear-gradient(145deg,#bf875d,#3e518e)}.officer-avatar.empty{border-color:#d9deec;color:#fff;background:#d9dee9;font-size:13px}.officer button{height:28px;margin-left:2px;padding:0 11px;border:1px solid #9daff4;border-radius:999px;background:rgba(255,255,255,.65);color:#4260ce;font-size:10px}.officer button:hover{background:#f1f1ff}.updated{color:#586eb6;font:10px 'JetBrains Mono',monospace}.row-action{display:grid;place-items:center;width:33px;height:33px;padding:0;border:0;border-radius:50%;background:#edf3ff;color:#2d57d2;box-shadow:0 3px 8px rgba(73,92,186,.11)}.row-action:hover{color:#fff;background:#6240db;transform:translateX(2px)}.no-results{padding:52px;text-align:center;color:#6e7ebc;font-size:12px}.pagination{display:flex;align-items:center;justify-content:space-between;gap:15px;height:58px;padding:0 20px;border-top:1px solid #e2e6f7;color:#2041c0;font-size:11px}.page-controls{display:flex;align-items:center;gap:9px}.page-controls label{position:relative;display:flex;align-items:center;width:99px;height:32px;padding:0 10px;border:1px solid #e0e5f8;border-radius:999px;background:#fff;box-shadow:0 3px 8px rgba(75,82,165,.08)}.page-controls select{width:100%;border:0;outline:0;appearance:none;background:transparent;color:#5168bb;font-size:10px}.page-controls label svg{position:absolute;right:8px;color:#4d63c7;pointer-events:none}.page-controls>button{display:grid;place-items:center;min-width:28px;height:30px;padding:0 5px;border:0;border-radius:10px;background:transparent;color:#233ec0;font:11px 'JetBrains Mono',monospace}.page-controls>button:hover:not(:disabled){background:#eef0ff}.page-controls>button:disabled{opacity:.32;cursor:not-allowed}.page-controls .page-active{color:white;background:linear-gradient(145deg,#6b35e8,#3920cf);box-shadow:0 4px 8px rgba(75,42,199,.22)}.ellipsis{color:#6777b7}
@media(max-width:1100px){.app-shell{padding:12px}.filter-bar{grid-template-columns:1fr 1fr 1.2fr}.search-immersive{grid-column:1/3}.add-filter{justify-self:start}.overview-metrics{grid-template-columns:1fr}.pagination{padding:0 13px}}
@media(max-width:700px){.page-header h1{font-size:32px}.filter-bar{grid-template-columns:1fr}.search-immersive{grid-column:auto}.active-row{align-items:flex-start;flex-direction:column;padding:10px 5px}.table-card{border-radius:15px}.pagination{align-items:flex-start;flex-direction:column;height:auto;padding:15px}.page-controls{flex-wrap:wrap}.filter-select,.category-filter,.search-immersive{height:52px}}
`;

export default CaseList;
