/* ═══════════════════════════════════════════
   AeroIntel DB — App Logic
   ═══════════════════════════════════════════ */

/* ─── Section routing ─── */
const SECTION_TITLES = {
  vehicles: 'Vehicle Master Database',
  wbs: 'System Work Breakdown Structure',
  components: 'Component Database',
  materials: 'Materials Engineering',
  manufacturing: 'Manufacturing Processes',
  propulsion: 'Propulsion Systems',
  electronics: 'Electronics & Embedded Systems',
  software: 'Software Technology Stack',
  india: 'India Manufacturing Ecosystem',
  imports: 'Import Dependency Analysis',
  supplychain: 'Supply Chain & Investors',
  erp: 'ERP Database Schema',
  ai: 'AI Intelligence Query Engine',
  gallery: 'Image Gallery',
};

const SECTION_SUBS = {
  vehicles: 'All Platforms',
  wbs: 'LCA / AMCA / ALH',
  components: 'Parts & Assemblies',
  materials: 'Metals / Composites / Polymers',
  manufacturing: 'Processes & Equipment',
  propulsion: 'Engines & Motors',
  electronics: 'Processors / FPGAs / RTOS',
  software: 'CAD / CAE / PLM / AI',
  india: 'OEMs / DPSUs / Startups',
  imports: 'Technology Gaps',
  supplychain: 'Tier 1–3 Mapping',
  erp: 'SQL / JSON / API',
  ai: 'Claude-powered',
  gallery: 'Uploaded Images',
};

// Lazy-render flags
const rendered = {};

function showSection(id) {
  document.querySelectorAll('.sec').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('sec-' + id);
  if (el) el.classList.add('active');

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navEl = document.querySelector(`.nav-item[data-section="${id}"]`);
  if (navEl) navEl.classList.add('active');

  document.getElementById('topbarTitle').textContent = SECTION_TITLES[id] || id;
  document.getElementById('topbarSub').textContent = SECTION_SUBS[id] || '';

  // Lazy renders
  if (!rendered[id]) {
    rendered[id] = true;
    if (id === 'wbs') renderWBS('All');
    if (id === 'manufacturing') renderMfg();
    if (id === 'electronics') renderElectronics();
    if (id === 'software') renderSoftware();
    if (id === 'imports') renderImports();
    if (id === 'supplychain') renderSC();
    if (id === 'erp') renderERP();
    if (id === 'gallery') renderGallery();
  }
}

/* ─── Sidebar toggle ─── */
document.getElementById('sidebarToggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('collapsed');
});

/* ─── Nav item clicks ─── */
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    showSection(item.dataset.section);
  });
});

/* ─── Global search ─── */
function globalFilter(q) {
  if (!q.trim()) { renderVehicles(VEHICLES); return; }
  const ql = q.toLowerCase();
  const fv = VEHICLES.filter(v => Object.values(v).join(' ').toLowerCase().includes(ql));
  const tbody = document.getElementById('vehicleTbody');
  if (tbody) {
    tbody.innerHTML = fv.map(v => `<tr>
      ${thumbCell(v.id, 'vehicle')}
      <td><strong>${v.name}</strong></td>
      <td><span class="pill ${catPill(v.cat)}">${v.cat}</span></td>
      <td>${v.origin}</td>
      <td style="font-size:11px;color:var(--text-secondary)">${v.mfr}</td>
      <td><span class="pill ${statusPill(v.status)}">${v.status}</span></td>
      <td>${v.mtow}</td><td>${v.range}</td><td>${v.speed}</td>
      <td style="font-size:11px;color:var(--text-secondary)">${v.ops}</td>
      ${uploadBtn(v.id, 'vehicle')}
    </tr>`).join('');
  }
}

/* ─── Keyboard shortcut ─── */
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    document.getElementById('globalSearch').focus();
  }
  if (e.key === 'Escape') {
    closeModal();
    document.getElementById('globalSearch').blur();
  }
});

/* ══════════════════════════════════════════
   IMAGE UPLOAD MODAL
══════════════════════════════════════════ */
let _currentUploadId = null;
let _currentUploadCat = null;
let _currentUploadFile = null;

function openModal(id, category, mode) {
  _currentUploadId = id;
  _currentUploadCat = category;
  _currentUploadFile = null;

  // Find the item name
  const allItems = [...VEHICLES, ...COMPONENTS, ...PROPULSION];
  const item = allItems.find(x => x.id === id);
  const itemName = item ? (item.name || item.engine || id) : id;

  // Spec lookup
  const spec = IMAGE_SPECS[category] || IMAGE_SPECS['vehicle'];

  document.getElementById('uploadTargetInfo').innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
      <i class="ti ti-photo-up" style="color:var(--accent);font-size:16px"></i>
      <strong>${itemName}</strong>
    </div>
    <div style="color:var(--text-muted);font-size:11.5px">Category: ${category.charAt(0).toUpperCase() + category.slice(1)}</div>`;

  document.getElementById('uploadSpecBox').innerHTML = `
    <div class="spec-title"><i class="ti ti-ruler-measure"></i> Recommended Image Specifications</div>
    <div class="spec-row">
      <div class="spec-item"><strong>Size:</strong> ${spec.w} × ${spec.h} px</div>
      <div class="spec-item"><strong>Ratio:</strong> ${spec.ratio}</div>
      <div class="spec-item"><strong>Format:</strong> ${spec.format}</div>
    </div>
    <div style="margin-top:6px;font-size:11px;color:var(--text-secondary)">${spec.note}</div>`;

  // If already has image, show it
  const stored = imageStore[id];
  if (stored) {
    document.getElementById('imagePreview').style.display = 'block';
    document.getElementById('previewImg').src = stored.url;
    document.getElementById('imgPreviewInfo').innerHTML = `
      <i class="ti ti-check" style="color:var(--green)"></i>
      Image uploaded · ${stored.size || ''} · Click browse to replace`;
    document.getElementById('confirmUploadBtn').disabled = false;
    document.getElementById('dropZone').style.display = 'none';
  } else {
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('dropZone').style.display = 'block';
    document.getElementById('confirmUploadBtn').disabled = true;
  }

  document.getElementById('fileInput').value = '';
  document.getElementById('uploadModal').classList.add('open');
  setupDropZone();
}

function closeModal() {
  document.getElementById('uploadModal').classList.remove('open');
  _currentUploadId = null;
  _currentUploadFile = null;
}

function setupDropZone() {
  const dz = document.getElementById('dropZone');
  dz.ondragover = e => { e.preventDefault(); dz.classList.add('drag-over'); };
  dz.ondragleave = () => dz.classList.remove('drag-over');
  dz.ondrop = e => {
    e.preventDefault(); dz.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) processFile(file);
  };
}

function handleFileSelect(input) {
  if (input.files && input.files[0]) processFile(input.files[0]);
}

function processFile(file) {
  _currentUploadFile = file;
  const reader = new FileReader();
  reader.onload = function(e) {
    const url = e.target.result;
    const img = new Image();
    img.onload = function() {
      const sizeStr = `${img.width} × ${img.height} px · ${(file.size / 1024).toFixed(0)} KB`;
      document.getElementById('previewImg').src = url;
      document.getElementById('imgPreviewInfo').innerHTML = `
        <i class="ti ti-photo" style="color:var(--accent)"></i>
        ${file.name} · ${sizeStr}`;
      document.getElementById('imagePreview').style.display = 'block';
      document.getElementById('dropZone').style.display = 'none';
      document.getElementById('confirmUploadBtn').disabled = false;
    };
    img.src = url;
  };
  reader.readAsDataURL(file);
}

function confirmUpload() {
  if (!_currentUploadId) return;

  let url;
  let sizeStr = '';

  if (_currentUploadFile) {
    url = document.getElementById('previewImg').src;
    const infoText = document.getElementById('imgPreviewInfo').textContent;
    sizeStr = infoText;
  } else if (imageStore[_currentUploadId]) {
    // Already had one, just close
    closeModal();
    return;
  }

  const allItems = [...VEHICLES, ...COMPONENTS, ...PROPULSION];
  const item = allItems.find(x => x.id === _currentUploadId);
  const itemName = item ? (item.name || item.engine || _currentUploadId) : _currentUploadId;

  imageStore[_currentUploadId] = {
    url: url,
    name: itemName,
    category: _currentUploadCat,
    size: sizeStr,
  };

  // Refresh the relevant table cells
  refreshImageCell(_currentUploadId, _currentUploadCat);

  // Update gallery if rendered
  if (rendered['gallery']) renderGallery();

  closeModal();
}

function refreshImageCell(id, category) {
  // Re-render the relevant table
  const tables = {
    vehicle: () => renderVehicles(VEHICLES),
    component: () => renderComponents(),
    engine: () => renderPropulsion(),
  };
  if (tables[category]) tables[category]();
}

/* ══════════════════════════════════════════
   AI QUERY ENGINE
══════════════════════════════════════════ */
const queryHistoryItems = [];

async function queryAI() {
  const input = document.getElementById('aiQuery');
  const q = input.value.trim();
  if (!q) return;

  const respEl = document.getElementById('aiResponse');
  respEl.style.display = 'block';
  respEl.innerHTML = '<span class="spinner"></span> Processing aerospace intelligence query…';
  input.value = '';

  // Add to history
  queryHistoryItems.unshift({ q, time: new Date().toLocaleTimeString() });
  const histEl = document.getElementById('queryHistory');
  histEl.innerHTML = queryHistoryItems.slice(0, 10).map(h =>
    `<div class="qh-item"><span class="qh-time">${h.time}</span><span class="qh-text">${h.q}</span></div>`
  ).join('');

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: `You are AeroIntel, a world-class aerospace and defence intelligence system with deep knowledge of all Indian, US, European, Russian, Israeli aerospace platforms, defence systems, UAVs, missiles, satellites, space launch vehicles, and their subsystems. Answer queries with precise technical detail: specifications, suppliers, materials, manufacturing processes, WBS, and technology assessments. Format responses clearly. Focus on India-relevant information where applicable. Use headings with ** for bold section labels. Be comprehensive but scannable.`,
        messages: [{ role: 'user', content: q }]
      })
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    const text = data.content?.map(b => b.text || '').join('\n') || 'No response received.';

    // Render with basic markdown-like formatting
    respEl.innerHTML = text
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^(#{1,3})\s(.+)$/gm, '<div class="ai-section-title">$2</div>');

  } catch (err) {
    respEl.innerHTML = `<span style="color:var(--red)"><i class="ti ti-alert-circle"></i> Query failed: ${err.message}</span>`;
  }
}

function setQuery(q) {
  showSection('ai');
  document.getElementById('aiQuery').value = q;
  document.getElementById('aiQuery').focus();
}

/* ─── INIT ─── */
(function init() {
  // Initial renders
  renderVehicles(VEHICLES);
  renderComponents();
  renderMaterials(MATERIALS);
  renderPropulsion();
  renderIndia();
  renderQuickChips();

  // Mark initial section
  rendered['vehicles'] = true;
  rendered['components'] = true;
  rendered['materials'] = true;
  rendered['propulsion'] = true;
  rendered['india'] = true;
})();
