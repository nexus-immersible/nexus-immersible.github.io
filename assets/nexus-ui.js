/* NEXUS Command Center (public GitHub Pages)
   Data sources:
   - /dashboard/live-status.json (published from VPS)
   - /dashboard/kanban.json (generated from GitHub Issues)

   This UI intentionally does NOT embed credentials.
*/

const REPO_OWNER = "nexus-immersible";
const REPO_NAME = "nexus-immersible.github.io";

const LIVE_URL = "/dashboard/live-status.json";
const KANBAN_URL = "/dashboard/kanban.json";

const COLS = [
  { key: "backlog", label: "Backlog" },
  { key: "next", label: "Next" },
  { key: "in_progress", label: "In Progress" },
  { key: "blocked", label: "Blocked" },
  { key: "done", label: "Done" },
];

function $(sel, el = document) {
  return el.querySelector(sel);
}

function $all(sel, el = document) {
  return Array.from(el.querySelectorAll(sel));
}

function setTextAll(sel, text) {
  for (const el of $all(sel)) el.textContent = text;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatIST(ts) {
  if (!ts) return "—";
  const d = new Date(ts);
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(d);
}

async function fetchJsonNoCache(url, { timeoutMs = 8000 } = {}) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${url}?t=${Date.now()}`, {
      cache: "no-store",
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `HTTP ${res.status} ${res.statusText}${text ? `: ${text.slice(0, 180)}` : ""}`,
      );
    }
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

function setDot(dotEl, level) {
  if (!dotEl) return;
  dotEl.classList.remove("ok", "warn", "bad");
  if (level === "ok") dotEl.classList.add("ok");
  else if (level === "warn") dotEl.classList.add("warn");
  else if (level === "bad") dotEl.classList.add("bad");
}

function githubNewIssueUrl({ title, body, labels }) {
  const base = `https://github.com/${REPO_OWNER}/${REPO_NAME}/issues/new`;
  const params = new URLSearchParams();
  if (title) params.set("title", title);
  if (body) params.set("body", body);
  if (labels && labels.length) params.set("labels", labels.join(","));
  return `${base}?${params.toString()}`;
}

function deptToLabel(dept) {
  if (dept === "eng") return "dept:eng";
  if (dept === "ops") return "dept:ops";
  if (dept === "research") return "dept:research";
  if (dept === "intern") return "dept:intern";
  return "";
}

function prioToLabel(prio) {
  if (prio === "high") return "priority:high";
  if (prio === "low") return "priority:low";
  return "priority:medium";
}

function buildIssueTemplate({ dept, prio }) {
  const deptLabel = deptToLabel(dept);
  const prioLabel = prioToLabel(prio);
  const labels = ["kanban", "status:next", "run:queue", prioLabel];
  if (deptLabel) labels.push(deptLabel);

  const title = `(${dept || "nexus"}) `;
  const body = [
    "# Task",
    "",
    "Goal:",
    "- ",
    "",
    "Context:",
    "- ",
    "",
    "Definition of Done:",
    "- ",
    "",
    "Constraints:",
    "- No secrets in this issue (public repo)",
    "",
    "Execution:",
    "- If this is an engineering task, add details (files, repo links)",
    "- If research, specify sources or questions",
    "",
    "(Created from NEXUS Command Center)",
  ].join("\n");

  return { title, body, labels };
}

function renderLiveStatus(live) {
  const updated = live?.generatedAt || live?.generated_at || null;
  const label = updated ? formatIST(updated) : "—";

  setTextAll("[data-live-updated]", label);

  // topbar dot
  const dot = $("[data-live-dot]");
  const lvl = live?.system?.health || live?.health || "warn";
  setDot(dot, lvl);

  // metrics
  const gatewayActive = !!live?.system?.services?.gateway_active;
  const nodeActive = !!live?.system?.services?.node_active;
  const ollamaActive = !!live?.system?.services?.ollama_active;
  const telegramOk = !!live?.system?.telegram?.ok;
  const tokens = live?.system?.sessions?.main?.totalTokens ?? live?.system?.sessions?.main?.total_tokens;
  const timers = live?.system?.timers?.length ?? 0;
  const night = live?.nightShift?.latestArtifact ? "active" : "idle";

  setTextAll("[data-metric-gateway]", gatewayActive ? "ONLINE" : "OFFLINE");
  setTextAll("[data-metric-node]", nodeActive ? "ONLINE" : "OFFLINE");
  setTextAll("[data-metric-ollama]", ollamaActive ? "ONLINE" : "OFFLINE");
  setTextAll("[data-metric-telegram]", telegramOk ? "OK" : "DEGRADED");
  setTextAll("[data-metric-tokens]", typeof tokens === "number" ? String(tokens) : "n/a");
  setTextAll("[data-metric-timers]", String(timers));
  setTextAll("[data-metric-night]", night);
}

function renderMonitor(live) {
  if (!live) return;
  setTextAll("[data-mon-health]", String(live?.health || live?.system?.health || "—").toUpperCase());
  setTextAll("[data-mon-host]", live?.system?.host || "—");
  setTextAll("[data-mon-updated]", live?.generatedAt ? formatIST(live.generatedAt) : "—");

  const s = live?.system?.services || {};
  setTextAll("[data-mon-gateway]", s.gateway_active ? "ACTIVE" : "OFFLINE");
  setTextAll("[data-mon-node]", s.node_active ? "ACTIVE" : "OFFLINE");
  setTextAll("[data-mon-ollama]", s.ollama_active ? "ACTIVE" : "OFFLINE");
  setTextAll("[data-mon-telegram]", live?.system?.telegram?.ok ? "OK" : "DEGRADED");

  const sess = live?.system?.sessions?.main || {};
  const total = sess.totalTokens ?? sess.total_tokens;
  const ctx = sess.contextTokens ?? sess.context_tokens;
  setTextAll("[data-mon-tokens-total]", typeof total === "number" ? String(total) : "n/a");
  setTextAll("[data-mon-tokens-ctx]", typeof ctx === "number" ? String(ctx) : "n/a");

  setTextAll("[data-mon-night]", live?.nightShift?.latestArtifact ? "ACTIVE" : "IDLE");
  setTextAll("[data-mon-night-artifact]", live?.nightShift?.latestArtifact || "—");

  const timers = Array.isArray(live?.system?.timers) ? live.system.timers : [];
  const tbl = $("[data-mon-timers]");
  if (tbl) {
    tbl.innerHTML = timers
      .map((t) => {
        const unit = escapeHtml(t.unit || "");
        const activates = escapeHtml(t.activates || "");
        const next = escapeHtml(t.next ? formatIST(t.next) : "—");
        const last = escapeHtml(t.last ? formatIST(t.last) : "—");
        return `<tr><td class="mono">${unit}</td><td class="mono">${activates}</td><td class="mono">${next}</td><td class="mono">${last}</td></tr>`;
      })
      .join("");
  }
}

function normalizeTask(raw) {
  const labels = Array.isArray(raw.labels) ? raw.labels : [];
  const labelNames = labels
    .map((l) => (typeof l === "string" ? l : l?.name))
    .filter(Boolean);

  const state = raw.state || (raw.closedAt ? "closed" : "open");
  const column = raw.column || raw.status || "backlog";

  const deptLabel = labelNames.find((n) => n && n.startsWith("dept:")) || "dept:nexus";
  const prioLabel = labelNames.find((n) => n && n.startsWith("priority:")) || "priority:medium";

  const dept = deptLabel.split(":", 2)[1] || "nexus";
  const prio = prioLabel.split(":", 2)[1] || "medium";

  return {
    number: raw.number,
    title: raw.title,
    url: raw.url,
    htmlUrl: raw.htmlUrl || raw.html_url,
    updatedAt: raw.updatedAt || raw.updated_at,
    createdAt: raw.createdAt || raw.created_at,
    closedAt: raw.closedAt || raw.closed_at,
    body: raw.body || "",
    bodyExcerpt: raw.bodyExcerpt || raw.body_excerpt || "",
    state,
    column,
    dept,
    prio,
    labels: labelNames,
    assignee: raw.assignee || raw.assignee_login || null,
  };
}

function renderKanbanBoard(kanban, { query = "", dept = "all", prio = "all" } = {}) {
  const board = $("[data-board]");
  if (!board) return;

  const tasks = Array.isArray(kanban?.tasks) ? kanban.tasks.map(normalizeTask) : [];

  const q = query.trim().toLowerCase();
  const filtered = tasks.filter((t) => {
    if (dept !== "all" && t.dept !== dept) return false;
    if (prio !== "all" && t.prio !== prio) return false;
    if (!q) return true;
    const hay = `${t.title} #${t.number} ${t.labels.join(" ")}`.toLowerCase();
    return hay.includes(q);
  });

  const byCol = new Map(COLS.map((c) => [c.key, []]));
  for (const t of filtered) {
    const k = byCol.has(t.column) ? t.column : "backlog";
    byCol.get(k).push(t);
  }

  for (const [, arr] of byCol) {
    arr.sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
  }

  board.innerHTML = COLS.map((c) => {
    const arr = byCol.get(c.key) || [];
    const count = arr.length;
    const cards = arr
      .map((t) => {
        const deptCls = `dept-${t.dept}`.replaceAll("_", "-");
        const prioCls = t.prio === "high" ? "prio-high" : t.prio === "low" ? "prio-low" : "prio-med";
        const when = t.updatedAt ? formatIST(t.updatedAt) : "—";
        const safeTitle = escapeHtml(t.title || "(untitled)");
        const num = escapeHtml(String(t.number || ""));
        const deptChip = escapeHtml(t.dept);
        const prioChip = escapeHtml(t.prio);
        const updatedChip = escapeHtml(when);
        const htmlUrl = escapeHtml(t.htmlUrl || t.url || "");
        const body = escapeHtml(t.bodyExcerpt || t.body || "");
        return `
        <div class="card-task" role="button" tabindex="0"
          data-task
          data-task-url="${htmlUrl}"
          data-task-title="${safeTitle}"
          data-task-number="${num}"
          data-task-dept="${deptChip}"
          data-task-prio="${prioChip}"
          data-task-updated="${updatedChip}"
          data-task-body="${body}">
          <div class="title">#${num} ${safeTitle}</div>
          <div class="meta">
            <span class="pchip ${deptCls}">${deptChip}</span>
            <span class="pchip ${prioCls}">${prioChip}</span>
            <span class="pchip">${updatedChip}</span>
          </div>
        </div>
      `;
      })
      .join("");

    return `
      <section class="column" data-col="${c.key}">
        <div class="col-head">
          <div class="col-title">${escapeHtml(c.label)}</div>
          <div class="badge">${count}</div>
        </div>
        ${cards || `<div class="tag">No tasks</div>`}
      </section>
    `;
  }).join("");

  const updatedEl = $("[data-kanban-updated]");
  if (updatedEl) updatedEl.textContent = kanban?.generatedAt ? formatIST(kanban.generatedAt) : "—";

  for (const el of board.querySelectorAll("[data-task]")) {
    el.addEventListener("click", () => openTaskDialog(el));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openTaskDialog(el);
      }
    });
  }
}

function openTaskDialog(el) {
  const dlg = $("[data-dialog]");
  if (!dlg) return;

  const title = el.getAttribute("data-task-title") || "";
  const number = el.getAttribute("data-task-number") || "";
  const dept = el.getAttribute("data-task-dept") || "";
  const prio = el.getAttribute("data-task-prio") || "";
  const updated = el.getAttribute("data-task-updated") || "";
  const url = el.getAttribute("data-task-url") || "";
  const body = el.getAttribute("data-task-body") || "";

  $("[data-dialog-title]", dlg).textContent = `#${number} ${title}`;
  $("[data-dialog-meta]", dlg).textContent = `dept=${dept} prio=${prio} updated=${updated}`;
  $("[data-dialog-body]", dlg).textContent = body;

  const openBtn = $("[data-dialog-open]", dlg);
  if (openBtn) openBtn.href = url;

  dlg.classList.add("open");
}

function closeDialog() {
  const dlg = $("[data-dialog]");
  if (!dlg) return;
  dlg.classList.remove("open");
}

function bindDialog() {
  const dlg = $("[data-dialog]");
  if (!dlg) return;

  $(".backdrop", dlg)?.addEventListener("click", closeDialog);
  $("[data-dialog-close]", dlg)?.addEventListener("click", closeDialog);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDialog();
  });
}

function renderIndexKanbanMeta(kanban) {
  const doneEl = $("[data-metric-done]");
  const inprogEl = $("[data-metric-inprog]");
  const nextEl = $("[data-metric-next]");

  const counts = kanban?.counts || {};
  if (doneEl) doneEl.textContent = String(counts.done ?? "—");
  if (inprogEl) inprogEl.textContent = String(counts.in_progress ?? "—");
  if (nextEl) nextEl.textContent = String(counts.next ?? "—");
}

function bindNewTaskButtons() {
  $("[data-new-task]")?.addEventListener("click", () => {
    const dept = $("[data-new-dept]")?.value || "eng";
    const prio = $("[data-new-prio]")?.value || "medium";
    const tpl = buildIssueTemplate({ dept, prio });
    window.open(githubNewIssueUrl(tpl), "_blank", "noopener,noreferrer");
  });

  for (const el of document.querySelectorAll("[data-new-quick]")) {
    el.addEventListener("click", () => {
      const dept = el.getAttribute("data-new-quick") || "eng";
      const tpl = buildIssueTemplate({ dept, prio: "medium" });
      window.open(githubNewIssueUrl(tpl), "_blank", "noopener,noreferrer");
    });
  }
}

function initIndex() {
  bindDialog();
  bindNewTaskButtons();

  const refresh = async () => {
    try {
      renderLiveStatus(await fetchJsonNoCache(LIVE_URL, { timeoutMs: 6000 }));
    } catch (e) {
      const el = $("[data-live-updated]");
      if (el) el.textContent = "error";
      console.warn("live-status fetch failed", String(e?.message || e));
    }

    try {
      const kanban = await fetchJsonNoCache(KANBAN_URL, { timeoutMs: 6000 });
      renderIndexKanbanMeta(kanban);
      const el = $("[data-kanban-updated]");
      if (el) el.textContent = kanban?.generatedAt ? formatIST(kanban.generatedAt) : "—";
    } catch (e) {
      console.warn("kanban fetch failed", String(e?.message || e));
    }
  };

  refresh();
  setInterval(refresh, 15000);
}

function initKanban() {
  bindDialog();
  bindNewTaskButtons();

  const state = { query: "", dept: "all", prio: "all", kanban: null };

  const apply = () => state.kanban && renderKanbanBoard(state.kanban, state);

  $("[data-search]")?.addEventListener("input", (e) => {
    state.query = e.target.value;
    apply();
  });

  $("[data-filter-dept]")?.addEventListener("change", (e) => {
    state.dept = e.target.value;
    apply();
  });

  $("[data-filter-prio]")?.addEventListener("change", (e) => {
    state.prio = e.target.value;
    apply();
  });

  const refresh = async () => {
    try {
      state.kanban = await fetchJsonNoCache(KANBAN_URL, { timeoutMs: 7000 });
      apply();
    } catch (e) {
      console.warn("kanban fetch failed", String(e?.message || e));
    }

    try {
      renderLiveStatus(await fetchJsonNoCache(LIVE_URL, { timeoutMs: 6000 }));
    } catch (e) {
      console.warn("live-status fetch failed", String(e?.message || e));
    }
  };

  refresh();
  setInterval(refresh, 10000);
}

function initMonitor() {
  bindDialog();
  bindNewTaskButtons();

  const refresh = async () => {
    try {
      const live = await fetchJsonNoCache(LIVE_URL, { timeoutMs: 7000 });
      renderMonitor(live);
      renderLiveStatus(live);
    } catch (e) {
      console.warn("monitor fetch failed", String(e?.message || e));
    }

    try {
      const kanban = await fetchJsonNoCache(KANBAN_URL, { timeoutMs: 7000 });
      renderIndexKanbanMeta(kanban);
      const el = $("[data-kanban-updated]");
      if (el) el.textContent = kanban?.generatedAt ? formatIST(kanban.generatedAt) : "—";
    } catch (e) {
      console.warn("kanban fetch failed", String(e?.message || e));
    }
  };

  refresh();
  setInterval(refresh, 10000);
}

function main() {
  const page = document.body?.dataset?.page || "index";
  if (page === "kanban") initKanban();
  else if (page === "monitor") initMonitor();
  else initIndex();
}

main();
