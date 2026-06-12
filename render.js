/* ═══════════════════════════════════════════
   AeroIntel DB — Render Functions
   ═══════════════════════════════════════════ */

/* ─── Utility ─── */
function catPill(c) {
  if (c === 'Fighter' || c === 'Loitering Munition') return 'pill-red';
  if (c === 'UAV') return 'pill-purple';
  if (c === 'Satellite/Space') return 'pill-blue';
  if (c === 'Helicopter') return 'pill-green';
  if (c === 'Missile') return 'pill-amber';
  if (c === 'eVTOL') return 'pill-purple';
  if (c === 'Commercial') return 'pill-blue';
  if (c === 'Naval Aircraft') return 'pill-blue';
  return 'pill-gray';
}

function statusPill(s) {
  if (['In Service', 'Operational', 'Production'].includes(s)) return 'pill-green';
  if (['Development', 'Devel.', 'Test'].includes(s)) return 'pill-amber';
  if (['Design'].includes(s)) return 'pill-blue';
  if (['Phasing Out'].includes(s)) return 'pill-red';
  return 'pill-gray';
}

function thumbCell(id, category) {
  const stored = imageStore[id];
  if (stored) {
    return `<td><div class="thumb-cell" onclick="openModal('${id}','${category}','view')"><img src="${stored.url}" alt="thumbnail"></div></td>`;
  }
  return `<td><div class="thumb-cell" onclick="openModal('${id}','${category}','upload')"><i class="ti ti-photo"></i></div></td>`;
}

function uploadBtn(id, category) {
  const stored = imageStore[id];
  const cls = stored ? 'upload-btn has-image' : 'upload-btn';
  const icon = stored ? 'ti-photo-check' : 'ti-cloud-upload';
  const label = stored ? 'Uploaded' : 'Upload';
  return `<td><button class="${cls}" onclick="openModal('${id}','${category}','upload')"><i class="ti ${icon}"></i>${label}</button></td>`;
}

/* ─── VEHICLES ─── */
function renderVehicles(data) {
  const kpis = [
    { icon: 'ti-planet', color: '#38bdf8', val: VEHICLES.length, label: 'Total Platforms' },
    { icon: 'ti-building-factory', color: '#4ade80', val: VEHICLES.filter(v => v.origin.includes('India')).length, label: 'Indian Programmes' },
    { icon: 'ti-check-circle', color: '#fb923c', val: VEHICLES.filter(v => v.status === 'In Service' || v.status === 'Operational' || v.status === 'Production').length, label: 'Active / Production' },
    { icon: 'ti-layout-grid', color: '#a78bfa', val: [...new Set(VEHICLES.map(v => v.cat))].length, label: 'Categories' },
  ];
  document.getElementById('vehicleKPIs').innerHTML = kpis.map(k => `
    <div class="kpi-card">
      <div class="kpi-icon" style="color:${k.color}"><i class="ti ${k.icon}"></i></div>
      <div class="kpi-val">${k.val}</div>
      <div class="kpi-label">${k.label}</div>
    </div>`).join('');

  document.getElementById('vehicleTbody').innerHTML = data.map(v => `<tr>
    ${thumbCell(v.id, 'vehicle')}
    <td><strong>${v.name}</strong></td>
    <td><span class="pill ${catPill(v.cat)}">${v.cat}</span></td>
    <td>${v.origin}</td>
    <td style="font-size:11px;color:var(--text-secondary)">${v.mfr}</td>
    <td><span class="pill ${statusPill(v.status)}">${v.status}</span></td>
    <td>${v.mtow}</td>
    <td>${v.range}</td>
    <td>${v.speed}</td>
    <td style="font-size:11px;color:var(--text-secondary)">${v.ops}</td>
    ${uploadBtn(v.id, 'vehicle')}
  </tr>`).join('');
}

function filterVehicles(cat, btn) {
  document.querySelectorAll('#vehicleFilters .fbtn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filtered = cat === 'All' ? VEHICLES : VEHICLES.filter(v => v.cat === cat || v.cat.includes(cat));
  document.getElementById('vehicleTbody').innerHTML = filtered.map(v => `<tr>
    ${thumbCell(v.id, 'vehicle')}
    <td><strong>${v.name}</strong></td>
    <td><span class="pill ${catPill(v.cat)}">${v.cat}</span></td>
    <td>${v.origin}</td>
    <td style="font-size:11px;color:var(--text-secondary)">${v.mfr}</td>
    <td><span class="pill ${statusPill(v.status)}">${v.status}</span></td>
    <td>${v.mtow}</td>
    <td>${v.range}</td>
    <td>${v.speed}</td>
    <td style="font-size:11px;color:var(--text-secondary)">${v.ops}</td>
    ${uploadBtn(v.id, 'vehicle')}
  </tr>`).join('');
}

/* ─── COMPONENTS ─── */
function renderComponents() {
  document.getElementById('componentTbody').innerHTML = COMPONENTS.map(c => `<tr>
    ${thumbCell(c.id, 'component')}
    <td><strong>${c.name}</strong></td>
    <td style="font-family:var(--font-mono);font-size:11px;color:var(--text-secondary)">${c.pn}</td>
    <td style="font-size:12px">${c.mat}</td>
    <td style="font-size:11px;color:var(--text-secondary)">${c.supp}</td>
    <td>${c.country}</td>
    <td style="font-size:11px">${c.cert}</td>
    <td><span class="pill ${c.grade === 'Military' ? 'pill-red' : c.grade === 'Space' ? 'pill-blue' : 'pill-green'}">${c.grade}</span></td>
    ${uploadBtn(c.id, 'component')}
  </tr>`).join('');
}

/* ─── MATERIALS ─── */
function renderMaterials(data) {
  document.getElementById('materialTbody').innerHTML = data.map(m => `<tr>
    <td><strong>${m.name}</strong></td>
    <td><span class="pill ${m.type === 'Metal' ? 'pill-blue' : m.type === 'Composite' ? 'pill-green' : m.type === 'Ceramic' ? 'pill-amber' : 'pill-purple'}">${m.type}</span></td>
    <td style="font-family:var(--font-mono);font-size:11px">${m.grade}</td>
    <td><strong>${m.uts}</strong></td>
    <td>${m.dens}</td>
    <td style="font-size:11px">${m.temp}</td>
    <td style="font-size:11px;color:var(--text-secondary)">${m.app}</td>
    <td style="font-size:11px;color:var(--text-secondary)">${m.supp}</td>
  </tr>`).join('');
}

function filterMat(type, btn) {
  document.querySelectorAll('#matFilters .fbtn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderMaterials(type === 'All' ? MATERIALS : MATERIALS.filter(m => m.type === type));
}

/* ─── PROPULSION ─── */
function renderPropulsion() {
  document.getElementById('propTbody').innerHTML = PROPULSION.map(p => `<tr>
    ${thumbCell(p.id, 'engine')}
    <td><strong>${p.name}</strong></td>
    <td style="font-size:11px;color:var(--text-secondary)">${p.mfr}</td>
    <td><span class="pill pill-blue" style="font-size:10px">${p.type}</span></td>
    <td><strong>${p.thrust}</strong></td>
    <td style="font-family:var(--font-mono);font-size:11px">${p.sfc}</td>
    <td>${p.wt}</td>
    <td>${p.tbo}</td>
    <td style="font-size:11px;color:var(--text-secondary)">${p.apps}</td>
    <td><span class="pill ${statusPill(p.status)}">${p.status}</span></td>
    ${uploadBtn(p.id, 'engine')}
  </tr>`).join('');
}

/* ─── WBS ─── */
const WBS_SYS_ICONS = {
  'Airframe & Structures': 'ti-box',
  'Airframe': 'ti-box',
  'Propulsion': 'ti-flame',
  'Landing Gear': 'ti-circle-arrow-down',
  'Avionics Suite': 'ti-cpu',
  'Avionics & Mission': 'ti-radar',
  'Electrical Power': 'ti-bolt',
  'Hydraulics & Actuation': 'ti-settings-automation',
  'Armament': 'ti-target',
  'Stealth Airframe': 'ti-ghost-2',
  'Sensor Fusion & Avionics': 'ti-radar',
  'Structural Materials': 'ti-atom-2',
  'Rotor System': 'ti-windmill',
  'Mechanical': 'ti-settings',
};

function renderWBS(platformKey) {
  const keys = platformKey === 'All' ? Object.keys(WBS_DATA) : [platformKey];
  document.getElementById('wbsContent').innerHTML = keys.map(plat => {
    const data = WBS_DATA[plat];
    if (!data) return '';
    const sysBlocks = Object.entries(data).map(([sys, val]) => {
      const icon = val.icon || WBS_SYS_ICONS[sys] || 'ti-circle';
      const items = val.items || val;
      return `
        <div class="wbs-sys-title"><i class="ti ${icon}"></i>${sys}</div>
        ${items.map(item => `<div class="wbs-item">${item}</div>`).join('')}
      `;
    }).join('');
    return `
      <div class="wbs-card">
        <div class="wbs-header">
          <h3><i class="ti ti-plane"></i>${plat}</h3>
          <span class="pill pill-blue">${Object.keys(data).length} subsystems</span>
        </div>
        <div class="wbs-body grid-2">${sysBlocks}</div>
      </div>`;
  }).join('');
}

function filterWBS(val, btn) {
  document.querySelectorAll('#sec-wbs .fbtn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const map = { LCA: 'LCA Tejas Mk1A', AMCA: 'AMCA', ALH: 'ALH Dhruv', All: 'All' };
  renderWBS(map[val] || 'All');
}

/* ─── MANUFACTURING ─── */
function renderMfg() {
  const cats = [
    { title: 'Sheet Metal', icon: 'ti-cut', color: '#38bdf8', items: [
      ['Fibre Laser Cutting', 'CO₂/Fibre, ±0.05 mm, Al/Ti/SS up to 25 mm thick', 'Trumpf TruLaser 5030, Bystronic ByStar'],
      ['Waterjet Cutting (Abrasive)', 'No HAZ, 60,000 psi, CFRP/Ti/Kevlar', 'Flow Mach 500, OMAX 80160'],
      ['5-Axis CNC Punching', 'Sheet panels, brackets, flanges', 'Trumpf TruPunch 5000'],
      ['Stretch Forming', 'Contour skin panels, Al 2024/7075', 'Cyril Bath SF-500 series'],
      ['Hydroforming', 'Complex hollow forms, single-step', 'Schuler AP-400 hydroform press'],
    ]},
    { title: 'Composites Manufacturing', icon: 'ti-layers-difference', color: '#4ade80', items: [
      ['Automated Fibre Placement (AFP)', 'CFRP wing skins, fuselage panels, precise layup, <0.5° angle tolerance', 'Electroimpact AFP, Coriolis C1'],
      ['Autoclave Curing (OoA)', '120–180°C, 6–7 bar, CFRP/GFRP large structures', 'ASC autoclave at HAL, NAL CSIR'],
      ['Resin Transfer Moulding (RTM/VARTM)', 'Closed mould, complex shapes, very low void content', 'Radius Engineering systems'],
      ['Filament Winding', 'Pressure vessels, rocket motor casings, PSLV tubes', 'Entec CNC winders, Roth'],
      ['Robotic Hand Layup', 'Legacy/repair, complex curvature, manual where needed', 'Manual + Laser projection (GKN, HAL)'],
    ]},
    { title: 'CNC Machining', icon: 'ti-tool', color: '#fb923c', items: [
      ['5-Axis CNC Milling', 'Engine/structural Ti/Al/Inconel, ±0.01 mm, complex geometry', 'DMG MORI DMU 85, Makino A99, Haas UMC-750'],
      ['High Speed Machining (HSM)', 'Al alloys at 30,000+ RPM, thin-wall integral spars', 'Mazak Variaxis i-800, Haas VF series'],
      ['Turn-Mill Centres', 'Shafts, spindles, LG components, compressor discs', 'Mazak Integrex i-630, DMG CTX 2000'],
      ['Wire EDM', 'Turbine blade profiles, hardened steel, complex pockets', 'Sodick AG1000L, Mitsubishi MV4800'],
      ['Jig Boring', 'High-precision hole location, fixture bases', 'Mitsui Seiki HU series'],
    ]},
    { title: 'Additive Manufacturing', icon: 'ti-cube-3d-sphere', color: '#a78bfa', items: [
      ['DMLS / LPBF (Metal AM)', 'Ti6Al4V, IN718, complex brackets, <1% porosity, used at ISRO/DRDO', 'EOS M300-4, SLM Solutions 500, Trumpf TruPrint'],
      ['WAAM (Wire Arc AM)', 'Large Ti/Al structures, near-net-shape, rapid deposition rate', 'Lincoln Electric, AML3D'],
      ['DED (Directed Energy Dep)', 'Repair and cladding of aero components', 'Optomec LENS, BeAM machines'],
      ['Binder Jetting', 'Complex tooling, sand cores for castings', 'ExOne Exerial, Desktop Metal'],
      ['Agnilet Engine (Agnikul)', '3D-printed semi-cryo engine — world first single-piece cast rocket motor', 'In-house, Agnikul AM facility (Chennai)'],
    ]},
    { title: 'Joining Processes', icon: 'ti-link', color: '#38bdf8', items: [
      ['Friction Stir Welding (FSW)', 'Al alloy panels, fuel tanks, ISRO LVM3 propellant tanks', 'MTS ISTIR, Grenzebach FSW systems'],
      ['Electron Beam Welding (EBW)', 'Ti/Ni superalloy, vacuum, precision single-pass weld', 'PTR-Precision EBW, FOCUS GmbH'],
      ['Automated Riveting', 'Fuselage panel assembly, fastener installation ±0.05 mm', 'Electroimpact GRAWDE, Gemcor G86'],
      ['Structural Adhesive Bonding', 'CFRP-to-metal, composite joints, Redux 319/312', 'Autoclave cure, Huntsman Araldite systems'],
      ['Laser Beam Welding (LBW)', 'Ti structures, thin gauge, no filler, minimal distortion', 'TRUMPF TruLaser Robot 5020'],
    ]},
    { title: 'NDT & Quality Control', icon: 'ti-scan', color: '#4ade80', items: [
      ['Phased Array UT (PAUT)', 'Composite delamination, metallic flaws, weld inspection', 'Olympus OmniScan MX2, GE Mentor UT'],
      ['Industrial CT Scanning', 'Internal defects, casting porosity, complex 3D geometry', 'Nikon XT H 450, Zeiss Metrotom 1500'],
      ['CMM Dimensional Inspection', 'GD&T verification, fixture checking, first article', 'Hexagon Global Advantage, Zeiss CONTURA G2'],
      ['Eddy Current Testing (ECT)', 'Surface cracks, corrosion, fastener holes in Al', 'Zetec MIZ-200, Olympus EddyFi'],
      ['Laser Tracker (Assembly)', 'Wing rigging, large assembly alignment, tolerance stack', 'FARO Vantage, API Radian Plus'],
    ]},
  ];

  document.getElementById('mfgContent').innerHTML = `<div class="proc-grid">${cats.map(cat => `
    <div class="proc-card">
      <div class="proc-header" style="border-left:3px solid ${cat.color}">
        <i class="ti ${cat.icon}" style="color:${cat.color}"></i>
        <span>${cat.title}</span>
        <span class="pill pill-gray" style="margin-left:auto;font-size:10px">${cat.items.length} processes</span>
      </div>
      <table style="width:100%">
        <thead><tr><th>Process</th><th>Details</th><th>Equipment</th></tr></thead>
        <tbody>${cat.items.map(i => `<tr>
          <td><strong style="font-size:11.5px">${i[0]}</strong></td>
          <td style="font-size:11px;color:var(--text-secondary)">${i[1]}</td>
          <td style="font-size:11px;color:var(--text-muted)">${i[2]}</td>
        </tr>`).join('')}</tbody>
      </table>
    </div>`).join('')}</div>`;
}

/* ─── ELECTRONICS ─── */
function renderElectronics() {
  const blocks = [
    { title: 'Processors & SoCs', icon: 'ti-cpu', color: '#38bdf8', items: [
      ['PowerPC 750FX', 'Mission computers (LCA, ALH)', 'IBM/Freescale (NXP)', 'DO-254 DAL-A'],
      ['ARM Cortex-A72 (NXP i.MX8)', 'FMS, embedded processors, UAVs', 'NXP Semiconductors', 'DO-178C'],
      ['TMS570LS3137', 'Safety-critical MCU (BMS, FCS, ECS)', 'Texas Instruments', 'IEC 61508 SIL-3'],
      ['STM32H7 / STM32U5', 'UAV flight controllers, sensor fusion, actuators', 'STMicroelectronics', 'IEC 62443'],
      ['Zynq UltraScale+ MPSoC', 'AI inference + real-time control combined', 'AMD Xilinx', 'DO-254'],
    ]},
    { title: 'FPGAs (Flight Grade)', icon: 'ti-circuit-ground', color: '#a78bfa', items: [
      ['Xilinx Virtex UltraScale+ HBM', 'AESA radar signal processing, high-speed DSP', 'AMD Xilinx', 'DO-254 DAL-A'],
      ['Intel Stratix 10 SX', 'Space-grade, ISRO payload processing', 'Intel (Altera)', 'MIL-STD-883'],
      ['Microsemi RTG4 (RT4G150)', 'Radiation-hardened, ISRO/DRDO space missions', 'Microchip (Microsemi)', 'MIL-PRF-38535 Class V'],
      ['NanoXplore NG-LARGE', 'ESA/CNES European space-grade FPGA', 'NanoXplore (France)', 'ESA qualified'],
    ]},
    { title: 'Sensors & Navigation', icon: 'ti-radar', color: '#4ade80', items: [
      ['Honeywell HG4930 MEMS IMU', 'Navigation-grade IMU, LCA/ALH/transport', 'Honeywell Aerospace', 'DO-160G, MIL-STD-810'],
      ['Northrop Grumman LN-100G RLG', 'Ring Laser Gyro INS, precision nav', 'Northrop Grumman', 'MIL-STD-810'],
      ['NavIC / GPS Dual-Frequency', 'SATNAV, GAGAN-enabled, IN-built IIT-B', 'BEL / ISRO NavIC receivers', 'ICAO, DGAQA'],
      ['Hesai XT32 LiDAR', 'UAV obstacle avoidance, 3D mapping', 'Hesai / Ouster', 'CE, IP67'],
      ['Teledyne FLIR Vue Pro R', 'Thermal imaging for UAV surveillance/targeting', 'Teledyne FLIR', 'DO-160 compatible'],
      ['BEL/LRDE GaN T/R Module', 'AESA radar transmit/receive, wide-bandwidth', 'LRDE / BEL (India)', 'DGAQA certified'],
    ]},
    { title: 'Communication Systems', icon: 'ti-antenna', color: '#fb923c', items: [
      ['Link 16 / MIDS-LVT', 'Tactical data link, IAF network-centric ops', 'ViaSat / Collins Aerospace', 'MIL-STD-6016E'],
      ['ARINC 429 (Level 3)', 'Avionics serial data bus (civil/mil)', 'Holt Integrated Circuits, DDC', 'ARINC 429-18'],
      ['MIL-STD-1553B (Dual)', 'Military avionics data bus — LCA, ALH, all IAF', 'DDC, Abaco Systems (India BEL)', 'MIL-STD-1553B'],
      ['SDR (Software Defined Radio)', 'Multi-band EW/comms, PX4-linked telemetry', 'Epiq Solutions, DRDO CAIR', 'DO-160'],
      ['SATCOM VSAT (iDirect)', 'Long-range UAV data link, beyond-LOS', 'Hughes, iDirect (India: ISRO/BSNL)', 'ITU-R, WPC'],
    ]},
    { title: 'RTOS & Middleware', icon: 'ti-terminal', color: '#38bdf8', items: [
      ['Wind River VxWorks 7', 'Mission-critical RTOS, LCA DFCC / ALH FCS', 'Wind River Systems', 'DO-178C DAL-A'],
      ['LynxOS-178', 'Safety RTOS, avionics certified', 'Lynx Software Technologies', 'DO-178C DAL-A'],
      ['RTEMS 5.x', 'Space on-board software — ISRO satellites, ESA', 'OAR Corporation / ESA', 'ECSS-E-ST-40C'],
      ['FreeRTOS 10', 'UAV flight controllers, MCU targets, iDEX drones', 'Amazon / Open Source', 'IEC 61508 partial'],
      ['ROS2 Humble', 'Ground robots, UAV perception, DRDO ground systems', 'Open Robotics (Intrinsic)', 'None (dev only)'],
    ]},
  ];

  document.getElementById('electronicsContent').innerHTML = blocks.map(b => `
    <div class="data-card" style="margin-bottom:14px">
      <div class="card-title-row" style="color:${b.color}">
        <i class="ti ${b.icon}" style="font-size:16px"></i>${b.title}
        <span class="pill pill-gray" style="margin-left:auto">${b.items.length} items</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Component / System</th><th>Role in Aerospace</th><th>Vendor</th><th>Certification</th></tr></thead>
          <tbody>${b.items.map(i => `<tr>
            <td><strong>${i[0]}</strong></td>
            <td style="font-size:11.5px;color:var(--text-secondary)">${i[1]}</td>
            <td style="font-size:11.5px">${i[2]}</td>
            <td><span class="pill pill-gray" style="font-size:10px">${i[3]}</span></td>
          </tr>`).join('')}</tbody>
        </table>
      </div>
    </div>`).join('');
}

/* ─── SOFTWARE ─── */
function renderSoftware() {
  const cats = [
    { title: 'CAD & Structural Design', icon: 'ti-ruler-2', items: [
      ['CATIA V5 / V6 / 3DEXPERIENCE', 'Primary aerostructure surface & detailed design', 'HAL, Airbus India, Dassault progr.', 'Dassault Systèmes'],
      ['Siemens NX (Unigraphics)', 'Detailed design, machining, FEM pre/post', 'BEL, TASL, L&T, Bharat Forge', 'Siemens PLM'],
      ['PTC Creo Parametric 9', 'Product design, mechanism, GD&T', 'ISRO sub-systems, HAL', 'PTC Inc.'],
      ['SolidWorks (DASSAULT)', 'Startup & MSME design, iDEX projects', 'ideaForge, Agnikul, Sarla', 'Dassault Systèmes'],
    ]},
    { title: 'CAE — Structural Analysis', icon: 'ti-chart-bar', items: [
      ['MSC Nastran / Patran', 'FEA structural, freq, aeroelastic', 'HAL, NAL, ISRO', 'MSC Software (Hexagon)'],
      ['ANSYS Mechanical 2024', 'Thermal, fatigue, NVH, pre-stress', 'TASL, Bharat Forge, DRDO', 'ANSYS Inc.'],
      ['Abaqus/CAE (Simulia)', 'Non-linear, crash, composite progressive failure', 'DRDO DRDL, NAL, ADA', 'Dassault Simulia'],
      ['LS-DYNA R14', 'Birdstrike, crash, impact cert (DO-160)', 'HAL (cert support)', 'LSTC / Ansys'],
    ]},
    { title: 'CFD — Aerodynamics', icon: 'ti-wind', items: [
      ['ANSYS Fluent 2024', 'External aero, engine intake, nozzle, thermal', 'NAL, HAL AD, DRDO ADE', 'ANSYS Inc.'],
      ['Siemens STAR-CCM+', 'Full-aircraft aero, stealth shaping, multi-physics', 'HAL, ADA (AMCA)', 'Siemens Digital Ind.'],
      ['OpenFOAM 10', 'HPC cluster CFD — rocket plumes, wake', 'IIT-B/D/M, NAL, ISRO', 'OpenFOAM Foundation'],
      ['SU2 7.0 (Stanford)', 'Adjoint-based aerodynamic shape optimisation', 'Academic / DRDO research', 'Stanford / open source'],
    ]},
    { title: 'PLM & ERP', icon: 'ti-database', items: [
      ['Siemens Teamcenter 12', 'Enterprise PLM, BOM, drawing vault', 'HAL (all divisions), BEL, TASL', 'Siemens PLM'],
      ['PTC Windchill 12', 'PDM, configuration management, doc control', 'DRDO labs, NAL, CSIR', 'PTC Inc.'],
      ['SAP S/4HANA (Aerospace)', 'MRP, MRO, finance, procurement, inventory', 'HAL, BEL, BDL, MIDHANI', 'SAP SE (Germany)'],
      ['Oracle ERP Cloud', 'Finance + supply chain + procurement', 'ISRO, Tata group cos.', 'Oracle Corp.'],
    ]},
    { title: 'Embedded / Avionics Development', icon: 'ti-cpu', items: [
      ['MATLAB / Simulink R2024a', 'Model-based design, FCS/AFCS simulation', 'HAL Avionics, NAL, DARE', 'MathWorks'],
      ['Embedded Coder + DO Qualifier', 'Auto C/C++ code gen, DO-178C compliance', 'HAL, BEL (safety software)', 'MathWorks'],
      ['LDRA Testbed', 'Code coverage analysis, MISRA-C check', 'HAL, BEL certification teams', 'LDRA Technology'],
      ['IAR Embedded Workbench', 'ARM / RISC-V C/C++ IDE, RTOS integration', 'DRDO labs, iDEX startups', 'IAR Systems'],
    ]},
    { title: 'Autonomy, AI & Robotics', icon: 'ti-brain', items: [
      ['PX4 Autopilot 1.14', 'Open-source UAV FCS, custom for TAPAS/CATS', 'ideaForge, DRDO, iDEX drones', 'PX4 community'],
      ['ArduPilot Copter/Plane 4.x', 'Multi-rotor/fixed-wing research, field deployments', 'Research UAVs, NDRF, police drones', 'ArduPilot.org'],
      ['ROS2 Humble / Iron', 'Robot middleware, autonomy stack, perception', 'DRDO, IITs, ISRO rovers (Pragyan)', 'Open Robotics'],
      ['PyTorch 2.x + CUDA', 'SAR/ISAR target detection, EO/IR classification', 'DRDO AI proj., iDEX winners', 'Meta AI'],
      ['TensorFlow Lite (Edge)', 'On-device inference for UAV vision payload', 'Startup UAV perception stacks', 'Google'],
    ]},
  ];

  document.getElementById('softwareContent').innerHTML = cats.map(cat => `
    <div class="data-card" style="margin-bottom:14px">
      <div class="card-title-row">
        <i class="ti ${cat.icon}" style="font-size:16px;color:var(--accent)"></i>${cat.title}
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Tool</th><th>Purpose</th><th>Used By (India)</th><th>Vendor</th></tr></thead>
          <tbody>${cat.items.map(i => `<tr>
            <td><strong>${i[0]}</strong></td>
            <td style="font-size:11.5px;color:var(--text-secondary)">${i[1]}</td>
            <td style="font-size:11.5px">${i[2]}</td>
            <td style="font-size:11.5px;color:var(--text-muted)">${i[3]}</td>
          </tr>`).join('')}</tbody>
        </table>
      </div>
    </div>`).join('');
}

/* ─── INDIA ECOSYSTEM ─── */
function renderIndia() {
  document.getElementById('indiaTbody').innerHTML = INDIA_COMPANIES.map(c => `<tr>
    <td><strong>${c.name}</strong></td>
    <td><span class="pill ${c.type.includes('DPSU') || c.type.includes('Govt') ? 'pill-blue' : c.type.includes('Startup') || c.type.includes('NewSpace') ? 'pill-purple' : 'pill-green'}">${c.type}</span></td>
    <td style="font-size:11.5px">${c.loc}</td>
    <td style="font-size:11.5px;color:var(--text-secondary)">${c.rev}</td>
    <td>${c.emp}</td>
    <td style="font-size:11px;color:var(--text-secondary)">${c.cap}</td>
    <td style="font-size:11px;color:var(--text-secondary)">${c.cust}</td>
    <td style="font-size:11px">${c.cert}</td>
  </tr>`).join('');
}

/* ─── IMPORTS ─── */
function renderImports() {
  const kpis = `
    <div class="kpi-row" style="margin-bottom:20px">
      <div class="kpi-card"><div class="kpi-icon" style="color:#f87171"><i class="ti ti-arrows-transfer-up"></i></div><div class="kpi-val">₹1.4L Cr</div><div class="kpi-label">India defence import bill FY23</div></div>
      <div class="kpi-card"><div class="kpi-icon" style="color:#4ade80"><i class="ti ti-target"></i></div><div class="kpi-val">75%</div><div class="kpi-label">Indigenisation target by 2047</div></div>
      <div class="kpi-card"><div class="kpi-icon" style="color:#38bdf8"><i class="ti ti-list-check"></i></div><div class="kpi-val">509</div><div class="kpi-label">Positive indigenisation list items</div></div>
      <div class="kpi-card"><div class="kpi-icon" style="color:#a78bfa"><i class="ti ti-bulb"></i></div><div class="kpi-val">400+</div><div class="kpi-label">iDEX challenges funded</div></div>
    </div>`;

  const rows = IMPORT_DATA.map(d => {
    const pct = d.pct;
    const barClass = pct >= 70 ? 'green' : pct >= 30 ? 'amber' : 'red';
    return `<tr>
      <td><strong>${d.platform}</strong></td>
      <td>${d.comp}</td>
      <td>${d.country}</td>
      <td style="font-size:11px;color:var(--text-secondary)">${d.supplier}</td>
      <td style="font-size:11px;color:var(--text-secondary)">${d.gap}</td>
      <td>
        <div style="font-size:11px;margin-bottom:3px">${d.status}</div>
        <div class="prog-wrap"><div class="prog-bar ${barClass}" style="width:${pct}%"></div></div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:2px">${pct}% indigenous</div>
      </td>
      <td style="font-size:11px;color:#38bdf8">${d.path}</td>
    </tr>`;
  }).join('');

  document.getElementById('importsContent').innerHTML = kpis + `
    <div class="data-card">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Platform</th><th>Imported Component</th><th>Country</th><th>Supplier</th><th>Technology Gap</th><th>Indigenisation Status</th><th>Make in India Path</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
}

/* ─── SUPPLY CHAIN ─── */
function renderSC() {
  document.getElementById('scContent').innerHTML = `
    <div class="grid-2">
      <div class="data-card">
        <div class="card-title-row"><i class="ti ti-plane" style="color:var(--accent)"></i>LCA Tejas Supply Chain</div>
        <div style="padding:14px 16px">
          <div class="tier-card t1"><div class="tier-title"><i class="ti ti-crown"></i> OEM — System Integrator</div><div class="tier-content">HAL Aircraft Division, Bengaluru (HAL-AMD)</div></div>
          <div class="tier-card t1"><div class="tier-title"><i class="ti ti-star"></i> Tier 1 — Major Subsystems</div><div class="tier-content">BEL (avionics, radar), DARE (EW suite), GTRE (Kaveri engine), Eurojet (EJ200), Safran (landing gear), Martin Baker (ejection seat), Elbit (HUD/HMDS)</div></div>
          <div class="tier-card t2"><div class="tier-title"><i class="ti ti-circles-relation"></i> Tier 2 — Sub-assemblies</div><div class="tier-content">Dynamatic Technologies (structures), Bharat Forge (forgings), MIDHANI (special alloys), Alpha Design (EW components), Centum Electronics (PCBs), Godrej Aerospace</div></div>
          <div class="tier-card t3"><div class="tier-title"><i class="ti ti-dots"></i> Tier 3 — Parts & Raw Material</div><div class="tier-content">200+ Indian MSMEs; Toray/Hexcel (CFRP); Arconic (Al alloys); VSMPO-AVISMA (Ti); Haynes Intl (Ni alloys)</div></div>
        </div>
      </div>
      <div class="data-card">
        <div class="card-title-row"><i class="ti ti-rocket" style="color:var(--accent)"></i>ISRO / PSLV Supply Chain</div>
        <div style="padding:14px 16px">
          <div class="tier-card t1"><div class="tier-title"><i class="ti ti-crown"></i> OEM</div><div class="tier-content">ISRO — VSSC (Thiruvananthapuram), LPSC, ISAC, SAC, SDSC SHAR</div></div>
          <div class="tier-card t1"><div class="tier-title"><i class="ti ti-star"></i> Tier 1</div><div class="tier-content">HAL (engine parts), BEL (avionics), MIDHANI (alloys), Godrej Aerospace (turbopumps, tanks), L&T (motor cases)</div></div>
          <div class="tier-card t2"><div class="tier-title"><i class="ti ti-circles-relation"></i> Tier 2</div><div class="tier-content">Walchandnagar Industries (pressure vessels), Aequs (precision parts), Centum (avionics assy), Paras Defence (EO)</div></div>
          <div class="tier-card t3"><div class="tier-title"><i class="ti ti-dots"></i> New Space Ecosystem</div><div class="tier-content">Skyroot Aerospace, Agnikul Cosmos, Pixxel, Dhruva Space, Bellatrix, ePlane Company, Sarla Aviation — all IN-SPACe authorised</div></div>
        </div>
      </div>
    </div>
    <div class="data-card" style="margin-top:16px">
      <div class="card-title-row"><i class="ti ti-users" style="color:var(--accent)"></i>Key Investors & Government Bodies</div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Entity</th><th>Type</th><th>Role</th><th>Key Investments / Programmes</th></tr></thead>
          <tbody>
            <tr><td><strong>Ministry of Defence (MoD)</strong></td><td><span class="pill pill-blue">Govt</span></td><td>Policy, procurement, DAP 2020</td><td>Positive Indigenisation List, iDEX, FDI policy</td></tr>
            <tr><td><strong>DRDO (HQ)</strong></td><td><span class="pill pill-blue">Govt R&D</span></td><td>Technology developer → industry transfer</td><td>LCA, Astra, Akash, BrahMos, TAPAS</td></tr>
            <tr><td><strong>IN-SPACe</strong></td><td><span class="pill pill-blue">Space Regulator</span></td><td>Private sector space authorisation</td><td>Skyroot, Agnikul, Pixxel approvals</td></tr>
            <tr><td><strong>iDEX (Innovation for Defence Excellence)</strong></td><td><span class="pill pill-green">Govt Fund</span></td><td>Startup grants, challenge prizes up to ₹25 Cr</td><td>400+ startups funded</td></tr>
            <tr><td><strong>Peak XV (Sequoia India)</strong></td><td><span class="pill pill-purple">VC</span></td><td>Deep-tech VC, NewSpace focused</td><td>Agnikul ($26M), Pixxel, other space startups</td></tr>
            <tr><td><strong>Dharavi Capital / Kalaari Capital</strong></td><td><span class="pill pill-purple">VC</span></td><td>Early-stage defence tech</td><td>ideaForge (IPO exit), drone-tech portfolio</td></tr>
            <tr><td><strong>Tata Sons / TASL</strong></td><td><span class="pill pill-amber">Conglomerate</span></td><td>Strategic OEM investor + partner</td><td>C-295 aerostructures, Bell JV, Airbus 220 seats</td></tr>
          </tbody>
        </table>
      </div>
    </div>`;
}

/* ─── ERP SCHEMA ─── */
function renderERP() {
  document.getElementById('erpContent').innerHTML = `
    <a class="export-btn" onclick="exportSchema()">
      <i class="ti ti-download"></i> Export Full Schema (SQL)
    </a>
    <div class="grid-2">
      <div>
        <div class="data-card">
          <div class="card-title-row"><i class="ti ti-table" style="color:var(--accent)"></i>Core Table DDL</div>
          <div style="padding:14px 16px">
<pre class="code-block"><span class="code-cmt">-- VEHICLE MASTER</span>
<span class="code-kw">CREATE TABLE</span> vehicle_master (
  vehicle_id       <span class="code-type">VARCHAR(20)</span> <span class="code-kw">PRIMARY KEY</span>,
  vehicle_name     <span class="code-type">VARCHAR(200)</span> NOT NULL,
  category         <span class="code-type">VARCHAR(50)</span>,
  country_origin   <span class="code-type">VARCHAR(100)</span>,
  manufacturer_id  <span class="code-type">INT</span> <span class="code-kw">REFERENCES</span> manufacturer(id),
  program_status   <span class="code-type">VARCHAR(30)</span>,
  mtow_kg          <span class="code-type">NUMERIC(10,2)</span>,
  range_km         <span class="code-type">NUMERIC(8,2)</span>,
  max_speed_mach   <span class="code-type">NUMERIC(5,3)</span>,
  first_flight     <span class="code-type">DATE</span>,
  image_url        <span class="code-type">TEXT</span>,
  created_at       <span class="code-type">TIMESTAMP</span> DEFAULT NOW()
);

<span class="code-cmt">-- COMPONENT MASTER</span>
<span class="code-kw">CREATE TABLE</span> component_master (
  component_id   <span class="code-type">VARCHAR(30)</span> <span class="code-kw">PRIMARY KEY</span>,
  part_number    <span class="code-type">VARCHAR(50)</span> UNIQUE NOT NULL,
  component_name <span class="code-type">VARCHAR(200)</span>,
  vehicle_id     <span class="code-type">VARCHAR(20)</span> <span class="code-kw">REFERENCES</span> vehicle_master,
  material_id    <span class="code-type">INT</span> <span class="code-kw">REFERENCES</span> material_master(id),
  supplier_id    <span class="code-type">INT</span> <span class="code-kw">REFERENCES</span> supplier_master(id),
  unit_cost_usd  <span class="code-type">NUMERIC(12,2)</span>,
  weight_kg      <span class="code-type">NUMERIC(8,4)</span>,
  military_grade <span class="code-type">BOOLEAN</span>,
  export_ctrl    <span class="code-type">VARCHAR(20)</span>, <span class="code-cmt">-- ITAR/EAR/None</span>
  certification  <span class="code-type">VARCHAR(100)</span>,
  image_url      <span class="code-type">TEXT</span>
);

<span class="code-cmt">-- SUPPLIER MASTER</span>
<span class="code-kw">CREATE TABLE</span> supplier_master (
  supplier_id    <span class="code-type">SERIAL</span> <span class="code-kw">PRIMARY KEY</span>,
  supplier_name  <span class="code-type">VARCHAR(200)</span>,
  country        <span class="code-type">VARCHAR(100)</span>,
  tier           <span class="code-type">INT</span>, <span class="code-cmt">-- 1/2/3</span>
  capabilities   <span class="code-type">TEXT[]</span>,
  certifications <span class="code-type">VARCHAR(200)</span>,
  annual_revenue <span class="code-type">NUMERIC(15,2)</span>
);</pre>
          </div>
        </div>
      </div>
      <div>
        <div class="data-card">
          <div class="card-title-row"><i class="ti ti-git-branch" style="color:var(--accent)"></i>ER Relationships</div>
          <div style="padding:14px 16px">
<pre class="code-block">vehicle_master
  <span class="code-kw">|── (1:N) ──></span> component_master
  <span class="code-kw">|</span>              <span class="code-kw">|── (N:1) ──></span> material_master
  <span class="code-kw">|</span>              <span class="code-kw">|── (N:1) ──></span> supplier_master
  <span class="code-kw">|</span>              <span class="code-kw">└── (N:1) ──></span> process_master
  <span class="code-kw">|── (N:1) ──></span> manufacturer_master
  <span class="code-kw">|── (1:N) ──></span> propulsion_master
  <span class="code-kw">|── (N:M) ──></span> certification_master
  <span class="code-kw">└── (N:M) ──></span> operator_master

supplier_master
  <span class="code-kw">|── (1:N) ──></span> component_master
  <span class="code-kw">└── (N:M) ──></span> manufacturer_master

project_master
  <span class="code-kw">|── (1:N) ──></span> vehicle_master
  <span class="code-kw">|── (1:N) ──></span> costing_master
  <span class="code-kw">└── (N:M) ──></span> certification_master

inventory_master
  <span class="code-str">→ location, lot_no, qty_on_hand, expiry
  → linked to MRP engine (demand / supply)</span>

maintenance_master
  <span class="code-str">→ task_card_id, interval_hrs, last_done
  → LLP (Life Limited Parts) tracking</span></pre>
          </div>
        </div>
        <div class="data-card" style="margin-top:14px">
          <div class="card-title-row"><i class="ti ti-braces" style="color:var(--accent)"></i>JSON API Sample</div>
          <div style="padding:14px 16px">
<pre class="code-block">{
  <span class="code-kw">"vehicle_id"</span>: <span class="code-str">"IND-FTR-001"</span>,
  <span class="code-kw">"name"</span>: <span class="code-str">"LCA Tejas Mk1A"</span>,
  <span class="code-kw">"category"</span>: <span class="code-str">"Fighter"</span>,
  <span class="code-kw">"specs"</span>: {
    <span class="code-kw">"mtow_kg"</span>: 13500,
    <span class="code-kw">"range_km"</span>: 3000,
    <span class="code-kw">"max_speed_mach"</span>: 1.8,
    <span class="code-kw">"image_size_px"</span>: <span class="code-str">"800x450"</span>
  },
  <span class="code-kw">"components"</span>: [
    { <span class="code-kw">"part_no"</span>: <span class="code-str">"LCA-W-001"</span>,
      <span class="code-kw">"name"</span>: <span class="code-str">"CFRP Wing Panel"</span>,
      <span class="code-kw">"image_size_px"</span>: <span class="code-str">"600x600"</span> }
  ]
}</pre>
          </div>
        </div>
      </div>
    </div>`;
}

/* ─── GALLERY ─── */
function renderGallery() {
  const items = Object.entries(imageStore);
  if (items.length === 0) {
    document.getElementById('galleryContent').innerHTML = `
      <div class="gallery-empty">
        <i class="ti ti-photo-off"></i>
        <p>No images uploaded yet. Use the upload buttons in each table row to add images.</p>
      </div>`;
    return;
  }
  document.getElementById('galleryContent').innerHTML = `
    <div class="gallery-grid">
      ${items.map(([id, data]) => `
        <div class="gallery-item">
          <img src="${data.url}" alt="${data.name}">
          <div class="gallery-item-info">
            <div class="gallery-item-name">${data.name}</div>
            <div class="gallery-item-sub">${data.category} · ${data.size || ''}</div>
          </div>
        </div>`).join('')}
    </div>`;
}

/* ─── QUICK CHIPS ─── */
function renderQuickChips() {
  document.getElementById('quickChips').innerHTML = QUICK_CHIPS.map(q =>
    `<button class="chip" onclick="setQuery('${q.replace(/'/g, "\\'")}')">${q}</button>`
  ).join('');
}

/* ─── EXPORT SQL ─── */
function exportSchema() {
  const sql = `-- AeroIntel DB Schema Export\n-- Generated: ${new Date().toISOString()}\n\nCREATE TABLE vehicle_master (\n  vehicle_id VARCHAR(20) PRIMARY KEY,\n  vehicle_name VARCHAR(200) NOT NULL,\n  category VARCHAR(50),\n  country_origin VARCHAR(100),\n  manufacturer_id INT,\n  program_status VARCHAR(30),\n  mtow_kg NUMERIC(10,2),\n  range_km NUMERIC(8,2),\n  max_speed_mach NUMERIC(5,3),\n  first_flight DATE,\n  image_url TEXT,\n  created_at TIMESTAMP DEFAULT NOW()\n);\n\nCREATE TABLE component_master (\n  component_id VARCHAR(30) PRIMARY KEY,\n  part_number VARCHAR(50) UNIQUE NOT NULL,\n  component_name VARCHAR(200),\n  vehicle_id VARCHAR(20),\n  material_id INT,\n  supplier_id INT,\n  unit_cost_usd NUMERIC(12,2),\n  weight_kg NUMERIC(8,4),\n  military_grade BOOLEAN,\n  export_ctrl VARCHAR(20),\n  certification VARCHAR(100),\n  image_url TEXT\n);\n\nCREATE TABLE supplier_master (\n  supplier_id SERIAL PRIMARY KEY,\n  supplier_name VARCHAR(200),\n  country VARCHAR(100),\n  tier INT,\n  certifications VARCHAR(200),\n  annual_revenue NUMERIC(15,2)\n);\n`;
  const blob = new Blob([sql], { type: 'text/sql' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'aerointel_schema.sql';
  a.click();
}
