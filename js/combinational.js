/**
 * ==========================================================================
 * MK SISTEM DIGITAL - ITERA
 * Modul Minggu 5: Rangkaian Logika Kombinasional (Adder & Subtractor)
 * ==========================================================================
 * Mengimplementasikan:
 * 1. Half Adder (HA) & Full Adder (FA) Interactive Tester
 * 2. Ripple Carry Adder (RCA) vs Carry Lookahead Adder (CLA) Generator
 * 3. 4-Bit Integrated Adder-Subtractor Circuit Simulator (Mode M: ADD/SUB)
 */

const CombinationalModule = {
  // 4-Bit Integrated Adder-Subtractor State
  state: {
    mode: 0, // 0 = ADD, 1 = SUB
    A: [1, 0, 1, 1], // [A3, A2, A1, A0] -> default 1011_2 = 11_10
    B: [0, 1, 1, 0], // [B3, B2, B1, B0] -> default 0110_2 = 6_10
    
    // Single HA state
    haA: 1,
    haB: 1,

    // Single FA state
    faA: 1,
    faB: 0,
    faCin: 1,

    // Subtractor Single state
    hsA: 0,
    hsB: 1,
    fsA: 1,
    fsB: 0,
    fsBin: 1
  },

  init() {
    this.updateAdderSubtractor();
    this.updateHalfAdder();
    this.updateFullAdder();
    this.updateHalfSubtractor();
    this.updateFullSubtractor();
  },

  // --------------------------------------------------------------------------
  // 1. Integrated 4-Bit Adder-Subtractor
  // --------------------------------------------------------------------------
  setMode(m) {
    this.state.mode = m === 1 ? 1 : 0;
    const btnAdd = document.getElementById('btn_mode_add');
    const btnSub = document.getElementById('btn_mode_sub');
    if (btnAdd) btnAdd.classList.toggle('active', this.state.mode === 0);
    if (btnSub) btnSub.classList.toggle('active', this.state.mode === 1);
    this.updateAdderSubtractor();
  },

  toggleBit(operand, idx) {
    if (operand === 'A') {
      this.state.A[idx] = this.state.A[idx] === 1 ? 0 : 1;
    } else {
      this.state.B[idx] = this.state.B[idx] === 1 ? 0 : 1;
    }
    this.updateAdderSubtractor();
  },

  setDecimalInput(operand, val) {
    let num = parseInt(val, 10);
    if (isNaN(num)) num = 0;
    num = Math.max(0, Math.min(15, num));
    
    const bits = [
      (num >> 3) & 1,
      (num >> 2) & 1,
      (num >> 1) & 1,
      num & 1
    ];

    if (operand === 'A') {
      this.state.A = bits;
    } else {
      this.state.B = bits;
    }
    this.updateAdderSubtractor();
  },

  updateAdderSubtractor() {
    const M = this.state.mode;
    const A = [...this.state.A]; // [A3, A2, A1, A0]
    const B = [...this.state.B]; // [B3, B2, B1, B0]

    // Calculate B' = B XOR M and carries
    const Bprime = [];
    const C = [M]; // C0 = M (0 for ADD, 1 for SUB)
    const S = [];
    const G = [];
    const P = [];

    // LSB is at index 3, MSB at index 0
    for (let i = 3; i >= 0; i--) {
      const bitIndex = 3 - i; // 0 for LSB, 3 for MSB
      const ai = A[i];
      const bi = B[i];
      const bpi = bi ^ M;
      Bprime.unshift(bpi);

      const cin = C[C.length - 1];
      const sumBit = ai ^ bpi ^ cin;
      S.unshift(sumBit);

      // Carry out
      const cout = (ai & bpi) | (cin & (ai ^ bpi));
      C.push(cout);

      // CLA Generate & Propagate
      G.push(ai & bpi);
      P.push(ai ^ bpi);
    }

    const coutFinal = C[C.length - 1];
    const overflow = C[3] ^ C[4]; // V = C3 XOR C4 for signed 2's complement

    // Numeric values
    const valA = (A[0] << 3) | (A[1] << 2) | (A[2] << 1) | A[3];
    const valB = (B[0] << 3) | (B[1] << 2) | (B[2] << 1) | B[3];
    const valS = (S[0] << 3) | (S[1] << 2) | (S[2] << 1) | S[3];

    // Render Bit buttons
    for (let i = 0; i < 4; i++) {
      const btnA = document.getElementById(`addsub_bit_a_${i}`);
      const btnB = document.getElementById(`addsub_bit_b_${i}`);
      if (btnA) {
        btnA.textContent = A[i];
        btnA.classList.toggle('bit-1', A[i] === 1);
        btnA.classList.toggle('bit-0', A[i] === 0);
      }
      if (btnB) {
        btnB.textContent = B[i];
        btnB.classList.toggle('bit-1', B[i] === 1);
        btnB.classList.toggle('bit-0', B[i] === 0);
      }
    }

    // Update Input Numeric fields
    const inputA = document.getElementById('addsub_input_a_dec');
    const inputB = document.getElementById('addsub_input_b_dec');
    if (inputA && document.activeElement !== inputA) inputA.value = valA;
    if (inputB && document.activeElement !== inputB) inputB.value = valB;

    // Update Mode Display
    const modeBadge = document.getElementById('addsub_mode_badge');
    if (modeBadge) {
      if (M === 0) {
        modeBadge.className = 'status-pill active-pill';
        modeBadge.textContent = 'Mode: ADD (M = 0)';
      } else {
        modeBadge.className = 'status-pill warning-pill';
        modeBadge.textContent = 'Mode: SUB (M = 1)';
      }
    }

    // Update Table Walkthrough Rows (0 to 3)
    const tbody = document.getElementById('addsub_walkthrough_body');
    if (tbody) {
      let rowsHtml = '';
      for (let bit = 0; bit < 4; bit++) {
        const arrIdx = 3 - bit;
        const ai = A[arrIdx];
        const bi = B[arrIdx];
        const bpi = bi ^ M;
        const cin = C[bit];
        const si = S[arrIdx];
        const cout = C[bit + 1];

        rowsHtml += `
          <tr>
            <td><strong>Bit-${bit}</strong> ${bit === 0 ? '(LSB)' : bit === 3 ? '(MSB)' : ''}</td>
            <td><span class="mono-badge">${ai}</span></td>
            <td><span class="mono-badge">${bi}</span></td>
            <td><span class="mono-badge" style="color:var(--accent-amber);">${M}</span></td>
            <td><span class="mono-badge">${bpi}</span></td>
            <td><span class="mono-badge" style="color:var(--accent-cyan);">${cin}</span></td>
            <td><span class="mono-badge" style="color:var(--accent-emerald); font-weight:700;">${si}</span></td>
            <td><span class="mono-badge" style="color:var(--accent-purple); font-weight:700;">${cout}</span></td>
          </tr>
        `;
      }
      tbody.innerHTML = rowsHtml;
    }

    // Update Result Outputs
    const resBitsElem = document.getElementById('addsub_result_bits');
    if (resBitsElem) {
      resBitsElem.innerHTML = `
        <span style="color:var(--accent-purple); font-weight:800;" title="Cout Final">${coutFinal}</span>
        <span style="color:var(--text-muted); margin:0 4px;">|</span>
        <span style="color:var(--accent-emerald); font-weight:800;">${S.join('')}</span>
      `;
    }

    const resDecElem = document.getElementById('addsub_result_dec');
    if (resDecElem) {
      if (M === 0) {
        // Unsigned addition: 5-bit result = (Cout << 4) | valS
        const full5Bit = (coutFinal << 4) | valS;
        resDecElem.innerHTML = `<strong>${valA} + ${valB} = ${full5Bit}</strong> <span style="font-size:0.85rem; color:var(--text-secondary);">(Biner 5-bit: ${coutFinal}${S.join('')}₂)</span>`;
      } else {
        // Subtraction: A - B
        const diffExpected = valA - valB;
        const noBorrow = coutFinal === 1; // In two's complement subtractor with Cin=1, Cout=1 means no borrow (result >= 0)
        resDecElem.innerHTML = `<strong>${valA} - ${valB} = ${diffExpected}</strong> <span style="font-size:0.85rem; color:var(--text-secondary);">(Cout = ${coutFinal} ${noBorrow ? '→ Tidak ada borrow' : '→ Ada borrow / negatif'})</span>`;
      }
    }

    // Flags
    const flagCout = document.getElementById('addsub_flag_cout');
    if (flagCout) flagCout.textContent = coutFinal;

    const flagOverflow = document.getElementById('addsub_flag_overflow');
    if (flagOverflow) {
      flagOverflow.textContent = overflow === 1 ? '1 (TERJADI OVERFLOW)' : '0 (NORMAL)';
      flagOverflow.style.color = overflow === 1 ? 'var(--accent-rose)' : 'var(--accent-emerald)';
    }

    // CLA Generate & Propagate Equations Live Text
    const claEquElem = document.getElementById('cla_equations_live');
    if (claEquElem) {
      claEquElem.innerHTML = `
        <div style="font-family:var(--font-mono); font-size:0.85rem; line-height:1.7;">
          <div><strong style="color:var(--accent-cyan);">C₁</strong> = G₀ + P₀·C₀ = ${G[0]} + (${P[0]}·${C[0]}) = <strong>${C[1]}</strong></div>
          <div><strong style="color:var(--accent-cyan);">C₂</strong> = G₁ + P₁·G₀ + P₁·P₀·C₀ = <strong>${C[2]}</strong></div>
          <div><strong style="color:var(--accent-cyan);">C₃</strong> = G₂ + P₂·C₂ = <strong>${C[3]}</strong></div>
          <div><strong style="color:var(--accent-cyan);">C₄</strong> = G₃ + P₃·C₃ = <strong>${C[4]}</strong> (Cout)</div>
        </div>
      `;
    }
  },

  // --------------------------------------------------------------------------
  // 2. Single Half Adder (HA)
  // --------------------------------------------------------------------------
  toggleHA(input) {
    if (input === 'A') this.state.haA = this.state.haA === 1 ? 0 : 1;
    if (input === 'B') this.state.haB = this.state.haB === 1 ? 0 : 1;
    this.updateHalfAdder();
  },

  updateHalfAdder() {
    const A = this.state.haA;
    const B = this.state.haB;
    const S = A ^ B; // XOR
    const C = A & B; // AND

    const btnA = document.getElementById('ha_btn_a');
    const btnB = document.getElementById('ha_btn_b');
    if (btnA) {
      btnA.textContent = A;
      btnA.className = `bit-toggle-btn ${A === 1 ? 'active-1' : 'active-0'}`;
    }
    if (btnB) {
      btnB.textContent = B;
      btnB.className = `bit-toggle-btn ${B === 1 ? 'active-1' : 'active-0'}`;
    }

    const outS = document.getElementById('ha_out_s');
    const outC = document.getElementById('ha_out_c');
    if (outS) outS.textContent = S;
    if (outC) outC.textContent = C;

    // Highlight row in truth table
    for (let i = 0; i < 4; i++) {
      const row = document.getElementById(`ha_tr_${i}`);
      if (row) {
        const expectedA = (i >> 1) & 1;
        const expectedB = i & 1;
        row.classList.toggle('active-row', A === expectedA && B === expectedB);
      }
    }
  },

  // --------------------------------------------------------------------------
  // 3. Single Full Adder (FA)
  // --------------------------------------------------------------------------
  toggleFA(input) {
    if (input === 'A') this.state.faA = this.state.faA === 1 ? 0 : 1;
    if (input === 'B') this.state.faB = this.state.faB === 1 ? 0 : 1;
    if (input === 'Cin') this.state.faCin = this.state.faCin === 1 ? 0 : 1;
    this.updateFullAdder();
  },

  updateFullAdder() {
    const A = this.state.faA;
    const B = this.state.faB;
    const Cin = this.state.faCin;

    const S = A ^ B ^ Cin;
    const Cout = (A & B) | (Cin & (A ^ B));

    const btnA = document.getElementById('fa_btn_a');
    const btnB = document.getElementById('fa_btn_b');
    const btnCin = document.getElementById('fa_btn_cin');
    if (btnA) {
      btnA.textContent = A;
      btnA.className = `bit-toggle-btn ${A === 1 ? 'active-1' : 'active-0'}`;
    }
    if (btnB) {
      btnB.textContent = B;
      btnB.className = `bit-toggle-btn ${B === 1 ? 'active-1' : 'active-0'}`;
    }
    if (btnCin) {
      btnCin.textContent = Cin;
      btnCin.className = `bit-toggle-btn ${Cin === 1 ? 'active-1' : 'active-0'}`;
    }

    const outS = document.getElementById('fa_out_s');
    const outCout = document.getElementById('fa_out_cout');
    if (outS) outS.textContent = S;
    if (outCout) outCout.textContent = Cout;

    // Highlight row in FA truth table (8 rows)
    for (let i = 0; i < 8; i++) {
      const row = document.getElementById(`fa_tr_${i}`);
      if (row) {
        const expA = (i >> 2) & 1;
        const expB = (i >> 1) & 1;
        const expCin = i & 1;
        row.classList.toggle('active-row', A === expA && B === expB && Cin === expCin);
      }
    }
  },

  // --------------------------------------------------------------------------
  // 4. Half Subtractor (HS)
  // --------------------------------------------------------------------------
  toggleHS(input) {
    if (input === 'A') this.state.hsA = this.state.hsA === 1 ? 0 : 1;
    if (input === 'B') this.state.hsB = this.state.hsB === 1 ? 0 : 1;
    this.updateHalfSubtractor();
  },

  updateHalfSubtractor() {
    const A = this.state.hsA;
    const B = this.state.hsB;
    const D = A ^ B; // Difference
    const Bout = (!A && B) ? 1 : 0; // Borrow = NOT(A) AND B

    const btnA = document.getElementById('hs_btn_a');
    const btnB = document.getElementById('hs_btn_b');
    if (btnA) btnA.textContent = A;
    if (btnB) btnB.textContent = B;

    const outD = document.getElementById('hs_out_d');
    const outB = document.getElementById('hs_out_b');
    if (outD) outD.textContent = D;
    if (outB) outB.textContent = Bout;

    for (let i = 0; i < 4; i++) {
      const row = document.getElementById(`hs_tr_${i}`);
      if (row) {
        const expA = (i >> 1) & 1;
        const expB = i & 1;
        row.classList.toggle('active-row', A === expA && B === expB);
      }
    }
  },

  // --------------------------------------------------------------------------
  // 5. Full Subtractor (FS)
  // --------------------------------------------------------------------------
  toggleFS(input) {
    if (input === 'A') this.state.fsA = this.state.fsA === 1 ? 0 : 1;
    if (input === 'B') this.state.fsB = this.state.fsB === 1 ? 0 : 1;
    if (input === 'Bin') this.state.fsBin = this.state.fsBin === 1 ? 0 : 1;
    this.updateFullSubtractor();
  },

  updateFullSubtractor() {
    const A = this.state.fsA;
    const B = this.state.fsB;
    const Bin = this.state.fsBin;

    const D = A ^ B ^ Bin; // Difference
    // Bout = A'B + A'Bin + B*Bin = A'(B + Bin) + B*Bin
    const Bout = ((!A & B) | (!A & Bin) | (B & Bin)) ? 1 : 0;

    const btnA = document.getElementById('fs_btn_a');
    const btnB = document.getElementById('fs_btn_b');
    const btnBin = document.getElementById('fs_btn_bin');
    if (btnA) btnA.textContent = A;
    if (btnB) btnB.textContent = B;
    if (btnBin) btnBin.textContent = Bin;

    const outD = document.getElementById('fs_out_d');
    const outBout = document.getElementById('fs_out_bout');
    if (outD) outD.textContent = D;
    if (outBout) outBout.textContent = Bout;

    for (let i = 0; i < 8; i++) {
      const row = document.getElementById(`fs_tr_${i}`);
      if (row) {
        const expA = (i >> 2) & 1;
        const expB = (i >> 1) & 1;
        const expBin = i & 1;
        row.classList.toggle('active-row', A === expA && B === expB && Bin === expBin);
      }
    }
  }
};

// Expose globally
window.CombinationalModule = CombinationalModule;
