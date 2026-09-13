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
    2: 'sub_2_1'
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
  arithOp: 'SUB'
};

document.addEventListener('DOMContentLoaded', () => {
  initWeekNavigation();
  initSubmenuNavigation();
  initCentralHub();
  initBitBoard();
  initWeek2Features();
  initMobileDrawer();

  // Render official slide exercises
  if (window.QuizEngine) {
    QuizEngine.renderQuizList('quiz_container_w1', QuizEngine.officialExercisesWeek1);
    QuizEngine.renderQuizList('quiz_container_w2', QuizEngine.officialExercisesWeek2);
  }

  // Initial trigger for live visualizers
  triggerHubCalculation();
  triggerComplementCalculation();
  triggerArithmeticCalculation();
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

  // Show/hide submenus bar for active week
  const subnavW1 = document.getElementById('subnav_week_1');
  const subnavW2 = document.getElementById('subnav_week_2');
  if (subnavW1) subnavW1.style.display = weekNum === 1 ? 'flex' : 'none';
  if (subnavW2) subnavW2.style.display = weekNum === 2 ? 'flex' : 'none';

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
        <li><strong>Desimal (Basis 10):</strong> Kalikan setiap bit $b_i$ dengan bobot posisinya $2^i$, lalu jumlahkan seluruh hasilnya.</li>
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
