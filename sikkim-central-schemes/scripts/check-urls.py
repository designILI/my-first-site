#!/usr/bin/env python3
"""Check every URL cited in the dataset (sources, guidelines, portals).

Usage: python3 scripts/check-urls.py [--timeout 20]
Prints a report of unreachable or error URLs. Government sites are slow and
sometimes block HEAD requests, so failures are retried with GET and a
browser-like User-Agent before being reported.
"""
import concurrent.futures
import json
import ssl
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TIMEOUT = 25
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")


def collect_urls():
    schemes = json.loads((ROOT / "data" / "schemes.json").read_text())
    urls = {}  # url -> [scheme ids]
    for r in schemes:
        cands = []
        if r.get("portal"):
            cands.append(r["portal"])
        for g in r.get("guidelines") or []:
            if g.get("url"):
                cands.append(g["url"])
        for s in r.get("sources") or []:
            if s.get("url"):
                cands.append(s["url"])
        for u in cands:
            u = u.strip()
            if u.startswith("http"):
                urls.setdefault(u, []).append(r["id"])
    return urls


def probe(url):
    ctx = ssl.create_default_context()
    for method in ("HEAD", "GET"):
        req = urllib.request.Request(url, method=method, headers={"User-Agent": UA})
        try:
            with urllib.request.urlopen(req, timeout=TIMEOUT, context=ctx) as resp:
                return resp.status
        except urllib.error.HTTPError as e:
            if method == "GET":
                return e.code
        except Exception as e:
            if method == "GET":
                return f"ERR {type(e).__name__}: {e}"
    return "ERR unknown"


def main():
    urls = collect_urls()
    print(f"Checking {len(urls)} unique URLs …", flush=True)
    bad = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=12) as ex:
        futs = {ex.submit(probe, u): u for u in urls}
        for fut in concurrent.futures.as_completed(futs):
            u = futs[fut]
            status = fut.result()
            ok = isinstance(status, int) and status < 400
            if not ok:
                bad.append((u, status, urls[u]))
    print(f"\n{len(urls) - len(bad)} OK, {len(bad)} problems")
    for u, status, ids in sorted(bad):
        print(f"  [{status}] {u}\n      used by: {', '.join(ids)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
