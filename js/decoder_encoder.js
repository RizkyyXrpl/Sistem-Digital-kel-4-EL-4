/**
 * ==========================================================================
 * MK SISTEM DIGITAL - ITERA
 * Modul Minggu 7: Decoder, Encoder, dan Rangkaian BCD ke 7-Segment
 * ==========================================================================
 * Mengimplementasikan:
 * 1. 3-to-8 Decoder & IC 74138 Octal Decoder Simulator
 * 2. 8-to-3 Priority Encoder (IC 74LS148) & Keypad Scanner
 * 3. Interactive BCD to 7-Segment Display (Common Cathode vs Common Anode)
 */

const DecoderEncoderModule = {
  state: {
    // 3-to-8 Decoder / IC 74138 State
    decA: [0, 0, 0], // [A2, A1, A0]
    decE1Bar: 0, // 0 to enable
    decE2Bar: 0, // 0 to enable
    decE3: 1,    // 1 to enable
    decPolarity: 'active_low', // 'active_low' (IC 74138) or 'active_high'

    // Priority Encoder State
    encInputs: [0, 0, 0, 0, 0, 1, 0, 0], // D0 to D7

    // 7-Segment State
    sevenSegMode: 'CC', // 'CC' (Common Cathode - active HIGH) or 'CA' (Common Anode - active LOW)
    bcdBits: [0, 1, 0, 1], // [A, B, C, D] where A is MSB (bobot 8), D is LSB (bobot 1) -> default 5_10 (0101_2)
    selectedHex: 5
  },

  // 7-segment segment patterns for 0-F (active HIGH: 1 = ON)
  // Segments: a, b, c, d, e, f, g
  segmentHexPatterns: {
    0:  [1, 1, 1, 1, 1, 1, 0],
    1:  [0, 1, 1, 0, 0, 0, 0],
    2:  [1, 1, 0, 1, 1, 0, 1],
    3:  [1, 1, 1, 1, 0, 0, 1],
    4:  [0, 1, 1, 0, 0, 1, 1],
    5:  [1, 0, 1, 1, 0, 1, 1],
    6:  [1, 0, 1, 1, 1, 1, 1],
    7:  [1, 1, 1, 0, 0, 0, 0],
    8:  [1, 1, 1, 1, 1, 1, 1],
    9:  [1, 1, 1, 1, 0, 1, 1],
    10: [1, 1, 1, 0, 1, 1, 1], // A
    11: [0, 0, 1, 1, 1, 1, 1], // b
    12: [1, 0, 0, 1, 1, 1, 0], // C
    13: [0, 1, 1, 1, 1, 0, 1], // d
    14: [1, 0, 0, 1, 1, 1, 1], // E
    15: [1, 0, 0, 0, 1, 1, 1]  // F
  },

  init() {
    this.updateDecoder();
    this.updatePriorityEncoder();
    this.updateSevenSegment();
  },

  // --------------------------------------------------------------------------
  // 1. Decoder (3:8 & IC 74138)
  // --------------------------------------------------------------------------
  toggleDecAddress(bitIdx) {
    this.state.decA[bitIdx] = this.state.decA[bitIdx] === 1 ? 0 : 1;
    this.updateDecoder();
  },

  setDecEnable(pin, val) {
    if (pin === 'E1') this.state.decE1Bar = val;
    if (pin === 'E2') this.state.decE2Bar = val;
    if (pin === 'E3') this.state.decE3 = val;
    this.updateDecoder();
  },

  setDecPolarity(pol) {
    this.state.decPolarity = pol;
    const btnLow = document.getElementById('btn_dec_pol_low');
    const btnHigh = document.getElementById('btn_dec_pol_high');
    if (btnLow) btnLow.classList.toggle('active', pol === 'active_low');
    if (btnHigh) btnHigh.classList.toggle('active', pol === 'active_high');
    this.updateDecoder();
  },

  updateDecoder() {
    const A = this.state.decA; // [A2, A1, A0]
    const address = (A[0] << 2) | (A[1] << 1) | A[2]; // 0 to 7
    const isChipEnabled = (this.state.decE1Bar === 0 && this.state.decE2Bar === 0 && this.state.decE3 === 1);
    const isLow = this.state.decPolarity === 'active_low';

    // Update Address buttons
    for (let i = 0; i < 3; i++) {
      const btn = document.getElementById(`dec_btn_a_${2 - i}`);
      if (btn) {
        btn.textContent = A[i];
        btn.className = `bit-toggle-btn ${A[i] === 1 ? 'active-1' : 'active-0'}`;
      }
    }

    // Update Enable buttons
    const btnE1 = document.getElementById('dec_btn_e1');
    const btnE2 = document.getElementById('dec_btn_e2');
    const btnE3 = document.getElementById('dec_btn_e3');
    if (btnE1) btnE1.classList.toggle('active', this.state.decE1Bar === 0);
    if (btnE2) btnE2.classList.toggle('active', this.state.decE2Bar === 0);
    if (btnE3) btnE3.classList.toggle('active', this.state.decE3 === 1);

    // Compute 8 outputs
    const outGrid = document.getElementById('dec_outputs_grid');
    if (outGrid) {
      let gridHtml = '';
      for (let y = 0; y < 8; y++) {
        let isActivated = isChipEnabled && (y === address);
        let outSignal = isLow ? (isActivated ? 0 : 1) : (isActivated ? 1 : 0);

        gridHtml += `
          <div class="decoder-out-card ${isActivated ? 'out-active' : ''}">
            <div class="out-label">${isLow ? `Ȳ<sub>${y}</sub>` : `Y<sub>${y}</sub>`}</div>
            <div class="out-signal ${outSignal === 1 ? 'sig-1' : 'sig-0'}">${outSignal}</div>
            <div class="out-meta">${isActivated ? '★ AKTIF' : 'Standby'}</div>
          </div>
        `;
      }
      outGrid.innerHTML = gridHtml;
    }

    // Update Explanation Card
    const expElem = document.getElementById('dec_explanation_text');
    if (expElem) {
      if (!isChipEnabled) {
        expElem.innerHTML = `
          <span style="color:var(--accent-rose); font-weight:700;">
            ⚠️ IC Dinonaktifkan (Enable Tidak Memenuhi Syarat: Ē₁=0, Ē₂=0, E₃=1).
          </span>
          Semua keluaran berada pada level inaktif (${isLow ? 'semua 1' : 'semua 0'}).
        `;
      } else {
        expElem.innerHTML = `
          Kombinasi input alamat <strong>A₂A₁A₀ = ${A[0]}${A[1]}${A[2]}₂ = ${address}₁₀</strong> 
          → Jalur <strong>Y${isLow ? '̄' : ''}<sub>${address}</sub></strong> aktif terpilih 
          (Sinyal: <strong>${isLow ? '0V / LOW' : '5V / HIGH'}</strong>). 
          Dalam aplikasi memori, ini mengaktifkan <strong>Blok Chip Memori ${address}</strong>.
        `;
      }
    }
  },

  // --------------------------------------------------------------------------
  // 2. Priority Encoder (IC 74LS148)
  // --------------------------------------------------------------------------
  toggleEncoderInput(dIdx) {
    this.state.encInputs[dIdx] = this.state.encInputs[dIdx] === 1 ? 0 : 1;
    this.updatePriorityEncoder();
  },

  pressKeypadButton(key) {
    // Keypad scanner mode: press key 0 to 9, set only that input
    const num = parseInt(key, 10);
    for (let i = 0; i < 8; i++) {
      this.state.encInputs[i] = (i === num) ? 1 : 0;
    }
    this.updatePriorityEncoder();
  },

  clearEncoderInputs() {
    this.state.encInputs = [0, 0, 0, 0, 0, 0, 0, 0];
    this.updatePriorityEncoder();
  },

  updatePriorityEncoder() {
    const inputs = this.state.encInputs;

    // Find highest active input (from D7 down to D0)
    let highestActive = -1;
    for (let i = 7; i >= 0; i--) {
      if (inputs[i] === 1) {
        highestActive = i;
        break;
      }
    }

    // Output binary 3-bit: Y2, Y1, Y0
    let Y = [0, 0, 0];
    let isAnyActive = highestActive >= 0;

    if (isAnyActive) {
      Y = [
        (highestActive >> 2) & 1,
        (highestActive >> 1) & 1,
        highestActive & 1
      ];
    }

    // Render Input Buttons
    const inContainer = document.getElementById('enc_input_buttons');
    if (inContainer) {
      let inHtml = '';
      for (let i = 7; i >= 0; i--) {
        const isHighPrio = (i === highestActive);
        inHtml += `
          <div class="enc-input-item ${isHighPrio ? 'prio-selected' : ''}">
            <div class="channel-label">D<sub>${i}</sub></div>
            <button class="bit-toggle-btn ${inputs[i] === 1 ? 'active-1' : 'active-0'}" onclick="DecoderEncoderModule.toggleEncoderInput(${i})">
              ${inputs[i]}
            </button>
            <div style="font-size:0.65rem; color:${isHighPrio ? 'var(--accent-cyan)' : 'var(--text-muted)'}; margin-top:2px;">
              ${isHighPrio ? 'PRIORITAS' : `Bobot ${i}`}
            </div>
          </div>
        `;
      }
      inContainer.innerHTML = inHtml;
    }

    // Update Output Badges
    const outY2 = document.getElementById('enc_out_y2');
    const outY1 = document.getElementById('enc_out_y1');
    const outY0 = document.getElementById('enc_out_y0');
    if (outY2) outY2.textContent = isAnyActive ? Y[0] : '-';
    if (outY1) outY1.textContent = isAnyActive ? Y[1] : '-';
    if (outY0) outY0.textContent = isAnyActive ? Y[2] : '-';

    // Summary Text
    const descElem = document.getElementById('enc_explanation_text');
    if (descElem) {
      if (!isAnyActive) {
        descElem.innerHTML = `<span style="color:var(--text-muted);">Tidak ada input yang aktif (D₀–D₇ = 0). Keluaran tidak valid (GS = 0).</span>`;
      } else {
        const activeList = [];
        inputs.forEach((val, idx) => { if (val === 1) activeList.push(`D<sub>${idx}</sub>`); });
        descElem.innerHTML = `
          Input aktif saat ini: <strong>${activeList.join(', ')}</strong>.<br>
          Karena <strong>D<sub>${highestActive}</sub></strong> adalah bit dengan indeks tertinggi yang aktif, Priority Encoder mengabaikan input lainnya dan menghasilkan kode biner 
          <strong>Y₂Y₁Y₀ = ${Y[0]}${Y[1]}${Y[2]}₂ = ${highestActive}₁₀</strong>.
        `;
      }
    }
  },

  // --------------------------------------------------------------------------
  // 3. BCD to 7-Segment Display Simulator
  // --------------------------------------------------------------------------
  setSevenSegMode(mode) {
    this.state.sevenSegMode = mode;
    const btnCC = document.getElementById('btn_7seg_cc');
    const btnCA = document.getElementById('btn_7seg_ca');
    if (btnCC) btnCC.classList.toggle('active', mode === 'CC');
    if (btnCA) btnCA.classList.toggle('active', mode === 'CA');
    this.updateSevenSegment();
  },

  selectHexDigit(digit) {
    const val = parseInt(digit, 10);
    this.state.selectedHex = val;
    this.state.bcdBits = [
      (val >> 3) & 1,
      (val >> 2) & 1,
      (val >> 1) & 1,
      val & 1
    ];
    this.updateSevenSegment();
  },

  toggleBcdBit(idx) {
    this.state.bcdBits[idx] = this.state.bcdBits[idx] === 1 ? 0 : 1;
    const bits = this.state.bcdBits;
    this.state.selectedHex = (bits[0] << 3) | (bits[1] << 2) | (bits[2] << 1) | bits[3];
    this.updateSevenSegment();
  },

  updateSevenSegment() {
    const hex = this.state.selectedHex;
    const bcd = this.state.bcdBits;
    const mode = this.state.sevenSegMode; // 'CC' or 'CA'
    const isCC = mode === 'CC';

    // Get 7-segment pattern for current hex (0-15)
    const basePattern = this.segmentHexPatterns[hex] || [0, 0, 0, 0, 0, 0, 0];
    // In Common Anode (CA), logic signal is inverted (0 = ON, 1 = OFF)
    const displaySignals = basePattern.map(bit => isCC ? bit : (bit === 1 ? 0 : 1));

    // Update BCD Bit Buttons
    for (let i = 0; i < 4; i++) {
      const btn = document.getElementById(`bcd_btn_${i}`);
      if (btn) {
        btn.textContent = bcd[i];
        btn.className = `bit-toggle-btn ${bcd[i] === 1 ? 'active-1' : 'active-0'}`;
      }
    }

    // Update Hex selector buttons
    document.querySelectorAll('.hex-select-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.hex, 10) === hex);
    });

    // Update Physical SVG Segment Lights
    const segmentNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    segmentNames.forEach((segName, idx) => {
      const isLit = basePattern[idx] === 1;
      const segElem = document.getElementById(`seg_${segName}`);
      if (segElem) {
        segElem.classList.toggle('seg-on', isLit);
        segElem.classList.toggle('seg-off', !isLit);
      }

      // Update Segment Truth Table / Signal Display
      const sigValElem = document.getElementById(`sig_val_${segName}`);
      if (sigValElem) {
        sigValElem.textContent = displaySignals[idx];
        sigValElem.className = `mono-badge ${displaySignals[idx] === (isCC ? 1 : 0) ? 'badge-active' : ''}`;
      }
    });

    // Character representation string
    const hexChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'b', 'C', 'd', 'E', 'F'];
    const charDisplay = hexChars[hex] || '?';

    const charBadge = document.getElementById('disp_hex_char');
    if (charBadge) charBadge.textContent = charDisplay;

    const bcdStringElem = document.getElementById('disp_bcd_string');
    if (bcdStringElem) {
      bcdStringElem.innerHTML = `
        <strong>${bcd.join('')}₂</strong> (${hex}₁₀) ${hex > 9 ? '<span style="color:var(--accent-amber); font-size:0.8rem;">[Di luar BCD 0-9 murni, valid Hex]</span>' : ''}
      `;
    }

    // Highlight row in HEX truth table
    for (let r = 0; r < 16; r++) {
      const row = document.getElementById(`hex_tr_${r}`);
      if (row) {
        row.classList.toggle('active-row', r === hex);
      }
    }
  }
};

// Expose globally
window.DecoderEncoderModule = DecoderEncoderModule;
