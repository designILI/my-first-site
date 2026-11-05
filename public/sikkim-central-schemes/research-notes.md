# Research Notes — Ambiguities, Unresolved Questions and Verification Items

Compiled 5 September 2026, alongside the dataset in `data/schemes.json`. This file records what could **not** be fully verified, judgement calls taken during consolidation, and the highest-value follow-ups for the Government of Sikkim. Read it together with the per-record `flags`, `confidence` and `confidenceNote` fields — every uncertain fact is marked in the record itself.

## 1. Research-environment constraints (material)

- Research was performed by ten parallel research passes (one per ministry/sector cluster) using live web search and page fetches on 5 September 2026.
- **Egress proxy limitation:** direct fetches of several Government of India domains — pib.gov.in, mdoner.gov.in, necouncil.gov.in, morth.nic.in, indiabudget.gov.in, sikkim.gov.in and others — were blocked by the research environment's network proxy. Where a cited official page could not be opened in full, its existence and content were confirmed through official-domain search results and corroborating coverage, and the record's confidence was lowered with a note. This is why a number of entries sit at Medium confidence despite pointing at primary sources.
- **Session interruption:** the research session hit a usage limit mid-run. All ten clusters' structured data files were completed and validated, but five clusters' free-text researcher notes (agriculture, energy/environment/disaster, health/education/skills, industry/digital/S&T, tourism/culture/tribal/social) were lost before being written. Their uncertainties are fully captured in record-level flags and confidence notes; the five surviving notes files (connectivity, fiscal, North-East, rural/water, urban) are summarised below.
- **URL verification:** an independent link-check pass over all 263 unique portal/guideline URLs was attempted but the environment's egress proxy blocked every outbound fetch, so link liveness could not be re-confirmed after research. URLs stand as captured during the live research passes (surfaced from official-domain search results, and fetched directly where the proxy allowed at the time). Re-run `scripts/check-urls.py` from an unrestricted network to verify all 500+ cited URLs.

## 2. The single biggest systemic uncertainty: the 15th Finance Commission cliff

Most Centrally Sponsored Schemes were approved co-terminus with the 15th FC award, which ended **31 March 2026**. As of September 2026:

- Several schemes have confirmed continuation (PMAY-G to 2028-29, PMAY-U 2.0 to 2028-29, JJM to Dec 2028, PMGSY-IV to 2028-29, VVP-II to 2028-29, Modified UDAN 2026-36, MNRE Small Hydro FY2026-31).
- Several are operating on FY2026-27 budget lines and fresh sanctions **without a located new-cycle Cabinet approval or revised guidelines** (PM-DevINE, NESIDS, Schemes of NEC — MDoNER sanctioned 30 new projects worth ₹883 crore in Q1 FY2026-27 incl. 3 Sikkim projects worth ₹82.81 crore, but revised guidelines were not found). These are marked Active with the continuation flag.
- Several show **no continuation evidence** and are marked "Under continuation/revision": RGSA, WDC-PMKSY 2.0 (new sanctions), PMKSY AIBP/PDMC, DILRMP, SVAMITVA, SBM-Urban 2.0, SBM-Gramin Phase II (end-date ambiguity), NAFCC (dormant), and others — 27 records carry the flag "Current continuation beyond FY2025-26 needs confirmation".
- **Action for Sikkim:** before commissioning any new DPR under a flagged scheme, confirm the current sanction cycle in writing with the administering ministry.

## 3. Major new instruments verified during research (post-January-2026)

| Finding | Status of verification |
|---|---|
| **VB-G RAM G Act 2025** replaces MGNREGA from 1 July 2026 (125-day guarantee; four thematic domains; 90:10 NE/Himalayan share reported) | Act and commencement confirmed; final rules were in draft as of May 2026 — component-wise sharing needs confirmation |
| **16th Finance Commission** report tabled 1 Feb 2026; accepted in Budget 2026-27. Devolution retained at 41%; **revenue-deficit, sector-specific and state-specific grants discontinued**; ₹9.47 lakh crore total grants = local bodies + disaster only | Headline architecture corroborated across sources; Sikkim's inter-se share, SDRF/SDMF corpus and local-body splits **not confirmed** — obtain the report annexes |
| **SASCI FY2026-27** guidelines dated 27.03.2026 (Part-I ₹75,000 cr distributed by 16th FC tax share; reform-linked parts; in-year utilisation) | Guidelines file confirmed to exist (F.No. 44(1)/PF-S/2026-27); full part-wise conditions unread — obtain the PDF |
| **"Pride of Hills: Special Development Assistance for Hill States"** (new FY2026-27 window; ₹820 crore attributed to Sikkim in search-engine synthesis) | **Low confidence** — the Sikkim figure could not be independently opened/verified; treat as unconfirmed until DoE/PIB documentation is obtained |
| **Mission Sikkim Organics** (MDoNER USP flagship, launched ~1 June 2026; ₹360 crore total, MDoNER ₹85 crore, 66,000+ farm families; 21 further Sikkim projects worth ₹223 crore launched same day) | Launch confirmed via multiple reports; **approved framework/guidelines not yet public** — component-wise funding, state share and governance need confirmation from MDoNER |
| **NULM 2.0** Cabinet approval reported 4 May 2026 | Found only in secondary sources; PIB confirmation not located — Low confidence |
| **Modified UDAN** launched 4 July 2026 (₹28,840 cr to 2035-36 incl. 200 helipads for hilly/NE areas) | Confirmed; NE VGF-share clause carry-over flagged for confirmation |

## 4. Cluster-by-cluster open questions

### North-East (MDoNER/NEC)
- PM-DevINE Sikkim totals conflict between sources (₹561.11 cr verifiable vs "more than ₹760 cr" reported) — used the verifiable figure.
- NESIDS Sikkim split (Roads vs OTRI) and project names not located; the ₹5–50 crore OTRI project band comes from secondary summaries only.
- UNNATI 2024 registration closed 31.03.2026 with no extension notice located — confirm with DPIIT; Sikkim registration counts unpublished.
- NEHHDC's NEC-funded weaver digitalisation project covered 7 NE states **excluding Sikkim** — a concrete gap to close.
- NEC FY2026-27 budget line and "Vision NER 2047" reframing unconfirmed.

### Connectivity & border
- Whether Sikkim has a signed Parvatmala/NHLML MoU, and whether the Gangtok "Golden Jubilee Cable Car" is being structured under it — not confirmed.
- BADP: no formal discontinuation order located, allocation shrinking, VVP now operative — status unclear.
- VVP-I approval period ended 31.03.2026 (Sikkim: 63 works, ₹188.9 cr sanctioned) — continuation needs MHA confirmation.
- Sikkim's FY2026-27 CRIF allocation and Setu Bandhan envelope: obtain from MoRTH.

### Fiscal
- Obtain: SASCI 2026-27 guidelines PDF (all parts); 16th FC annexes (Sikkim share, SDRF/SDMF corpus); Sikkim's cumulative SASCI drawals; World Bank Sikkim INSPIRES disbursement status; whether DEA's 90:10 grant:loan pass-through for NE-state externally aided projects is retained unchanged in the current EAP guidelines edition.
- Aspirational Blocks Programme: Sikkim coverage unconfirmed; Karmayogi Bharat MoU status unknown.

### Rural & water
- VB-G RAM G final rules (state wage share, domain definitions) — in draft at research time.
- 16th FC performance-component operational guidelines not yet located; entry conditions (audited accounts online + functional SFC) are Sikkim's immediate compliance task.
- No dedicated central budget line for springshed work exists — financing remains convergence-based despite the 2025 spring census and 2026 SOP.
- Unverified figures deliberately omitted: current RIDF tranche size/rate, Sikkim PMAY-G target, new-cycle PMKSY ratios.

### Urban
- AMRUT 2.0 is extended to 31.03.2027 **only to complete sanctioned projects**; whether MoHUA permits any new sanctions in FY2026-27 is unresolved.
- SBM-U 2.0 end-date ambiguity (March vs October 2026) — no extension order located.
- PM-eBus Sewa: Gangtok expressly eligible (NE/hill capital <3 lakh) but absent from sanctions and the 10,000-bus cap appears exhausted — ask MoHUA about residual slots.
- Sikkim-specific gaps: AMRUT 2.0 allocation figure, PMAY-U 2.0 sanction counts, NUDM/UPYOG onboarding, 16th FC state-wise ULB share.

### Clusters whose researcher notes were lost (uncertainties preserved in-record)
- **Agriculture/cooperation:** whether any Sikkim district is in PM Dhan-Dhaanya Krishi Yojana's 100 districts; post-rationalisation component menu of PM-RKVY/Krishonnati for FY2026-27; MOVCDNER next-phase status; MoFPI call timings.
- **Energy/environment/disaster:** current PM Surya Ghar CFA rates for NE states; Sikkim's inclusion in Green Energy Corridor Phase II; GLOF programme component-wise sanctions to Sikkim; SDMF/NDMF norms under the 16th FC; NAFCC dormancy.
- **Health/education/skills:** NHM continuation formalities post-15th-FC; medical-college scheme phase status; ITI-upgradation scheme Sikkim participation; 16th FC treatment of health grants (discontinued as sector grants).
- **Industry/digital/S&T:** RAMP State Investment Plan status for Sikkim; BharatNet/4G-saturation Sikkim progress figures; TIES utilisation; DBT NER twinning current calls.
- **Tourism/culture/tribal/social:** Swadesh Darshan 2.0 current sanction cycle; CBDD second round; DAJGUA village coverage in Sikkim; whether any Sikkim community qualifies under PM-JANMAN (not assumed); Article 275(1) allocation mechanics for Sikkim.

## 5. Consolidation judgement calls

- **Duplicates removed** (the richer record kept): SASCI core (fiscal duplicate dropped in favour of the connectivity record), SASCI tourism window (fiscal duplicate dropped in favour of the tourism record), 16th FC local-body grants (combined fiscal record dropped in favour of separate RLB and ULB records), disaster funds (fiscal duplicate dropped in favour of the energy/disaster record), DEA externally aided projects (industry duplicate dropped in favour of the fiscal record). The drop list is encoded in `scripts/build-data.py`.
- UDAN was deliberately kept as two records (route VGF vs helipad/heliport infrastructure) because the components have different pathways and Sikkim-relevance.
- Atal Bhujal Yojana was **excluded**: implemented in 7 states with no Sikkim joining pathway; Sikkim's issue is springs, addressed by the springshed-convergence record.
- Excluded as non-opportunities: Ashtalakshmi Darshan youth exchange (not state funding), Rising North East Summit (event), MHA border-infrastructure works executed by CAPFs (not state-accessible).
- Formula/statutory transfers (devolution, FC grants, SDRF, CRIF, MGNREGA/VB-G RAM G) are recorded with compliance pathways, never as "applications".
- "No participation located" statements mean exactly that — our research did not find evidence; they are **not** findings of non-use and must be verified with the state department and ministry.

## 6. Register of Medium/Low-confidence entries

Generated from the dataset (see `data/schemes.json` for the reason in each `confidenceNote`):

| Record | Confidence | Reason |
|---|---|---|
| `national-beekeeping-honey-mission` | Low | Could not verify current mission status from official sources reachable this session. |
| `merite-technical-education` | Low | Primary sources not retrievable this session (search budget exhausted; egress blocked); parameters flagged accordingly. |
| `sasci-pride-of-hills-2026-27` | Low | Scheme existence and Nagaland allocation from a Government (Prasar Bharati) headline; Sikkim amount from search-engine synthesis only; guidelines not sighted. |
| `badp-border-area-development` | Low | Conflicting signals: budget documents show continued small allocations, while VVP has become the operative border-development vehicle; definitive FY2026-27 status unverified because MHA/PIB pages were unreachable. |
| `ndma-mha-preparedness-capacity-schemes` | Low | Composite record; scheme existence is well established but current windows, Sikkim allocations and exact parameters could not be verified due to blocked access to NDMA/MHA/PIB domains and exhausted search budget. |
| `nulm-2-0-urban-livelihoods` | Low | DAY-NULM closure is officially confirmed; NULM 2.0 approval and parameters rest on secondary sources and need PIB/MoHUA verification. |
| `bee-sda-energy-efficiency` | Low | Programme existence confirmed via BEE page in search results, but amounts, cycle and Sikkim SDA designation were not verifiable from this environment. |
| `dst-state-science-technology-programme` | Low | DST pages were unreachable this session; record based on the programme's established design with all specifics flagged for verification. |
| `national-scheme-iti-upgradation` | Low | Primary guidelines and Sikkim status unverified (search budget exhausted before this scheme could be searched; egress blocked). |
| `textiles-nhdp-rmss-silk-samagra-2` | Low | Official textile-ministry pages could not be loaded and no Sikkim-specific sanction was verified; scheme existence and structure are well-established but details here need re-verification. |
| `nertps` | Low | No post-2021 official activity located; status inferred from absence of new sanction announcements. Ministry of Textiles confirmation required. |
| `digital-agriculture-mission-agristack` | Medium | Cabinet approval details from September 2024 are well established; the specific PIB URL and Sikkim status were not re-verifiable this session. |
| `fpo-10000-formation-scheme` | Medium | Scheme design well established; official pages not loadable from this environment, so ceilings and Sikkim counts left unquantified. |
| `pkvy-paramparagat-krishi-vikas-yojana` | Medium | Component status under PM-RKVY confirmed; rates, ratio and Sikkim usage unverified. |
| `nabard-micro-irrigation-fund` | Medium | Fund status, augmentation and 2% subvention confirmed via PIB/NABARD; current lending window post-15th-FC-period and detailed terms unverified. |
| `national-ayush-mission-sowa-rigpa` | Medium | 2021-26 approval and Sikkim usage confirmed; FY2026-27 status and current SAAP window unverified. |
| `udan-helipad-heliport-component` | Medium | Component outlays confirmed via PIB backgrounder; state-facing application procedure not yet published/located. |
| `odop-districts-as-export-hubs` | Medium | Framework well-established; Sikkim-specific implementation status and any DEH budget line unverified because DGFT/ODOP pages could not be loaded this session. |
| `spices-board-large-cardamom` | Medium | Spices Board's cardamom mandate is certain; SPICED specifics and Sikkim current participation not re-verified (Board site not loadable this session). |
| `pm-gati-shakti` | Medium | National rollout facts confirmed from PIB-derived material; Sikkim's SMP/DMP operational depth not independently verified. |
| `startup-india-seed-fund-and-ranking` | Medium | Ranking participation confirmed from official startupindia.gov.in report; 2026 SISFS window status from secondary sources only. |
| `leads-logistics-state-plans` | Medium | LEADS 2025 release and Sikkim's inclusion confirmed via secondary reporting of the DPIIT report; official report PDF not retrieved through proxy. |
| `ties-trade-infrastructure` | Medium | Scheme design and NE share confirmed from PIB and consistent secondary summaries; the DoC page was unreachable and post-2026 validity is unverified. |
| `ministry-cooperation-pacs-grain-storage` | Medium | National programme facts well established from prior official announcements; official pages not loadable this session and Sikkim data unverified. |
| `ncdc-cooperative-financing` | Medium | NCDC's role and sub-schemes are well established; terms and Sikkim exposure unverified this session. |
| `kala-sanskriti-vikas-yojana` | Medium | Component structure and ceilings from PIB/MoC pages; Sikkim uptake and FY2026-27 cycles unverified. |
| `museum-grant-scheme` | Medium | Scheme live and recently publicised; ceilings and process cross-checked only against secondary reporting of official statements. |
| `rrrlf-library-assistance` | Medium | Programme mechanics confirmed from RRRLF pages; Sikkim drawdown and current NE matching ratio unverified. |
| `mdoner-inter-ministerial-facilitation` | Medium | Mechanism confirmed via PIB summaries in search results; internal procedures are not publicly documented. |
| `mission-sikkim-organics-usp` | Medium | Launch and headline figures confirmed by multiple news reports of the official event; the approved mission document/guidelines were not locatable online as of verification date. |
| `nec-science-technology-capacity-building` | Medium | NEC sector page content verified via search results only (gov.in fetch blocked); state-level routing steps not directly confirmed. |
| `nehhdc-handloom-handicrafts` | Medium | NEHHDC processes verified from corporate site and PIB summaries via search; empanelment mechanics not confirmed. |
| `nesids-otri` | Medium | Component-level guidelines (project ceilings, appraisal chain) could not be read directly because gov.in PDFs are blocked through the research proxy; details rest on official press summaries and secondary sources. |
| `nmmss-scholarships` | Medium | Scheme mechanics well-established; continuation status and Sikkim figures unverified in this session. |
| `pm-shri-schools` | Medium | Scheme parameters confirmed via PIB; Sikkim count based on secondary reporting only. |
| `indiaai-and-meity-state-support` | Medium | IndiaAI outlay/components are well-established (Cabinet, March 2024) but PIB page could not be loaded; state-access modalities and current calls unverified. |
| `idwh-project-snow-leopard` | Medium | Scheme continuation for 2021-26 and Project Snow Leopard coverage corroborated; current-cycle status and funding pattern unverified. |
| `nafcc-adaptation-fund` | Medium | Historic sanctions and Sikkim project confirmed from PIB/NABARD; dormancy inferred from absence of new sanctions/allocations, not from an explicit official statement. |
| `fc15-transition-instruments-2025-26` | Medium | Award boundary and discontinuations confirmed; Sikkim-specific pendency figures unverified. |
| `fc16-tax-devolution-sikkim` | Medium | 41% share, tabling date and criteria changes confirmed from multiple search results; Sikkim's specific share and full formula weights unverified. |
| `dea-externally-aided-projects-mechanism` | Medium | Mechanism and NE 90:10 terms are established pre-2026 policy; current guidelines edition, screening calendar and pipeline could not be verified in this environment. |
| `fc16-revenue-deficit-grant-discontinuation` | Medium | Discontinuation reported consistently across PRS/India Forum coverage of the tabled report; Sikkim's 15th FC RD-grant history and the ATR text unverified. |
| `world-bank-sikkim-inspires` | Medium | Approval (June 2023, ~US$100M, PforR, employment/economic revival focus) is pre-cutoff knowledge; 2026 implementation status unverified because project pages could not be opened. |
| `sasci-iconic-tourist-centres` | Medium | 2024-25 sanctions well documented (official data portal, parliamentary replies, state-press); post-March-2026 fund-flow status and any new round unverified. |
| `ahidf-infrastructure-fund` | Medium | Terms from established official guidelines; continuation figures from Feb 2024 Cabinet coverage not re-verified this session. |
| `rgm-npdd-dairy-bovine` | Medium | Scheme existence and design high-confidence; revised outlays and NE orientation from press coverage of the Feb 2025 Cabinet decision, not re-verified against PIB this session. |
| `national-livestock-mission` | Medium | Core design confirmed by portal existence and prior guidelines; ceilings, NE ratio, yak provisions and FY27 status unverified. |
| `pmfme-micro-food-processing` | Medium | Scheme design confirmed; extension to FY2025-26 and NE ratio from guideline knowledge, not re-verified (MoFPI site not loadable from this environment). |
| `pm-kisan-sampada-yojana` | Medium | Umbrella structure well established; current phase, EOI status and NE rates not re-verified (MoFPI site not loadable from this environment). |
| `css-new-medical-colleges` | Medium | Scheme parameters and Sikkim project reported via credible secondary/state sources; primary MoHFW phase documents not directly accessible in this session. |
| `tele-manas-ntmhp` | Medium | National programme and Sikkim promotion confirmed; Sikkim cell configuration and budgets unverified. |
| `pm-abhim-health-infrastructure` | Medium | National component data confirmed via PIB-domain results; post-March 2026 status and Sikkim-specific sanctions unverified because direct fetches to MoHFW/PIB/PRS were blocked. |
| `pm-e-drive-ev-charging` | Medium | Component and ₹2,000 crore outlay verified; scheme end date and per-station support not confirmed from primary sources in this session. |
| `vibrant-villages-programme-1` | Medium | Sikkim sanction figures from MHA parliamentary answer surfaced in search (mha.gov.in not directly loadable via proxy); post-March-2026 continuation unverified. |
| `ndma-glof-risk-mitigation-programme` | Medium | Programme existence, ₹150 crore outlay and Sikkim priority status are widely documented (and asserted in the commissioning brief); primary sources could not be re-fetched due to network egress blocks, so details are f… |
| `sdrf-ndrf-sdmf-ndmf-disaster-funds` | Medium | Fund architecture and 90:10 share are settled Finance Commission policy (High confidence); Sikkim figures and 16th FC operational detail unverified due to blocked official domains — hence overall Medium. |
| `hudco-urban-financing` | Medium | HUDCO's role and products are certain; Sikkim-specific terms and prior lending history unverified. |
| `amrut-gis-master-plan-subscheme` | Medium | Sub-scheme existence and Sikkim's Namchi RFP confirmed; population-threshold applicability to Sikkim's small towns unverified. |
| `citiis-2-0` | Medium | Programme design and city list confirmed; state-component access for Sikkim unverified. |
| `sbm-urban-2-0` | Medium | Scheme parameters well documented; end-date/extension status as of September 2026 is ambiguous between March and October 2026 and no continuation approval was located. |
| `swachh-survekshan-incentives` | Medium | Sikkim's 2023 awards confirmed; current-cycle incentive structure and post-mission continuation unverified. |
| `pm-ebus-sewa` | Medium | Scheme design and eligibility confirmed; whether new cities can still be sanctioned in FY2026-27 is unverified. |
| `nudm-upyog` | Medium | National status confirmed from official NUDM site; Sikkim specifics unverified. |
| `sbm-gramin-phase-2` | Medium | Sikkim's ODF Plus Model status is well documented; the exact current end-date/funding pattern of the extended phase is not fully confirmed. |
| `pmksy-aibp-pdmc` | Medium | Component structure and 2021-26 phase confirmed; FY2026-27 arrangements rest on budget-allocation reporting, not a located approval document. |
| `springshed-rejuvenation-convergence` | Medium | Policy architecture (census, SOP, partnership) confirmed via mixed primary/secondary sources; absence of a dedicated budget line means access is via other schemes. |
| `sfurti` | Medium | Active status confirmed via a March 2026 parliamentary reply reported in press; Sikkim precedent and funding ceilings rest partly on secondary sources because official portals were unreachable this session. |
| `national-green-hydrogen-mission` | Medium | Mission structure verified from MNRE pages via search; absence of state windows is an assessment, not an official statement. |
| `pm-kusum` | Medium | Scheme status and March 2026 extension verified from search results; the 50% NE CFA ratio is from MNRE guidelines as widely documented but was not re-verified in a primary PDF during this session. |
| `mnre-small-hydro-power-development-scheme` | Medium | Scheme existence, outlay, period and guideline issuance corroborated by multiple sector sources; primary guidelines not directly accessed, so rates/eligibility unconfirmed. |
| `rgsa-panchayat-capacity` | Medium | 2022-26 design confirmed; post-2026 status and Sikkim-specific allocations unverified. |
| `mission-karmayogi-state-capacity` | Medium | Mission architecture is established pre-2026 policy; Sikkim-specific adoption status unverified in this environment. |
| `pfc-rec-ireda-financing-windows` | Medium | Standing institutional windows; no scheme-specific claims made; NE concessionality and Sikkim exposure unverified as lender sites could not be loaded. |
| `crif-state-roads` | Medium | Formula and scheme confirmed via PIB and PRS; Sikkim-specific figures and current-year procedure not directly verified because MoRTH/PIB sites were unreachable through the proxy. |
| `nh-development-sikkim-nho` | Medium | NH-10 handover and NH-717A works corroborated by multiple regional outlets and NHIDCL project listings found via search; direct fetch of nhidcl.com/morth.nic.in blocked by proxy. |
| `parvatmala-ropeways` | Medium | Programme parameters from PIB backgrounder located via search (PIB direct fetch blocked); Sikkim-specific Parvatmala status pieced from state and press sources. |
| `setu-bandhan-crif-bridges` | Medium | Scheme mechanics confirmed from MoRTH circular/SOP URLs surfaced in search; documents could not be opened through the proxy, so details are from official titles and secondary summaries. |
| `day-nrlm-lakhpati-didi` | Medium | Scheme continuation and Lakhpati Didi targets well evidenced; Sikkim figure and FY27 allocation rest partly on secondary sources. |
| `dilrmp-land-records` | Medium | Programme design and 2021-26 extension confirmed on dolr.gov.in; post-2026 status and Sikkim specifics unverified. |
| `spmrm-rurban-mission` | Medium | End of funding evidenced via budget analyses and secondary fact-checks; no official discontinuation order located, and official portals still describe the mission - hence Discontinued with caution. |
| `wdc-pmksy-2` | Medium | 2021-26 design, 90:10 ratio and Sikkim's inclusion in the 2025 top-up are well sourced; post-March-2026 sanctioning arrangements unverified. |
| `dbt-ner-programmes-birac-bionest` | Medium | Programme architecture is well-established; DBT/BIRAC sites were unreachable this session so Sikkim-specific grants and current calls are unverified. |
| `skill-india-programme-pmkvy4` | Medium | Component mechanics solid; composite-scheme figures and Sikkim data unverified due to research-session limits. |
| `mot-capacity-building-paryatan-mitra` | Medium | Programme existence and design confirmed via PIB; Sikkim-specific coverage and current-year funding norms unverified. |
| `pm-van-dhan-trifed` | Medium | Scheme design confirmed; Sikkim-specific cluster data and post-2026 continuation unverified. |
| `saksham-anganwadi-poshan-2` | Medium | Scheme architecture well established; Sikkim-specific figures and FY2026-27 continuation not verified from primary sources in this pass. |
| `khelo-india` | Medium | Scheme structure well-established; Sikkim-specific sanctions and post-2026 design unverified (search budget exhausted before Sikkim sports searches completed). |
| `my-bharat-nyks-nss` | Medium | Programme structures well-established; Sikkim-specific current data unverified. |
| `niti-aayog-state-support-sikkim` | Medium | Programme architecture is established pre-2026; Sikkim-specific coverage/engagement details unverified. |
| `sidbi-cluster-development-fund` | Medium | SCDF design confirmed via SIDBI-derived material and a state government circular; SIDBI's own page unreachable this session; pricing and Sikkim exposure limits unverified. |

