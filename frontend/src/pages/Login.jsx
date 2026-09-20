import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import logo from "../assets/Drishtilogo.png";

const styles = `
:root {
  font-family: 'Sora', 'Avenir Next', Inter, system-ui, sans-serif;
  color: #15314b;
  background: #f7faff;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
html { min-width: 320px; background: #f7faff; height: 100%; }
body { min-width: 320px; min-height: 100vh; margin: 0; height: 100%; }
#root { min-height: 100vh; height: 100%; }
* { box-sizing: border-box; }
button, input, select { font: inherit; }
button { border: 0; }

.app-shell {
  --navy: #15314b;
  --slate: #607895;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(3rem, 6vw, 8rem);
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  overflow-x: hidden;
  padding: clamp(2rem, 5vh, 5rem) clamp(2rem, 6vw, 8rem);
  color: var(--navy);
  background: #f5f6f7;
  isolation: isolate;
}
.ambient {
  position: absolute; z-index: -2; border-radius: 50%;
  pointer-events: none; filter: blur(28px); opacity: .75;
}
.ambient-blue { width: 33rem; height: 29rem; top: -17rem; left: -8rem; background: #dceeff; opacity: .42; }
.ambient-lavender { width: 28rem; height: 25rem; bottom: -13rem; left: 8rem; background: #e9e2ff; opacity: .3; }
.ambient-mint { width: 31rem; height: 29rem; right: -16rem; bottom: -14rem; background: #d8f7f4; opacity: .36; }
.ambient-peach { display: none; }
.mesh-lines {
  position: absolute; z-index: -1; bottom: -1rem; left: -2rem;
  width: 52%; height: 45%; opacity: .2; fill: none; stroke: #cbd5df; stroke-width: 1;
}
.brand-column {
  display: flex; flex-direction: column; justify-content: center;
  flex: 1; max-width: 520px;
  padding: 2rem 0;
}
.brand-lockup { display: flex; align-items: center; gap: 1.2rem; }
.brand-lockup h1 {
  margin: 0; color: #164b80; font-size: clamp(3.4rem, 5.2vw, 6.2rem);
  font-weight: 800; letter-spacing: -.08em; line-height: .9;
}
.brand-mark {
  width: clamp(5rem, 8vw, 8rem);
  height: clamp(5rem, 8vw, 8rem);
  object-fit: contain;
}
.tagline {
  margin: 1.2rem 0 0;
  color: #607895;
  font-size: clamp(1.2rem, 1.8vw, 1.8rem);
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: -.02em;
}

.monitoring-status {
  display: flex; align-items: center; gap: .7rem; margin-top: 3rem;
  color: #6f88a3; font-size: clamp(.72rem, .85vw, .96rem); letter-spacing: .01em;
}
.monitoring-status strong { color: #1b4b7b; font-weight: 800; }
.monitoring-status b { margin: 0 .25rem; color: #9eb0c4; }
.status-dot { display: grid; width: 1.25rem; height: 1.25rem; place-items: center; border-radius: 50%; background: #d6f9f2; }
.status-dot span { width: .42rem; height: .42rem; border-radius: 50%; background: #28c9ad; box-shadow: 0 0 0 .2rem rgba(40, 201, 173, .13); }

.login-orbit {
  position: relative; display: grid; width: min(42vw, 620px); aspect-ratio: 1;
  min-width: 480px; max-height: none; place-items: center; flex-shrink: 0;
  border: 0; border-radius: 50%;
  background: #dfe2e9;
  box-shadow:
    2rem 2.4rem 4.5rem rgba(130, 140, 158, .5),
    -1.5rem -1.7rem 3.8rem rgba(255,255,255,1),
    inset 1.1rem 1.1rem 2rem rgba(255,255,255,.92),
    inset -1.2rem -1.3rem 2.1rem rgba(160, 168, 182, .65);
}
.login-orbit::before { position: absolute; inset: 1.2rem; border-radius: inherit; box-shadow: inset .45rem .5rem .9rem rgba(255,255,255,.78), inset -.45rem -.5rem .9rem rgba(197, 202, 209, .2); pointer-events: none; content: ''; }
.orbit-ring { display: none; }
.login-content { position: relative; width: 62%; min-width: 22rem; text-align: center; }
.login-heading .eyebrow { margin: 0 0 1rem; color: #91a9c1; font-size: .57rem; font-weight: 800; letter-spacing: .23em; }
.login-heading h2 {
  margin: 0;
  font-size: clamp(2.4rem, 3.5vw, 4.2rem);
  font-weight: 800;
  letter-spacing: -.065em;
  line-height: .95;
  font-family: 'Sora', 'Avenir Next', Inter, system-ui, sans-serif;
  color: #373839;
  text-shadow:
    1px 1px 1px rgba(255, 255, 255, 0.9),
    -1px -1px 1px rgba(163, 177, 198, 0.6);
}
.login-heading > p:last-child { margin: .8rem 0 clamp(1.5rem, 3vh, 2.8rem); color: #7890ad; font-size: clamp(.82rem, .95vw, 1.1rem); }
.role-selector {
  display: flex; align-items: stretch; gap: .2rem; padding: .24rem; margin-bottom: 1.1rem;
  border: 0; border-radius: 1rem; background: #ebecef;
  box-shadow: inset 4px 4px 9px rgba(181, 186, 192, .24), inset -4px -4px 9px rgba(255,255,255,.92);
}
.role-option {
  display: flex; flex: 1; align-items: center; justify-content: center; gap: .42rem; min-width: 0;
  padding: .65rem .3rem; color: #607080; border-radius: .78rem; background: transparent; cursor: pointer;
  font-size: clamp(.62rem, .75vw, .8rem); font-weight: 700; white-space: nowrap;
  transition: background .2s ease, color .2s ease, box-shadow .2s ease, transform .2s ease;
}
.role-option:hover { color: #45627b; }
.role-option.selected {
  color: #15314b; background: #f2f3f5;
  box-shadow: 3px 3px 7px rgba(184, 189, 195, .3), -3px -3px 7px rgba(255,255,255,.92);
}
.role-option:active { transform: scale(.98); }
form { display: grid; gap: .85rem; }
.field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .85rem; }
.input-shell {
  display: flex; align-items: center; min-height: 3.1rem; gap: .7rem; padding: 0 1rem;
  color: #7d8996; border: 0; border-radius: 1rem; background: #edeef0;
  box-shadow: inset 4px 4px 10px rgba(180,185,190,.22), inset -4px -4px 10px rgba(255,255,255,.95);
  transition: box-shadow .2s ease, background .2s ease;
}
.input-shell:focus-within { background: #eef0f2; box-shadow: inset 5px 5px 11px rgba(180,185,190,.25), inset -4px -4px 10px rgba(255,255,255,.96); }
.input-shell input, .input-shell select { width: 100%; min-width: 0; padding: 0; border: 0; outline: 0; color: #314a61; background: transparent; font-size: .88rem; }
.input-shell input::placeholder { color: #82909f; opacity: 1; }
.select-shell { min-width: 0; padding-right: .7rem; }
.select-shell select { color: #82909f; appearance: none; cursor: pointer; }
.select-shell select:valid { color: #314a61; }
.select-shell > svg:last-child { flex: none; color: #7d8996; }
.icon-button { display: grid; flex: none; width: 2rem; height: 2rem; padding: 0; place-items: center; color: #7892b1; background: transparent; cursor: pointer; border-radius: 50%; }
.icon-button:hover { color: #45627b; background: #f5f6f7; box-shadow: 2px 2px 5px rgba(184, 189, 195, .22), -2px -2px 5px rgba(255,255,255,.9); }
.submit-button {
  display: flex; align-items: center; justify-content: center; gap: .7rem; min-height: 3.3rem; margin-top: .4rem;
  color: white; border-radius: 1.1rem; background: #e2725b;
  box-shadow: 0 .6rem 1rem rgba(179, 105, 91, .24), 0 .15rem 0 #c45e4b, inset 0 1px 1px rgba(255,255,255,.45);
  cursor: pointer; font-size: .95rem; font-weight: 800;
  transition: transform .2s ease, box-shadow .2s ease, filter .2s ease;
}
.submit-button:hover { filter: saturate(1.08); transform: translateY(-2px); box-shadow: 0 .8rem 1.2rem rgba(204, 107, 88, .25), 0 .18rem 0 #c85d4b, inset 0 1px 1px rgba(255,255,255,.58); }
.submit-button:active { transform: translateY(2px); box-shadow: 0 .2rem .5rem rgba(204, 107, 88, .2), 0 0 0 #c85d4b, inset 0 2px 4px rgba(158, 69, 52, .18); }
.security-note { display: flex; align-items: center; justify-content: center; gap: .4rem; margin: 1.2rem 0 0; color: #8ba0b8; font-size: .6rem; }
.security-note svg { color: #6f8cac; }
.page-index { position: absolute; right: 3rem; bottom: 1.7rem; left: 3rem; display: flex; justify-content: space-between; color: #a4b7cb; font-size: .52rem; font-weight: 800; letter-spacing: .17em; }
.page-index b { color: #7991aa; font-weight: 800; }

@media (max-width: 1100px) {
  .app-shell { flex-direction: column; justify-content: center; align-items: center; gap: 2rem; padding: 2.5rem; }
  .brand-column { max-width: 100%; text-align: center; align-items: center; padding: 0; }
  .brand-lockup { justify-content: center; }
  .tagline { text-align: center; }
  .monitoring-status { justify-content: center; margin-top: 1.5rem; }
  .login-orbit { width: min(85vw, 540px); min-width: 0; }
}

@media (max-width: 600px) {
  .app-shell {
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 1.25rem;
    min-height: 100vh;
    min-height: 100dvh;
    padding: max(1.5rem, env(safe-area-inset-top)) 1rem max(1.5rem, env(safe-area-inset-bottom));
  }

  /* Brand */
  .brand-column { flex: none; padding: 0; text-align: center; align-items: center; width: 100%; max-width: 100%; }
  .brand-lockup { justify-content: center; gap: .6rem; }
  .brand-lockup h1 { font-size: 2.4rem; }
  .brand-mark { width: 3rem; height: 3rem; }
  .tagline { margin-top: .5rem; font-size: .9rem; line-height: 1.3; text-align: center; }
  .monitoring-status { display: none; }

  /* Circle: --d = diameter. Andar ka sab kuch isi se scale hota hai */
  .login-orbit {
    --d: min(calc(100vw - 2.5rem), 460px);
    width: var(--d);
    height: var(--d);
    aspect-ratio: auto;
    min-width: 0;
    max-width: none;
    margin: 0 auto;
    padding: 0;
    flex-shrink: 0;
    box-shadow:
      1rem 1.2rem 2.2rem rgba(130, 140, 158, .42),
      -.8rem -.8rem 1.8rem rgba(255, 255, 255, .95),
      inset .6rem .6rem 1.2rem rgba(255, 255, 255, .9),
      inset -.6rem -.6rem 1.2rem rgba(160, 168, 182, .6);
  }
  .login-orbit::before { inset: calc(var(--d) * .02); }
  .login-content { width: 82%; min-width: 0; max-width: none; }

  /* Heading (circle ke top pe chord chhota hota hai, isliye text chhota aur compact) */
  .login-heading h2 { font-size: calc(var(--d) * .08); }
  .login-heading > p:last-child {
    margin: calc(var(--d) * .012) 0 calc(var(--d) * .03);
    font-size: max(10.5px, calc(var(--d) * .034));
    line-height: 1.3;
  }

  /* Role selector */
  .role-selector {
    gap: calc(var(--d) * .006);
    margin-bottom: 0;
    padding: calc(var(--d) * .008);
    border-radius: calc(var(--d) * .04);
  }
  .role-option {
    min-width: 0;
    padding: calc(var(--d) * .016) calc(var(--d) * .004);
    gap: calc(var(--d) * .01);
    font-size: max(10px, calc(var(--d) * .03));
    border-radius: calc(var(--d) * .034);
  }
  .role-option svg { flex: none; width: max(11px, calc(var(--d) * .04)); height: max(11px, calc(var(--d) * .04)); }
  .role-option span { overflow: hidden; text-overflow: ellipsis; }

  /* Form */
  form { gap: calc(var(--d) * .02); }
  .field-grid { gap: calc(var(--d) * .02); }
  .input-shell {
    min-height: calc(var(--d) * .09);
    gap: calc(var(--d) * .02);
    padding: 0 calc(var(--d) * .032);
    border-radius: calc(var(--d) * .03);
  }
  .input-shell svg { flex: none; width: calc(var(--d) * .05); height: calc(var(--d) * .05); }
  .input-shell input { font-size: 16px; } /* iPhone pe focus zoom nahi hoga */

  /* State / District: pin icon hata diya taaki text poora dikhe */
  .select-shell { gap: calc(var(--d) * .01); padding: 0 calc(var(--d) * .025); }
  .select-shell > svg:first-child { display: none; }
  .select-shell > svg:last-child { width: calc(var(--d) * .035); height: calc(var(--d) * .035); }
  .select-shell select { font-size: max(11.5px, calc(var(--d) * .036)); text-overflow: ellipsis; }

  /* Password eye button (.input-shell svg ke baad rakha hai taaki override ho) */
  .icon-button { width: calc(var(--d) * .07); height: calc(var(--d) * .07); }
  .icon-button svg { width: calc(var(--d) * .048); height: calc(var(--d) * .048); }

  /* Submit: circle ke neeche chord chhota hai, isliye narrow */
  .submit-button {
    width: 80%;
    margin: calc(var(--d) * .008) auto 0;
    min-height: calc(var(--d) * .095);
    font-size: max(13px, calc(var(--d) * .038));
    border-radius: calc(var(--d) * .04);
  }
  .security-note {
    width: 64%;
    margin: calc(var(--d) * .02) auto 0;
    font-size: max(8.5px, calc(var(--d) * .027));
    line-height: 1.3;
    text-align: center;
  }
  .security-note svg { flex: none; width: 10px; height: 10px; }

  .page-index, .mesh-lines { display: none; }
}

/* Bahut chhote phones */
@media (max-width: 360px) {
  .role-option svg { display: none; }
}
`;

function Icon({ name, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (name === "shield")
    return (
      <svg {...common}>
        <path d="M12 3 19 6v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3Z" />
        <path d="m9.5 12 1.7 1.7 3.5-3.5" />
      </svg>
    );
  if (name === "building")
    return (
      <svg {...common}>
        <path d="M4 21h16M6 21V8l6-3 6 3v13M9 10h.01M12 10h.01M15 10h.01M9 14h.01M12 14h.01M15 14h.01M10 21v-3h4v3" />
      </svg>
    );
  if (name === "user")
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5.5 20c.6-3.4 2.7-5.2 6.5-5.2s5.9 1.8 6.5 5.2" />
      </svg>
    );
  if (name === "pin")
    return (
      <svg {...common}>
        <path d="M19 10c0 4.4-7 10-7 10s-7-5.6-7-10a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="10" r="2.2" />
      </svg>
    );
  if (name === "chevron")
    return (
      <svg {...common}>
        <path d="m7 9 5 5 5-5" />
      </svg>
    );
  if (name === "lock")
    return (
      <svg {...common}>
        <rect x="5.2" y="10" width="13.6" height="10" rx="2" />
        <path d="M8.2 10V7.5a3.8 3.8 0 0 1 7.6 0V10M12 14v2" />
      </svg>
    );
  if (name === "eyeOff")
    return (
      <svg {...common}>
        <path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.2A10.7 10.7 0 0 1 12 5c5.2 0 8.6 4.6 9.5 7-.3.8-1 2-2.1 3.1M6.3 6.3C4.7 7.4 3.6 9.1 3 12c.9 2.4 4.3 7 9 7 1.1 0 2.1-.2 3-.6" />
      </svg>
    );
  if (name === "eye")
    return (
      <svg {...common}>
        <path d="M2.5 12s3.3-5 9.5-5 9.5 5 9.5 5-3.3 5-9.5 5-9.5-5-9.5-5Z" />
        <circle cx="12" cy="12" r="2.2" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="m4 12 16-8-4 16-3.8-6.2L4 12Z" />
      <path d="m12.2 13.8 3.8-3.8" />
    </svg>
  );
}

const roles = [
  { label: "LEA Officer", icon: "shield" },
  { label: "Bank-FI", icon: "building" },
  { label: "I4C Admin", icon: "user" },
];

function Login() {
  const navigate = useNavigate();                            
  const [role, setRole] = useState("LEA Officer");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    window.setTimeout(() => setSubmitted(false), 2800);
    navigate("/dashboard");
  }

  return (
    <main className="app-shell">
      <style>{styles}</style>

      <div className="ambient ambient-blue" />
      <div className="ambient ambient-lavender" />
      <div className="ambient ambient-mint" />
      <div className="ambient ambient-peach" />
      <svg
        className="mesh-lines"
        viewBox="0 0 690 500"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {Array.from({ length: 18 }, (_, index) => (
          <path
            key={index}
            d={`M-40 ${80 + index * 18} C 150 ${250 + index * 6}, 280 ${80 + index * 4}, 680 ${230 + index * 13}`}
          />
        ))}
      </svg>

      <section className="brand-column" aria-label="Drishti introduction">
        <div className="brand-lockup">
         <img src={logo} alt="DRISHTI" className="brand-mark" />
          <h1>DRISHTI</h1>
        </div>
        <p className="tagline">
          Predictive intelligence for
          <br />
          cybercrime cash-out prevention
        </p>
        <div className="monitoring-status">
          <span className="status-dot">
            <span />
          </span>
          <span>
            Monitoring <strong>1,204</strong> zones <b>·</b>{" "}
            <strong>8,000+</strong> complaints processed daily
          </span>
        </div>
      </section>

      <section className="login-orbit" aria-label="Secure sign in">
        <div className="orbit-ring orbit-ring-one" />
        <div className="orbit-ring orbit-ring-two" />
        <div className="login-content">
          <header className="login-heading">
            <h2>Sign In</h2>
            <p>Access your secure command centre</p>
          </header>

          <form onSubmit={handleSubmit}>
            <div
              className="role-selector"
              role="tablist"
              aria-label="Select your role"
            >
              {roles.map((item) => (
                <button
                  type="button"
                  className={`role-option ${role === item.label ? "selected" : ""}`}
                  key={item.label}
                  onClick={() => setRole(item.label)}
                  role="tab"
                  aria-selected={role === item.label}
                >
                  <Icon name={item.icon} size={17} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="field-grid">
              <label className="input-shell select-shell">
                <Icon name="pin" size={18} />
                <select defaultValue="">
                  <option value="" disabled>
                    Select State
                  </option>
                  <option>Maharashtra</option>
                  <option>Karnataka</option>
                  <option>Delhi</option>
                   <option>Uttar Pradesh</option>
                </select>
                <Icon name="chevron" size={15} />
              </label>
              <label className="input-shell select-shell">
                <Icon name="pin" size={18} />
                <select defaultValue="">
                  <option value="" disabled>
                    Select District
                  </option>
                  <option>Mumbai City</option>
                  <option>Bengaluru Urban</option>
                  <option>New Delhi</option>
                   <option>Varanasi</option>
                </select>
                <Icon name="chevron" size={15} />
              </label>
            </div>

            <label className="input-shell">
              <Icon name="user" size={19} />
              <input type="text" placeholder="Login ID" aria-label="Login ID" />
            </label>
            <label className="input-shell">
              <Icon name="lock" size={19} />
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                aria-label="Password"
              />
              <button
                className="icon-button"
                type="button"
                onClick={() => setPasswordVisible((visible) => !visible)}
                aria-label={passwordVisible ? "Hide password" : "Show password"}
              >
                <Icon name={passwordVisible ? "eyeOff" : "eye"} size={19} />
              </button>
            </label>

            <button className="submit-button" type="submit">
              <span>{submitted ? "Access request sent" : "Submit"}</span>
            </button>
          </form>

          <p className="security-note">
            <Icon name="shield" size={13} /> All data is tokenized and access is
            audit-logged
          </p>
        </div>
      </section>

      <div className="page-index" aria-hidden="true">
        <span>DRISHTI / INTELLIGENCE PORTAL</span>
        <b>01 — 01</b>
      </div>
    </main>
  );
}

export default Login;