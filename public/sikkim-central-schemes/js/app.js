/* Sikkim Central Resources Navigator — client app (no dependencies) */
(function () {
  "use strict";

  var DATA = window.NAV_DATA || { schemes: [], stacks: [], generated: "" };
  var S = DATA.schemes;
  var LS_KEY = "sikkim-nav-pipeline-v1";

  var PIPE_STAGES = ["Explore", "Contact Ministry", "Prepare Concept Note", "Prepare DPR",
    "Await Call / Window", "Submit Proposal", "Under Consideration", "Sanctioned"];

  /* ---------------- utilities ---------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    if (s === null || s === undefined) return "";
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function nk(v) { // normalize unknowns
    if (v === null || v === undefined || v === "" || v === "null") return null;
    return v;
  }
  function loadPipe() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch (e) { return {}; }
  }
  function savePipe(p) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(p)); } catch (e) { /* private mode */ }
  }
  function byId(id) { return S.find(function (s) { return s.id === id; }); }

  function prClass(score) { return score >= 4 ? "pr-high" : score >= 3 ? "pr-med" : "pr-low"; }
  function statusClass(st) {
    if (st === "Active") return "b-status-active";
    if (st === "Discontinued") return "b-status-bad";
    return "b-status-warn";
  }
  function windowBadge(s) {
    if (s.openWindow === "open") return '<span class="b b-open">Window open</span>';
    if (s.openWindow === "upcoming") return '<span class="b b-upcoming">Window upcoming</span>';
    if (s.openWindow === "rolling") return '<span class="b b-rolling">Rolling</span>';
    return "";
  }
  function grantBadge(s) {
    var g = s.grantOrLoan || "";
    if (g === "Grant") return '<span class="b b-grant">Grant</span>';
    if (g === "Loan") return '<span class="b b-loan">Loan</span>';
    if (g === "Mixed") return '<span class="b b-loan">Grant + loan</span>';
    if (g === "Technical assistance") return '<span class="b">Technical assistance</span>';
    return g ? '<span class="b">' + esc(g) + "</span>" : "";
  }
  function badgeRow(s, compact) {
    var h = "";
    h += '<span class="b b-type">' + esc(s.type) + "</span>";
    h += '<span class="b ' + statusClass(s.status) + '">' + esc(s.status) + "</span>";
    h += grantBadge(s);
    if (s.nePreference === true) h += '<span class="b b-ne">NE preference</span>';
    h += windowBadge(s);
    if (!compact && s.flags && s.flags.length) h += '<span class="b b-flag">⚠ ' + s.flags.length + " flag" + (s.flags.length > 1 ? "s" : "") + "</span>";
    return h;
  }
  function partClass(st) {
    if (!st) return "part-unknown";
    if (st.indexOf("Confirmed") === 0) return "part-confirmed";
    if (st.indexOf("Evidence") === 0) return "part-evidence";
    if (st.indexOf("No participation") === 0) return "part-none";
    return "part-unknown";
  }

  /* ---------------- tabs ---------------- */
  var currentView = "dashboard";
  function showView(v) {
    currentView = v;
    $all(".tabs button").forEach(function (b) { b.classList.toggle("active", b.dataset.view === v); });
    $all(".view").forEach(function (sec) { sec.classList.toggle("active", sec.id === "view-" + v); });
    if (v === "pipeline") renderPipeline();
    window.scrollTo(0, 0);
  }
  $("#tabs").addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (b) showView(b.dataset.view);
  });

  /* ---------------- filters ---------------- */
  var FILTER_DEFS = [
    { key: "ministry", label: "Ministry / Agency", get: function (s) { return [s.ministry]; } },
    { key: "dept", label: "Sikkim department", get: function (s) { return [deptGroup(s)]; } },
    { key: "policyArea", label: "Policy sector", get: function (s) { return [s.policyArea]; } },
    { key: "type", label: "Scheme type", get: function (s) { return [s.type]; } },
    { key: "grantOrLoan", label: "Grant vs loan", get: function (s) { return [s.grantOrLoan]; } },
    { key: "status", label: "Status", get: function (s) { return [s.status]; } },
    {
      key: "ne", label: "North-East preference", get: function (s) {
        return [s.nePreference === true ? "Confirmed NE preference" : s.nePreference === false ? "No special NE provision" : "NE provision unverified"];
      }
    },
    {
      key: "ratio", label: "Centre–State ratio", get: function (s) {
        var r = nk(s.fundingRatio);
        if (!r || /not confirmed/i.test(r)) return ["Not confirmed / n.a."];
        if (/100%/.test(r)) return ["100% Central"];
        if (/90\s*:\s*10/.test(r)) return ["90:10"];
        if (/80\s*:\s*20/.test(r)) return ["80:20"];
        if (/60\s*:\s*40/.test(r)) return ["60:40"];
        if (/50\s*:\s*50/.test(r)) return ["50:50"];
        return ["Other confirmed pattern"];
      }
    },
    { key: "alloc", label: "Application mechanism", get: function (s) { return [allocGroup(s)]; } },
    {
      key: "window", label: "Window", get: function (s) {
        var m = { open: "Open now", upcoming: "Upcoming", rolling: "Rolling", closed: "Closed", "n/a": "Not applicable", unknown: "Unknown" };
        return [m[s.openWindow] || "Unknown"];
      }
    },
    {
      key: "priority", label: "Priority", get: function (s) {
        return [s.priorityScore >= 4 ? "High (≥4.0)" : s.priorityScore >= 3 ? "Medium (3.0–3.9)" : "Lower (<3.0)"];
      }
    },
    {
      key: "contrib", label: "State contribution", get: function (s) {
        var c = nk(s.stateContribution);
        if (!c || /not confirmed/i.test(c)) return ["Not confirmed"];
        if (/^(none|nil|no |not required|0)/i.test(c.trim())) return ["None required"];
        return ["Required / partial"];
      }
    },
    {
      key: "participation", label: "Sikkim track record", get: function (s) {
        return [(s.sikkimParticipation && s.sikkimParticipation.status) || "Unable to determine"];
      }
    }
  ];

  function deptGroup(s) {
    if (s.sikkimDeptGroup) return s.sikkimDeptGroup;
    var d = nk(s.sikkimNodalDept) || "To be determined";
    d = d.replace(/^likely[:\s]*/i, "").replace(/\s*\(likely\)\s*/i, " ");
    // take first named department if several
    d = d.split(/;|\/(?= [A-Z])|,\s*(?:with|jointly|in coordination)/i)[0].trim();
    d = d.replace(/,?\s*Government of Sikkim\.?$/i, "").replace(/\s*\([^)]*$/, "").trim().replace(/[,.]$/, "");
    return d.length > 58 ? d.slice(0, 58) + "…" : d;
  }
  function allocGroup(s) {
    var a = (s.allocationMethod || "").toLowerCase();
    if (a.indexOf("formula") >= 0 || a.indexOf("statutory") >= 0) return "Formula / statutory (no application)";
    if (a.indexOf("competitive") >= 0 || a.indexOf("challenge") >= 0) return "Competitive application";
    if (a.indexOf("dpr") >= 0) return "DPR / project sanction";
    if (a.indexOf("pip") >= 0 || a.indexOf("annual state proposal") >= 0 || a.indexOf("proposal") >= 0) return "Annual state plan / proposal";
    if (a.indexOf("demand") >= 0) return "Demand-driven";
    if (a.indexOf("reimburse") >= 0) return "Reimbursement";
    if (a.indexOf("loan") >= 0 || a.indexOf("sanction") >= 0) return "Project-by-project sanction";
    return "Other / see detail";
  }

  var activeFilters = {}; // key -> Set of values
  var searchTerm = "";
  var sortMode = "priority";

  function buildFilters() {
    var root = $("#filters");
    root.innerHTML = "";
    var head = el("h3", null, 'Filters <button id="clear-filters" type="button">Clear all</button>');
    root.appendChild(head);
    FILTER_DEFS.forEach(function (def, idx) {
      var counts = {};
      S.forEach(function (s) {
        def.get(s).forEach(function (v) {
          if (!v) return;
          counts[v] = (counts[v] || 0) + 1;
        });
      });
      var values = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a] || a.localeCompare(b); });
      if (!values.length) return;
      var g = el("div", "fgroup" + (idx < 3 ? " open" : ""));
      g.innerHTML = '<div class="fg-head"><span>' + esc(def.label) + '</span><span class="car">▶</span></div>';
      var body = el("div", "fg-body");
      values.forEach(function (v) {
        var lab = el("label");
        lab.innerHTML = '<input type="checkbox" data-fkey="' + def.key + '" value="' + esc(v) + '"><span>' + esc(v) + '</span><span class="cnt">' + counts[v] + "</span>";
        body.appendChild(lab);
      });
      g.appendChild(body);
      g.querySelector(".fg-head").addEventListener("click", function () { g.classList.toggle("open"); });
      root.appendChild(g);
    });
    root.addEventListener("change", function (e) {
      var cb = e.target;
      if (!cb.dataset || !cb.dataset.fkey) return;
      var k = cb.dataset.fkey;
      activeFilters[k] = activeFilters[k] || new Set();
      if (cb.checked) activeFilters[k].add(cb.value); else activeFilters[k].delete(cb.value);
      if (!activeFilters[k].size) delete activeFilters[k];
      renderCards();
    });
    $("#clear-filters").addEventListener("click", function () {
      activeFilters = {};
      $all("#filters input[type=checkbox]").forEach(function (c) { c.checked = false; });
      renderCards();
    });
  }

  function setFilter(key, value) {
    activeFilters = {};
    $all("#filters input[type=checkbox]").forEach(function (c) {
      c.checked = (c.dataset.fkey === key && c.value === value);
    });
    activeFilters[key] = new Set([value]);
    showView("browse");
    renderCards();
  }

  function matches(s) {
    for (var k in activeFilters) {
      var def = FILTER_DEFS.find(function (d) { return d.key === k; });
      var vals = def.get(s);
      var ok = vals.some(function (v) { return activeFilters[k].has(v); });
      if (!ok) return false;
    }
    if (searchTerm) {
      var hay = s._search;
      var terms = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
      for (var i = 0; i < terms.length; i++) if (hay.indexOf(terms[i]) < 0) return false;
    }
    return true;
  }

  var WINDOW_ORDER = { open: 0, upcoming: 1, rolling: 2, unknown: 3, "n/a": 4, closed: 5 };
  function sortSchemes(list) {
    var m = sortMode;
    return list.sort(function (a, b) {
      if (m === "alpha") return a.name.localeCompare(b.name);
      if (m === "financial") return b.scores.financial - a.scores.financial || b.priorityScore - a.priorityScore;
      if (m === "ease") return b.scores.ease - a.scores.ease || b.priorityScore - a.priorityScore;
      if (m === "window") return (WINDOW_ORDER[a.openWindow] || 9) - (WINDOW_ORDER[b.openWindow] || 9) || b.priorityScore - a.priorityScore;
      if (m === "verified") return (b.lastVerified || "").localeCompare(a.lastVerified || "") || b.priorityScore - a.priorityScore;
      return b.priorityScore - a.priorityScore;
    });
  }

  function cardHTML(s) {
    return '<div class="c-top"><h4>' + esc(s.name) + '</h4>' +
      '<span class="pr-badge ' + prClass(s.priorityScore) + '" title="Analytical priority score (1–5)">' + s.priorityScore.toFixed(1) + "</span></div>" +
      '<div class="ministry">' + esc(s.ministry) + "</div>" +
      '<div class="badges">' + badgeRow(s) + "</div>" +
      '<div class="why">' + esc(s.whyItMatters) + "</div>" +
      '<div class="c-foot"><span>' + esc(deptGroup(s)) + "</span><span>Verified " + esc(s.lastVerified) + "</span></div>";
  }

  function renderCards() {
    var wrap = $("#cards");
    wrap.innerHTML = "";
    var list = sortSchemes(S.filter(matches).slice());
    $("#result-count").textContent = list.length + " of " + S.length + " opportunities shown";
    var chips = $("#active-chips");
    chips.innerHTML = "";
    Object.keys(activeFilters).forEach(function (k) {
      activeFilters[k].forEach(function (v) {
        var c = el("span", "chip", esc(v) + " ✕");
        c.addEventListener("click", function () {
          activeFilters[k].delete(v);
          if (!activeFilters[k].size) delete activeFilters[k];
          $all('#filters input[data-fkey="' + k + '"]').forEach(function (cb) { if (cb.value === v) cb.checked = false; });
          renderCards();
        });
        chips.appendChild(c);
      });
    });
    if (!list.length) { wrap.appendChild(el("div", "empty", "No opportunities match the current filters.")); return; }
    list.forEach(function (s) {
      var c = el("article", "card", cardHTML(s));
      c.addEventListener("click", function () { openDetail(s.id); });
      wrap.appendChild(c);
    });
  }

  $("#search").addEventListener("input", function (e) { searchTerm = e.target.value.trim(); renderCards(); });
  $("#sort").addEventListener("change", function (e) { sortMode = e.target.value; renderCards(); });

  /* ---------------- detail overlay ---------------- */
  var overlay = $("#overlay");
  overlay.addEventListener("click", function (e) { if (e.target === overlay) closeDetail(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDetail(); });
  function closeDetail() { overlay.classList.remove("open"); document.body.style.overflow = ""; }

  function kvRow(label, value, rawHTML) {
    var v = nk(value);
    if (!v) return "";
    return "<tr><th>" + esc(label) + "</th><td>" + (rawHTML ? v : esc(v)) + "</td></tr>";
  }

  function openDetail(id) {
    var s = byId(id);
    if (!s) return;
    var d = $("#detail");
    var pipe = loadPipe();
    var st = pipe[id] || {};

    var scoreRows = [
      ["Financial potential", s.scores.financial],
      ["Ease of access", s.scores.ease],
      ["Sikkim fit", s.scores.fit],
      ["Time sensitivity", s.scores.timeSensitivity],
      ["Transformational potential", s.scores.transformational]
    ].map(function (r) {
      return '<div>' + r[0] + '</div><div class="st"><div class="sf" style="width:' + (r[1] * 20) + '%"></div></div><div>' + r[1] + "</div>";
    }).join("");

    var steps = (s.accessPathway || []).map(function (step, i) {
      var unc = /requires confirmation/i.test(step);
      return '<li data-n="' + (i + 1) + '"' + (unc ? ' class="uncertain"' : "") + ">" + esc(step) + "</li>";
    }).join("");

    var docs = (s.keyDocuments || []).map(function (kd) {
      return "<li>" + esc(kd.doc) + (kd.certainty === "likely" ? ' <em style="color:var(--gold)">(likely — confirm)</em>' : "") + "</li>";
    }).join("");

    var uses = (s.potentialUseCases || []).map(function (u) { return "<li>" + esc(u) + "</li>"; }).join("");
    var elig = (s.eligibleApplicants || []).map(function (u) { return "<li>" + esc(u) + "</li>"; }).join("");
    var flags = (s.flags || []).map(function (f) { return '<div class="flag-line">⚠ ' + esc(f) + "</div>"; }).join("");

    var guidelines = (s.guidelines || []).filter(function (g) { return g && g.url; }).map(function (g) {
      return '<li><a href="' + esc(g.url) + '" target="_blank" rel="noopener">' + esc(g.title || g.url) + "</a></li>";
    }).join("");

    var sources = (s.sources || []).map(function (src) {
      return '<div class="src-item"><div class="st1">' + esc(src.title) + '</div>' +
        '<div class="st2">' + esc(src.publisher || "") + (src.date ? " · " + esc(src.date) : "") + (src.section ? " · " + esc(src.section) : "") + "</div>" +
        (src.url ? '<a href="' + esc(src.url) + '" target="_blank" rel="noopener">' + esc(src.url) + "</a>" : "") + "</div>";
    }).join("");

    var part = s.sikkimParticipation || {};
    var portal = nk(s.portal) ? '<a href="' + esc(s.portal) + '" target="_blank" rel="noopener">' + esc(s.portal) + "</a>" : "";

    d.innerHTML =
      '<div class="detail-head">' +
      '<button class="close-btn" id="d-close" aria-label="Close">✕</button>' +
      "<h2>" + esc(s.name) + (nk(s.shortName) && s.shortName !== s.name ? ' <span style="font-weight:400;color:#c8d6e2">(' + esc(s.shortName) + ")</span>" : "") + "</h2>" +
      '<div class="dh-sub">' + esc(s.ministry) + (nk(s.agency) && s.agency !== s.ministry ? " · " + esc(s.agency) : "") + " · " + esc(s.policyArea) + "</div>" +
      '<div class="badges">' + badgeRow(s, true) +
      '<span class="pr-badge ' + prClass(s.priorityScore) + '" style="margin-left:4px">Priority ' + s.priorityScore.toFixed(1) + "/5</span></div>" +
      "</div>" +
      '<div class="detail-body">' +

      '<div class="next-action"><strong>Exact next action</strong>' + esc(s.nextAction || "—") + "</div>" +

      '<div class="panel"><h3>Why it matters for Sikkim</h3><p style="font-size:13.4px;margin:6px 0 0">' + esc(s.whyItMatters) + "</p></div>" +

      '<div class="panel"><h3>Key facts</h3><table class="kv">' +
      kvRow("Type", s.type) +
      kvRow("Grant or loan", s.grantOrLoan) +
      kvRow("Status", s.status) +
      kvRow("Relevant period", s.period) +
      kvRow("Funding available", s.fundingAvailable) +
      kvRow("Centre–State ratio", s.fundingRatio) +
      kvRow("NE / Himalayan preference", s.nePreference === true ? (s.nePreferenceDetail || "Yes — see sources") : s.nePreference === false ? "No special provision identified" : "Unverified" + (s.nePreferenceDetail ? " — " + s.nePreferenceDetail : "")) +
      kvRow("State contribution", s.stateContribution) +
      kvRow("How funds are allocated", s.allocationMethod) +
      kvRow("Application window", s.applicationWindow) +
      kvRow("Portal", portal, true) +
      kvRow("Approving authority", s.approvingAuthority) +
      kvRow("Contact / nodal division", s.contact) +
      kvRow("Likely Sikkim nodal department", s.sikkimNodalDept) +
      kvRow("Last verified", s.lastVerified) +
      kvRow("Research confidence", s.confidence + (nk(s.confidenceNote) ? " — " + s.confidenceNote : "")) +
      "</table></div>" +

      (flags ? '<div class="panel"><h3>Data quality flags</h3>' + flags + "</div>" : "") +

      '<div class="panel"><h3>How do we get the money?</h3><p class="note">Administrative sequence from opportunity to fund release. Amber steps require confirmation with the ministry.</p><ol class="steps">' + steps + "</ol></div>" +

      '<div class="grid-2">' +
      '<div class="panel"><h3>What can be funded</h3><p style="font-size:13.2px">' + esc(s.whatCanBeFunded || "—") + "</p>" +
      (elig ? "<h3 style='margin-top:12px'>Eligible applicants</h3><ul class='plain'>" + elig + "</ul>" : "") + "</div>" +
      '<div class="panel"><h3>Key required documents</h3>' + (docs ? "<ul class='plain'>" + docs + "</ul>" : "<p class='note'>Not confirmed from available official guidance.</p>") + "</div>" +
      "</div>" +

      (uses ? '<div class="panel"><h3>Potential Sikkim use cases <span style="font-weight:400;font-size:11.5px;color:var(--muted)">(illustrative suggestions, not approved projects)</span></h3><ul class="plain">' + uses + "</ul></div>" : "") +

      '<div class="panel"><h3>Has Sikkim already used this?</h3>' +
      '<span class="part-badge ' + partClass(part.status) + '">' + esc(part.status || "Unable to determine") + "</span>" +
      (nk(part.detail) ? '<p style="font-size:13.2px;margin:8px 0 0">' + esc(part.detail) + "</p>" : "") +
      ((part.status || "").indexOf("No participation") === 0 ? '<p class="note" style="margin-top:8px">Our research did not identify recent Sikkim participation. This should be verified with the relevant state department and the Central ministry.</p>' : "") +
      "</div>" +

      '<div class="panel"><h3>Analytical priority scores</h3><p class="note">1–5 scale; research team\'s assessment, not an official measure. Composite: financial 25% · fit 25% · ease 20% · transformational 20% · time sensitivity 10%.</p>' +
      '<div class="score-grid">' + scoreRows + "</div>" +
      (s.scores.rationale ? '<p style="font-size:12.8px;color:var(--slate);margin:10px 0 0">' + esc(s.scores.rationale) + "</p>" : "") + "</div>" +

      '<div class="panel"><h3>Sources &amp; guidelines</h3>' +
      (guidelines ? "<strong style='font-size:12.5px'>Official guidelines</strong><ul class='plain'>" + guidelines + "</ul>" : "") +
      '<details class="sources-toggle" open><summary>Sources (' + (s.sources || []).length + ")</summary>" + sources + "</details></div>" +

      '<div class="panel"><h3>Track in your action pipeline</h3>' +
      '<div class="pipe-controls"><label style="font-size:13px">Stage: <select id="pipe-stage"><option value="">— not tracked —</option>' +
      PIPE_STAGES.map(function (p) { return '<option' + (st.stage === p ? " selected" : "") + ">" + p + "</option>"; }).join("") +
      "</select></label></div>" +
      '<textarea class="pipe-notes" id="pipe-notes" placeholder="Private notes (saved only in this browser)…">' + esc(st.notes || "") + "</textarea>" +
      '<div class="local-note">Saved locally in this browser only — not transmitted or shared.</div></div>' +

      "</div>";

    $("#d-close").addEventListener("click", closeDetail);
    $("#pipe-stage").addEventListener("change", function (e) {
      var p = loadPipe();
      p[id] = p[id] || {};
      p[id].stage = e.target.value || undefined;
      if (!p[id].stage && !p[id].notes) delete p[id];
      else p[id].updated = new Date().toISOString().slice(0, 10);
      savePipe(p);
    });
    $("#pipe-notes").addEventListener("input", function (e) {
      var p = loadPipe();
      p[id] = p[id] || {};
      p[id].notes = e.target.value;
      if (!p[id].stage && !p[id].notes) delete p[id];
      else p[id].updated = new Date().toISOString().slice(0, 10);
      savePipe(p);
    });

    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    d.scrollTop = 0;
  }

  /* ---------------- dashboard ---------------- */
  function countBy(fn) {
    var m = {};
    S.forEach(function (s) { (fn(s) || []).forEach(function (v) { if (v) m[v] = (m[v] || 0) + 1; }); });
    return m;
  }
  function barPanel(title, note, counts, limit, clickKey) {
    var entries = Object.keys(counts).map(function (k) { return [k, counts[k]]; })
      .sort(function (a, b) { return b[1] - a[1]; });
    var shown = limit ? entries.slice(0, limit) : entries;
    var max = shown.length ? shown[0][1] : 1;
    var rows = shown.map(function (e2) {
      return '<div class="bar-row"><span class="bl" data-fkey="' + (clickKey || "") + '" data-fval="' + esc(e2[0]) + '" title="' + esc(e2[0]) + '">' + esc(e2[0]) + "</span>" +
        '<div class="bar-track"><div class="bar-fill" style="width:' + Math.max(3, Math.round(e2[1] / max * 100)) + '%"></div></div>' +
        '<span class="bv">' + e2[1] + "</span></div>";
    }).join("");
    var more = limit && entries.length > limit ? '<p class="note" style="margin-top:6px">+ ' + (entries.length - limit) + " more — use filters to explore.</p>" : "";
    return '<div class="panel"><h3>' + esc(title) + "</h3>" + (note ? '<p class="note">' + esc(note) + "</p>" : "") + rows + more + "</div>";
  }

  function matrixSVG() {
    // financial (x) vs ease (y); bubble size = number of schemes at that point
    var buckets = {};
    S.forEach(function (s) {
      var k = s.scores.financial + ":" + s.scores.ease;
      (buckets[k] = buckets[k] || []).push(s);
    });
    var W = 560, H = 400, pad = 52;
    var sx = function (v) { return pad + (v - 0.5) / 5 * (W - pad - 20); };
    var sy = function (v) { return H - pad - (v - 0.5) / 5 * (H - pad - 24); };
    var out = '<svg viewBox="0 0 ' + W + " " + H + '" width="100%" style="max-width:640px">';
    // quadrant shading: high fin + high ease
    out += '<rect x="' + sx(3.5) + '" y="24" width="' + (W - 20 - sx(3.5)) + '" height="' + (sy(3.5) - 24) + '" fill="#e6f4ec" opacity="0.55"/>';
    for (var g = 1; g <= 5; g++) {
      out += '<line x1="' + sx(g) + '" y1="24" x2="' + sx(g) + '" y2="' + (H - pad) + '" stroke="#e3e9ee"/>';
      out += '<line x1="' + pad + '" y1="' + sy(g) + '" x2="' + (W - 20) + '" y2="' + sy(g) + '" stroke="#e3e9ee"/>';
      out += '<text x="' + sx(g) + '" y="' + (H - pad + 18) + '" font-size="11" fill="#7a8794" text-anchor="middle">' + g + "</text>";
      out += '<text x="' + (pad - 12) + '" y="' + (sy(g) + 4) + '" font-size="11" fill="#7a8794" text-anchor="end">' + g + "</text>";
    }
    out += '<text x="' + ((W + pad - 20) / 2) + '" y="' + (H - 12) + '" font-size="12" fill="#51606e" text-anchor="middle">Financial potential →</text>';
    out += '<text x="16" y="' + ((H - pad + 24) / 2) + '" font-size="12" fill="#51606e" text-anchor="middle" transform="rotate(-90 16 ' + ((H - pad + 24) / 2) + ')">Ease of access →</text>';
    out += '<text x="' + (W - 26) + '" y="40" font-size="11" fill="#1e7a44" text-anchor="end">High-value, feasible</text>';
    Object.keys(buckets).forEach(function (k) {
      var parts = k.split(":");
      var n = buckets[k].length;
      var r = 6 + Math.sqrt(n) * 4.5;
      var names = buckets[k].slice(0, 6).map(function (s) { return s.shortName || s.name; }).join(", ") + (n > 6 ? " +" + (n - 6) + " more" : "");
      out += '<circle cx="' + sx(+parts[0]) + '" cy="' + sy(+parts[1]) + '" r="' + r + '" fill="#1d4568" opacity="0.72"><title>' + esc(names) + "</title></circle>";
      out += '<text x="' + sx(+parts[0]) + '" y="' + (sy(+parts[1]) + 4) + '" font-size="11" fill="#fff" text-anchor="middle" pointer-events="none">' + n + "</text>";
    });
    out += "</svg>";
    return out;
  }

  function renderDashboard() {
    var v = $("#view-dashboard");
    var active = S.filter(function (s) { return s.status === "Active" || s.status === "Active but current call closed"; }).length;
    var ne = S.filter(function (s) { return s.nePreference === true; }).length;
    var open = S.filter(function (s) { return s.openWindow === "open" || s.openWindow === "upcoming" || s.openWindow === "rolling"; }).length;
    var hi = S.filter(function (s) { return s.priorityScore >= 4; }).length;
    var ministries = Object.keys(countBy(function (s) { return [s.ministry]; })).length;
    var grants = S.filter(function (s) { return s.grantOrLoan === "Grant"; }).length;

    var metrics = [
      ["Total opportunities", S.length, null, null],
      ["Active schemes", active, "status", "Active"],
      ["NE-preferential", ne, "ne", "Confirmed NE preference"],
      ["Open / upcoming / rolling", open, "window", "Open now"],
      ["High-priority (≥4.0)", hi, "priority", "High (≥4.0)"],
      ["Ministries & agencies", ministries, null, null],
      ["Pure grants", grants, "grantOrLoan", "Grant"]
    ];
    var mh = metrics.map(function (m) {
      return '<div class="metric' + (m[2] ? " clickable" : "") + '"' + (m[2] ? ' data-fkey="' + m[2] + '" data-fval="' + esc(m[3]) + '"' : "") + '><div class="num">' + m[1] + '</div><div class="lbl">' + m[0] + "</div></div>";
    }).join("");

    var openList = sortSchemes(S.filter(function (s) { return s.openWindow === "open" || s.openWindow === "upcoming"; }).slice());
    var openHTML = openList.length ? openList.slice(0, 12).map(function (s) {
      return '<div class="dept-row" data-open="' + s.id + '"><span class="dr-name">' + esc(s.name) + '</span><span class="dr-min">' + esc(s.applicationWindow || s.openWindow) + '</span><span class="dr-score pr-badge ' + prClass(s.priorityScore) + '">' + s.priorityScore.toFixed(1) + "</span></div>";
    }).join("") : '<p class="note">No dated windows currently identified — most opportunities are rolling or plan-based.</p>';

    v.innerHTML =
      '<h2 class="view-title">Dashboard</h2>' +
      '<p class="view-desc">Snapshot of the researched inventory. Click a metric or bar to filter the full list.</p>' +
      '<div class="metric-row">' + mh + "</div>" +
      '<div class="grid-2">' +
      barPanel("Opportunities by ministry", "Top ministries by number of accessible instruments.", countBy(function (s) { return [s.ministry]; }), 14, "ministry") +
      barPanel("Opportunities by policy sector", null, countBy(function (s) { return [s.policyArea]; }), 14, "policyArea") +
      barPanel("Opportunities by Sikkim department", "Grouped by likely nodal department.", countBy(function (s) { return [deptGroup(s)]; }), 14, "dept") +
      barPanel("Funding mechanism", "How funds are allocated — note how many need no application at all.", countBy(function (s) { return [allocGroup(s)]; }), 10, "alloc") +
      barPanel("Centre–State sharing pattern", "Only ratios confirmed from official guidance are classified.", countBy(function (s) { return FILTER_DEFS.find(function (d) { return d.key === "ratio"; }).get(s); }), 8, "ratio") +
      barPanel("Scheme status (Sept 2026)", "Many CSS approvals were co-terminus with the 15th Finance Commission cycle that ended 31 March 2026.", countBy(function (s) { return [s.status]; }), 8, "status") +
      "</div>" +
      '<div class="grid-2">' +
      '<div class="panel"><h3>Opportunity matrix — financial potential vs ease of access</h3><p class="note">Bubble = number of opportunities at that score combination (hover for names). Shaded quadrant = high-value and feasible.</p><div class="chart-scroll">' + matrixSVG() + "</div></div>" +
      '<div class="panel"><h3>Windows open or expected soon</h3><p class="note">Dated or announced application windows. Rolling programmes are excluded here.</p>' + openHTML + "</div>" +
      "</div>";

    v.addEventListener("click", function (e) {
      var m = e.target.closest("[data-fkey]");
      if (m && m.dataset.fval) { setFilter(m.dataset.fkey, m.dataset.fval); return; }
      var o = e.target.closest("[data-open]");
      if (o) openDetail(o.dataset.open);
    });
  }

  /* ---------------- top opportunities ---------------- */
  function topLists() {
    var byPr = S.slice().sort(function (a, b) { return b.priorityScore - a.priorityScore; });
    return [
      {
        key: "immediate", label: "Top 10 immediate",
        desc: "Highest-priority opportunities with a live, upcoming or rolling route in — act this fiscal year.",
        list: byPr.filter(function (s) { return (s.openWindow === "open" || s.openWindow === "upcoming" || s.openWindow === "rolling") && s.scores.timeSensitivity >= 3; }).slice(0, 10)
      },
      {
        key: "strategic", label: "Top 10 strategic",
        desc: "Largest potential resources and transformational impact, even if the pathway is longer.",
        list: S.slice().sort(function (a, b) { return (b.scores.financial + b.scores.transformational) - (a.scores.financial + a.scores.transformational) || b.priorityScore - a.priorityScore; }).slice(0, 10)
      },
      {
        key: "easy", label: "Top 10 easy wins",
        desc: "High ease of access and strong Sikkim fit — administratively cheap to pursue.",
        list: S.filter(function (s) { return s.scores.ease >= 4; }).sort(function (a, b) { return (b.scores.ease + b.scores.fit) - (a.scores.ease + a.scores.fit) || b.priorityScore - a.priorityScore; }).slice(0, 10)
      },
      {
        key: "ne", label: "Top 10 North-East-specific",
        desc: "Instruments with confirmed NE/Himalayan preference or dedicated NE windows.",
        list: byPr.filter(function (s) { return s.nePreference === true; }).slice(0, 10)
      },
      {
        key: "windows", label: "Open / expected windows",
        desc: "Everything with a window currently open or expected soon.",
        list: sortSchemes(S.filter(function (s) { return s.openWindow === "open" || s.openWindow === "upcoming"; }).slice())
      },
      {
        key: "under", label: "Potentially underutilised",
        desc: "Sikkim appears eligible and meaningful resources exist, but our research did not identify recent Sikkim participation. This should be verified with the relevant state department and Central ministry — absence of evidence here is not evidence of non-use.",
        list: byPr.filter(function (s) {
          var p = (s.sikkimParticipation && s.sikkimParticipation.status) || "";
          return (p.indexOf("No participation") === 0 || p.indexOf("Unable") === 0) && s.priorityScore >= 3.2;
        })
      }
    ];
  }

  function renderTop() {
    var v = $("#view-top");
    var lists = topLists();
    var tabs = lists.map(function (l, i) {
      return '<button data-tk="' + l.key + '"' + (i === 0 ? ' class="active"' : "") + ">" + l.label + " (" + l.list.length + ")</button>";
    }).join("");
    v.innerHTML = '<h2 class="view-title">Top opportunities for Sikkim</h2>' +
      '<p class="view-desc">Curated analytical shortlists derived from the priority scores. An opportunity can appear in several lists. These are research judgements, not official rankings.</p>' +
      '<div class="sec-tabs" id="top-tabs">' + tabs + '</div><div id="top-body"></div>';

    function draw(key) {
      var l = lists.find(function (x) { return x.key === key; });
      var body = $("#top-body");
      var items = l.list.map(function (s) {
        var why = s.scores.rationale || s.whyItMatters;
        return '<div class="top-item" data-open="' + s.id + '"><h4>' + esc(s.name) +
          '<span class="pr-badge ' + prClass(s.priorityScore) + '">' + s.priorityScore.toFixed(1) + "</span>" + windowBadge(s) + "</h4>" +
          '<div class="ti-min">' + esc(s.ministry) + " · " + esc(deptGroup(s)) + "</div>" +
          '<div class="ti-why"><strong>Why act:</strong> ' + esc(why) + "</div></div>";
      }).join("");
      body.innerHTML = '<p class="view-desc" style="margin-top:2px">' + esc(l.desc) + "</p>" +
        (items ? '<div class="top-list">' + items + "</div>" : '<div class="empty">Nothing currently in this list.</div>');
    }
    draw("immediate");
    $("#top-tabs").addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      $all("#top-tabs button").forEach(function (x) { x.classList.toggle("active", x === b); });
      draw(b.dataset.tk);
    });
    v.addEventListener("click", function (e) {
      var o = e.target.closest("[data-open]");
      if (o) openDetail(o.dataset.open);
    });
  }

  /* ---------------- departments ---------------- */
  function renderDepts() {
    var v = $("#view-depts");
    var groups = {};
    S.forEach(function (s) {
      var d = deptGroup(s);
      (groups[d] = groups[d] || []).push(s);
    });
    var keys = Object.keys(groups).sort(function (a, b) { return groups[b].length - groups[a].length || a.localeCompare(b); });
    v.innerHTML = '<h2 class="view-title">Who should do what</h2>' +
      '<p class="view-desc">Every opportunity grouped by the likely Government of Sikkim nodal department, so a Secretary can see their portfolio at a glance. Nodal assignments marked "likely" in the detail view need confirmation with the state government.</p>';
    keys.forEach(function (k) {
      var list = groups[k].slice().sort(function (a, b) { return b.priorityScore - a.priorityScore; });
      var block = el("div", "dept-block");
      var rows = list.map(function (s) {
        return '<div class="dept-row" data-open="' + s.id + '"><span class="dr-name">' + esc(s.name) + '</span>' +
          '<span class="dr-min">' + esc(s.ministry) + "</span>" +
          '<span class="dr-score pr-badge ' + prClass(s.priorityScore) + '">' + s.priorityScore.toFixed(1) + "</span></div>";
      }).join("");
      block.innerHTML = '<div class="dept-head"><h4>' + esc(k) + '</h4><span class="dcount">' + list.length + " opportunities ▸</span></div>" +
        '<div class="dept-body">' + rows + "</div>";
      block.querySelector(".dept-head").addEventListener("click", function () { block.classList.toggle("open"); });
      v.appendChild(block);
    });
    v.addEventListener("click", function (e) {
      var o = e.target.closest("[data-open]");
      if (o) openDetail(o.dataset.open);
    });
  }

  /* ---------------- government map ---------------- */
  function renderMap() {
    var v = $("#view-map");
    v.innerHTML = '<h2 class="view-title">Central Government map</h2>' +
      '<p class="view-desc">Browse where each opportunity sits institutionally: Government of India → Ministry → Department/Agency → Scheme → Sikkim nodal department → access mechanism.</p>';
    var tree = el("div", "tree panel");
    var ministries = {};
    S.forEach(function (s) {
      var m = s.ministry || "Other";
      var a = nk(s.agency) && s.agency !== s.ministry ? s.agency : "(Ministry direct)";
      ministries[m] = ministries[m] || {};
      (ministries[m][a] = ministries[m][a] || []).push(s);
    });
    Object.keys(ministries).sort().forEach(function (m) {
      var dm = document.createElement("details");
      var total = Object.keys(ministries[m]).reduce(function (n, a) { return n + ministries[m][a].length; }, 0);
      dm.innerHTML = "<summary>" + esc(m) + ' <span style="color:var(--muted);font-weight:400">(' + total + ")</span></summary>";
      Object.keys(ministries[m]).sort().forEach(function (a) {
        var da = document.createElement("details");
        da.className = "t-agency";
        da.style.marginLeft = "18px";
        da.innerHTML = "<summary>" + esc(a) + ' <span style="color:var(--muted);font-weight:400">(' + ministries[m][a].length + ")</span></summary>";
        ministries[m][a].sort(function (x, y) { return y.priorityScore - x.priorityScore; }).forEach(function (s) {
          var row = el("div", "t-scheme");
          row.dataset.open = s.id;
          row.innerHTML = '<div class="ts-name">' + esc(s.name) + '</div><div class="ts-meta">→ ' + esc(deptGroup(s)) + " · " + esc(allocGroup(s)) + " · " + esc(s.type) + "</div>";
          da.appendChild(row);
        });
        dm.appendChild(da);
      });
      tree.appendChild(dm);
    });
    v.appendChild(tree);
    v.addEventListener("click", function (e) {
      var o = e.target.closest("[data-open]");
      if (o) openDetail(o.dataset.open);
    });
  }

  /* ---------------- stacks ---------------- */
  function renderStacks() {
    var v = $("#view-stacks");
    var stacks = DATA.stacks || [];
    v.innerHTML = '<h2 class="view-title">Funding stacks</h2>' +
      '<p class="view-desc">Promising combinations of Central programmes that could jointly finance a major Sikkim priority. Components are financed separately under each scheme\'s own rules — this does not imply that guidelines permit formal pooling unless stated. Convergence must be agreed with each administering ministry.</p>';
    if (!stacks.length) { v.appendChild(el("div", "empty", "No stacks defined.")); return; }
    stacks.forEach(function (st) {
      var p = el("div", "panel stack-card");
      var comps = st.components.map(function (c) {
        var s = byId(c.schemeId);
        if (!s) return "";
        return '<div class="stack-comp" data-open="' + s.id + '"><span class="dr-name" style="font-weight:600;color:var(--navy-2)">' + esc(s.shortName || s.name) + '</span><span class="scc-role">' + esc(c.role) + "</span>" + '<span class="dr-score pr-badge ' + prClass(s.priorityScore) + '" style="margin-left:auto">' + s.priorityScore.toFixed(1) + "</span></div>";
      }).join("");
      p.innerHTML = "<h3>" + esc(st.title) + '</h3><div class="sc-goal">' + esc(st.goal) + "</div>" + comps +
        (st.caveat ? '<div class="stack-caveat">⚠ ' + esc(st.caveat) + "</div>" : "");
      v.appendChild(p);
    });
    v.addEventListener("click", function (e) {
      var o = e.target.closest("[data-open]");
      if (o) openDetail(o.dataset.open);
    });
  }

  /* ---------------- pipeline ---------------- */
  function renderPipeline() {
    var v = $("#view-pipeline");
    var pipe = loadPipe();
    var ids = Object.keys(pipe);
    v.innerHTML = '<h2 class="view-title">Action pipeline</h2>' +
      '<p class="view-desc">Your working pipeline. Assign a stage and private notes to any opportunity from its detail page. Everything here is stored only in this browser (localStorage) — use Export to back it up or share it.</p>' +
      '<div class="toolbar"><button class="chip" id="pipe-export" style="font-size:13px;padding:6px 14px">Export notes (JSON)</button>' +
      '<label class="chip" style="font-size:13px;padding:6px 14px">Import <input type="file" id="pipe-import" accept=".json" style="display:none"></label></div>' +
      '<div class="pipe-cols" id="pipe-cols"></div>';
    var cols = $("#pipe-cols");
    PIPE_STAGES.forEach(function (stage) {
      var col = el("div", "pipe-col");
      col.innerHTML = "<h4>" + stage + "</h4>";
      var any = false;
      ids.forEach(function (id) {
        if (pipe[id].stage !== stage) return;
        var s = byId(id);
        if (!s) return;
        any = true;
        var c = el("div", "pipe-card");
        c.dataset.open = id;
        c.innerHTML = '<div class="pc-name">' + esc(s.shortName || s.name) + '</div>' +
          (pipe[id].notes ? '<div class="pc-note">' + esc(pipe[id].notes) + "</div>" : "") +
          '<div class="local-note">' + esc(pipe[id].updated || "") + "</div>";
        col.appendChild(c);
      });
      if (!any) col.appendChild(el("div", "local-note", "—"));
      cols.appendChild(col);
    });
    if (!ids.length) v.insertBefore(el("div", "empty", "Nothing tracked yet. Open any opportunity and set a pipeline stage."), cols);
    $("#pipe-export").addEventListener("click", function () {
      var blob = new Blob([JSON.stringify(loadPipe(), null, 2)], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "sikkim-pipeline-notes.json";
      a.click();
      URL.revokeObjectURL(a.href);
    });
    $("#pipe-import").addEventListener("change", function (e) {
      var f = e.target.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var incoming = JSON.parse(r.result);
          var merged = Object.assign({}, loadPipe(), incoming);
          savePipe(merged);
          renderPipeline();
        } catch (err) { alert("Could not parse that file as pipeline JSON."); }
      };
      r.readAsText(f);
    });
    cols.addEventListener("click", function (e) {
      var o = e.target.closest("[data-open]");
      if (o) openDetail(o.dataset.open);
    });
  }

  /* ---------------- about ---------------- */
  function renderAbout() {
    var v = $("#view-about");
    var flagged = S.filter(function (s) { return s.flags && s.flags.length; }).length;
    var lowMed = S.filter(function (s) { return s.confidence !== "High"; }).length;
    v.innerHTML = '<h2 class="view-title">Methodology &amp; caveats</h2>' +
      '<div class="panel about-cols">' +
      "<h3>What this is</h3><p>An independent research compilation of Central Government of India schemes, missions, grants, funds, financing windows and technical-assistance programmes that the Government of Sikkim can potentially access. It was built ministry-by-ministry from primary Government of India sources (ministry websites, PIB releases, scheme guidelines, Cabinet approvals, Budget documents, Finance Commission reports and parliamentary answers), verified as of " + esc(DATA.generated || "September 2026") + ".</p>" +
      "<h3>Priority scores</h3><p>Each opportunity is scored 1–5 on five dimensions: financial potential, ease of access, Sikkim fit, time sensitivity and transformational potential. The composite priority score is a weighted mean — financial 25%, Sikkim fit 25%, ease 20%, transformational 20%, time sensitivity 10%. It is an analytical prioritisation aid produced by this research exercise; it is <strong>not</strong> an official measure of any government.</p>" +
      "<h3>Uncertainty is marked, not hidden</h3><p>" + flagged + " entries carry one or more data-quality flags (e.g. continuation beyond FY2025-26 needs confirmation; funding details unclear; no current window found), and " + lowMed + " entries have Medium or Low research confidence with the reason stated. Where a fact could not be confirmed from official guidance, the entry says so explicitly rather than guessing. Formula-based and statutory transfers are labelled as such and are not presented as things Sikkim must “apply” for.</p>" +
      "<h3>Key limitations</h3><ul>" +
      "<li>The 15th Finance Commission cycle ended 31 March 2026; several centrally sponsored schemes were awaiting formal continuation orders at the time of research. Status is flagged where unconfirmed.</li>" +
      "<li>“No participation located” means our search did not find evidence of recent Sikkim participation — it is not a finding that Sikkim has failed to use a scheme, and should be verified with the state department and ministry.</li>" +
      "<li>Some official portals were intermittently unreachable during research; affected entries carry lower confidence.</li>" +
      "<li>Nodal department assignments reflect Sikkim's current portfolio structure as best as could be determined and are marked “likely” where uncertain.</li></ul>" +
      "<h3>Updating</h3><p>The dataset lives in <code>data/schemes.json</code> (one record per opportunity) with citations in <code>data/sources.json</code>. Regenerate the site bundle with <code>python3 scripts/build-data.py</code> after editing. Full instructions are in the README, and unresolved research questions are logged in <code>research-notes.md</code>.</p>" +
      "</div>";
  }

  /* ---------------- boot ---------------- */
  $("#stamp-count").textContent = S.length + " opportunities · " + Object.keys(countBy(function (s) { return [s.ministry]; })).length + " ministries/agencies";
  if (DATA.generated) $("#stamp-date").textContent = DATA.generated;
  buildFilters();
  renderCards();
  renderDashboard();
  renderTop();
  renderDepts();
  renderMap();
  renderStacks();
  renderAbout();
})();
