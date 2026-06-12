# AeroIntel DB — Aerospace & Defence Intelligence Platform

> **Live Demo:** [https://mahin-aeroai.github.io/aerointel-db](https://mahin-aeroai.github.io/aerointel-db)
> 
> **Portfolio:** [github.com/mahin-aeroai](https://github.com/mahin-aeroai)

---

## Overview

AeroIntel DB is a full-stack ERP-grade knowledge platform covering the complete aerospace, defence, space, UAV, and aviation industry — with an India-first focus. Built as a single-page application with dark military theme, AI-powered query engine, and image upload per vehicle/component.

---

## Features

| Module | Description |
|--------|-------------|
| 🛩️ **Vehicle Master** | 42+ platforms — fighters, UAVs, missiles, satellites, eVTOL |
| 🔧 **System WBS** | Complete subsystem hierarchy — LCA Tejas, AMCA, ALH Dhruv |
| ⚙️ **Component DB** | 18+ key parts with part numbers, suppliers, certifications |
| 🧪 **Materials Eng** | Metals, composites, ceramics — properties & suppliers |
| 🏭 **Manufacturing** | AFP, autoclave, 5-axis CNC, DMLS/AM, FSW, NDT |
| 🔥 **Propulsion** | 14 engines — EJ200, Kaveri, CE-20, AL-31FP, LEAP-1A |
| 💻 **Electronics** | FPGAs, RTOS, sensors, comms protocols, processors |
| 🖥️ **Software Stack** | CAD/CAE/CFD/PLM/Autonomy/AI tools |
| 🇮🇳 **India Ecosystem** | 18 companies — HAL, BEL, ISRO, TASL, startups |
| 📊 **Import Analysis** | Technology gaps, indigenisation progress bars |
| 🔗 **Supply Chain** | Tier 1/2/3 mapping, investors, govt bodies |
| 🗄️ **ERP Schema** | SQL DDL, ER diagram, JSON API structure |
| 🤖 **AI Query Engine** | Claude-powered — ask anything about any platform |
| 🖼️ **Image Gallery** | Per-vehicle/component image upload with spec guidance |

---

## Image Upload Specifications

| Category | Recommended Size | Aspect Ratio | Format |
|----------|-----------------|--------------|--------|
| Vehicle / Aircraft | 800 × 450 px | 16:9 | JPG / PNG / WebP |
| Component / Part | 600 × 600 px | 1:1 | JPG / PNG |
| Engine | 800 × 500 px | 8:5 | JPG / PNG / WebP |
| Material Sample | 400 × 400 px | 1:1 | JPG / PNG |
| Facility / Factory | 1200 × 630 px | ~2:1 | JPG / PNG |

---

## Project Structure

```
aerointel-db/
├── index.html          # Main SPA shell
├── css/
│   └── style.css       # Dark military theme
├── js/
│   ├── data.js         # All data arrays & image specs
│   ├── render.js       # Section render functions
│   └── app.js          # Navigation, upload modal, AI query
└── README.md
```

---

## Tech Stack

- **Vanilla HTML/CSS/JS** — zero build step, pure static deployment
- **Tabler Icons** — 5,800+ outline icons via CDN
- **Google Fonts** — Inter + JetBrains Mono
- **Anthropic Claude API** — AI query engine (claude-sonnet-4-6)
- **GitHub Pages** — free static hosting

---

## Deploy to GitHub Pages

```bash
# 1. Create new repo on GitHub: aerointel-db
# 2. Clone and add files
git clone https://github.com/mahin-aeroai/aerointel-db.git
cd aerointel-db

# 3. Add all project files
cp -r /path/to/aerointel/* .

# 4. Push
git add .
git commit -m "feat: initial AeroIntel DB v1.0"
git push origin main

# 5. Enable GitHub Pages: Settings > Pages > main branch > / (root)
```

---

## Data Coverage

- **42** vehicle platforms across 10 categories
- **18** critical components with part numbers and certifications
- **14** propulsion systems (turbofan, turboshaft, cryogenic, solid)
- **16** materials (Al alloys, Ti alloys, Inconel, CFRP, CMC)
- **18** Indian companies (DPSUs, private OEMs, startups)
- **10** import dependency entries with indigenisation progress
- **6** manufacturing categories with processes and equipment
- Full ERP schema: 12 master tables, ER diagram, API JSON

---

## Author

**Mahin** — ML Engineer | Aerospace + AI/ML intersection  
B.Tech Aerospace Engineering, VIT Bhopal  
PG Certificate AI & ML, IIIT Hyderabad (TalentSprint × Accenture)

🔗 [github.com/mahin-aeroai](https://github.com/mahin-aeroai)

---

## License

MIT — free to use, fork, and deploy. Data is compiled from open-source public domain references.
