/**
 * ==========================================================================
 * MK SISTEM DIGITAL - ITERA
 * Week 4 Engine: Karnaugh Map (K-Map) Solver & Visualizer (2, 3, 4, & 5 Variabel)
 * ==========================================================================
 * Mengimplementasikan materi Pertemuan 4 ITERA & Modul Lanjutan:
 * - K-Map 2-Variabel (A, B) - 4 Sel
 * - K-Map 3-Variabel (AB x C) - 8 Sel
 * - K-Map 4-Variabel (AB x CD) - 16 Sel
 * - K-Map 5-Variabel (A=0 & A=1, BC x DE) - 32 Sel (Superposisi 3D)
 * - Format Urutan Kode Gray: 00, 01, 11, 10 (hanya 1-bit berubah antar-kolom/baris)
 * - Grouping pangkat dua (1, 2, 4, 8, 16, 32) dengan Toroidal Wrap-Around
 * - Deteksi Pengelompokan 3D Refleksi (Superposisi Antar Sub-Peta A=0 dan A=1)
 * - Kondisi Don't Care (X) untuk memaksimalkan ukuran kelompok
 * - Presets Resmi Slide ITERA & Presets Eksplorasi 5 Variabel
 */

const KMapEngine = {
  // Current settings: 2, 3, 4, or 5
  numVars: 4,
  
  // Storage for cell values: minterm index -> 0, 1, or 'X'
  cells: {},

  // Vibrant palette for group overlays and border indicators
  GROUP_COLORS: [
    { border: '#06b6d4', bg: 'rgba(6, 182, 212, 0.22)', name: 'Cyan' },
    { border: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.22)', name: 'Purple' },
    { border: '#10b981', bg: 'rgba(16, 185, 129, 0.22)', name: 'Emerald' },
    { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.22)', name: 'Amber' },
    { border: '#f43f5e', bg: 'rgba(244, 63, 94, 0.22)', name: 'Rose' },
    { border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.22)', name: 'Blue' },
    { border: '#ec4899', bg: 'rgba(236, 72, 153, 0.22)', name: 'Pink' },
    { border: '#84cc16', bg: 'rgba(132, 204, 22, 0.22)', name: 'Lime' },
    { border: '#14b8a6', bg: 'rgba(20, 184, 166, 0.22)', name: 'Teal' },
    { border: '#f97316', bg: 'rgba(249, 115, 22, 0.22)', name: 'Orange' },
    { border: '#a855f7', bg: 'rgba(168, 85, 247, 0.22)', name: 'Violet' },
    { border: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.22)', name: 'Sky' }
  ],

  init() {
    this.resetCells(this.numVars);
  },

  resetCells(vars = 4) {
    this.numVars = vars;
    this.cells = {};
    const totalCells = Math.pow(2, vars);
    for (let i = 0; i < totalCells; i++) {
      this.cells[i] = 0;
    }
  },

  clearAll() {
    const totalCells = Math.pow(2, this.numVars);
    for (let i = 0; i < totalCells; i++) {
      this.cells[i] = 0;
    }
  },

  fillAll() {
    const totalCells = Math.pow(2, this.numVars);
    for (let i = 0; i < totalCells; i++) {
      this.cells[i] = 1;
    }
  },

  invertAll() {
    const totalCells = Math.pow(2, this.numVars);
    for (let i = 0; i < totalCells; i++) {
      if (this.cells[i] === 0) this.cells[i] = 1;
      else if (this.cells[i] === 1) this.cells[i] = 0;
    }
  },

  randomize(density = 0.35) {
    const totalCells = Math.pow(2, this.numVars);
    for (let i = 0; i < totalCells; i++) {
      const r = Math.random();
      if (r < density) {
        this.cells[i] = 1;
      } else if (r < density + 0.08) {
        this.cells[i] = 'X';
      } else {
        this.cells[i] = 0;
      }
    }
  },

  toggleCell(mIndex) {
    const curr = this.cells[mIndex];
    if (curr === 0) {
      this.cells[mIndex] = 1;
    } else if (curr === 1) {
      this.cells[mIndex] = 'X';
    } else {
      this.cells[mIndex] = 0;
    }
  },

  setCellValue(mIndex, val) {
    this.cells[mIndex] = val;
  },

  /**
   * Set Preset Sesuai Slide Perkuliahan ITERA & Eksplorasi 5 Variabel
   */
  loadPreset(presetName) {
    switch (presetName) {
      // --- 2-VARIABEL (SLIDE KULIAH ITERA) ---
      case '2var_slide09':
        // Q = AB + A'B + AB' -> minterm: m3, m2, m1 (atau A=1,B=1; A=0,B=1; A=1,B=0)
        this.resetCells(2);
        this.setCellValue(1, 1); // A=0, B=1 (A'B)
        this.setCellValue(2, 1); // A=1, B=0 (AB')
        this.setCellValue(3, 1); // A=1, B=1 (AB)
        break;

      // --- 3-VARIABEL (SLIDE KULIAH ITERA) ---
      case '3var_slide10':
        // Q = ABC' + AB'C' + AB'C + ABC
        this.resetCells(3);
        this.setCellValue(4, 1); // 100
        this.setCellValue(5, 1); // 101
        this.setCellValue(6, 1); // 110
        this.setCellValue(7, 1); // 111
        break;

      case '3var_slide11_lat1':
        // Q = AB' + A'B' -> B'
        this.resetCells(3);
        this.setCellValue(0, 1); // 000
        this.setCellValue(1, 1); // 001
        this.setCellValue(4, 1); // 100
        this.setCellValue(5, 1); // 101
        break;

      case '3var_slide11_lat2':
        // Q = A'B'C + A'BC + AB'C + ABC + ABC' -> Q = AB + C
        this.resetCells(3);
        this.setCellValue(1, 1);
        this.setCellValue(3, 1);
        this.setCellValue(5, 1);
        this.setCellValue(6, 1);
        this.setCellValue(7, 1);
        break;

      // --- 4-VARIABEL (SLIDE KULIAH ITERA) ---
      case '4var_slide13':
        // Q = A'BC'D + ABC'D + A'BCD + ABCD -> Q = BD
        this.resetCells(4);
        this.setCellValue(5, 1);
        this.setCellValue(7, 1);
        this.setCellValue(13, 1);
        this.setCellValue(15, 1);
        break;

      case '4var_slide14_sensor':
        // Sistem Keamanan Gedung 4 Sensor: Q = D + AC + BC
        this.resetCells(4);
        [1, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15].forEach(m => this.setCellValue(m, 1));
        break;

      case '4var_slide17_dontcare':
        // Slide 17 Don't Care condition
        this.resetCells(3);
        this.setCellValue(0, 'X');
        this.setCellValue(2, 'X');
        this.setCellValue(6, 1);
        this.setCellValue(4, 1);
        this.setCellValue(3, 1);
        this.setCellValue(7, 1);
        this.setCellValue(5, 1);
        break;

      case '4var_slide18_parkir':
        // Gerbang Parkir Otomatis: F = A·B·C' + D
        this.resetCells(4);
        [1, 3, 5, 7, 9, 11, 12, 13, 15].forEach(m => this.setCellValue(m, 1));
        break;

      // --- 5-VARIABEL (32 SEL / SUPERPOSISI 3D DUA SUB-PETA) ---
      case '5var_preset1_corner_3d':
        // 4 Sudut di Peta A=0 (m0, m2, m8, m10) & 4 Sudut di Peta A=1 (m16, m18, m24, m26)
        // Membentuk grup 8 sel 3D -> variabel A hilang, B hilang, D hilang -> Q = C'E'
        this.resetCells(5);
        [0, 2, 8, 10, 16, 18, 24, 26].forEach(m => this.setCellValue(m, 1));
        break;

      case '5var_preset2_superposisi':
        // Superposisi dua grup 8 sel tembus antar-peta:
        // Kolom DE=11 pada kedua peta (m3, m7, m11, m15, m19, m23, m27, m31) -> DE
        // Baris BC=11 pada kedua peta (m12, m13, m14, m15, m28, m29, m30, m31) -> BC
        // Hasil sederhana: Q = BC + DE
        this.resetCells(5);
        [3, 7, 11, 15, 19, 23, 27, 31, 12, 13, 14, 28, 29, 30].forEach(m => this.setCellValue(m, 1));
        break;

      case '5var_preset3_mixed':
        // Kombinasi: Grup 8 sel 3D + Grup 4 sel lokal di A=0 + Grup 4 sel lokal di A=1
        // Grup 3D: m(5, 7, 13, 15, 21, 23, 29, 31) -> CE
        // Grup A=0: m(0, 1, 2, 3) -> A'B'C'
        // Grup A=1: m(24, 25, 28, 29) -> AB D'
        this.resetCells(5);
        [5, 7, 13, 15, 21, 23, 29, 31, 0, 1, 2, 3, 24, 25, 28, 29].forEach(m => this.setCellValue(m, 1));
        break;

      case '5var_preset4_dontcare':
        // Pemanfaatan kondisi Don't Care (X) antar sub-peta:
        // Minterm aktif di A=0 baris BC=01: m(4, 5, 6, 7)
        // Don't care di A=1 baris BC=01: m(20, 21, 22, 23)
        // Tanpa X: grup 4 sel di A=0 (A'B'C). Dengan X: grup 8 sel 3D (B'C)!
        this.resetCells(5);
        [4, 5, 6, 7].forEach(m => this.setCellValue(m, 1));
        [20, 21, 22, 23].forEach(m => this.setCellValue(m, 'X'));
        // Tambahan minterm di A=1: m(16, 17, 18, 19) dengan Don't Care di A=0: m(0, 1, 2, 3)
        [16, 17, 18, 19].forEach(m => this.setCellValue(m, 1));
        [0, 1, 2, 3].forEach(m => this.setCellValue(m, 'X'));
        break;

      case '5var_preset5_majority':
        // Sistem Voting Mayoritas 5 Input (A, B, C, D, E):
        // Output = 1 jika setidaknya 3 dari 5 input bernilai 1 (bobot bit >= 3)
        this.resetCells(5);
        for (let i = 0; i < 32; i++) {
          let onesCount = 0;
          for (let b = 0; b < 5; b++) {
            if ((i >> b) & 1) onesCount++;
          }
          if (onesCount >= 3) {
            this.setCellValue(i, 1);
          }
        }
        break;

      default:
        this.resetCells(this.numVars);
    }
  },

  /**
   * Mengubah susunan Baris & Kolom ke Minterm Index
   * Untuk 5-Var: layer (0 untuk A=0, 1 untuk A=1)
   */
  getMintermIndex(rowGray, colGray, numVars, layer = 0) {
    if (numVars === 2) {
      // rowGray = A (0 or 1), colGray = B (0 or 1)
      return (rowGray << 1) | colGray;
    } else if (numVars === 3) {
      // rowGray = C (0 or 1), colGray = AB (00=0, 01=1, 11=3, 10=2)
      return (colGray << 1) | rowGray;
    } else if (numVars === 4) {
      // rowGray = AB (0..3), colGray = CD (0..3)
      return (rowGray << 2) | colGray;
    } else if (numVars === 5) {
      // layer = A (0 or 1), rowGray = BC (0..3), colGray = DE (0..3)
      // Minterm: A B C D E = (A << 4) | (BC << 2) | DE
      return (layer << 4) | (rowGray << 2) | colGray;
    }
    return 0;
  },

  /**
   * Gray Code Map for Grid Dimensions
   */
  getGridDimensions(vars) {
    if (vars === 2) {
      return {
        is5Var: false,
        rowVars: 'A',
        colVars: 'B',
        rows: [{ gray: 0, label: '0' }, { gray: 1, label: '1' }],
        cols: [{ gray: 0, label: '0' }, { gray: 1, label: '1' }]
      };
    } else if (vars === 3) {
      return {
        is5Var: false,
        rowVars: 'C',
        colVars: 'AB',
        rows: [{ gray: 0, label: '0' }, { gray: 1, label: '1' }],
        cols: [
          { gray: 0, label: '00' },
          { gray: 1, label: '01' },
          { gray: 3, label: '11' },
          { gray: 2, label: '10' }
        ]
      };
    } else if (vars === 4) {
      return {
        is5Var: false,
        rowVars: 'AB',
        colVars: 'CD',
        rows: [
          { gray: 0, label: '00' },
          { gray: 1, label: '01' },
          { gray: 3, label: '11' },
          { gray: 2, label: '10' }
        ],
        cols: [
          { gray: 0, label: '00' },
          { gray: 1, label: '01' },
          { gray: 3, label: '11' },
          { gray: 2, label: '10' }
        ]
      };
    } else {
      // 5-Variabel: 2 sub-peta 4x4 (A=0 dan A=1)
      return {
        is5Var: true,
        layerVar: 'A',
        rowVars: 'BC',
        colVars: 'DE',
        layers: [
          { layer: 0, label: 'A = 0', subLabel: 'm0 – m15', name: 'Sub-Peta Kiri (A = 0)' },
          { layer: 1, label: 'A = 1', subLabel: 'm16 – m31', name: 'Sub-Peta Kanan (A = 1)' }
        ],
        rows: [
          { gray: 0, label: '00' },
          { gray: 1, label: '01' },
          { gray: 3, label: '11' },
          { gray: 2, label: '10' }
        ],
        cols: [
          { gray: 0, label: '00' },
          { gray: 1, label: '01' },
          { gray: 3, label: '11' },
          { gray: 2, label: '10' }
        ]
      };
    }
  },

  /**
   * K-Map Solver & Grouping Engine
   * Menemukan Essential Prime Implicants dan Minimal SOP
   * Mendukung K-Map 2, 3, 4, serta 5 Variabel dengan Superposisi 3D
   */
  solve() {
    const vars = this.numVars;
    const totalCells = Math.pow(2, vars);
    const minterms = [];
    const dontCares = [];

    for (let i = 0; i < totalCells; i++) {
      if (this.cells[i] === 1) minterms.push(i);
      else if (this.cells[i] === 'X') dontCares.push(i);
    }

    if (minterms.length === 0) {
      return {
        expression: '0',
        minterms: [],
        dontCares: dontCares,
        groups: [],
        allOnes: false,
        allZero: true
      };
    }

    if (minterms.length + dontCares.length === totalCells) {
      return {
        expression: '1',
        minterms: minterms,
        dontCares: dontCares,
        groups: [{ 
          cells: Array.from({ length: totalCells }, (_, i) => i), 
          term: '1', 
          size: totalCells,
          is3D: vars === 5,
          layers: vars === 5 ? [0, 1] : [0],
          color: this.GROUP_COLORS[0]
        }],
        allOnes: true,
        allZero: false
      };
    }

    const candidateGroups = [];

    if (vars === 5) {
      // ====================================================================
      // 5-VARIABEL 3D SOLVER (2 Sub-Peta: Layer A=0 & Layer A=1)
      // ====================================================================
      const dim = this.getGridDimensions(5);
      const gridToM = [];
      for (let ly = 0; ly < 2; ly++) {
        gridToM[ly] = [];
        for (let r = 0; r < 4; r++) {
          gridToM[ly][r] = [];
          for (let c = 0; c < 4; c++) {
            gridToM[ly][r][c] = this.getMintermIndex(dim.rows[r].gray, dim.cols[c].gray, 5, ly);
          }
        }
      }

      // Seluruh kemungkinan bentuk grup kubus/balok pangkat 2 (L x H x W)
      // L: kedalaman layer (1 = dalam 1 peta saja, 2 = tembus kedua peta)
      // H: tinggi baris BC (1, 2, 4)
      // W: lebar kolom DE (1, 2, 4)
      const groupShapes5 = [
        // Area 32 (Seluruh 32 sel)
        { L: 2, H: 4, W: 4, area: 32 },
        // Area 16 (16 sel)
        { L: 1, H: 4, W: 4, area: 16 }, // Satu sub-peta penuh
        { L: 2, H: 4, W: 2, area: 16 }, // 2 kolom tembus kedua peta
        { L: 2, H: 2, W: 4, area: 16 }, // 2 baris tembus kedua peta
        // Area 8 (8 sel)
        { L: 1, H: 4, W: 2, area: 8 },
        { L: 1, H: 2, W: 4, area: 8 },
        { L: 2, H: 4, W: 1, area: 8 }, // 1 kolom tembus kedua peta
        { L: 2, H: 1, W: 4, area: 8 }, // 1 baris tembus kedua peta
        { L: 2, H: 2, W: 2, area: 8 }, // Persegi 2x2 tembus kedua peta (termasuk 4 sudut)
        // Area 4 (4 sel)
        { L: 1, H: 4, W: 1, area: 4 },
        { L: 1, H: 1, W: 4, area: 4 },
        { L: 1, H: 2, W: 2, area: 4 },
        { L: 2, H: 2, W: 1, area: 4 },
        { L: 2, H: 1, W: 2, area: 4 },
        // Area 2 (2 sel)
        { L: 1, H: 2, W: 1, area: 2 },
        { L: 1, H: 1, W: 2, area: 2 },
        { L: 2, H: 1, W: 1, area: 2 }, // Sel pada posisi sama tembus kedua peta
        // Area 1 (1 sel)
        { L: 1, H: 1, W: 1, area: 1 }
      ];

      for (const shape of groupShapes5) {
        const { L, H, W, area } = shape;
        // Jika L === 2, grup dimulai dari layer 0 dan mengambil layer 0 & 1 secara bersamaan
        // Jika L === 1, grup bisa berada di layer 0 atau layer 1
        const startLayers = (L === 2) ? [0] : [0, 1];

        for (const startL of startLayers) {
          for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
              const cellList = [];
              let allMatch = true;
              let hasMinterm = false;

              for (let dl = 0; dl < L; dl++) {
                const curL = startL + dl;
                for (let dr = 0; dr < H; dr++) {
                  const curR = (r + dr) % 4; // Toroidal wrap-around vertikal
                  for (let dc = 0; dc < W; dc++) {
                    const curC = (c + dc) % 4; // Toroidal wrap-around horizontal
                    const m = gridToM[curL][curR][curC];
                    const val = this.cells[m];
                    if (val !== 1 && val !== 'X') {
                      allMatch = false;
                      break;
                    }
                    if (val === 1) hasMinterm = true;
                    cellList.push(m);
                  }
                  if (!allMatch) break;
                }
                if (!allMatch) break;
              }

              if (allMatch && hasMinterm) {
                cellList.sort((a, b) => a - b);
                const key = cellList.join(',');
                if (!candidateGroups.some(g => g.key === key)) {
                  const term = this.termFromCells(cellList, vars);
                  candidateGroups.push({
                    key,
                    cells: cellList,
                    term,
                    area,
                    is3D: (L === 2),
                    layers: (L === 2) ? [0, 1] : [startL],
                    L, H, W,
                    startL,
                    startR: r,
                    startC: c
                  });
                }
              }
            }
          }
        }
      }

    } else {
      // ====================================================================
      // 2, 3, & 4-VARIABEL 2D SOLVER
      // ====================================================================
      const dim = this.getGridDimensions(vars);
      const numRows = dim.rows.length;
      const numCols = dim.cols.length;

      const gridToM = [];
      for (let r = 0; r < numRows; r++) {
        gridToM[r] = [];
        for (let c = 0; c < numCols; c++) {
          const m = this.getMintermIndex(dim.rows[r].gray, dim.cols[c].gray, vars);
          gridToM[r][c] = m;
        }
      }

      const groupShapes = [];
      const allowedAreas = [16, 8, 4, 2, 1].filter(a => a <= totalCells);

      for (const area of allowedAreas) {
        for (let h = 1; h <= numRows; h *= 2) {
          if (area % h === 0) {
            const w = area / h;
            if (w <= numCols && (w & (w - 1)) === 0) {
              groupShapes.push({ h, w, area });
            }
          }
        }
      }

      for (const shape of groupShapes) {
        const { h, w, area } = shape;
        for (let r = 0; r < numRows; r++) {
          for (let c = 0; c < numCols; c++) {
            const cellList = [];
            let allMatch = true;
            let hasMinterm = false;

            for (let dr = 0; dr < h; dr++) {
              const curR = (r + dr) % numRows;
              for (let dc = 0; dc < w; dc++) {
                const curC = (c + dc) % numCols;
                const m = gridToM[curR][curC];
                const val = this.cells[m];
                if (val !== 1 && val !== 'X') {
                  allMatch = false;
                  break;
                }
                if (val === 1) hasMinterm = true;
                cellList.push(m);
              }
              if (!allMatch) break;
            }

            if (allMatch && hasMinterm) {
              cellList.sort((a, b) => a - b);
              const key = cellList.join(',');
              if (!candidateGroups.some(g => g.key === key)) {
                const term = this.termFromCells(cellList, vars);
                candidateGroups.push({
                  key,
                  cells: cellList,
                  term,
                  area,
                  is3D: false,
                  layers: [0],
                  h, w,
                  startR: r,
                  startC: c
                });
              }
            }
          }
        }
      }
    }

    // Filter prime implicants (grup yang tidak termuat secara utuh di grup lain yang lebih besar)
    const primeImplicants = candidateGroups.filter(g1 => {
      return !candidateGroups.some(g2 => {
        if (g2.area <= g1.area) return false;
        return g1.cells.every(c => g2.cells.includes(c));
      });
    });

    // Greedy cover selection: Menentukan himpunan penutup minimum (SOP Minimum)
    const uncovered = new Set(minterms);
    const chosenGroups = [];

    // Langkah 1: Essential Prime Implicants (EPI)
    for (const m of minterms) {
      const covering = primeImplicants.filter(g => g.cells.includes(m));
      if (covering.length === 1) {
        const epi = covering[0];
        if (!chosenGroups.some(cg => cg.key === epi.key)) {
          chosenGroups.push(epi);
          epi.cells.forEach(c => uncovered.delete(c));
        }
      }
    }

    // Langkah 2: Greedy Cover untuk sisa minterm yang belum tertutup
    while (uncovered.size > 0) {
      let bestPI = null;
      let maxCovers = -1;

      for (const pi of primeImplicants) {
        if (chosenGroups.some(cg => cg.key === pi.key)) continue;
        const count = pi.cells.filter(c => uncovered.has(c)).length;
        if (count > maxCovers) {
          maxCovers = count;
          bestPI = pi;
        }
      }

      if (!bestPI || maxCovers === 0) break;
      chosenGroups.push(bestPI);
      bestPI.cells.forEach(c => uncovered.delete(c));
    }

    // Urutkan grup untuk keterbacaan yang rapi
    chosenGroups.sort((a, b) => a.term.length - b.term.length || a.term.localeCompare(b.term));

    // Tetapkan warna khas untuk setiap grup terpilih
    chosenGroups.forEach((g, idx) => {
      g.color = this.GROUP_COLORS[idx % this.GROUP_COLORS.length];
    });

    const expr = chosenGroups.map(g => g.term).join(' + ') || '0';

    return {
      expression: expr,
      minterms,
      dontCares,
      groups: chosenGroups
    };
  },

  /**
   * Menurunkan product term Boolean dari sekumpulan minterm
   * Mendukung hingga 5 variabel: A, B, C, D, E
   */
  termFromCells(cells, numVars) {
    if (cells.length === Math.pow(2, numVars)) return '1';

    const varNames = ['A', 'B', 'C', 'D', 'E'].slice(0, numVars);
    let termParts = [];

    for (let bitIdx = 0; bitIdx < numVars; bitIdx++) {
      // bitIdx 0 adalah MSB (A), bitIdx 1 adalah B, dst.
      const shift = numVars - 1 - bitIdx;
      const firstBit = (cells[0] >> shift) & 1;
      let isConstant = true;

      for (let i = 1; i < cells.length; i++) {
        const bit = (cells[i] >> shift) & 1;
        if (bit !== firstBit) {
          isConstant = false;
          break;
        }
      }

      if (isConstant) {
        const vName = varNames[bitIdx];
        termParts.push(firstBit === 1 ? vName : `${vName}'`);
      }
    }

    return termParts.join('') || '1';
  }
};

window.KMapEngine = KMapEngine;
