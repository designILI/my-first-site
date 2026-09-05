#!/usr/bin/env python3
"""Build the site data bundle for the Sikkim Central Resources Navigator.

Reads:
  data/raw/*.json      one JSON array of opportunity records per research cluster
  data/stacks.json     authored funding-stack combinations

Writes:
  data/schemes.json    merged, deduplicated, scored dataset (canonical)
  data/sources.json    flat citation index (one row per source per scheme)
  js/data.js           browser bundle consumed by index.html (window.NAV_DATA)

Priority score = weighted mean of the five 1-5 analytical scores:
  financial 25% + fit 25% + ease 20% + transformational 20% + timeSensitivity 10%
It is an analytical prioritisation aid, not an official measure.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "data" / "raw"
GENERATED_LABEL = "5 September 2026"

WEIGHTS = {"financial": 0.25, "fit": 0.25, "ease": 0.20, "transformational": 0.20, "timeSensitivity": 0.10}

# Cross-cluster duplicates resolved during consolidation (see research-notes.md).
# Key = dropped record id, value = surviving record id.
DROP_DUPLICATES = {
    "sasci-2026-27-core": "sasci-capital-investment-loans",
    "sasci-tourism-destinations-window": "sasci-iconic-tourist-centres",
    "fc16-local-body-grants": "finance-commission-grants-rural-local-bodies / 16th-fc-ulb-grants",
    "fc16-disaster-risk-financing-sdrf-sdmf": "sdrf-ndrf-sdmf-ndmf-disaster-funds",
    "dea-externally-aided-projects": "dea-externally-aided-projects-mechanism",
}

# --- Canonicalisation -------------------------------------------------------
# Ministries: strip parenthetical/department suffixes to one name per ministry
# (the `agency` field keeps the department detail); a few explicit overrides.
MINISTRY_OVERRIDES = {
    "All 55 non-exempt Central Ministries/Departments (monitored by MDoNER)": "Cross-ministry (MDoNER-monitored)",
    "Department of Space (jointly with North Eastern Council / MDoNER)": "Department of Space",
    "MoEFCC (National Designated Authority); Ministry of Finance oversight of NABARD": "Ministry of Environment, Forest and Climate Change",
    "Not applicable (NABARD's own balance-sheet lending window)": "NABARD (under Ministry of Finance oversight)",
    "n/a (SIDBI fund set up with RBI support; Ministry of Finance ecosystem)": "SIDBI (under Ministry of Finance ecosystem)",
    "NITI Aayog (Government of India)": "NITI Aayog",
}


def canon_ministry(m):
    if not m:
        return "Other"
    if m in MINISTRY_OVERRIDES:
        return MINISTRY_OVERRIDES[m]
    import re as _re
    out = _re.split(r"\s+\(|\s+—\s+|;\s+|,\s+on\s+|\s+with\s+", m)[0].strip().rstrip(",;")
    return out or m


# Policy sectors: explicit mapping of every raw value to a ~20-sector taxonomy.
POLICY_CANON = {
    "Agricultural marketing and value chains": "Agriculture & Organic Farming",
    "Agriculture": "Agriculture & Organic Farming",
    "Agriculture and allied sectors": "Agriculture & Organic Farming",
    "Agriculture infrastructure": "Agriculture & Organic Farming",
    "Beekeeping/allied agriculture": "Agriculture & Organic Farming",
    "Farmer collectivisation": "Agriculture & Organic Farming",
    "Horticulture": "Agriculture & Organic Farming",
    "Organic agriculture value chains / state USP development": "Agriculture & Organic Farming",
    "Organic farming": "Agriculture & Organic Farming",
    "Organic/natural farming": "Agriculture & Organic Farming",
    "Digital agriculture / DPI": "Agriculture & Organic Farming",
    "Spices / export development": "Agriculture & Organic Farming",
    "Livestock": "Livestock & Fisheries",
    "Livestock/dairy": "Livestock & Fisheries",
    "Livestock/dairy infrastructure": "Livestock & Fisheries",
    "Fisheries": "Livestock & Fisheries",
    "Food processing": "Food Processing & Cold Chain",
    "Cooperatives": "Cooperatives",
    "Border Areas": "Border Areas",
    "Infrastructure & Connectivity": "Infrastructure & Connectivity",
    "Road connectivity infrastructure": "Infrastructure & Connectivity",
    "Physical and social infrastructure (non-road)": "Infrastructure & Connectivity",
    "Urban Development & Housing": "Urban Development & Housing",
    "Rural Development": "Rural Development & Panchayati Raj",
    "Rural sanitation": "Rural Development & Panchayati Raj",
    "Panchayati Raj": "Rural Development & Panchayati Raj",
    "Panchayati Raj / fiscal transfers": "Rural Development & Panchayati Raj",
    "Panchayati Raj / land governance": "Rural Development & Panchayati Raj",
    "Land governance": "Rural Development & Panchayati Raj",
    "Rural infrastructure financing": "Rural Development & Panchayati Raj",
    "Drinking water": "Water & Irrigation",
    "Irrigation": "Water & Irrigation",
    "Irrigation financing": "Water & Irrigation",
    "Land & water resources": "Water & Irrigation",
    "Water security / climate adaptation": "Water & Irrigation",
    "Tourism": "Tourism",
    "Tourism / Religious heritage": "Tourism",
    "Culture / Education": "Culture & Heritage",
    "Culture and heritage": "Culture & Heritage",
    "Education": "Education",
    "Education / Nutrition": "Education",
    "Skills": "Skills & Employment",
    "Sports": "Sports & Youth",
    "Youth": "Sports & Youth",
    "Health": "Health",
    "Health / Medical education": "Health",
    "Energy": "Energy",
    "Energy / Climate": "Energy",
    "Energy / Transport": "Energy",
    "Cross-cutting financing (power/digital/industrial infrastructure)": "Energy",
    "Environment & Forests": "Environment, Forests & Climate",
    "Environment & Forests / Climate": "Environment, Forests & Climate",
    "Environment / Climate / Himalayan research": "Environment, Forests & Climate",
    "Climate": "Environment, Forests & Climate",
    "Disaster resilience": "Disaster Resilience",
    "Industry & MSME": "Industry, MSME & Trade",
    "Industry & MSME / Textiles": "Industry, MSME & Trade",
    "Industry & MSME / Trade": "Industry, MSME & Trade",
    "Industrial development / private investment incentives": "Industry, MSME & Trade",
    "Startup and enterprise financing": "Industry, MSME & Trade",
    "Enterprise and infrastructure financing": "Industry, MSME & Trade",
    "Handloom, handicrafts and artisan livelihoods": "Industry, MSME & Trade",
    "Textiles, sericulture, handloom and handicrafts": "Industry, MSME & Trade",
    "Digital Government & Connectivity": "Digital Government & Connectivity",
    "Digital Government & Connectivity / Science & Technology": "Digital Government & Connectivity",
    "Science & Technology": "Science, Technology & Innovation",
    "Science & Technology / Innovation": "Science, Technology & Innovation",
    "Space technology applications: disaster management, natural resources, governance support": "Science, Technology & Innovation",
    "Science & technology, skilling, human resource development": "North East Regional Development",
    "Regional development / infrastructure / social development / livelihoods": "North East Regional Development",
    "Regional planning and development": "North East Regional Development",
    "Project facilitation and unblocking of major NER infrastructure": "North East Regional Development",
    "Fiscal earmarking policy for regional development": "North East Regional Development",
    "Social welfare / Drug demand reduction": "Social Welfare & Nutrition",
    "Social welfare / Nutrition and child development": "Social Welfare & Nutrition",
    "Social welfare / Women": "Social Welfare & Nutrition",
    "Tribal development": "Tribal Development",
    "Tribal development / Education": "Tribal Development",
    "Tribal development / Livelihoods": "Tribal Development",
    "Fiscal federalism / award transition": "Fiscal Transfers & Public Finance",
    "Fiscal federalism / revenue-account gap filling": "Fiscal Transfers & Public Finance",
    "Fiscal federalism / untied resource transfer": "Fiscal Transfers & Public Finance",
    "Plan-era transfers to special category states": "Fiscal Transfers & Public Finance",
    "Public financial management / fund-flow compliance": "Fiscal Transfers & Public Finance",
    "State capital expenditure / hill-state development": "Fiscal Transfers & Public Finance",
    "External development financing": "Fiscal Transfers & Public Finance",
    "Economic revival, employment and service delivery": "Fiscal Transfers & Public Finance",
    "Civil service capacity building": "Governance & Capacity Building",
    "Planning support, governance transformation, development monitoring": "Governance & Capacity Building",
}

# Sikkim nodal departments: canonical grouping for the "Who Should Do What"
# view. Patterns are searched in the raw sikkimNodalDept string; the EARLIEST
# match in the string wins (so the first-listed department dominates).
DEPT_PATTERNS = [
    (r"Food Security and Agriculture", "Agriculture Department"),
    (r"Agriculture Department", "Agriculture Department"),
    (r"Animal Husbandry", "Animal Husbandry & Veterinary Services Department"),
    (r"Fisheries Department", "Fisheries Department"),
    (r"Horticulture Department", "Horticulture Department"),
    (r"Commerce", "Commerce & Industries Department"),
    (r"Cooperation Department", "Cooperation Department"),
    (r"Cultural Affairs", "Cultural Affairs & Heritage Department"),
    (r"Ecclesiastical", "Ecclesiastical Affairs Department"),
    (r"Information Technology|IT Department", "Information Technology Department"),
    (r"Department of Personnel", "Department of Personnel"),
    (r"Science (and|&) Technology", "Science, Technology & Climate Change Department"),
    (r"Development Planning|Chief Secretary", "Development Planning, ER & NECA Department"),
    (r"Education Department", "Education Department"),
    (r"Energy & Power|Power Department", "Energy & Power Department"),
    (r"Finance Department", "Finance Department"),
    (r"Forest & Environment|Forest and Environment", "Forest & Environment Department"),
    (r"Health", "Health & Family Welfare Department"),
    (r"Home Department", "Home Department"),
    (r"Sikkim Fire|SSDMA|Sikkim State Disaster Management|Land Revenue", "Land Revenue & Disaster Management / SSDMA"),
    (r"Public Health Engineering", "PHE & Water Security Department"),
    (r"Water Resources", "Water Resources Department"),
    (r"Roads (&|and) Bridges", "Roads & Bridges Department"),
    (r"Rural Development", "Rural Development Department"),
    (r"Skill Development", "Skill Development Department"),
    (r"Social Welfare", "Social Welfare Department"),
    (r"Sports", "Sports & Youth Affairs Department"),
    (r"Tourism", "Tourism & Civil Aviation Department"),
    (r"Transport Department", "Transport Department"),
    (r"Urban Development", "Urban Development Department"),
    (r"Women, Child", "Women, Child & Divyangjan Welfare Department"),
]


def canon_dept(raw):
    import re as _re
    if not raw:
        return "To be confirmed"
    best = None
    for pat, canon in DEPT_PATTERNS:
        m = _re.search(pat, raw, _re.I)
        if m and (best is None or m.start() < best[0]):
            best = (m.start(), canon)
    return best[1] if best else "To be confirmed"


REQUIRED_KEYS = [
    "id", "name", "shortName", "ministry", "agency", "policyArea", "subcategory",
    "type", "grantOrLoan", "status", "period", "whyItMatters", "eligibleApplicants",
    "sikkimNodalDept", "whatCanBeFunded", "fundingAvailable", "fundingRatio",
    "nePreference", "nePreferenceDetail", "stateContribution", "allocationMethod",
    "accessPathway", "nextAction", "portal", "applicationWindow", "keyDocuments",
    "approvingAuthority", "contact", "guidelines", "sources", "sikkimParticipation",
    "potentialUseCases", "flags", "scores", "openWindow", "lastVerified",
    "confidence", "confidenceNote",
]


def clamp_score(v):
    try:
        return max(1, min(5, int(v)))
    except (TypeError, ValueError):
        return 1


def main():
    records = {}
    problems = []
    for f in sorted(RAW.glob("*.json")):
        try:
            arr = json.loads(f.read_text())
        except json.JSONDecodeError as e:
            problems.append(f"{f.name}: JSON parse error: {e}")
            continue
        if not isinstance(arr, list):
            problems.append(f"{f.name}: top level is not a list")
            continue
        for rec in arr:
            rid = rec.get("id")
            if rid in DROP_DUPLICATES:
                continue
            if not rid:
                problems.append(f"{f.name}: record without id: {rec.get('name')}")
                continue
            missing = [k for k in REQUIRED_KEYS if k not in rec]
            if missing:
                problems.append(f"{f.name}:{rid}: missing keys {missing}")
            if rid in records:
                # keep the record with more sources; note the collision
                old = records[rid]["_rec"]
                keep_new = len(rec.get("sources") or []) > len(old.get("sources") or [])
                problems.append(
                    f"duplicate id '{rid}' in {f.name} (also in {records[rid]['_file']}); "
                    f"kept {'new' if keep_new else 'existing'}"
                )
                if not keep_new:
                    continue
            records[rid] = {"_rec": rec, "_file": f.name}

    schemes = []
    for rid, wrap in records.items():
        rec = dict(wrap["_rec"])
        rec.pop("_cluster", None)
        raw_ministry = rec.get("ministry") or ""
        canon = canon_ministry(raw_ministry)
        if canon != raw_ministry:
            # keep the researcher's full attribution in agency if it adds detail
            if not rec.get("agency") or rec["agency"] == raw_ministry:
                rec["agency"] = raw_ministry
        rec["ministry"] = canon
        raw_pa = rec.get("policyArea") or ""
        if raw_pa in POLICY_CANON:
            rec["policyArea"] = POLICY_CANON[raw_pa]
        elif raw_pa:
            problems.append(f"{rid}: unmapped policyArea '{raw_pa}' kept as-is")
        rec["_rawPolicyArea"] = raw_pa
        rec["sikkimDeptGroup"] = canon_dept(rec.get("sikkimNodalDept"))
        # coerce nePreference: JSON true/false, or the string "unverified"
        nep = rec.get("nePreference")
        if isinstance(nep, str):
            low = nep.strip().lower()
            rec["nePreference"] = True if low == "true" else False if low == "false" else "unverified"
        sc = rec.get("scores") or {}
        for k in WEIGHTS:
            sc[k] = clamp_score(sc.get(k))
        rec["scores"] = sc
        rec["priorityScore"] = round(sum(sc[k] * w for k, w in WEIGHTS.items()), 2)
        # search haystack
        hay_parts = [
            rec.get("name"), rec.get("shortName"), rec.get("ministry"), rec.get("agency"),
            rec.get("policyArea"), rec.get("subcategory"), rec.get("type"),
            rec.get("sikkimNodalDept"), rec.get("whyItMatters"), rec.get("whatCanBeFunded"),
            rec.get("fundingAvailable"), rec.get("fundingRatio"), rec.get("allocationMethod"),
            rec.get("nextAction"), rec.get("status"), rec.get("grantOrLoan"), rec.get("_rawPolicyArea"),
            " ".join(rec.get("potentialUseCases") or []),
            " ".join(rec.get("eligibleApplicants") or []),
        ]
        rec["_search"] = " ".join(str(p) for p in hay_parts if p).lower()
        schemes.append(rec)

    schemes.sort(key=lambda r: (-r["priorityScore"], r["name"]))

    stacks_file = ROOT / "data" / "stacks.json"
    stacks = json.loads(stacks_file.read_text()) if stacks_file.exists() else []
    ids = {r["id"] for r in schemes}
    for st in stacks:
        for comp in st.get("components", []):
            if comp.get("schemeId") not in ids:
                problems.append(f"stack '{st.get('title')}': unknown schemeId {comp.get('schemeId')}")

    # canonical dataset (without derived _search)
    canonical = []
    for r in schemes:
        c = {k: v for k, v in r.items() if k not in ("_search", "_rawPolicyArea")}
        canonical.append(c)
    (ROOT / "data" / "schemes.json").write_text(json.dumps(canonical, indent=1, ensure_ascii=False))

    # citation index
    src_rows = []
    for r in schemes:
        for s in r.get("sources") or []:
            src_rows.append({
                "schemeId": r["id"], "scheme": r["name"],
                "title": s.get("title"), "publisher": s.get("publisher"),
                "date": s.get("date"), "url": s.get("url"), "section": s.get("section"),
            })
    (ROOT / "data" / "sources.json").write_text(json.dumps(src_rows, indent=1, ensure_ascii=False))

    bundle = {"generated": GENERATED_LABEL, "schemes": schemes, "stacks": stacks}
    (ROOT / "js" / "data.js").write_text(
        "/* Generated by scripts/build-data.py — do not edit by hand. */\n"
        "window.NAV_DATA = " + json.dumps(bundle, ensure_ascii=False) + ";\n"
    )

    print(f"OK: {len(schemes)} schemes, {len(src_rows)} sources, {len(stacks)} stacks")
    if problems:
        print(f"\n{len(problems)} warnings:")
        for p in problems:
            print("  -", p)
    return 0


if __name__ == "__main__":
    sys.exit(main())
