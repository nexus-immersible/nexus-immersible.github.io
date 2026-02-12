import fs from "node:fs/promises";
import path from "node:path";

const repoFull = process.env.GITHUB_REPOSITORY || "nexus-immersible/nexus-immersible.github.io";
const [owner, repo] = repoFull.split("/", 2);

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
if (!token) {
  console.error("Missing GITHUB_TOKEN");
  process.exit(1);
}

const OUT_DIR = path.resolve(process.cwd(), "dashboard");
const OUT_FILE = path.join(OUT_DIR, "kanban.json");

const headers = {
  "Accept": "application/vnd.github+json",
  "Authorization": `Bearer ${token}`,
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "nexus-kanban-indexer",
};

function labelNames(issue) {
  return (issue.labels || [])
    .map((l) => (typeof l === "string" ? l : l?.name))
    .filter(Boolean);
}

function pickColumn(issue) {
  const labels = new Set(labelNames(issue));
  // Prefer explicit status labels; fall back to closed -> done.
  if (labels.has("status:done")) return "done";
  if (issue.state === "closed") return "done";
  if (labels.has("status:blocked")) return "blocked";
  if (labels.has("status:in-progress")) return "in_progress";
  if (labels.has("status:next")) return "next";
  if (labels.has("status:backlog")) return "backlog";
  return "backlog";
}

function pickDept(issue) {
  const labels = labelNames(issue);
  const dept = labels.find((n) => n.startsWith("dept:"));
  return dept ? dept.split(":", 2)[1] : "nexus";
}

function pickPriority(issue) {
  const labels = labelNames(issue);
  const pr = labels.find((n) => n.startsWith("priority:"));
  return pr ? pr.split(":", 2)[1] : "medium";
}

async function gh(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status} ${res.statusText} for ${url}`);
  return await res.json();
}

async function listAllIssues() {
  const all = [];
  for (let page = 1; page <= 20; page += 1) {
    const url =
      `https://api.github.com/repos/${owner}/${repo}/issues` +
      `?state=all&per_page=100&page=${page}&labels=kanban`;
    // eslint-disable-next-line no-await-in-loop
    const items = await gh(url);
    if (!Array.isArray(items) || items.length === 0) break;
    for (const it of items) {
      if (it.pull_request) continue; // exclude PRs
      all.push(it);
    }
    if (items.length < 100) break;
  }
  return all;
}

function excerpt(s, max = 900) {
  const x = String(s || "").trim();
  if (!x) return "";
  if (x.length <= max) return x;
  return x.slice(0, max).trimEnd() + "\n…";
}

const nowIso = new Date().toISOString();
const issues = await listAllIssues();

const tasks = issues
  .map((it) => {
    const labels = labelNames(it);
    return {
      number: it.number,
      title: it.title,
      state: it.state,
      column: pickColumn(it),
      dept: pickDept(it),
      prio: pickPriority(it),
      labels,
      assignee: it.assignee?.login || null,
      htmlUrl: it.html_url,
      url: it.url,
      createdAt: it.created_at,
      updatedAt: it.updated_at,
      closedAt: it.closed_at,
      bodyExcerpt: excerpt(it.body, 1200),
    };
  })
  .sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));

const counts = {
  backlog: 0,
  next: 0,
  in_progress: 0,
  blocked: 0,
  done: 0,
};
for (const t of tasks) {
  if (counts[t.column] != null) counts[t.column] += 1;
}

const out = {
  schemaVersion: 1,
  generatedAt: nowIso,
  repo: { owner, name: repo },
  counts,
  tasks,
};

await fs.mkdir(OUT_DIR, { recursive: true });
await fs.writeFile(OUT_FILE, JSON.stringify(out, null, 2) + "\n", "utf8");
console.log(`wrote ${OUT_FILE} tasks=${tasks.length}`);

