/**
 * ==========================================================================
 * MK SISTEM DIGITAL - ITERA
 * Main Application Controller & UI Coordinator
 * ==========================================================================
 */

const AppState = {
  activeWeek: 1,
  activeSubmenu: {
    1: 'sub_1_3', // default to Central Binary Hub for Week 1
    2: 'sub_2_1',
    3: 'sub_3_2', // default to Real-time Logic Gate Simulator
    4: 'sub_4_5', // default to Interactive K-Map Solver
    5: 'sub_5_1',
    6: 'sub_6_1',
    7: 'sub_7_1'
  },
  // 8-bit switch board state
  bitBoard: [0, 0, 0, 1, 1, 0, 0, 1], // default 25_10 = 0001 1001_2
  bitLength: 8,
  
  // Week 1 Central Hub State
  hubInput: '25',
  hubBase: 10,

  // Week 2 Complement State
  compInput: '-13',
  compBits: 8,

  // Week 2 Arithmetic State
  arithA: '75',
  arithB: '103',
  arithOp: 'SUB',

  // Week 3 Logic Gate & Circuit Simulator State
  logicGate: 'AND',
  gateInputA: 1,
  gateInputB: 0,
  activeCircuitMode: 'single', // 'single', 'latihan3', 'latihan4'
  circuit3A: 0,
  circuit3B: 0,
  circuit4A: 0,
  circuit4B: 0,

  // Week 4 K-Map State
  kmapVars: 5,
  sensorDoor: 0,
  sensorWindow: 0,
  sensorMotion: 0,
  sensorSmoke: 0
};

document.addEventListener('DOMContentLoaded', () => {
  initWeekNavigation();
  initSubmenuNavigation();
  initCentralHub();
  initBitBoard();
  initWeek2Features();
  initWeek3Features();
  initWeek4Features();
  initMobileDrawer();

  // Render official slide exercises for Weeks 1, 2, 3, 4, 5, 6, 7
  if (window.QuizEngine) {
    QuizEngine.renderQuizList('quiz_container_w1', QuizEngine.officialExercisesWeek1);
    QuizEngine.renderQuizList('quiz_container_w2', QuizEngine.officialExercisesWeek2);
    QuizEngine.renderQuizList('quiz_container_w3', QuizEngine.officialExercisesWeek3);
    QuizEngine.renderQuizList('quiz_container_w4', QuizEngine.officialExercisesWeek4);
    if (QuizEngine.officialExercisesWeek5) QuizEngine.renderQuizList('quiz_container_w5', QuizEngine.officialExercisesWeek5);
    if (QuizEngine.officialExercisesWeek6) QuizEngine.renderQuizList('quiz_container_w6', QuizEngine.officialExercisesWeek6);
    if (QuizEngine.officialExercisesWeek7) QuizEngine.renderQuizList('quiz_container_w7', QuizEngine.officialExercisesWeek7);
  }

  // Initialize new modules for Week 5, 6, 7
  if (window.CombinationalModule) CombinationalModule.init();
  if (window.MultilevelMuxModule) MultilevelMuxModule.init();
  if (window.DecoderEncoderModule) DecoderEncoderModule.init();

  // Initial trigger for live visualizers
  triggerHubCalculation();
  triggerComplementCalculation();
  triggerArithmeticCalculation();
  renderLogicGateSimulator();
  renderKMapSimulator();
  updateSensorSimulation();
});

/* ==========================================================================
   1. NAVIGATION SYSTEM (WEEKS 1 - 14)
   ========================================================================== */
function initWeekNavigation() {
  const navBtns = document.querySelectorAll('.week-nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const weekNum = parseInt(btn.dataset.week, 10);
      switchWeek(weekNum);
    });
  });
}

function switchWeek(weekNum) {
  AppState.activeWeek = weekNum;

  // Update active button in sidebar
  document.querySelectorAll('.week-nav-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.week, 10) === weekNum);
  });

  // Update breadcrumbs
  const crumbActive = document.getElementById('crumb_active_week');
  if (crumbActive) {
    crumbActive.textContent = `Minggu ${weekNum}`;
  }

  // Show corresponding week panel
  document.querySelectorAll('.week-panel').forEach(panel => {
    panel.classList.toggle('active', parseInt(panel.dataset.week, 10) === weekNum);
  });

  // Show/hide submenus bar for active week (supporting weeks 1 to 14)
  for (let w = 1; w <= 14; w++) {
    const subnav = document.getElementById(`subnav_week_${w}`);
    if (subnav) subnav.style.display = weekNum === w ? 'flex' : 'none';
  }

  // If week has default submenu and not yet active, activate it
  const targetSub = AppState.activeSubmenu[weekNum];
  if (targetSub) {
    switchSubmenu(weekNum, targetSub);
  }

  // Trigger visual updates for dynamic canvases
  if (weekNum === 3) {
    renderLogicGateSimulator();
  } else if (weekNum === 4) {
    renderKMapSimulator();
  } else if (weekNum === 5 && window.CombinationalModule) {
    CombinationalModule.updateAdderSubtractor();
  } else if (weekNum === 6 && window.MultilevelMuxModule) {
    MultilevelMuxModule.updateMuxSimulator();
  } else if (weekNum === 7 && window.DecoderEncoderModule) {
    DecoderEncoderModule.updateSevenSegment();
    DecoderEncoderModule.updateDecoder();
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initSubmenuNavigation() {
  const subTabs = document.querySelectorAll('.submenu-tab-btn');
  subTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const parentWeek = parseInt(tab.dataset.parentWeek, 10);
      const targetSub = tab.dataset.targetSub;
      switchSubmenu(parentWeek, targetSub);
    });
  });
}

function switchSubmenu(parentWeek, targetSub) {
  AppState.activeSubmenu[parentWeek] = targetSub;

  // Update sub-tab buttons
  const weekSubTabs = document.querySelectorAll(`.submenu-tab-btn[data-parent-week="${parentWeek}"]`);
  weekSubTabs.forEach(t => {
    t.classList.toggle('active', t.dataset.targetSub === targetSub);
  });

  // Update subtopic panels
  const panels = document.querySelectorAll(`#week_panel_${parentWeek} .subtopic-panel`);
  panels.forEach(p => {
    p.classList.toggle('active', p.id === targetSub);
  });
}

function initMobileDrawer() {
  const toggle = document.getElementById('mobile_toggle');
  const sidebar = document.getElementById('sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
}

/* ==========================================================================
   2. CENTRAL BINARY HUB (WEEK 1 CONTROLLER)
   ========================================================================== */
function initCentralHub() {
  const inputElem = document.getElementById('hub_input_val');
  const baseSelect = document.getElementById('hub_base_select');

  if (inputElem) {
    inputElem.addEventListener('input', (e) => {
      AppState.hubInput = e.target.value;
      triggerHubCalculation();
    });
  }

  if (baseSelect) {
    baseSelect.addEventListener('change', (e) => {
      AppState.hubBase = parseInt(e.target.value, 10);
      triggerHubCalculation();
    });
  }
}

function setHubPreset(val, base = 10) {
  AppState.hubInput = val;
  AppState.hubBase = base;

  const inputElem = document.getElementById('hub_input_val');
  const baseSelect = document.getElementById('hub_base_select');
  if (inputElem) inputElem.value = val;
  if (baseSelect) baseSelect.value = base.toString();

  triggerHubCalculation();
}

function triggerHubCalculation() {
  const errorBox = document.getElementById('hub_error_msg');
  if (errorBox) errorBox.style.display = 'none';

  try {
    const result = CentralBinaryConverter.convert(AppState.hubInput, AppState.hubBase);
    renderHubResults(result);
  } catch (err) {
    if (errorBox) {
      errorBox.textContent = err.message;
      errorBox.style.display = 'block';
    }
  }
}

function renderHubResults(res) {
  // 1. Update Pipeline Architecture Nodes
  const nodeSource = document.getElementById('pipeline_node_source');
  const nodeBinary = document.getElementById('pipeline_node_binary');
  const nodeHex = document.getElementById('pipeline_node_hex');
  const nodeOct = document.getElementById('pipeline_node_oct');
  const nodeDec = document.getElementById('pipeline_node_dec');

  if (nodeSource) {
    nodeSource.innerHTML = `
      <div class="pipeline-node-badge">Input (Basis ${res.source.sourceBase})</div>
      <div class="pipeline-node-val">${res.source.inputStr}</div>
    `;
  }

  if (nodeBinary) {
    nodeBinary.innerHTML = `
      <div class="pipeline-node-badge">⭐ CENTRAL BINARY (BRIDGE)</div>
      <div class="pipeline-node-val" style="color:var(--accent-cyan); letter-spacing:1px;">${res.centralBinary.fullBinary}₂</div>
    `;
  }

  if (nodeHex) nodeHex.textContent = `${res.hexadecimal.hexResult}₁₆`;
  if (nodeOct) nodeOct.textContent = `${res.octal.octResult}₈`;
  if (nodeDec) nodeDec.textContent = `${res.decimal.totalDecimalStr}₁₀`;

  // 2. Render 4-bit Hexadecimal Grouping Blocks (Nibbles)
  renderGroupingBlocks(
    'hex_group_blocks',
    res.hexadecimal.intGroups,
    res.hexadecimal.fracGroups,
    'HEX',
    4
  );

  // 3. Render 3-bit Octal Grouping Blocks
  renderGroupingBlocks(
    'octal_group_blocks',
    res.octal.intGroups,
    res.octal.fracGroups,
    'OCT',
    3
  );

  // 4. Render Positional Weights for Decimal
  renderDecimalWeights(res.decimal);

  // 5. Render Step-by-Step Math Cards
  renderStepByStep(res);
}

function renderGroupingBlocks(containerId, intGroups, fracGroups, type, groupSize) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let html = '';

  // Render Integer Groups
  intGroups.forEach((g, idx) => {
    const colorClass = `group-${type.toLowerCase()}-${idx % 4}`;
    const padBadge = g.paddingCount > 0 ? `<span style="font-size:0.62rem; color:var(--accent-amber);">(+${g.paddingCount} pad 0 kiri)</span>` : '';
    
    // Highlight padded zeros in bits display
    let bitChars = '';
    if (g.paddingCount > 0) {
      bitChars += `<span class="group-bit-padded">${g.paddedBits.slice(0, g.paddingCount)}</span>`;
      bitChars += g.paddedBits.slice(g.paddingCount);
    } else {
      bitChars = g.paddedBits;
    }

    html += `
      <div class="group-block ${colorClass}">
        <div class="group-tag">${type} Nibble/Grup #${intGroups.length - idx} ${padBadge}</div>
        <div class="group-bits">${bitChars}</div>
        <div class="group-arrow-down">↓</div>
        <div class="group-target-val">${g.symbol}</div>
        <div class="group-formula-text">= ${g.val}₁₀</div>
      </div>
    `;
  });

  // Render Radix Point if fractional groups exist
  if (fracGroups && fracGroups.length > 0) {
    html += `
      <div style="display:flex; align-items:center; font-size:2.5rem; font-weight:800; color:var(--accent-cyan); padding:0 8px;">
        •
      </div>
    `;

    fracGroups.forEach((g, idx) => {
      const colorClass = `group-${type.toLowerCase()}-${(idx + 2) % 4}`;
      const padBadge = g.paddingCount > 0 ? `<span style="font-size:0.62rem; color:var(--accent-amber);">(+${g.paddingCount} pad 0 kanan)</span>` : '';
      
      let bitChars = '';
      if (g.paddingCount > 0) {
        let actualBits = g.paddedBits.slice(0, groupSize - g.paddingCount);
        let padBits = g.paddedBits.slice(groupSize - g.paddingCount);
        bitChars = actualBits + `<span class="group-bit-padded">${padBits}</span>`;
      } else {
        bitChars = g.paddedBits;
      }

      html += `
        <div class="group-block ${colorClass}">
          <div class="group-tag">Pecahan #${idx + 1} ${padBadge}</div>
          <div class="group-bits">${bitChars}</div>
          <div class="group-arrow-down">↓</div>
          <div class="group-target-val">${g.symbol}</div>
          <div class="group-formula-text">= ${g.val}₁₀</div>
        </div>
      `;
    });
  }

  container.innerHTML = html;
}

function renderDecimalWeights(decData) {
  const container = document.getElementById('decimal_weights_container');
  if (!container) return;

  let activeTerms = [];
  let html = `
    <div style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin:16px 0;">
  `;

  decData.intWeights.forEach(w => {
    if (w.isActive) activeTerms.push(`(${w.bit} × 2^${w.power} = ${w.weightVal})`);
    html += `
      <div style="background:${w.isActive ? 'rgba(6, 182, 212, 0.15)' : 'var(--bg-elevated)'}; border:1px solid ${w.isActive ? 'var(--accent-cyan)' : 'var(--border-subtle)'}; border-radius:8px; padding:10px 14px; text-align:center; min-width:68px;">
        <div style="font-size:0.7rem; color:var(--text-muted);">2^${w.power}</div>
        <div style="font-family:var(--font-mono); font-size:1.3rem; font-weight:800; color:${w.isActive ? '#ffffff' : 'var(--text-muted)'}; margin:4px 0;">${w.bit}</div>
        <div style="font-size:0.75rem; color:${w.isActive ? 'var(--accent-cyan)' : 'var(--text-muted)'}; font-family:var(--font-mono);">${w.weightVal}</div>
      </div>
    `;
  });

  if (decData.fracWeights.length > 0) {
    html += `<div style="font-size:2rem; font-weight:800; color:var(--accent-cyan); align-self:center;">•</div>`;
    decData.fracWeights.forEach(w => {
      if (w.isActive) activeTerms.push(`(${w.bit} × 2^${w.power} = ${w.weightVal})`);
      html += `
        <div style="background:${w.isActive ? 'rgba(139, 92, 246, 0.15)' : 'var(--bg-elevated)'}; border:1px solid ${w.isActive ? 'var(--accent-purple)' : 'var(--border-subtle)'}; border-radius:8px; padding:10px 14px; text-align:center; min-width:68px;">
          <div style="font-size:0.7rem; color:var(--text-muted);">2^${w.power}</div>
          <div style="font-family:var(--font-mono); font-size:1.3rem; font-weight:800; color:${w.isActive ? '#ffffff' : 'var(--text-muted)'}; margin:4px 0;">${w.bit}</div>
          <div style="font-size:0.72rem; color:${w.isActive ? 'var(--accent-purple)' : 'var(--text-muted)'}; font-family:var(--font-mono);">${w.weightVal}</div>
        </div>
      `;
    });
  }

  html += `</div>`;

  html += `
    <div class="step-math-box" style="margin-top:14px; line-height:1.8;">
      <strong>Penjumlahan Bit Aktif:</strong><br>
      Total Desimal = ${activeTerms.length > 0 ? activeTerms.join(' + ') : '0'} = <strong style="color:#ffffff;">${decData.totalDecimalStr}₁₀</strong>
    </div>
  `;

  container.innerHTML = html;
}

function renderStepByStep(res) {
  const container = document.getElementById('step_by_step_container');
  if (!container) return;

  let html = '';

  // Step 1 Details
  res.centralBinary.stepsToBinary.forEach(st => {
    html += `
      <div class="step-card">
        <div class="step-number">Langkah 1: Jembatan ke Central Biner</div>
        <div class="step-desc">${st.title}</div>
    `;

    if (st.type === 'division_table') {
      html += `
        <table class="division-table">
          <thead>
            <tr><th>Operasi Pembagian</th><th>Hasil Bagi</th><th>Sisa Bagi (Bit)</th></tr>
          </thead>
          <tbody>
            ${st.rows.map(r => `
              <tr>
                <td>${r.current} ÷ 2</td>
                <td><strong>${r.quotient}</strong></td>
                <td style="color:var(--accent-cyan); font-weight:700;">${r.remainder}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div style="margin-top:10px; font-size:0.82rem; color:var(--text-muted);">${st.summary}</div>
      `;
    } else if (st.type === 'multiplication_table') {
      html += `
        <table class="division-table">
          <thead>
            <tr><th>Operasi Perkalian (×2)</th><th>Hasil</th><th>Angka Bulat (Carry)</th></tr>
          </thead>
          <tbody>
            ${st.rows.map(r => `
              <tr>
                <td>${r.current} × 2</td>
                <td><strong>${r.result}</strong></td>
                <td style="color:var(--accent-cyan); font-weight:700;">${r.carry}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div style="margin-top:10px; font-size:0.82rem; color:var(--text-muted);">${st.summary}</div>
      `;
    } else if (st.type === 'hex_expansion' || st.type === 'octal_expansion') {
      html += `
        <div style="display:flex; flex-wrap:wrap; gap:12px; margin-top:8px;">
          ${st.intRows.map(r => `
            <div style="background:var(--bg-input); padding:8px 14px; border-radius:6px; text-align:center;">
              <div style="font-size:1.1rem; font-weight:800; color:#ffffff;">${r.char}</div>
              <div style="color:var(--accent-cyan); font-family:var(--font-mono); font-size:0.9rem;">${r.bits}₂</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    html += `</div>`;
  });

  // Step 2 Details: Grouping
  html += `
    <div class="step-card" style="border-left-color:var(--accent-purple);">
      <div class="step-number" style="color:var(--accent-purple);">Langkah 2: Transformasi dari Central Biner</div>
      <div class="step-desc">Semua target sistem dibentuk langsung dari bit biner:</div>
      <ul style="padding-left:20px; font-size:0.88rem; color:var(--text-secondary); line-height:1.7;">
        <li><strong>Heksadesimal (Basis 16 = 2⁴):</strong> Ambil deretan biner, kelompokkan per <strong>4 bit (nibble)</strong> dari posisi LSB (kanan ke kiri) untuk bilangan bulat, dan dari radix point (kiri ke kanan) untuk pecahan. Tambahkan padding 0 bila bit kurang.</li>
        <li><strong>Oktal (Basis 8 = 2³):</strong> Kelompokkan per <strong>3 bit</strong> dari LSB. Tambahkan padding 0 bila bit kurang.</li>
        <li><strong>Desimal (Basis 10):</strong> Kalikan setiap bit b<sub>i</sub> dengan bobot posisinya 2<sup>i</sup>, lalu jumlahkan seluruh hasilnya.</li>
      </ul>
    </div>
  `;

  container.innerHTML = html;
}

/* ==========================================================================
   3. INTERACTIVE BIT SWITCH BOARD (8-BIT REGISTER)
   ========================================================================== */
function initBitBoard() {
  renderBitBoard();
}

function renderBitBoard() {
  const container = document.getElementById('bit_cells_row');
  if (!container) return;

  let html = '';
  const n = AppState.bitBoard.length;

  for (let i = 0; i < n; i++) {
    const bit = AppState.bitBoard[i];
    const power = n - 1 - i;
    const weight = 2 ** power;
    const isMSB = i === 0;
    const isLSB = i === n - 1;

    // Add nibble divider in the middle
    if (i === 4 && n === 8) {
      html += `<div class="nibble-divider"></div>`;
    }

    html += `
      <div class="bit-card-item">
        <span class="bit-weight-label">2^${power}<br>(${weight})</span>
        <button class="bit-switch-btn ${bit === 1 ? 'active' : ''}" onclick="toggleBit(${i})">
          ${bit}
        </button>
        <span class="bit-meta-badge ${isMSB ? 'msb' : (isLSB ? 'lsb' : '')}">
          ${isMSB ? 'MSB' : (isLSB ? 'LSB' : 'b' + power)}
        </span>
      </div>
    `;
  }

  container.innerHTML = html;

  // Sync board to live converter
  const binaryStr = AppState.bitBoard.join('');
  const unsignedDec = parseInt(binaryStr, 2);
  const hexVal = unsignedDec.toString(16).toUpperCase().padStart(2, '0');
  const octVal = unsignedDec.toString(8).padStart(3, '0');

  const boardHexElem = document.getElementById('board_res_hex');
  const boardOctElem = document.getElementById('board_res_oct');
  const boardDecElem = document.getElementById('board_res_dec');

  if (boardHexElem) boardHexElem.textContent = `0x${hexVal}`;
  if (boardOctElem) boardOctElem.textContent = `0o${octVal}`;
  if (boardDecElem) boardDecElem.textContent = `${unsignedDec}`;
}

function toggleBit(index) {
  AppState.bitBoard[index] = AppState.bitBoard[index] === 1 ? 0 : 1;
  renderBitBoard();

  // Also auto-update central hub if user is working on binary
  const binaryStr = AppState.bitBoard.join('');
  setHubPreset(binaryStr, 2);
}

function setBoardPattern(pattern) {
  if (pattern === 'CLEAR') {
    AppState.bitBoard = [0, 0, 0, 0, 0, 0, 0, 0];
  } else if (pattern === 'SET_ALL') {
    AppState.bitBoard = [1, 1, 1, 1, 1, 1, 1, 1];
  } else if (pattern === 'INVERT') {
    AppState.bitBoard = AppState.bitBoard.map(b => b === 1 ? 0 : 1);
  } else if (pattern === 'ALTERNATE') {
    AppState.bitBoard = [1, 0, 1, 0, 1, 0, 1, 0];
  } else if (pattern === 'INC') {
    let dec = (parseInt(AppState.bitBoard.join(''), 2) + 1) % 256;
    let b = dec.toString(2).padStart(8, '0');
    AppState.bitBoard = b.split('').map(x => parseInt(x));
  }
  renderBitBoard();
  const binaryStr = AppState.bitBoard.join('');
  setHubPreset(binaryStr, 2);
}

/* ==========================================================================
   4. WEEK 2 FEATURES: SIGNED NUMBERS & ARITHMETIC SIMULATOR
   ========================================================================== */
function initWeek2Features() {
  const compInput = document.getElementById('comp_input_val');
  if (compInput) {
    compInput.addEventListener('input', (e) => {
      AppState.compInput = e.target.value;
      triggerComplementCalculation();
    });
  }

  const arithAInput = document.getElementById('arith_val_a');
  const arithBInput = document.getElementById('arith_val_b');
  const arithOpSelect = document.getElementById('arith_op_select');

  if (arithAInput) {
    arithAInput.addEventListener('input', (e) => {
      AppState.arithA = e.target.value;
      triggerArithmeticCalculation();
    });
  }
  if (arithBInput) {
    arithBInput.addEventListener('input', (e) => {
      AppState.arithB = e.target.value;
      triggerArithmeticCalculation();
    });
  }
  if (arithOpSelect) {
    arithOpSelect.addEventListener('change', (e) => {
      AppState.arithOp = e.target.value;
      triggerArithmeticCalculation();
    });
  }
}

function setCompPreset(val) {
  AppState.compInput = val.toString();
  const inp = document.getElementById('comp_input_val');
  if (inp) inp.value = val;
  triggerComplementCalculation();
}

function triggerComplementCalculation() {
  const errorBox = document.getElementById('comp_error_msg');
  if (errorBox) errorBox.style.display = 'none';

  try {
    const res = SignedComplementEngine.getSignedRepresentations(AppState.compInput, 8);
    renderComplementResults(res);
  } catch (err) {
    if (errorBox) {
      errorBox.textContent = err.message;
      errorBox.style.display = 'block';
    }
  }
}

function renderComplementResults(res) {
  // 1. Update 3-Scheme Cards
  const smBits = document.getElementById('card_sm_bits');
  const c1Bits = document.getElementById('card_c1_bits');
  const c2Bits = document.getElementById('card_c2_bits');

  if (smBits) smBits.textContent = res.sm.bits;
  if (c1Bits) c1Bits.textContent = res.c1.bits;
  if (c2Bits) c2Bits.textContent = res.c2.bits;

  // 2. Update 3-Step Pipeline
  const step1 = document.getElementById('c2_step1_bits');
  const step2 = document.getElementById('c2_step2_bits');
  const step3 = document.getElementById('c2_step3_bits');

  if (step1) step1.textContent = res.c2.step1;
  if (step2) step2.textContent = res.c2.step2_not;
  if (step3) step3.textContent = res.c2.step3_plus1;

  // 3. Update Hex & Octal Representations
  const hexElem = document.getElementById('c2_hex_val');
  const octElem = document.getElementById('c2_oct_val');
  const ext16Elem = document.getElementById('c2_ext16_val');

  if (hexElem) hexElem.textContent = `${res.c2.hexVal} (2⁸ - |${res.decimalVal}| = ${res.c2.unsignedVal})`;
  if (octElem) octElem.textContent = `${res.c2.octVal}`;
  if (ext16Elem) ext16Elem.textContent = res.c2.extended16;
}

function triggerArithmeticCalculation() {
  try {
    const res = SignedComplementEngine.performArithmeticC2(
      AppState.arithA,
      AppState.arithB,
      AppState.arithOp,
      8
    );
    renderArithmeticResults(res);
  } catch (err) {
    console.error('Arithmetic calculation error:', err);
  }
}

function renderArithmeticResults(res) {
  const carryRow = document.getElementById('arith_row_carry');
  const aRow = document.getElementById('arith_row_a');
  const bRow = document.getElementById('arith_row_b');
  const sumRow = document.getElementById('arith_row_sum');
  const overflowFlag = document.getElementById('flag_overflow');
  const signFlag = document.getElementById('flag_sign');
  const zeroFlag = document.getElementById('flag_zero');
  const summaryBox = document.getElementById('arith_summary_text');

  if (carryRow) carryRow.textContent = res.carries.split('').join(' ');
  if (aRow) aRow.textContent = `${res.binA.split('').join(' ')}  (+${res.numA})`;
  if (bRow) {
    const opSign = res.operation === 'SUB' ? 'C2(B)' : 'B';
    bRow.textContent = `${res.binB.split('').join(' ')}  (${res.operation === 'SUB' ? '-' : '+'}${res.numB})`;
  }
  if (sumRow) sumRow.textContent = `${res.resultBin.split('').join(' ')}  (= ${res.actualDecimal}₁₀)`;

  // Flags
  if (overflowFlag) {
    overflowFlag.className = `flag-badge ${res.overflow ? 'active-flag' : ''}`;
    overflowFlag.innerHTML = `⚠️ Overflow (V): ${res.overflow ? 'YES (OVERFLOW!)' : 'NO'}`;
  }
  if (signFlag) {
    signFlag.className = `flag-badge ${res.isNegative ? 'active-flag' : ''}`;
    signFlag.innerHTML = `🏷️ Sign Bit (MSB): ${res.resultBin[0]}`;
  }
  if (zeroFlag) {
    zeroFlag.className = `flag-badge ${res.zeroFlag ? 'active-flag' : ''}`;
    zeroFlag.innerHTML = `⭕ Zero Flag (Z): ${res.zeroFlag ? 'YES' : 'NO'}`;
  }

  if (summaryBox) {
    if (res.overflow) {
      summaryBox.innerHTML = `
        <span style="color:var(--accent-rose); font-weight:700;">⚠️ TERDETEKSI OVERFLOW!</span><br>
        Hasil yang diharapkan adalah <strong>${res.theoreticalResult}</strong>, namun register 8-bit Two's Complement hanya mampu menampung rentang [-128 s.d. +127].<br>
        Deteksi: Carry ke MSB (${res.carryIntoMSB}) ⊕ Carry keluar MSB (${res.carryOutOfMSB}) = 1.
      `;
    } else {
      summaryBox.innerHTML = `
        <span style="color:var(--accent-emerald); font-weight:700;">✅ OPERASI VALID!</span><br>
        Hasil biner <strong>${res.resultBin}₂</strong> setara dengan nilai desimal <strong>${res.actualDecimal}₁₀</strong> sesuai perhitungan matematika murni.
      `;
    }
  }
}

// Global functions attached to window
window.switchWeek = switchWeek;
window.switchSubmenu = switchSubmenu;
window.setHubPreset = setHubPreset;
window.toggleBit = toggleBit;
window.setBoardPattern = setBoardPattern;
window.setCompPreset = setCompPreset;

/* ==========================================================================
   5. WEEK 3 FEATURES: REALTIME LOGIC GATES & COMBINATIONAL CIRCUITS
   ========================================================================== */
function initWeek3Features() {
  if (window.LogicGateEngine) {
    LogicGateEngine.currentGate = AppState.logicGate;
    LogicGateEngine.inputA = AppState.gateInputA;
    LogicGateEngine.inputB = AppState.gateInputB;
  }
}

function selectLogicGate(gateKey) {
  AppState.logicGate = gateKey;
  if (window.LogicGateEngine) {
    LogicGateEngine.currentGate = gateKey;
  }
  document.querySelectorAll('.gate-pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.gate === gateKey);
  });
  renderLogicGateSimulator();
}

function toggleGateInput(pin) {
  if (pin === 'A') {
    AppState.gateInputA = AppState.gateInputA === 1 ? 0 : 1;
    if (window.LogicGateEngine) LogicGateEngine.inputA = AppState.gateInputA;
  } else if (pin === 'B') {
    AppState.gateInputB = AppState.gateInputB === 1 ? 0 : 1;
    if (window.LogicGateEngine) LogicGateEngine.inputB = AppState.gateInputB;
  }
  renderLogicGateSimulator();
}

function setGateInputRow(a, b = 0) {
  AppState.gateInputA = a;
  AppState.gateInputB = b;
  if (window.LogicGateEngine) {
    LogicGateEngine.inputA = a;
    LogicGateEngine.inputB = b;
  }
  renderLogicGateSimulator();
}

function selectCircuitMode(mode) {
  AppState.activeCircuitMode = mode;
  document.querySelectorAll('.circuit-mode-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.mode === mode);
  });

  const singleView = document.getElementById('circuit_single_view');
  const lat3View = document.getElementById('circuit_latihan3_view');
  const lat4View = document.getElementById('circuit_latihan4_view');

  if (singleView) singleView.style.display = mode === 'single' ? 'block' : 'none';
  if (lat3View) lat3View.style.display = mode === 'latihan3' ? 'block' : 'none';
  if (lat4View) lat4View.style.display = mode === 'latihan4' ? 'block' : 'none';

  if (mode === 'single') {
    renderLogicGateSimulator();
  } else if (mode === 'latihan3') {
    renderCircuitLatihan3();
  } else if (mode === 'latihan4') {
    renderCircuitLatihan4();
  }
}

function renderLogicGateSimulator() {
  if (!window.LogicGateEngine) return;
  const ev = LogicGateEngine.evaluateCurrentGate();

  // 1. Render SVG Canvas
  const svgContainer = document.getElementById('gate_svg_container');
  if (svgContainer) {
    svgContainer.innerHTML = LogicGateEngine.renderGateSVG(ev.gate, ev.a, ev.b, ev.out);
  }

  // 2. Update Switches
  const btnA = document.getElementById('gate_btn_a');
  const txtA = document.getElementById('gate_txt_a');
  const btnB = document.getElementById('gate_btn_b');
  const txtB = document.getElementById('gate_txt_b');
  const rowB = document.getElementById('gate_input_b_row');

  if (btnA && txtA) {
    btnA.classList.toggle('active', ev.a === 1);
    txtA.textContent = ev.a;
    txtA.style.color = ev.a === 1 ? 'var(--accent-emerald)' : 'var(--text-muted)';
  }

  const isSingle = ev.info.inputsCount === 1;
  if (rowB) {
    rowB.style.display = isSingle ? 'none' : 'flex';
  }
  if (btnB && txtB) {
    btnB.classList.toggle('active', ev.b === 1);
    txtB.textContent = ev.b;
    txtB.style.color = ev.b === 1 ? 'var(--accent-emerald)' : 'var(--text-muted)';
  }

  // 3. Update Truth Table
  const tableBody = document.getElementById('gate_truth_table_body');
  if (tableBody) {
    if (isSingle) {
      tableBody.innerHTML = `
        <tr class="${ev.a === 0 ? 'active-truth-row' : ''}" onclick="setGateInputRow(0)">
          <td>0</td>
          <td><strong style="color:var(--accent-cyan);">1</strong></td>
          <td>${ev.a === 0 ? '👉 Aktif' : ''}</td>
        </tr>
        <tr class="${ev.a === 1 ? 'active-truth-row' : ''}" onclick="setGateInputRow(1)">
          <td>1</td>
          <td><strong style="color:var(--accent-cyan);">0</strong></td>
          <td>${ev.a === 1 ? '👉 Aktif' : ''}</td>
        </tr>
      `;
    } else {
      tableBody.innerHTML = ev.info.truthTable.map(row => {
        const isActive = (row.a === ev.a && row.b === ev.b);
        return `
          <tr class="${isActive ? 'active-truth-row' : ''}" onclick="setGateInputRow(${row.a}, ${row.b})">
            <td>${row.a}</td>
            <td>${row.b}</td>
            <td><strong style="color:var(--accent-cyan);">${row.out}</strong></td>
            <td>${isActive ? '👉 Aktif' : ''}</td>
          </tr>
        `;
      }).join('');
    }
  }

  // 4. Update Header Details
  const gateTitle = document.getElementById('gate_title_display');
  const gateExpr = document.getElementById('gate_expr_display');
  const gateDesc = document.getElementById('gate_desc_display');
  const liveCalc = document.getElementById('gate_live_calc_display');

  if (gateTitle) gateTitle.textContent = ev.info.name;
  if (gateExpr) gateExpr.textContent = ev.info.expression;
  if (gateDesc) gateDesc.textContent = ev.info.description;

  if (liveCalc) {
    if (isSingle) {
      liveCalc.innerHTML = `Substitusi nilai aktif: <strong>F = NOT(${ev.a}) = ${ev.out}</strong> (${ev.out === 1 ? 'HIGH / 5V' : 'LOW / 0V'})`;
    } else {
      let opSymbol = '·';
      if (ev.gate === 'OR' || ev.gate === 'NOR') opSymbol = '+';
      if (ev.gate === 'XOR' || ev.gate === 'XNOR') opSymbol = '⊕';
      liveCalc.innerHTML = `Substitusi nilai aktif: <strong>A = ${ev.a}</strong>, <strong>B = ${ev.b}</strong> → <strong>F = ${ev.out}</strong> (${ev.out === 1 ? 'HIGH / 5V' : 'LOW / 0V'})`;
    }
  }
}

function toggleCircuitInput(circuitKey, pin) {
  if (circuitKey === 'latihan3') {
    if (pin === 'A') AppState.circuit3A = AppState.circuit3A === 1 ? 0 : 1;
    if (pin === 'B') AppState.circuit3B = AppState.circuit3B === 1 ? 0 : 1;
    renderCircuitLatihan3();
  } else if (circuitKey === 'latihan4') {
    if (pin === 'A') AppState.circuit4A = AppState.circuit4A === 1 ? 0 : 1;
    if (pin === 'B') AppState.circuit4B = AppState.circuit4B === 1 ? 0 : 1;
    renderCircuitLatihan4();
  }
}

function setCircuitInputRow(circuitKey, a, b) {
  if (circuitKey === 'latihan3') {
    AppState.circuit3A = a;
    AppState.circuit3B = b;
    renderCircuitLatihan3();
  } else if (circuitKey === 'latihan4') {
    AppState.circuit4A = a;
    AppState.circuit4B = b;
    renderCircuitLatihan4();
  }
}

function renderCircuitLatihan3() {
  if (!window.LogicGateEngine) return;
  const a = AppState.circuit3A;
  const b = AppState.circuit3B;
  const res = LogicGateEngine.evaluateCircuitLatihan3(a, b);

  const container = document.getElementById('circuit3_svg_container');
  if (container) {
    container.innerHTML = LogicGateEngine.renderCircuitLatihan3SVG(a, b);
  }

  const btnA = document.getElementById('c3_btn_a');
  const txtA = document.getElementById('c3_txt_a');
  const btnB = document.getElementById('c3_btn_b');
  const txtB = document.getElementById('c3_txt_b');

  if (btnA && txtA) {
    btnA.classList.toggle('active', a === 1);
    txtA.textContent = a;
    txtA.style.color = a === 1 ? 'var(--accent-emerald)' : 'var(--text-muted)';
  }
  if (btnB && txtB) {
    btnB.classList.toggle('active', b === 1);
    txtB.textContent = b;
    txtB.style.color = b === 1 ? 'var(--accent-emerald)' : 'var(--text-muted)';
  }

  const tableBody = document.getElementById('c3_truth_table_body');
  if (tableBody) {
    const rows = [
      { a: 0, b: 0, c: 1, d: 0, q: 0 },
      { a: 0, b: 1, c: 1, d: 1, q: 1 },
      { a: 1, b: 0, c: 1, d: 1, q: 1 },
      { a: 1, b: 1, c: 0, d: 0, q: 1 }
    ];
    tableBody.innerHTML = rows.map(r => {
      const active = (r.a === a && r.b === b);
      return `
        <tr class="${active ? 'active-truth-row' : ''}" onclick="setCircuitInputRow('latihan3', ${r.a}, ${r.b})">
          <td>${r.a}</td>
          <td>${r.b}</td>
          <td style="color:var(--accent-rose); font-weight:700;">${r.c}</td>
          <td style="color:var(--accent-purple); font-weight:700;">${r.d}</td>
          <td><strong style="color:var(--accent-cyan); font-size:1.05rem;">${r.q}</strong></td>
          <td>${active ? '👉 Aktif' : ''}</td>
        </tr>
      `;
    }).join('');
  }
}

function renderCircuitLatihan4() {
  if (!window.LogicGateEngine) return;
  const a = AppState.circuit4A;
  const b = AppState.circuit4B;
  const res = LogicGateEngine.evaluateCircuitLatihan4(a, b);

  const container = document.getElementById('circuit4_svg_container');
  if (container) {
    container.innerHTML = LogicGateEngine.renderCircuitLatihan4SVG(a, b);
  }

  const btnA = document.getElementById('c4_btn_a');
  const txtA = document.getElementById('c4_txt_a');
  const btnB = document.getElementById('c4_btn_b');
  const txtB = document.getElementById('c4_txt_b');

  if (btnA && txtA) {
    btnA.classList.toggle('active', a === 1);
    txtA.textContent = a;
    txtA.style.color = a === 1 ? 'var(--accent-emerald)' : 'var(--text-muted)';
  }
  if (btnB && txtB) {
    btnB.classList.toggle('active', b === 1);
    txtB.textContent = b;
    txtB.style.color = b === 1 ? 'var(--accent-emerald)' : 'var(--text-muted)';
  }

  const tableBody = document.getElementById('c4_truth_table_body');
  if (tableBody) {
    const rows = [
      { a: 0, b: 0, c: 0, d: 0, q: 0 },
      { a: 0, b: 1, c: 0, d: 1, q: 1 },
      { a: 1, b: 0, c: 0, d: 1, q: 1 },
      { a: 1, b: 1, c: 1, d: 1, q: 0 }
    ];
    tableBody.innerHTML = rows.map(r => {
      const active = (r.a === a && r.b === b);
      return `
        <tr class="${active ? 'active-truth-row' : ''}" onclick="setCircuitInputRow('latihan4', ${r.a}, ${r.b})">
          <td>${r.a}</td>
          <td>${r.b}</td>
          <td style="color:var(--accent-blue); font-weight:700;">${r.c}</td>
          <td style="color:var(--accent-cyan); font-weight:700;">${r.d}</td>
          <td><strong style="color:var(--accent-purple); font-size:1.05rem;">${r.q}</strong></td>
          <td>${active ? '👉 Aktif' : ''}</td>
        </tr>
      `;
    }).join('');
  }
}

/* ==========================================================================
   6. WEEK 4 FEATURES: KARNAUGH MAP (K-MAP) SOLVER & SENSORS
   ========================================================================== */
function initWeek4Features() {
  if (window.KMapEngine) {
    KMapEngine.init();
    KMapEngine.loadPreset('5var_preset1_corner_3d');
    AppState.kmapVars = KMapEngine.numVars;
    updatePresetVisibility(KMapEngine.numVars);
  }
}

function setKMapVars(vars) {
  AppState.kmapVars = vars;
  if (window.KMapEngine) {
    KMapEngine.resetCells(vars);
    if (vars === 5) {
      KMapEngine.loadPreset('5var_preset1_corner_3d');
    }
  }
  document.querySelectorAll('.kmap-var-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.vars, 10) === vars);
  });
  updatePresetVisibility(vars);
  renderKMapSimulator();
}

function updatePresetVisibility(vars) {
  const container234 = document.getElementById('kmap_presets_234');
  const container5 = document.getElementById('kmap_presets_5');
  const guideCard5 = document.getElementById('kmap_5var_guide_card');
  if (container234 && container5) {
    if (vars === 5) {
      container234.style.display = 'none';
      container5.style.display = 'flex';
      if (guideCard5) guideCard5.style.display = 'block';
    } else {
      container234.style.display = 'flex';
      container5.style.display = 'none';
      if (guideCard5) guideCard5.style.display = 'none';
    }
  }
}

function loadKMapPreset(presetName) {
  if (window.KMapEngine) {
    KMapEngine.loadPreset(presetName);
    AppState.kmapVars = KMapEngine.numVars;
    document.querySelectorAll('.kmap-var-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.vars, 10) === KMapEngine.numVars);
    });
    updatePresetVisibility(KMapEngine.numVars);
  }
  renderKMapSimulator();
}

function toggleKMapCell(mIndex) {
  if (window.KMapEngine) {
    KMapEngine.toggleCell(mIndex);
  }
  renderKMapSimulator();
}

function clearKMapCells() {
  if (window.KMapEngine) {
    KMapEngine.clearAll();
  }
  renderKMapSimulator();
}

function fillAllKMapCells() {
  if (window.KMapEngine) {
    KMapEngine.fillAll();
  }
  renderKMapSimulator();
}

function invertKMapCells() {
  if (window.KMapEngine) {
    KMapEngine.invertAll();
  }
  renderKMapSimulator();
}

function randomKMapCells() {
  if (window.KMapEngine) {
    KMapEngine.randomize();
  }
  renderKMapSimulator();
}

function highlightKMapGroup(gIdx, isHighlight) {
  const sol = window.currentKMapSolution;
  if (!sol || !sol.groups || !sol.groups[gIdx]) return;
  const group = sol.groups[gIdx];
  group.cells.forEach(m => {
    const el = document.getElementById(`kmap_cell_${m}`);
    if (el) {
      if (isHighlight) {
        el.classList.add('cell-group-hovered');
        el.style.borderColor = group.color.border;
        el.style.boxShadow = `0 0 20px ${group.color.border}`;
      } else {
        el.classList.remove('cell-group-hovered');
        const belongingGroups = sol.groups.filter(g => g.cells.includes(m));
        if (belongingGroups.length > 0) {
          el.style.borderColor = belongingGroups[0].color.border;
          el.style.boxShadow = `0 0 10px ${belongingGroups[0].color.bg}`;
        } else {
          el.style.borderColor = '';
          el.style.boxShadow = '';
        }
      }
    }
  });
}

function renderKMapSimulator() {
  if (!window.KMapEngine) return;
  const vars = AppState.kmapVars;
  const dim = KMapEngine.getGridDimensions(vars);
  const container = document.getElementById('kmap_grid_container');
  if (!container) return;

  const sol = KMapEngine.solve();
  window.currentKMapSolution = sol;

  if (vars === 5) {
    // 5-VARIABEL RENDERING: Dua Sub-Peta Berdampingan (A=0 dan A=1)
    let html = `<div class="kmap-5var-wrapper">`;

    dim.layers.forEach(ly => {
      html += `
        <div class="kmap-submap-card layer-${ly.layer}">
          <div class="kmap-submap-header">
            <div class="submap-title-row">
              <span class="submap-pill pill-${ly.layer}">Sub-Peta ${ly.layer + 1}: ${ly.label}</span>
              <span class="submap-range">${ly.subLabel}</span>
            </div>
            <div class="submap-subtitle">Sumbu Baris: <strong>BC</strong> | Sumbu Kolom: <strong>DE</strong></div>
          </div>

          <div class="kmap-table-responsive">
            <table class="kmap-table">
              <thead>
                <tr>
                  <th class="kmap-corner-cell">BC \\ DE</th>
      `;
      dim.cols.forEach(col => {
        html += `<th class="kmap-header-cell">${col.label}</th>`;
      });
      html += `</tr></thead><tbody>`;

      dim.rows.forEach(row => {
        html += `<tr>`;
        html += `<th class="kmap-header-cell">${row.label}</th>`;
        dim.cols.forEach(col => {
          const m = KMapEngine.getMintermIndex(row.gray, col.gray, 5, ly.layer);
          const val = KMapEngine.cells[m];
          const valClass = val === 1 ? 'val-1' : (val === 'X' ? 'val-x' : 'val-0');

          const belongingGroups = sol.groups.filter(g => g.cells.includes(m));
          let borderStyle = '';
          if (belongingGroups.length > 0) {
            const topColor = belongingGroups[0].color.border;
            borderStyle = `border-color:${topColor}; box-shadow:0 0 10px ${belongingGroups[0].color.bg};`;
          }

          html += `
            <td class="kmap-data-cell ${valClass}" id="kmap_cell_${m}" data-minterm="${m}" style="${borderStyle}" onclick="toggleKMapCell(${m})" title="Minterm m${m} (Klik untuk ubah: 0 -> 1 -> X)">
              <span class="kmap-minterm-tag">m${m}</span>
              <span class="kmap-cell-val">${val}</span>
            </td>
          `;
        });
        html += `</tr>`;
      });

      html += `</tbody></table></div></div>`;
    });

    html += `</div>`;
    container.innerHTML = html;

  } else {
    // 2, 3, 4 VARIABEL RENDERING (Single Table)
    let tableHtml = `<table class="kmap-table">`;
    tableHtml += `<thead><tr>`;
    tableHtml += `<th class="kmap-corner-cell">${dim.rowVars} \\ ${dim.colVars}</th>`;
    dim.cols.forEach(col => {
      tableHtml += `<th class="kmap-header-cell">${col.label}</th>`;
    });
    tableHtml += `</tr></thead><tbody>`;

    dim.rows.forEach(row => {
      tableHtml += `<tr>`;
      tableHtml += `<th class="kmap-header-cell">${row.label}</th>`;
      dim.cols.forEach(col => {
        const m = KMapEngine.getMintermIndex(row.gray, col.gray, vars);
        const val = KMapEngine.cells[m];
        const valClass = val === 1 ? 'val-1' : (val === 'X' ? 'val-x' : 'val-0');

        const belongingGroups = sol.groups.filter(g => g.cells.includes(m));
        let borderStyle = '';
        if (belongingGroups.length > 0) {
          const topColor = belongingGroups[0].color.border;
          borderStyle = `border-color:${topColor}; box-shadow:0 0 10px ${belongingGroups[0].color.bg};`;
        }

        tableHtml += `
          <td class="kmap-data-cell ${valClass}" id="kmap_cell_${m}" data-minterm="${m}" style="${borderStyle}" onclick="toggleKMapCell(${m})" title="Minterm m${m} (Klik untuk ubah: 0 -> 1 -> X)">
            <span class="kmap-minterm-tag">m${m}</span>
            <span class="kmap-cell-val">${val}</span>
          </td>
        `;
      });
      tableHtml += `</tr>`;
    });

    tableHtml += `</tbody></table>`;
    container.innerHTML = tableHtml;
  }

  // Update Equation Display
  const eqDisplay = document.getElementById('kmap_equation_display');
  if (eqDisplay) {
    eqDisplay.innerHTML = `<span style="color:var(--accent-cyan);">Q =</span> ${sol.expression}`;
  }

  // Update Groups List with Badges and Interactive Hover
  const groupsList = document.getElementById('kmap_groups_list');
  if (groupsList) {
    if (sol.groups.length === 0) {
      groupsList.innerHTML = `<span style="color:var(--text-muted); font-size:0.85rem;">Seluruh sel bernilai 0 (Output = 0).</span>`;
    } else {
      groupsList.innerHTML = sol.groups.map((g, gIdx) => {
        let badgeHtml = '';
        if (vars === 5) {
          if (g.is3D) {
            badgeHtml = `<span class="group-pill-badge badge-3d">🔗 3D (A=0 & A=1)</span>`;
          } else if (g.layers && g.layers.length === 1) {
            badgeHtml = `<span class="group-pill-badge badge-layer">Lapisan A=${g.layers[0]}</span>`;
          }
        }
        return `
          <div class="kmap-group-pill" id="group_pill_${gIdx}" 
               onmouseenter="highlightKMapGroup(${gIdx}, true)" 
               onmouseleave="highlightKMapGroup(${gIdx}, false)"
               style="border:1px solid ${g.color.border}; background:${g.color.bg}; color:${g.color.border}; cursor:pointer;"
               title="Sorot untuk melihat sel grup ini pada peta">
            <span>Grup (${g.cells.length} sel): <strong>${g.term}</strong></span>
            ${badgeHtml}
            <span style="opacity:0.75; font-size:0.72rem;">[m${g.cells.join(', m')}]</span>
          </div>
        `;
      }).join('');
    }
  }

  // Update Minterm Summary
  const mintermSummary = document.getElementById('kmap_minterm_summary');
  if (mintermSummary) {
    const mStr = sol.minterms.length > 0 ? `Σm(${sol.minterms.join(', ')})` : '0';
    const dStr = sol.dontCares.length > 0 ? ` + d(${sol.dontCares.join(', ')})` : '';
    mintermSummary.textContent = `${mStr}${dStr}`;
  }
}

function toggleSensor(sensorKey) {
  AppState[sensorKey] = AppState[sensorKey] === 1 ? 0 : 1;
  updateSensorSimulation();
}

function updateSensorSimulation() {
  const A = AppState.sensorDoor;
  const B = AppState.sensorWindow;
  const C = AppState.sensorMotion;
  const D = AppState.sensorSmoke;

  const btnA = document.getElementById('sensor_btn_door');
  const btnB = document.getElementById('sensor_btn_window');
  const btnC = document.getElementById('sensor_btn_motion');
  const btnD = document.getElementById('sensor_btn_smoke');

  if (btnA) btnA.classList.toggle('active', A === 1);
  if (btnB) btnB.classList.toggle('active', B === 1);
  if (btnC) btnC.classList.toggle('active', C === 1);
  if (btnD) btnD.classList.toggle('active', D === 1);

  // Alarm function: Q = D + AC + BC
  const conditionSmoke = (D === 1);
  const conditionDoorMotion = (A === 1 && C === 1);
  const conditionWindowMotion = (B === 1 && C === 1);
  const isAlarm = conditionSmoke || conditionDoorMotion || conditionWindowMotion;

  const indicator = document.getElementById('alarm_indicator_box');
  if (indicator) {
    indicator.classList.toggle('alarm-active', isAlarm);
    if (isAlarm) {
      const reasons = [];
      if (conditionSmoke) reasons.push('⚠️ ASAP TERDETEKSI (D=1)');
      if (conditionDoorMotion) reasons.push('🚪 PINTU TERBUKA + GERAKAN (A·C=1)');
      if (conditionWindowMotion) reasons.push('🪟 JENDELA TERBUKA + GERAKAN (B·C=1)');
      indicator.innerHTML = `
        <div style="font-size:2rem;">🚨</div>
        <div>
          <div style="font-weight:800; color:var(--accent-rose); font-size:1.1rem;">ALARM MENYALA (Q = 1)!</div>
          <div style="font-size:0.85rem; color:var(--text-secondary); margin-top:2px;">
            Pemicu: <strong>${reasons.join(' | ')}</strong>
          </div>
        </div>
      `;
    } else {
      indicator.innerHTML = `
        <div style="font-size:2rem;">🛡️</div>
        <div>
          <div style="font-weight:800; color:var(--accent-emerald); font-size:1.1rem;">SISTEM AMAN (Q = 0)</div>
          <div style="font-size:0.85rem; color:var(--text-muted); margin-top:2px;">
            Pintu tertutup / tidak ada gerakan mencurigakan / tidak ada asap.
          </div>
        </div>
      `;
    }
  }
}

// Global functions attached to window for event listeners
window.selectLogicGate = selectLogicGate;
window.toggleGateInput = toggleGateInput;
window.setGateInputRow = setGateInputRow;
window.selectCircuitMode = selectCircuitMode;
window.toggleCircuitInput = toggleCircuitInput;
window.setCircuitInputRow = setCircuitInputRow;
window.setKMapVars = setKMapVars;
window.loadKMapPreset = loadKMapPreset;
window.toggleKMapCell = toggleKMapCell;
window.clearKMapCells = clearKMapCells;
window.fillAllKMapCells = fillAllKMapCells;
window.invertKMapCells = invertKMapCells;
window.randomKMapCells = randomKMapCells;
window.highlightKMapGroup = highlightKMapGroup;
window.toggleSensor = toggleSensor;
window.updatePresetVisibility = updatePresetVisibility;


