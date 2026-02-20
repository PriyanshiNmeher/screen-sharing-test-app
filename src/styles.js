const styles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;600;700&family=Syne:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0b;
    --surface: #111113;
    --surface2: #1a1a1e;
    --border: #2a2a30;
    --accent: #00ff88;
    --accent2: #0066ff;
    --warn: #ff4444;
    --warn2: #ff8800;
    --text: #e8e8ec;
    --muted: #666670;
    --font-display: 'Syne', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-display); }
  .app { min-height: 100vh; display: flex; flex-direction: column; }

  @keyframes pulse   { 0%,100%{ opacity:1 } 50%{ opacity:0.4 } }
  @keyframes fadeIn  { from{ opacity:0 } to{ opacity:1 } }
  @keyframes slideUp { from{ transform:translateY(28px);opacity:0 } to{ transform:translateY(0);opacity:1 } }
  @keyframes spin    { to{ transform:rotate(360deg) } }

  /* ── Header ── */
  .header { border-bottom:1px solid var(--border); padding:16px 32px; display:flex; align-items:center; gap:12px; background:var(--surface); }
  .header-dot { width:8px; height:8px; border-radius:50%; background:var(--accent); box-shadow:0 0 8px var(--accent); animation:pulse 2s infinite; }
  .header-title { font-family:var(--font-mono); font-size:13px; letter-spacing:0.1em; color:var(--muted); text-transform:uppercase; }

  .page { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:48px 24px; }

  /* ── Home ── */
  .home-wrap { max-width:480px; width:100%; text-align:center; }
  .home-icon { width:80px; height:80px; border-radius:20px; background:linear-gradient(135deg,#001a33,#003366); border:1px solid var(--accent2); display:flex; align-items:center; justify-content:center; margin:0 auto 32px; font-size:32px; box-shadow:0 0 40px rgba(0,102,255,0.15); }
  .home-title { font-size:clamp(28px,6vw,42px); font-weight:800; letter-spacing:-0.02em; line-height:1.1; margin-bottom:16px; }
  .home-title span { color:var(--accent); }
  .home-desc { color:var(--muted); font-size:15px; line-height:1.6; margin-bottom:40px; font-family:var(--font-mono); font-weight:300; }
  .unsupported-badge { background:rgba(255,68,68,0.08); border:1px solid rgba(255,68,68,0.3); color:var(--warn); padding:16px 20px; border-radius:10px; font-family:var(--font-mono); font-size:13px; line-height:1.6; text-align:left; }

  /* ── Button ── */
  .btn { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border:none; border-radius:10px; font-family:var(--font-display); font-weight:600; font-size:15px; cursor:pointer; transition:all 0.15s ease; outline:none; white-space:nowrap; }
  .btn:focus-visible { box-shadow:0 0 0 3px rgba(0,255,136,0.3); }
  .btn-primary { background:var(--accent); color:#000; box-shadow:0 0 24px rgba(0,255,136,0.2); }
  .btn-primary:hover:not(:disabled) { background:#00e87a; box-shadow:0 0 32px rgba(0,255,136,0.35); transform:translateY(-1px); }
  .btn-primary:disabled { opacity:0.4; cursor:not-allowed; }
  .btn-secondary { background:var(--surface2); color:var(--text); border:1px solid var(--border); }
  .btn-secondary:hover { background:#222228; border-color:#3a3a44; }
  .btn-danger { background:rgba(255,68,68,0.12); color:var(--warn); border:1px solid rgba(255,68,68,0.3); }
  .btn-danger:hover { background:rgba(255,68,68,0.2); }
  .btn-sm { padding:10px 18px; font-size:13px; }

  /* ── Screen Test ── */
  .test-wrap { max-width:900px; width:100%; }
  .test-header { margin-bottom:28px; }
  .test-header h1 { font-size:clamp(20px,4vw,28px); font-weight:800; letter-spacing:-0.02em; }
  .breadcrumb { display:flex; align-items:center; gap:8px; font-family:var(--font-mono); font-size:12px; color:var(--muted); margin-bottom:10px; }
  .breadcrumb-sep { color:var(--border); }

  /* ── Status Panel ── */
  .status-panel { border:1px solid var(--border); border-radius:14px; background:var(--surface); overflow:hidden; margin-bottom:20px; }
  .status-panel-header { padding:14px 20px; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:10px; font-family:var(--font-mono); font-size:12px; color:var(--muted); text-transform:uppercase; letter-spacing:0.08em; background:var(--surface2); flex-wrap:wrap; }
  .status-panel-body { padding:28px; }

  .status-indicator { display:flex; align-items:center; gap:10px; }
  .status-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
  .status-dot.idle { background:var(--muted); }
  .status-dot.requesting { background:var(--accent2); animation:pulse 1s infinite; box-shadow:0 0 8px var(--accent2); }
  .status-dot.granted { background:var(--accent); box-shadow:0 0 8px var(--accent); animation:pulse 2s infinite; }
  .status-dot.stopped,.status-dot.cancelled { background:var(--warn2); }
  .status-dot.denied,.status-dot.error { background:var(--warn); }
  .status-label { font-weight:600; font-size:17px; }

  .idle-body { text-align:center; padding:16px 0; }
  .idle-body p { color:var(--muted); font-family:var(--font-mono); font-size:13px; margin-bottom:24px; }
  .requesting-body { text-align:center; }
  .spinner { width:48px; height:48px; border-radius:50%; border:3px solid var(--border); border-top-color:var(--accent2); animation:spin 0.8s linear infinite; margin:0 auto 20px; }
  .requesting-body p { color:var(--muted); font-family:var(--font-mono); font-size:13px; }

  .error-code { font-family:var(--font-mono); font-size:12px; color:var(--muted); margin-bottom:8px; letter-spacing:0.05em; }
  .error-msg { font-size:14px; color:var(--muted); font-family:var(--font-mono); margin-top:12px; background:var(--surface2); padding:12px; border-radius:8px; word-break:break-word; }
  .error-desc { color:var(--muted); font-family:var(--font-mono); font-size:13px; margin:8px 0 20px; line-height:1.5; }
  .btn-row { display:flex; gap:10px; flex-wrap:wrap; margin-top:20px; }

  /* ── Stream layout ── */
  .stream-grid { display:grid; grid-template-columns:1fr; gap:20px; }
  @media(min-width:640px){ .stream-grid{ grid-template-columns:1fr 260px; } }

  .video-wrap { position:relative; background:#000; border-radius:10px; overflow:hidden; aspect-ratio:16/9; border:1px solid var(--border); }
  .video-wrap video { width:100%; height:100%; object-fit:contain; display:block; }
  .live-badge { position:absolute; top:10px; left:10px; background:rgba(0,0,0,0.75); backdrop-filter:blur(4px); border:1px solid rgba(0,255,136,0.4); border-radius:6px; padding:4px 10px; font-family:var(--font-mono); font-size:11px; color:var(--accent); display:flex; align-items:center; gap:6px; letter-spacing:0.06em; }
  .live-dot { width:6px; height:6px; border-radius:50%; background:var(--accent); animation:pulse 1s infinite; }
  .video-action-btns { position:absolute; top:10px; right:10px; display:flex; gap:6px; }
  .vid-act-btn { background:rgba(0,0,0,0.65); backdrop-filter:blur(6px); border:1px solid rgba(255,255,255,0.15); border-radius:7px; color:#fff; width:34px; height:34px; display:flex; align-items:center; justify-content:center; font-size:15px; cursor:pointer; transition:all 0.15s; }
  .vid-act-btn:hover { background:rgba(255,255,255,0.15); transform:scale(1.05); }
  .vid-act-btn.expand { border-color:rgba(0,102,255,0.5); color:#6699ff; }
  .vid-act-btn.expand:hover { background:rgba(0,102,255,0.2); }

  .meta-panel { display:flex; flex-direction:column; gap:10px; }
  .meta-card { background:var(--surface2); border:1px solid var(--border); border-radius:10px; padding:12px 14px; }
  .meta-label { font-family:var(--font-mono); font-size:10px; color:var(--muted); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:4px; }
  .meta-value { font-family:var(--font-mono); font-size:14px; font-weight:600; color:var(--text); }
  .meta-value.accent { color:var(--accent); }

  .stream-controls { display:flex; gap:10px; flex-wrap:wrap; margin-top:12px; }

  .stopped-body { text-align:center; padding:8px 0; }
  .stopped-body p { color:var(--muted); font-family:var(--font-mono); font-size:13px; margin-bottom:24px; line-height:1.6; }
  .stopped-icon { font-size:40px; margin-bottom:16px; }

  /* ── Steps ── */
  .steps { display:flex; margin-bottom:20px; border:1px solid var(--border); border-radius:10px; overflow:hidden; background:var(--surface); }
  .step { flex:1; padding:12px 16px; font-family:var(--font-mono); font-size:11px; color:var(--muted); letter-spacing:0.05em; display:flex; align-items:center; gap:8px; border-right:1px solid var(--border); transition:all 0.2s; }
  .step:last-child { border-right:none; }
  .step.active { color:var(--accent); background:rgba(0,255,136,0.04); }
  .step.error  { color:var(--warn);   background:rgba(255,68,68,0.04); }
  .step-num { width:18px; height:18px; border-radius:50%; border:1px solid currentColor; display:flex; align-items:center; justify-content:center; font-size:10px; flex-shrink:0; }
  .step.done   .step-num { background:var(--muted);  border-color:var(--muted);  color:#000; }
  .step.active .step-num { background:var(--accent); border-color:var(--accent); color:#000; }
  @media(max-width:520px){ .step span.step-label{ display:none } .step{ justify-content:center } }

  /* ══════════════════════════════════════════
     PERMISSION PROMPT
  ══════════════════════════════════════════ */
  .perm-overlay {
    position:fixed; inset:0; z-index:9999;
    background:rgba(0,0,0,0.72); backdrop-filter:blur(8px);
    display:flex; align-items:center; justify-content:center;
    padding:20px; animation:fadeIn 0.2s ease;
  }
  .perm-dialog {
    background:#1c1c20; border:1px solid #38383f; border-radius:18px;
    width:100%; max-width:450px; overflow:hidden;
    box-shadow:0 32px 100px rgba(0,0,0,0.7);
    animation:slideUp 0.28s cubic-bezier(0.34,1.56,0.64,1);
  }

  /* fake browser bar */
  .perm-browser-bar { background:#111113; border-bottom:1px solid #2a2a30; padding:10px 16px; display:flex; align-items:center; gap:12px; }
  .perm-browser-dots { display:flex; gap:6px; }
  .perm-browser-dots span { width:11px; height:11px; border-radius:50%; }
  .perm-browser-dots span:nth-child(1){ background:#ff5f57; }
  .perm-browser-dots span:nth-child(2){ background:#febc2e; }
  .perm-browser-dots span:nth-child(3){ background:#28c840; }
  .perm-browser-url { flex:1; background:#1e1e22; border:1px solid #2e2e36; border-radius:6px; padding:5px 12px; font-family:var(--font-mono); font-size:12px; color:#888; text-align:center; display:flex; align-items:center; justify-content:center; gap:6px; }
  .perm-lock { color:#4caf50; font-size:11px; }

  .perm-body { padding:26px 26px 22px; text-align:center; }
  .perm-site-icon { font-size:42px; margin-bottom:12px; display:block; }
  .perm-site  { font-family:var(--font-mono); font-size:13px; color:var(--accent2); margin-bottom:4px; font-weight:600; }
  .perm-title { font-size:18px; font-weight:700; margin-bottom:10px; }
  .perm-desc  { font-family:var(--font-mono); font-size:12px; color:var(--muted); line-height:1.65; margin-bottom:16px; }

  .perm-warning { background:rgba(255,136,0,0.07); border:1px solid rgba(255,136,0,0.22); border-radius:9px; padding:10px 14px; font-family:var(--font-mono); font-size:12px; color:#cc7700; display:flex; align-items:flex-start; gap:8px; margin-bottom:18px; text-align:left; }
  .perm-warn-icon { font-size:14px; flex-shrink:0; margin-top:1px; }

  /* options */
  .perm-options { display:flex; flex-direction:column; gap:8px; margin-bottom:14px; text-align:left; }
  .perm-option {
    display:flex; align-items:flex-start; gap:12px;
    background:var(--surface2); border:2px solid var(--border);
    border-radius:11px; padding:13px 14px;
    transition:border-color 0.15s, background 0.15s;
  }
  .perm-option-selectable { cursor:pointer; }
  .perm-option-selectable:hover { border-color:#444; background:#1e1e24; }
  .perm-option-selected {
    border-color:var(--accent2) !important;
    background:rgba(0,102,255,0.06) !important;
  }
  .perm-option-selected .perm-radio { border-color:var(--accent2); }
  .perm-option-selected .perm-radio-inner { background:var(--accent2); transform:scale(1); }

  .perm-radio { width:18px; height:18px; border-radius:50%; border:2px solid var(--border); flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:border-color 0.15s; margin-top:2px; }
  .perm-radio-inner { width:8px; height:8px; border-radius:50%; background:transparent; transform:scale(0); transition:transform 0.15s, background 0.15s; }

  .perm-option-icon  { font-size:20px; flex-shrink:0; margin-top:0px; }
  .perm-option-title { font-size:13px; font-weight:600; margin-bottom:4px; color:var(--text); }
  .perm-option-desc  { font-family:var(--font-mono); font-size:11px; color:var(--muted); line-height:1.5; }

  /* inline tag badges inside option desc */
  .perm-option-tag {
    display:inline-block; margin-left:6px; margin-top:4px;
    background:rgba(0,102,255,0.12); color:#6699ff;
    border:1px solid rgba(0,102,255,0.25); border-radius:4px;
    padding:1px 7px; font-size:10px; font-weight:600; letter-spacing:0.04em;
    vertical-align:middle;
  }
  .perm-option-tag-once {
    background:rgba(0,255,136,0.08); color:var(--accent);
    border-color:rgba(0,255,136,0.2);
  }

  /* hint bar */
  .perm-hint {
    font-family:var(--font-mono); font-size:11px; color:var(--muted);
    padding:10px 12px; background:rgba(0,102,255,0.06); border-radius:8px;
    margin-bottom:16px; text-align:left; border-left:3px solid var(--accent2);
    line-height:1.5;
  }
  .perm-hint.perm-hint-once {
    background:rgba(0,255,136,0.04); border-left-color:var(--accent);
  }

  .perm-divider { border:none; border-top:1px solid var(--border); margin:0 0 18px; }
  .perm-actions { display:flex; gap:10px; justify-content:flex-end; }
  .perm-btn { padding:10px 22px; border:none; border-radius:9px; font-family:var(--font-display); font-weight:700; font-size:14px; cursor:pointer; transition:all 0.15s; }
  .perm-btn-deny  { background:var(--surface2); color:var(--text); border:1px solid var(--border); }
  .perm-btn-deny:hover { background:#252529; }
  .perm-btn-allow { background:var(--accent2); color:#fff; box-shadow:0 2px 12px rgba(0,102,255,0.3); }
  .perm-btn-allow:hover { background:#0055dd; transform:translateY(-1px); box-shadow:0 6px 20px rgba(0,102,255,0.4); }

  /* permission badge in status bar */
  .perm-badge { display:inline-flex; align-items:center; gap:6px; padding:4px 10px; border-radius:6px; font-family:var(--font-mono); font-size:11px; font-weight:600; margin-left:4px; }
  .perm-badge.visiting { background:rgba(0,102,255,0.12); color:#6699ff; border:1px solid rgba(0,102,255,0.3); }
  .perm-badge.once     { background:rgba(0,255,136,0.08); color:var(--accent); border:1px solid rgba(0,255,136,0.25); }

  .revoke-link { font-family:var(--font-mono); font-size:11px; color:var(--muted); text-decoration:underline; cursor:pointer; background:none; border:none; padding:0; margin-left:4px; }
  .revoke-link:hover { color:var(--warn); }

  /* ══════════════════════════════════════════
     FULLSCREEN OVERLAY
  ══════════════════════════════════════════ */
  .fullscreen-overlay { position:fixed; inset:0; z-index:8888; background:#000; display:flex; flex-direction:column; animation:fadeIn 0.18s ease; }
  .fs-video-area { flex:1; position:relative; overflow:hidden; }
  .fs-video-area video { width:100%; height:100%; object-fit:contain; display:block; }
  .fs-topbar { position:absolute; top:0; left:0; right:0; padding:14px 20px; background:linear-gradient(to bottom,rgba(0,0,0,0.75) 0%,transparent 100%); display:flex; align-items:center; justify-content:space-between; gap:12px; }
  .fs-live-pill { background:rgba(0,0,0,0.55); backdrop-filter:blur(6px); border:1px solid rgba(0,255,136,0.35); border-radius:7px; padding:5px 12px; font-family:var(--font-mono); font-size:12px; color:var(--accent); display:flex; align-items:center; gap:7px; }
  .fs-controls { display:flex; gap:8px; }
  .fs-btn { background:rgba(0,0,0,0.55); backdrop-filter:blur(6px); border:1px solid rgba(255,255,255,0.14); border-radius:8px; color:#fff; padding:8px 14px; font-family:var(--font-display); font-weight:600; font-size:13px; cursor:pointer; transition:all 0.15s; display:flex; align-items:center; gap:6px; }
  .fs-btn:hover { background:rgba(255,255,255,0.12); }
  .fs-btn.stop { border-color:rgba(255,68,68,0.4); color:#ff7777; }
  .fs-btn.stop:hover { background:rgba(255,68,68,0.2); }
  .fs-bottombar { position:absolute; bottom:0; left:0; right:0; padding:14px 20px; background:linear-gradient(to top,rgba(0,0,0,0.75) 0%,transparent 100%); display:flex; gap:20px; align-items:center; flex-wrap:wrap; font-family:var(--font-mono); font-size:12px; color:rgba(255,255,255,0.55); }
  .fs-meta-item { display:flex; align-items:center; gap:6px; }
  .fs-meta-item strong { color:rgba(255,255,255,0.88); }
`

export default styles