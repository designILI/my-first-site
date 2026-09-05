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
            rec.get("nextAction"), rec.get("status"), rec.get("grantOrLoan"),
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
        c = {k: v for k, v in r.items() if k != "_search"}
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
