/**
 * ==========================================================================
 * MK SISTEM DIGITAL - ITERA
 * Week 3 Engine: Logic Gates Real-Time Simulator & Multi-Gate Circuits
 * ==========================================================================
 * Mengimplementasikan materi Pertemuan 3 ITERA:
 * - Gerbang Dasar: NOT, AND, OR
 * - Gerbang Turunan/Universal: NAND, NOR, XOR, XNOR
 * - Visualisasi Simbol Standar ANSI/IEEE dengan SVG Interaktif
 * - Simulasi Sinyal Real-time (LOW/0 vs HIGH/1, Kabel Menyala, Indikator LED)
 * - Tabel Kebenaran Dinamis dengan Penanda Baris Aktif
 * - Simulasi Rangkaian Gabungan Slide 18 (Latihan 3: NAND+XOR -> XNOR = OR)
 *   dan Slide 19 (Latihan 4: AND+OR -> XOR = XOR)
 */

const LogicGateEngine = {
  // Definisi Gerbang Logika Standar
  GATES: {
    NOT: {
      name: 'NOT (Inverter)',
      inputsCount: 1,
      expression: "F = A'  (atau Ā)",
      description: 'Membalikkan nilai input. Jika input bernilai 0 maka output 1, dan jika input 1 maka output 0.',
      symbolType: 'not',
      evaluate: (a) => a === 0 ? 1 : 0,
      truthTable: [
        { a: 0, out: 1 },
        { a: 1, out: 0 }
      ]
    },
    AND: {
      name: 'AND',
      inputsCount: 2,
      expression: 'F = A · B',
      description: 'Output bernilai 1 (HIGH) HANYA JIKA seluruh input bernilai 1. Merepresentasikan perkalian logika Boolean.',
      symbolType: 'and',
      evaluate: (a, b) => (a === 1 && b === 1) ? 1 : 0,
      truthTable: [
        { a: 0, b: 0, out: 0 },
        { a: 0, b: 1, out: 0 },
        { a: 1, b: 0, out: 0 },
        { a: 1, b: 1, out: 1 }
      ]
    },
    OR: {
      name: 'OR',
      inputsCount: 2,
      expression: 'F = A + B',
      description: 'Output bernilai 1 (HIGH) jika SALAH SATU atau kedua input bernilai 1. Merepresentasikan penjumlahan logika Boolean.',
      symbolType: 'or',
      evaluate: (a, b) => (a === 1 || b === 1) ? 1 : 0,
      truthTable: [
        { a: 0, b: 0, out: 0 },
        { a: 0, b: 1, out: 1 },
        { a: 1, b: 0, out: 1 },
        { a: 1, b: 1, out: 1 }
      ]
    },
    NAND: {
      name: 'NAND (Not-AND)',
      inputsCount: 2,
      expression: 'F = (A · B)\'',
      description: 'Merupakan kebalikan (inversi) dari gerbang AND. Output bernilai 0 HANYA JIKA kedua input bernilai 1. Merupakan gerbang universal.',
      symbolType: 'nand',
      evaluate: (a, b) => !(a === 1 && b === 1) ? 1 : 0,
      truthTable: [
        { a: 0, b: 0, out: 1 },
        { a: 0, b: 1, out: 1 },
        { a: 1, b: 0, out: 1 },
        { a: 1, b: 1, out: 0 }
      ]
    },
    NOR: {
      name: 'NOR (Not-OR)',
      inputsCount: 2,
      expression: 'F = (A + B)\'',
      description: 'Merupakan kebalikan (inversi) dari gerbang OR. Output bernilai 1 HANYA JIKA kedua input bernilai 0. Merupakan gerbang universal.',
      symbolType: 'nor',
      evaluate: (a, b) => !(a === 1 || b === 1) ? 1 : 0,
      truthTable: [
        { a: 0, b: 0, out: 1 },
        { a: 0, b: 1, out: 0 },
        { a: 1, b: 0, out: 0 },
        { a: 1, b: 1, out: 0 }
      ]
    },
    XOR: {
      name: 'EXCLUSIVE OR (XOR)',
      inputsCount: 2,
      expression: 'F = A ⊕ B = A\'B + AB\'',
      description: 'Output bernilai 1 jika nilai input BERBEDA (ganjil). Contoh Slide 16: dibangun dari baris output bernilai 1 pada tabel kebenaran.',
      symbolType: 'xor',
      evaluate: (a, b) => (a !== b) ? 1 : 0,
      truthTable: [
        { a: 0, b: 0, out: 0 },
        { a: 0, b: 1, out: 1 },
        { a: 1, b: 0, out: 1 },
        { a: 1, b: 1, out: 0 }
      ]
    },
    XNOR: {
      name: 'EXCLUSIVE NOR (XNOR)',
      inputsCount: 2,
      expression: 'F = (A ⊕ B)\' = A\'B\' + AB',
      description: 'Output bernilai 1 jika nilai kedua input SAMA (00 atau 11). Merupakan inverter dari gerbang XOR.',
      symbolType: 'xnor',
      evaluate: (a, b) => (a === b) ? 1 : 0,
      truthTable: [
        { a: 0, b: 0, out: 1 },
        { a: 0, b: 1, out: 0 },
        { a: 1, b: 0, out: 0 },
        { a: 1, b: 1, out: 1 }
      ]
    }
  },

  // State Simulasi Tunggal
  currentGate: 'AND',
  inputA: 1,
  inputB: 0,

  // State Simulasi Rangkaian Slide 18 & 19
  circuitInputs: {
    latihan3: { a: 0, b: 0 },
    latihan4: { a: 0, b: 0 }
  },

  /**
   * Evaluasi Gerbang Logika Tunggal
   */
  evaluateCurrentGate() {
    const gateInfo = this.GATES[this.currentGate];
    const out = gateInfo.inputsCount === 1 
      ? gateInfo.evaluate(this.inputA)
      : gateInfo.evaluate(this.inputA, this.inputB);
    return {
      gate: this.currentGate,
      info: gateInfo,
      a: this.inputA,
      b: this.inputB,
      out: out
    };
  },

  /**
   * Evaluasi Rangkaian Latihan 3 (Slide 18)
   * A, B -> NAND -> C = (A·B)'
   * A, B -> XOR  -> D = A ⊕ B
   * C, D -> XNOR -> Q = (C ⊙ D)
   * Ekivalen dengan Gerbang OR tunggal: Q = A + B
   */
  evaluateCircuitLatihan3(a, b) {
    const c = !(a === 1 && b === 1) ? 1 : 0; // NAND
    const d = (a !== b) ? 1 : 0;             // XOR
    const q = (c === d) ? 1 : 0;             // XNOR
    const equivOr = (a === 1 || b === 1) ? 1 : 0; // OR
    return { a, b, c, d, q, equivOr };
  },

  /**
   * Evaluasi Rangkaian Latihan 4 (Slide 19)
   * A, B -> AND -> C = A·B
   * A, B -> OR  -> D = A + B
   * C, D -> XOR -> Q = C ⊕ D
   * Ekivalen dengan Gerbang XOR tunggal: Q = A ⊕ B
   */
  evaluateCircuitLatihan4(a, b) {
    const c = (a === 1 && b === 1) ? 1 : 0; // AND
    const d = (a === 1 || b === 1) ? 1 : 0; // OR
    const q = (c !== d) ? 1 : 0;            // XOR
    const equivXor = (a !== b) ? 1 : 0;     // XOR
    return { a, b, c, d, q, equivXor };
  },

  /**
   * Render SVG Simbol Gerbang Logika dengan Wire Glow Real-Time
   */
  renderGateSVG(gateKey, inA, inB, outVal) {
    const gate = this.GATES[gateKey];
    const isSingleInput = gate.inputsCount === 1;

    // Warna kabel interaktif
    const wireHigh = '#10b981'; // emerald neon
    const wireLow = '#334155';  // muted slate
    const glowFilterHigh = 'url(#highGlow)';
    const glowFilterLow = 'none';

    const colorA = inA === 1 ? wireHigh : wireLow;
    const colorB = inB === 1 ? wireHigh : wireLow;
    const colorOut = outVal === 1 ? '#06b6d4' : wireLow;
    const filterA = inA === 1 ? glowFilterHigh : glowFilterLow;
    const filterB = inB === 1 ? glowFilterHigh : glowFilterLow;
    const filterOut = outVal === 1 ? 'url(#cyanGlow)' : glowFilterLow;

    let gateSymbolSvg = '';

    switch (gateKey) {
      case 'NOT':
        gateSymbolSvg = `
          <!-- Segitiga Inverter -->
          <polygon points="170,85 270,140 170,195" fill="rgba(139, 92, 246, 0.15)" stroke="#8b5cf6" stroke-width="4" stroke-linejoin="round" />
          <!-- Lingkaran Inversi / Bubble -->
          <circle cx="282" cy="140" r="11" fill="#070b14" stroke="#8b5cf6" stroke-width="4" />
        `;
        break;

      case 'AND':
        gateSymbolSvg = `
          <!-- Simbol AND: Garis belakang lurus, depan melengkung separuh lingkaran -->
          <path d="M 160,75 L 225,75 A 65,65 0 0,1 225,205 L 160,205 Z" 
                fill="rgba(59, 130, 246, 0.15)" stroke="#3b82f6" stroke-width="4" stroke-linejoin="round" />
        `;
        break;

      case 'OR':
        gateSymbolSvg = `
          <!-- Simbol OR: Belakang cekung melengkung, depan runcing melengkung -->
          <path d="M 150,75 Q 210,140 150,205 Q 230,205 295,140 Q 230,75 150,75 Z" 
                fill="rgba(6, 182, 212, 0.15)" stroke="#06b6d4" stroke-width="4" stroke-linejoin="round" />
        `;
        break;

      case 'NAND':
        gateSymbolSvg = `
          <!-- AND Body -->
          <path d="M 150,75 L 215,75 A 65,65 0 0,1 215,205 L 150,205 Z" 
                fill="rgba(244, 63, 94, 0.15)" stroke="#f43f5e" stroke-width="4" stroke-linejoin="round" />
          <!-- Inversion Bubble -->
          <circle cx="292" cy="140" r="11" fill="#070b14" stroke="#f43f5e" stroke-width="4" />
        `;
        break;

      case 'NOR':
        gateSymbolSvg = `
          <!-- OR Body -->
          <path d="M 140,75 Q 200,140 140,205 Q 220,205 285,140 Q 220,75 140,75 Z" 
                fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" stroke-width="4" stroke-linejoin="round" />
          <!-- Inversion Bubble -->
          <circle cx="298" cy="140" r="11" fill="#070b14" stroke="#f59e0b" stroke-width="4" />
        `;
        break;

      case 'XOR':
        gateSymbolSvg = `
          <!-- Lengkungan Tambahan Belakang XOR -->
          <path d="M 125,75 Q 185,140 125,205" fill="none" stroke="#a855f7" stroke-width="4" stroke-linecap="round" />
          <!-- OR Body -->
          <path d="M 145,75 Q 205,140 145,205 Q 225,205 290,140 Q 225,75 145,75 Z" 
                fill="rgba(168, 85, 247, 0.15)" stroke="#a855f7" stroke-width="4" stroke-linejoin="round" />
        `;
        break;

      case 'XNOR':
        gateSymbolSvg = `
          <!-- Lengkungan Tambahan Belakang XOR -->
          <path d="M 120,75 Q 180,140 120,205" fill="none" stroke="#10b981" stroke-width="4" stroke-linecap="round" />
          <!-- OR Body -->
          <path d="M 140,75 Q 200,140 140,205 Q 220,205 280,140 Q 220,75 140,75 Z" 
                fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" stroke-width="4" stroke-linejoin="round" />
          <!-- Inversion Bubble -->
          <circle cx="294" cy="140" r="11" fill="#070b14" stroke="#10b981" stroke-width="4" />
        `;
        break;
    }

    // Input Wires
    let inputWiresSvg = '';
    if (isSingleInput) {
      inputWiresSvg = `
        <!-- Input A wire tunggal ke NOT -->
        <line x1="40" y1="140" x2="170" y2="140" stroke="${colorA}" stroke-width="5" filter="${filterA}" />
        <circle cx="40" cy="140" r="7" fill="${colorA}" />
        <text x="20" y="145" fill="#f8fafc" font-family="'Outfit', sans-serif" font-weight="700" font-size="16">A</text>
        <rect x="55" y="115" width="46" height="22" rx="4" fill="#0d1424" stroke="${colorA}" stroke-width="1.5" />
        <text x="78" y="131" text-anchor="middle" fill="${colorA}" font-family="'Fira Code', monospace" font-weight="700" font-size="13">${inA}</text>
      `;
    } else {
      inputWiresSvg = `
        <!-- Input A (Atas) -->
        <line x1="40" y1="105" x2="155" y2="105" stroke="${colorA}" stroke-width="5" filter="${filterA}" />
        <circle cx="40" cy="105" r="7" fill="${colorA}" />
        <text x="20" y="110" fill="#f8fafc" font-family="'Outfit', sans-serif" font-weight="700" font-size="16">A</text>
        <rect x="55" y="80" width="46" height="22" rx="4" fill="#0d1424" stroke="${colorA}" stroke-width="1.5" />
        <text x="78" y="96" text-anchor="middle" fill="${colorA}" font-family="'Fira Code', monospace" font-weight="700" font-size="13">${inA}</text>

        <!-- Input B (Bawah) -->
        <line x1="40" y1="175" x2="155" y2="175" stroke="${colorB}" stroke-width="5" filter="${filterB}" />
        <circle cx="40" cy="175" r="7" fill="${colorB}" />
        <text x="20" y="180" fill="#f8fafc" font-family="'Outfit', sans-serif" font-weight="700" font-size="16">B</text>
        <rect x="55" y="185" width="46" height="22" rx="4" fill="#0d1424" stroke="${colorB}" stroke-width="1.5" />
        <text x="78" y="201" text-anchor="middle" fill="${colorB}" font-family="'Fira Code', monospace" font-weight="700" font-size="13">${inB}</text>
      `;
    }

    // Output Wire & Bulb/LED
    const outStartX = (gateKey === 'NOT' || gateKey === 'NAND' || gateKey === 'NOR' || gateKey === 'XNOR') ? 305 : 295;
    const bulbGlow = outVal === 1 ? 'rgba(6, 182, 212, 0.45)' : 'rgba(30, 41, 59, 0.2)';
    const bulbColor = outVal === 1 ? '#06b6d4' : '#475569';

    const outputWireSvg = `
      <!-- Output Wire -->
      <line x1="${outStartX}" y1="140" x2="380" y2="140" stroke="${colorOut}" stroke-width="5" filter="${filterOut}" />
      <circle cx="380" cy="140" r="7" fill="${colorOut}" />
      <text x="400" y="146" fill="#f8fafc" font-family="'Outfit', sans-serif" font-weight="700" font-size="16">Q (Out)</text>
      <rect x="330" y="112" width="42" height="22" rx="4" fill="#0d1424" stroke="${colorOut}" stroke-width="1.5" />
      <text x="351" y="128" text-anchor="middle" fill="${colorOut}" font-family="'Fira Code', monospace" font-weight="700" font-size="13">${outVal}</text>

      <!-- Virtual LED Indicator Bulb -->
      <g transform="translate(425, 115)">
        <circle cx="25" cy="25" r="22" fill="${bulbGlow}" filter="${filterOut}" />
        <circle cx="25" cy="25" r="16" fill="${bulbColor}" stroke="#ffffff" stroke-width="2" />
        <circle cx="20" cy="20" r="5" fill="#ffffff" opacity="${outVal === 1 ? '0.7' : '0.15'}" />
        <text x="25" y="60" text-anchor="middle" fill="${colorOut}" font-family="'Outfit', sans-serif" font-weight="700" font-size="11">
          ${outVal === 1 ? 'HIGH (1)' : 'LOW (0)'}
        </text>
      </g>
    `;

    return `
      <svg class="logic-gate-canvas-svg" viewBox="0 0 500 260" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="highGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Background Grid Gridlines -->
        <g stroke="rgba(148, 163, 184, 0.05)" stroke-width="1">
          <line x1="0" y1="65" x2="500" y2="65" />
          <line x1="0" y1="130" x2="500" y2="130" />
          <line x1="0" y1="195" x2="500" y2="195" />
          <line x1="125" y1="0" x2="125" y2="260" />
          <line x1="250" y1="0" x2="250" y2="260" />
          <line x1="375" y1="0" x2="375" y2="260" />
        </g>

        <!-- Input Wires -->
        ${inputWiresSvg}

        <!-- Gate Symbol -->
        ${gateSymbolSvg}

        <!-- Gate Name Tag inside symbol -->
        <text x="${gateKey === 'NOT' ? '210' : '205'}" y="145" text-anchor="middle" fill="rgba(255,255,255,0.85)" 
              font-family="'Outfit', sans-serif" font-weight="800" font-size="14" letter-spacing="1">
          ${gateKey}
        </text>

        <!-- Output Wires & Indicator -->
        ${outputWireSvg}
      </svg>
    `;
  },

  /**
   * Render SVG Rangkaian Latihan 3 (Slide 18 ITERA)
   * NAND (C) + XOR (D) -> XNOR (Q)
   */
  renderCircuitLatihan3SVG(a, b) {
    const { c, d, q, equivOr } = this.evaluateCircuitLatihan3(a, b);
    const wireHigh = '#10b981';
    const wireLow = '#334155';
    const colA = a === 1 ? wireHigh : wireLow;
    const colB = b === 1 ? wireHigh : wireLow;
    const colC = c === 1 ? '#f43f5e' : wireLow;
    const colD = d === 1 ? '#a855f7' : wireLow;
    const colQ = q === 1 ? '#06b6d4' : wireLow;

    return `
      <svg class="circuit-canvas-svg" viewBox="0 0 680 320" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="c3Glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Input Nodes A & B -->
        <text x="35" y="85" fill="#ffffff" font-family="'Outfit', sans-serif" font-weight="700" font-size="16">A</text>
        <circle cx="55" cy="80" r="7" fill="${colA}" />
        <rect x="70" y="65" width="36" height="22" rx="4" fill="#0d1424" stroke="${colA}" stroke-width="1.5" />
        <text x="88" y="81" text-anchor="middle" fill="${colA}" font-family="'Fira Code', monospace" font-weight="700" font-size="13">${a}</text>

        <text x="35" y="245" fill="#ffffff" font-family="'Outfit', sans-serif" font-weight="700" font-size="16">B</text>
        <circle cx="55" cy="240" r="7" fill="${colB}" />
        <rect x="70" y="225" width="36" height="22" rx="4" fill="#0d1424" stroke="${colB}" stroke-width="1.5" />
        <text x="88" y="241" text-anchor="middle" fill="${colB}" font-family="'Fira Code', monospace" font-weight="700" font-size="13">${b}</text>

        <!-- Wire A splits to NAND top and XOR top -->
        <path d="M 55,80 L 150,80 L 150,65 L 210,65" fill="none" stroke="${colA}" stroke-width="4" />
        <path d="M 150,80 L 150,225 L 210,225" fill="none" stroke="${colA}" stroke-width="4" />
        <circle cx="150" cy="80" r="4" fill="${colA}" />

        <!-- Wire B splits to NAND bot and XOR bot -->
        <path d="M 55,240 L 175,240 L 175,95 L 210,95" fill="none" stroke="${colB}" stroke-width="4" />
        <path d="M 175,240 L 210,255" fill="none" stroke="${colB}" stroke-width="4" />
        <circle cx="175" cy="240" r="4" fill="${colB}" />

        <!-- Gate 1: NAND (Top) -->
        <g transform="translate(60, 0)">
          <path d="M 150,50 L 205,50 A 30,30 0 0,1 205,110 L 150,110 Z" 
                fill="rgba(244, 63, 94, 0.15)" stroke="#f43f5e" stroke-width="3" />
          <circle cx="241" cy="80" r="6" fill="#070b14" stroke="#f43f5e" stroke-width="3" />
          <text x="185" y="85" text-anchor="middle" fill="#f43f5e" font-family="'Outfit', sans-serif" font-weight="700" font-size="12">NAND</text>
        </g>

        <!-- Probe C -->
        <line x1="307" y1="80" x2="430" y2="80" stroke="${colC}" stroke-width="4" />
        <line x1="430" y1="80" x2="430" y2="140" stroke="${colC}" stroke-width="4" />
        <line x1="430" y1="140" x2="465" y2="140" stroke="${colC}" stroke-width="4" />
        <rect x="330" y="55" width="70" height="24" rx="4" fill="#0d1424" stroke="${colC}" stroke-width="1.5" />
        <text x="365" y="72" text-anchor="middle" fill="${colC}" font-family="'Fira Code', monospace" font-weight="700" font-size="12">C = ${c}</text>

        <!-- Gate 2: XOR (Bottom) -->
        <g transform="translate(70, 160)">
          <path d="M 125,50 Q 155,80 125,110" fill="none" stroke="#a855f7" stroke-width="3" stroke-linecap="round" />
          <path d="M 135,50 Q 165,80 135,110 Q 185,110 220,80 Q 185,50 135,50 Z" 
                fill="rgba(168, 85, 247, 0.15)" stroke="#a855f7" stroke-width="3" />
          <text x="170" y="85" text-anchor="middle" fill="#a855f7" font-family="'Outfit', sans-serif" font-weight="700" font-size="12">XOR</text>
        </g>

        <!-- Probe D -->
        <line x1="290" y1="240" x2="430" y2="240" stroke="${colD}" stroke-width="4" />
        <line x1="430" y1="240" x2="430" y2="180" stroke="${colD}" stroke-width="4" />
        <line x1="430" y1="180" x2="465" y2="180" stroke="${colD}" stroke-width="4" />
        <rect x="330" y="248" width="70" height="24" rx="4" fill="#0d1424" stroke="${colD}" stroke-width="1.5" />
        <text x="365" y="265" text-anchor="middle" fill="${colD}" font-family="'Fira Code', monospace" font-weight="700" font-size="12">D = ${d}</text>

        <!-- Gate 3: XNOR (Final Output Q) -->
        <g transform="translate(345, 80)">
          <path d="M 110,50 Q 140,80 110,110" fill="none" stroke="#06b6d4" stroke-width="3" stroke-linecap="round" />
          <path d="M 120,50 Q 150,80 120,110 Q 170,110 205,80 Q 170,50 120,50 Z" 
                fill="rgba(6, 182, 212, 0.15)" stroke="#06b6d4" stroke-width="3" />
          <circle cx="212" cy="80" r="6" fill="#070b14" stroke="#06b6d4" stroke-width="3" />
          <text x="155" y="85" text-anchor="middle" fill="#06b6d4" font-family="'Outfit', sans-serif" font-weight="700" font-size="12">XNOR</text>
        </g>

        <!-- Output Q & Final Indicator -->
        <line x1="563" y1="160" x2="630" y2="160" stroke="${colQ}" stroke-width="5" />
        <circle cx="630" cy="160" r="8" fill="${colQ}" />
        <text x="645" y="165" fill="#ffffff" font-family="'Outfit', sans-serif" font-weight="700" font-size="16">Q</text>
        <rect x="575" y="125" width="46" height="24" rx="4" fill="#0d1424" stroke="${colQ}" stroke-width="2" />
        <text x="598" y="142" text-anchor="middle" fill="${colQ}" font-family="'Fira Code', monospace" font-weight="700" font-size="14">${q}</text>

        <!-- Equivalent Single Gate Tag -->
        <g transform="translate(480, 270)">
          <rect x="0" y="0" width="180" height="34" rx="6" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" stroke-width="1.5" />
          <text x="90" y="22" text-anchor="middle" fill="#10b981" font-family="'Outfit', sans-serif" font-weight="700" font-size="12">
            ≡ Gerbang Tunggal: OR (A+B)
          </text>
        </g>
      </svg>
    `;
  },

  /**
   * Render SVG Rangkaian Latihan 4 (Slide 19 ITERA)
   * AND (C) + OR (D) -> XOR (Q) = XOR
   */
  renderCircuitLatihan4SVG(a, b) {
    const { c, d, q, equivXor } = this.evaluateCircuitLatihan4(a, b);
    const wireHigh = '#10b981';
    const wireLow = '#334155';
    const colA = a === 1 ? wireHigh : wireLow;
    const colB = b === 1 ? wireHigh : wireLow;
    const colC = c === 1 ? '#3b82f6' : wireLow;
    const colD = d === 1 ? '#06b6d4' : wireLow;
    const colQ = q === 1 ? '#a855f7' : wireLow;

    return `
      <svg class="circuit-canvas-svg" viewBox="0 0 680 320" xmlns="http://www.w3.org/2000/svg">
        <!-- Input Nodes A & B -->
        <text x="35" y="85" fill="#ffffff" font-family="'Outfit', sans-serif" font-weight="700" font-size="16">A</text>
        <circle cx="55" cy="80" r="7" fill="${colA}" />
        <rect x="70" y="65" width="36" height="22" rx="4" fill="#0d1424" stroke="${colA}" stroke-width="1.5" />
        <text x="88" y="81" text-anchor="middle" fill="${colA}" font-family="'Fira Code', monospace" font-weight="700" font-size="13">${a}</text>

        <text x="35" y="245" fill="#ffffff" font-family="'Outfit', sans-serif" font-weight="700" font-size="16">B</text>
        <circle cx="55" cy="240" r="7" fill="${colB}" />
        <rect x="70" y="225" width="36" height="22" rx="4" fill="#0d1424" stroke="${colB}" stroke-width="1.5" />
        <text x="88" y="241" text-anchor="middle" fill="${colB}" font-family="'Fira Code', monospace" font-weight="700" font-size="13">${b}</text>

        <!-- Wires splitting -->
        <path d="M 55,80 L 150,80 L 150,65 L 210,65" fill="none" stroke="${colA}" stroke-width="4" />
        <path d="M 150,80 L 150,225 L 210,225" fill="none" stroke="${colA}" stroke-width="4" />
        <circle cx="150" cy="80" r="4" fill="${colA}" />

        <path d="M 55,240 L 175,240 L 175,95 L 210,95" fill="none" stroke="${colB}" stroke-width="4" />
        <path d="M 175,240 L 210,255" fill="none" stroke="${colB}" stroke-width="4" />
        <circle cx="175" cy="240" r="4" fill="${colB}" />

        <!-- Gate 1: AND (Top) -->
        <g transform="translate(60, 0)">
          <path d="M 150,50 L 205,50 A 30,30 0 0,1 205,110 L 150,110 Z" 
                fill="rgba(59, 130, 246, 0.15)" stroke="#3b82f6" stroke-width="3" />
          <text x="180" y="85" text-anchor="middle" fill="#3b82f6" font-family="'Outfit', sans-serif" font-weight="700" font-size="12">AND</text>
        </g>

        <!-- Probe C -->
        <line x1="295" y1="80" x2="430" y2="80" stroke="${colC}" stroke-width="4" />
        <line x1="430" y1="80" x2="430" y2="140" stroke="${colC}" stroke-width="4" />
        <line x1="430" y1="140" x2="465" y2="140" stroke="${colC}" stroke-width="4" />
        <rect x="330" y="55" width="70" height="24" rx="4" fill="#0d1424" stroke="${colC}" stroke-width="1.5" />
        <text x="365" y="72" text-anchor="middle" fill="${colC}" font-family="'Fira Code', monospace" font-weight="700" font-size="12">C = ${c}</text>

        <!-- Gate 2: OR (Bottom) -->
        <g transform="translate(70, 160)">
          <path d="M 135,50 Q 165,80 135,110 Q 185,110 220,80 Q 185,50 135,50 Z" 
                fill="rgba(6, 182, 212, 0.15)" stroke="#06b6d4" stroke-width="3" />
          <text x="170" y="85" text-anchor="middle" fill="#06b6d4" font-family="'Outfit', sans-serif" font-weight="700" font-size="12">OR</text>
        </g>

        <!-- Probe D -->
        <line x1="290" y1="240" x2="430" y2="240" stroke="${colD}" stroke-width="4" />
        <line x1="430" y1="240" x2="430" y2="180" stroke="${colD}" stroke-width="4" />
        <line x1="430" y1="180" x2="465" y2="180" stroke="${colD}" stroke-width="4" />
        <rect x="330" y="248" width="70" height="24" rx="4" fill="#0d1424" stroke="${colD}" stroke-width="1.5" />
        <text x="365" y="265" text-anchor="middle" fill="${colD}" font-family="'Fira Code', monospace" font-weight="700" font-size="12">D = ${d}</text>

        <!-- Gate 3: XOR (Output Q) -->
        <g transform="translate(345, 80)">
          <path d="M 110,50 Q 140,80 110,110" fill="none" stroke="#a855f7" stroke-width="3" stroke-linecap="round" />
          <path d="M 120,50 Q 150,80 120,110 Q 170,110 205,80 Q 170,50 120,50 Z" 
                fill="rgba(168, 85, 247, 0.15)" stroke="#a855f7" stroke-width="3" />
          <text x="155" y="85" text-anchor="middle" fill="#a855f7" font-family="'Outfit', sans-serif" font-weight="700" font-size="12">XOR</text>
        </g>

        <!-- Output Q -->
        <line x1="550" y1="160" x2="630" y2="160" stroke="${colQ}" stroke-width="5" />
        <circle cx="630" cy="160" r="8" fill="${colQ}" />
        <text x="645" y="165" fill="#ffffff" font-family="'Outfit', sans-serif" font-weight="700" font-size="16">Q</text>
        <rect x="565" y="125" width="46" height="24" rx="4" fill="#0d1424" stroke="${colQ}" stroke-width="2" />
        <text x="588" y="142" text-anchor="middle" fill="${colQ}" font-family="'Fira Code', monospace" font-weight="700" font-size="14">${q}</text>

        <!-- Equivalent Tag -->
        <g transform="translate(480, 270)">
          <rect x="0" y="0" width="180" height="34" rx="6" fill="rgba(168, 85, 247, 0.15)" stroke="#a855f7" stroke-width="1.5" />
          <text x="90" y="22" text-anchor="middle" fill="#a855f7" font-family="'Outfit', sans-serif" font-weight="700" font-size="12">
            ≡ Gerbang Tunggal: XOR (A⊕B)
          </text>
        </g>
      </svg>
    `;
  }
};

window.LogicGateEngine = LogicGateEngine;
