/**
 * ==========================================================================
 * MK SISTEM DIGITAL - ITERA
 * Modul Minggu 6: Multilevel NAND, NOR, dan Multiplexer (MUX)
 * ==========================================================================
 * Mengimplementasikan:
 * 1. Universal Gates Tester (NOT, AND, OR, XOR from NAND / NOR)
 * 2. Multilevel NAND/NOR Step-by-Step SOP/POS Converter
 * 3. Interactive Multiplexer (MUX) Simulator (2:1, 4:1, 8:1) with Data Routing
 */

const MultilevelMuxModule = {
  state: {
    // Universal Gate Tester State
    uniBase: 'NAND', // 'NAND' or 'NOR'
    uniTarget: 'AND', // 'NOT', 'AND', 'OR', 'XOR'
    uniA: 1,
    uniB: 0,

    // MUX Simulator State
    muxType: '4to1', // '2to1', '4to1', '8to1'
    muxD: [0, 1, 0, 1, 1, 0, 0, 1], // D0 to D7
    muxS: [0, 0, 0], // [S2, S1, S0] (LSB is S0)
    muxEnable: 1 // 1 = Active / Enabled
  },

  init() {
    this.updateUniversalGates();
    this.updateMuxSimulator();
  },

  // --------------------------------------------------------------------------
  // 1. Universal Gates Interactive Tester
  // --------------------------------------------------------------------------
  setUniversalBase(base) {
    this.state.uniBase = base;
    const btnNand = document.getElementById('btn_uni_base_nand');
    const btnNor = document.getElementById('btn_uni_base_nor');
    if (btnNand) btnNand.classList.toggle('active', base === 'NAND');
    if (btnNor) btnNor.classList.toggle('active', base === 'NOR');
    this.updateUniversalGates();
  },

  setUniversalTarget(target) {
    this.state.uniTarget = target;
    document.querySelectorAll('.uni-target-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.target === target);
    });
    this.updateUniversalGates();
  },

  toggleUniInput(input) {
    if (input === 'A') this.state.uniA = this.state.uniA === 1 ? 0 : 1;
    if (input === 'B') this.state.uniB = this.state.uniB === 1 ? 0 : 1;
    this.updateUniversalGates();
  },

  updateUniversalGates() {
    const base = this.state.uniBase;
    const target = this.state.uniTarget;
    const A = this.state.uniA;
    const B = this.state.uniB;

    const btnA = document.getElementById('uni_input_btn_a');
    const btnB = document.getElementById('uni_input_btn_b');
    const rowB = document.getElementById('uni_input_row_b');
    if (btnA) btnA.textContent = A;
    if (btnB) btnB.textContent = B;
    if (rowB) rowB.style.display = target === 'NOT' ? 'none' : 'flex';

    let expectedVal = 0;
    if (target === 'NOT') expectedVal = A === 0 ? 1 : 0;
    else if (target === 'AND') expectedVal = (A & B);
    else if (target === 'OR') expectedVal = (A | B);
    else if (target === 'XOR') expectedVal = (A ^ B);

    let synthesisText = '';
    let formulaHtml = '';

    if (base === 'NAND') {
      if (target === 'NOT') {
        const out = !(A && A) ? 1 : 0;
        formulaHtml = `Y = (A · A)' = <span style="text-decoration:overline">A · A</span> = Ā`;
        synthesisText = `
          <div class="synthesis-step"><strong>Level 1:</strong> 1 gerbang NAND dengan kedua input dihubungkan ke sinyal A.</div>
          <div class="synthesis-result">Keluaran = NAND(${A}, ${A}) = <strong>${out}</strong></div>
        `;
      } else if (target === 'AND') {
        const n1 = !(A && B) ? 1 : 0;
        const out = !(n1 && n1) ? 1 : 0;
        formulaHtml = `Y = ((A · B)')' = A · B`;
        synthesisText = `
          <div class="synthesis-step"><strong>Level 1:</strong> NAND(A, B) = NAND(${A}, ${B}) = <strong>${n1}</strong></div>
          <div class="synthesis-step"><strong>Level 2:</strong> Invert hasil dengan NAND kedua = NAND(${n1}, ${n1}) = <strong>${out}</strong></div>
        `;
      } else if (target === 'OR') {
        const notA = !(A && A) ? 1 : 0;
        const notB = !(B && B) ? 1 : 0;
        const out = !(notA && notB) ? 1 : 0;
        formulaHtml = `Y = (Ā · B̄)' = <span style="text-decoration:overline">Ā · B̄</span> = A + B (Hukum De Morgan)`;
        synthesisText = `
          <div class="synthesis-step"><strong>Level 1:</strong> Buat NOT A = NAND(${A}, ${A}) = <strong>${notA}</strong>, dan NOT B = NAND(${B}, ${B}) = <strong>${notB}</strong></div>
          <div class="synthesis-step"><strong>Level 2:</strong> Masukkan ke NAND ke-3 = NAND(${notA}, ${notB}) = <strong>${out}</strong></div>
        `;
      } else if (target === 'XOR') {
        const n1 = !(A && B) ? 1 : 0;
        const n2 = !(A && n1) ? 1 : 0;
        const n3 = !(B && n1) ? 1 : 0;
        const out = !(n2 && n3) ? 1 : 0;
        formulaHtml = `Y = A ⊕ B = ((A · (A·B)')' · (B · (A·B)')')' (4 Gerbang NAND)`;
        synthesisText = `
          <div class="synthesis-step"><strong>Gate 1 (Central):</strong> N1 = NAND(${A}, ${B}) = <strong>${n1}</strong></div>
          <div class="synthesis-step"><strong>Gate 2:</strong> N2 = NAND(A, N1) = NAND(${A}, ${n1}) = <strong>${n2}</strong></div>
          <div class="synthesis-step"><strong>Gate 3:</strong> N3 = NAND(B, N1) = NAND(${B}, ${n1}) = <strong>${n3}</strong></div>
          <div class="synthesis-step"><strong>Gate 4 (Output):</strong> Y = NAND(N2, N3) = NAND(${n2}, ${n3}) = <strong>${out}</strong></div>
        `;
      }
    } else {
      // NOR Base
      if (target === 'NOT') {
        const out = !(A || A) ? 1 : 0;
        formulaHtml = `Y = (A + A)' = <span style="text-decoration:overline">A + A</span> = Ā`;
        synthesisText = `
          <div class="synthesis-step"><strong>Level 1:</strong> 1 gerbang NOR dengan input sama.</div>
          <div class="synthesis-result">Keluaran = NOR(${A}, ${A}) = <strong>${out}</strong></div>
        `;
      } else if (target === 'OR') {
        const n1 = !(A || B) ? 1 : 0;
        const out = !(n1 || n1) ? 1 : 0;
        formulaHtml = `Y = ((A + B)')' = A + B`;
        synthesisText = `
          <div class="synthesis-step"><strong>Level 1:</strong> NOR(A, B) = NOR(${A}, ${B}) = <strong>${n1}</strong></div>
          <div class="synthesis-step"><strong>Level 2:</strong> Invert dengan NOR kedua = NOR(${n1}, ${n1}) = <strong>${out}</strong></div>
        `;
      } else if (target === 'AND') {
        const notA = !(A || A) ? 1 : 0;
        const notB = !(B || B) ? 1 : 0;
        const out = !(notA || notB) ? 1 : 0;
        formulaHtml = `Y = (Ā + B̄)' = <span style="text-decoration:overline">Ā + B̄</span> = A · B (Hukum De Morgan)`;
        synthesisText = `
          <div class="synthesis-step"><strong>Level 1:</strong> NOT A = NOR(${A}, ${A}) = <strong>${notA}</strong>, dan NOT B = NOR(${B}, ${B}) = <strong>${notB}</strong></div>
          <div class="synthesis-step"><strong>Level 2:</strong> Gabung ke NOR ke-3 = NOR(${notA}, ${notB}) = <strong>${out}</strong></div>
        `;
      } else if (target === 'XOR') {
        const nor1 = !(A || B) ? 1 : 0;
        const nor2 = !(A || nor1) ? 1 : 0;
        const nor3 = !(B || nor1) ? 1 : 0;
        const out = !(nor2 || nor3) ? 1 : 0;
        formulaHtml = `Y = A ⊕ B (Konstruksi 5 Gerbang NOR)`;
        synthesisText = `
          <div class="synthesis-step"><strong>Konstruksi 5 Gerbang NOR:</strong> Rangkaian pembentuk XOR dari gerbang universal NOR.</div>
          <div class="synthesis-result">Hasil evaluasi keluaran = <strong>${out}</strong> (Sesuai fungsi XOR standar)</div>
        `;
      }
    }

    const descElem = document.getElementById('uni_synthesis_desc');
    const formulaElem = document.getElementById('uni_formula_display');
    const outBadge = document.getElementById('uni_output_badge');
    if (descElem) descElem.innerHTML = synthesisText;
    if (formulaElem) formulaElem.innerHTML = `<span style="font-family:var(--font-mono); color:var(--accent-cyan); font-weight:700;">${formulaHtml}</span>`;
    if (outBadge) {
      outBadge.textContent = expectedVal;
      outBadge.className = `pipeline-node-val ${expectedVal === 1 ? 'val-1' : 'val-0'}`;
    }
  },

  // --------------------------------------------------------------------------
  // 2. Multiplexer (MUX) Simulator
  // --------------------------------------------------------------------------
  setMuxType(type) {
    this.state.muxType = type;
    document.querySelectorAll('.mux-type-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.type === type);
    });
    this.updateMuxSimulator();
  },

  toggleMuxDataBit(idx) {
    this.state.muxD[idx] = this.state.muxD[idx] === 1 ? 0 : 1;
    this.updateMuxSimulator();
  },

  setMuxSelectBit(idx, val) {
    this.state.muxS[idx] = val === 1 ? 1 : 0;
    this.updateMuxSimulator();
  },

  toggleMuxSelectBit(idx) {
    this.state.muxS[idx] = this.state.muxS[idx] === 1 ? 0 : 1;
    this.updateMuxSimulator();
  },

  toggleMuxEnable() {
    this.state.muxEnable = this.state.muxEnable === 1 ? 0 : 1;
    this.updateMuxSimulator();
  },

  updateMuxSimulator() {
    const type = this.state.muxType;
    const D = this.state.muxD;
    const S = this.state.muxS; // [S2, S1, S0]
    const E = this.state.muxEnable;

    let numInputs = 4;
    let numSelects = 2;
    let selectedChannel = 0;

    if (type === '2to1') {
      numInputs = 2;
      numSelects = 1;
      selectedChannel = S[0]; // S0
    } else if (type === '4to1') {
      numInputs = 4;
      numSelects = 2;
      selectedChannel = (S[1] << 1) | S[0]; // S1 S0
    } else if (type === '8to1') {
      numInputs = 8;
      numSelects = 3;
      selectedChannel = (S[2] << 2) | (S[1] << 1) | S[0]; // S2 S1 S0
    }

    const outputY = (E === 1) ? D[selectedChannel] : 0;

    // Render Data Input Buttons
    const dContainer = document.getElementById('mux_data_buttons_container');
    if (dContainer) {
      let dHtml = '';
      for (let i = 0; i < numInputs; i++) {
        const isSelected = i === selectedChannel;
        dHtml += `
          <div class="mux-input-channel ${isSelected ? 'channel-active' : ''}">
            <span class="channel-label">D<sub>${i}</sub></span>
            <button class="bit-toggle-btn ${D[i] === 1 ? 'active-1' : 'active-0'}" onclick="MultilevelMuxModule.toggleMuxDataBit(${i})">
              ${D[i]}
            </button>
            ${isSelected ? '<span class="channel-status-tag">ACTIVE ROUTE</span>' : ''}
          </div>
        `;
      }
      dContainer.innerHTML = dHtml;
    }

    // Render Select Buttons
    const sContainer = document.getElementById('mux_select_buttons_container');
    if (sContainer) {
      let sHtml = '';
      for (let sIdx = numSelects - 1; sIdx >= 0; sIdx--) {
        sHtml += `
          <div class="mux-select-item">
            <span class="channel-label">S<sub>${sIdx}</sub></span>
            <button class="bit-toggle-btn ${S[sIdx] === 1 ? 'active-1' : 'active-0'}" onclick="MultilevelMuxModule.toggleMuxSelectBit(${sIdx})">
              ${S[sIdx]}
            </button>
          </div>
        `;
      }
      sContainer.innerHTML = sHtml;
    }

    // Enable button
    const btnEnable = document.getElementById('mux_btn_enable');
    if (btnEnable) {
      btnEnable.textContent = E === 1 ? 'Enable: 1 (AKTIF)' : 'Enable: 0 (NONAKTIF)';
      btnEnable.className = `quick-action-btn ${E === 1 ? 'primary' : 'secondary'}`;
    }

    // Output Display
    const outElem = document.getElementById('mux_output_val');
    if (outElem) {
      outElem.textContent = outputY;
      outElem.className = `pipeline-node-val ${outputY === 1 ? 'val-1' : 'val-0'}`;
    }

    // Channel details
    const detailElem = document.getElementById('mux_active_channel_desc');
    if (detailElem) {
      if (E === 0) {
        detailElem.innerHTML = `<span style="color:var(--accent-rose);">MUX Dinonaktifkan (Enable = 0) → Keluaran Y = 0</span>`;
      } else {
        detailElem.innerHTML = `
          Pilihan Saluran: <strong>D<sub>${selectedChannel}</sub></strong> 
          (karena Select = <code>${type === '2to1' ? S[0] : type === '4to1' ? `${S[1]}${S[0]}` : `${S[2]}${S[1]}${S[0]}`}₂ = ${selectedChannel}₁₀</code>) 
          → Nilai diteruskan ke Y = <strong>${D[selectedChannel]}</strong>
        `;
      }
    }

    // Equation Text
    const eqElem = document.getElementById('mux_equation_display');
    if (eqElem) {
      if (type === '2to1') {
        eqElem.innerHTML = `<code>Y = S'·D₀ + S·D₁ = (${S[0] === 0 ? '1' : '0'}·${D[0]}) + (${S[0]}·${D[1]}) = ${outputY}</code>`;
      } else if (type === '4to1') {
        eqElem.innerHTML = `<code>Y = S₁'S₀'·D₀ + S₁'S₀·D₁ + S₁S₀'·D₂ + S₁S₀·D₃</code>`;
      } else {
        eqElem.innerHTML = `<code>Y = ∑ (Dᵢ · mᵢ) = D₀·S₂'S₁'S₀' + D₁·S₂'S₁'S₀ + ... + D₇·S₂S₁S₀</code>`;
      }
    }

    // Highlight Truth Table Row
    const totalRows = Math.pow(2, numSelects);
    for (let r = 0; r < 8; r++) {
      const row = document.getElementById(`mux_tr_${r}`);
      if (row) {
        row.style.display = r < totalRows ? 'table-row' : 'none';
        row.classList.toggle('active-row', r === selectedChannel && E === 1);
      }
    }
  }
};

// Expose globally
window.MultilevelMuxModule = MultilevelMuxModule;
