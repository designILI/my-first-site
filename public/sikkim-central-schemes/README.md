# Sikkim Central Resources Navigator

A research-backed, standalone website and structured database of **Central Government of India schemes, missions, programmes, grants, funds, financing windows and technical-assistance programmes that the Government of Sikkim can access** — with, for each opportunity, the administrative pathway ("how do we get the money?"), the likely Sikkim nodal department, confirmed funding patterns, Sikkim's participation track record, data-quality flags and full source citations.

**155 opportunities · 10 ministry/sector clusters · 370+ citations · verified as of 5 September 2026.**

Open `index.html` in any browser — no build step, no server, no dependencies.

## What's inside

| View | Purpose |
|---|---|
| Dashboard | Summary metrics, opportunities by ministry/sector/department, funding-mechanism and Centre–State-ratio breakdowns, scheme status, financial-potential vs ease-of-access matrix, open windows |
| All Opportunities | Full-text search, 13 filter dimensions (ministry, Sikkim department, sector, type, grant vs loan, status, NE preference, ratio, mechanism, window, priority, state contribution, track record), 6 sort orders, card grid with full detail panel |
| Top Opportunities | Analytical shortlists: immediate, strategic, easy wins, North-East-specific, open windows, and Potentially Underutilised |
| Who Should Do What | Every opportunity grouped by likely Government of Sikkim nodal department |
| Government Map | Browsable hierarchy: Ministry → Department/Agency → Scheme → Sikkim department → access mechanism |
| Funding Stacks | 12 combinations of Central programmes for major Sikkim priorities (tourism destinations, border villages, organic value chains, GLOF resilience, mountain towns, EV transition, …) |
| Action Pipeline | Track opportunities through Explore → … → Sanctioned with private notes (browser localStorage only; JSON export/import) |
| Methodology | Scoring method, caveats and limitations |

Each opportunity's detail panel includes: why it matters for Sikkim, key facts (type, status, period, funding, confirmed Centre–State ratio, state contribution, allocation method, window, portal, approving authority, contact), a step-by-step **access-pathway workflow** with uncertain steps highlighted, an operational **exact next action**, what can be funded, eligible applicants, required documents (confirmed vs likely), illustrative potential Sikkim use cases, **"Has Sikkim already used this?"** with evidence, data-quality flags, the five analytical scores with rationale, and expandable sources.

## Research methodology

- **Live research, not model memory.** Ten parallel research passes (one per ministry/sector cluster) ran web searches and page fetches on 5 September 2026, covering: MDoNER/NEC and NE-specific programmes; infrastructure/connectivity/border; urban & housing; rural development, panchayati raj & water; agriculture, organic farming, livestock, fisheries, food processing & cooperatives; health, education, skills, sports & youth; energy, environment, climate & disaster resilience; tourism, culture, tribal development & social welfare; industry, MSME, digital & S&T; and fiscal transfers (SASCI, Finance Commission, externally aided projects, PFMS/SNA plumbing).
- **Sources searched, in priority order:** ministry websites and scheme portals, PIB releases, Cabinet approvals, Union Budget documents, scheme guidelines PDFs, Finance Commission reports, Department of Expenditure/DEA documents, parliamentary questions, official dashboards, Government of Sikkim releases; reputable secondary sources only for discovery and corroboration.
- **Verification discipline:** every substantive claim carries a citation; funding ratios, ceilings, deadlines and processes are stated only where confirmed — otherwise the entry says *"Not confirmed from available official guidance."* Formula-based and statutory transfers are labelled as such and never presented as "applications". Each scheme was checked for continuation beyond the 15th Finance Commission cycle that ended 31 March 2026, and for evidence of prior Sikkim participation (classified as Confirmed / Evidence of previous participation / No participation located / Unable to determine).
- **Uncertainty is marked, not hidden:** 90 of 155 entries carry Medium/Low confidence with the reason stated, and data-quality flags (⚠ continuation needs confirmation, ⚠ funding details unclear, etc.) appear on the affected records. See `research-notes.md` for all unresolved questions.

### Limitations

- The research environment's egress proxy blocked direct fetches of several .gov.in domains (including PIB); affected facts were verified through official-domain search results and corroborating coverage, with confidence lowered accordingly.
- An independent post-research link-liveness check could not be completed from this environment (all outbound fetches blocked); run `python3 scripts/check-urls.py` from an unrestricted network to test every cited URL.
- The 16th Finance Commission's state-wise annexes and several FY2026-27 scheme guidelines were not publicly readable at research time; Sikkim-specific figures under the new award are flagged rather than guessed.
- "No participation located" is a research result, not a finding of non-use — verify with the state department and the ministry.

## Priority scores

Each opportunity is scored 1–5 on five dimensions by the research team: **financial potential**, **ease of access**, **Sikkim fit**, **time sensitivity**, **transformational potential**. The composite Opportunity Priority Score is a weighted mean:

```
priority = 0.25·financial + 0.25·fit + 0.20·ease + 0.20·transformational + 0.10·timeSensitivity
```

Bands: **High ≥ 4.0**, Medium 3.0–3.9, Lower < 3.0. This is a transparent analytical prioritisation aid produced by this research exercise — **not** an official measure of any government. Weights live in `scripts/build-data.py`; change them and rebuild to re-rank.

## Repository layout

```
index.html              the site (open directly, or host statically)
css/styles.css          styling
js/app.js               all client logic (vanilla JS, no dependencies)
js/data.js              GENERATED browser bundle — do not edit by hand
data/raw/cluster-*.json research output, one file per cluster (source of truth)
data/schemes.json       GENERATED merged + scored dataset
data/sources.json       GENERATED flat citation index (one row per source)
data/stacks.json        authored funding-stack combinations
scripts/build-data.py   merges raw clusters → schemes.json, sources.json, js/data.js
scripts/check-urls.py   link checker for every cited URL (run on an open network)
research-notes.md       ambiguities, unresolved questions, consolidation decisions
```

## How to update the database

1. Edit the relevant `data/raw/cluster-*.json` file (or add a new `cluster-*.json` — any JSON array of records with the same keys is picked up automatically). Keep the key set identical across records; use `"Not confirmed from available official guidance"` rather than guessing; update `lastVerified`.
2. To retire a duplicate, add its id to `DROP_DUPLICATES` in `scripts/build-data.py` with the surviving id.
3. Edit `data/stacks.json` to adjust funding stacks (components reference scheme `id`s; the build warns on unknown ids).
4. Rebuild: `python3 scripts/build-data.py` — regenerates `data/schemes.json`, `data/sources.json` and `js/data.js`, and prints validation warnings (missing keys, duplicate ids, bad stack references).
5. Check links: `python3 scripts/check-urls.py`.
6. Refresh the browser. Pipeline notes stored in visitors' localStorage are unaffected by data updates.

## Deployment

The site is fully static — everything is plain files and the dataset ships inside `js/data.js`, so it works from `file://`, GitHub Pages, Netlify, or any web server.

**Vercel (current setup):** this folder lives under the repository's `public/` directory, so the existing Next.js deployment serves it automatically at `/sikkim-central-schemes/index.html` on every deploy and preview — no configuration needed.

**Standalone:** the folder is fully self-contained. Copy it to any static host (or a dedicated Vercel project with Framework Preset "Other", root directory pointed here) and open `index.html`.

**Privacy note:** the Action Pipeline stores stages and notes only in the visitor's browser (localStorage). Nothing is transmitted; the export button produces a local JSON file for backup or manual sharing.
