/**
 * ==========================================================================
 * MK SISTEM DIGITAL - ITERA
 * Quiz & Interactive Exercise Engine
 * ==========================================================================
 * Mengintegrasikan soal latihan dari slide perkuliahan Minggu 1 & 2
 * serta generator latihan mandiri tak terbatas.
 */

const QuizEngine = {
  // Soal Kurikulum Resmi dari Slide ITERA
  officialExercisesWeek1: [
    {
      id: 'w1_q1',
      badge: 'Modul Minggu 1 - Slide 37',
      question: 'Konversikan bilangan desimal <strong>258₁₀</strong> ke Heksadesimal dan Oktal menggunakan metode Central Binary!',
      inputs: [
        { label: 'Biner (Central):', key: 'biner', placeholder: 'contoh: 100000010', expected: '100000010' },
        { label: 'Heksadesimal (Basis 16):', key: 'hex', placeholder: 'contoh: 102', expected: '102' },
        { label: 'Oktal (Basis 8):', key: 'oct', placeholder: 'contoh: 402', expected: '402' }
      ],
      solutionText: `
<strong>Langkah Penyelesaian Metode Central Biner:</strong>
1. 258₁₀ ke Biner:
   258 = 256 + 2 = (1 × 2⁸) + (1 × 2¹) = 1 0000 0010₂
2. Biner ke Heksadesimal (Grouping 4-bit dari LSB):
   0001 0000 0010₂
   • 0001₂ = 1₁₆
   • 0000₂ = 0₁₆
   • 0010₂ = 2₁₆
   → Hasil: <strong>102₁₆</strong>
3. Biner ke Oktal (Grouping 3-bit dari LSB):
   100 000 010₂
   • 100₂ = 4₈
   • 000₂ = 0₈
   • 010₂ = 2₈
   → Hasil: <strong>402₈</strong>
`
    },
    {
      id: 'w1_q2',
      badge: 'Modul Minggu 1 - Slide 35 & 36',
      question: 'Konversikan pecahan desimal <strong>0.625₁₀</strong> ke format Biner, Heksadesimal, dan Oktal!',
      inputs: [
        { label: 'Biner (Central):', key: 'biner', placeholder: 'contoh: 0.101', expected: '0.101' },
        { label: 'Heksadesimal:', key: 'hex', placeholder: 'contoh: 0.A', expected: '0.A' },
        { label: 'Oktal:', key: 'oct', placeholder: 'contoh: 0.5', expected: '0.5' }
      ],
      solutionText: `
<strong>Langkah Penyelesaian:</strong>
1. Perkalian berulang dengan 2:
   • 0.625 × 2 = 1.25 → simpan 1
   • 0.25 × 2 = 0.5 → simpan 0
   • 0.5 × 2 = 1.0 → simpan 1
   → Biner: <strong>0.101₂</strong>
2. Biner ke Hex (Grouping 4-bit pecahan ke kanan, tambah 0 di belakang):
   0.101₂ = 0.1010₂
   • 1010₂ = A₁₆ → Hasil: <strong>0.A₁₆</strong>
3. Biner ke Oktal (Grouping 3-bit pecahan ke kanan):
   0.101₂ (pas 3 bit)
   • 101₂ = 5₈ → Hasil: <strong>0.5₈</strong>
`
    },
    {
      id: 'w1_q3',
      badge: 'Modul Minggu 1 - Slide 32',
      question: 'Konversikan bilangan desimal <strong>7562₁₀</strong> ke bilangan Heksadesimal!',
      inputs: [
        { label: 'Heksadesimal:', key: 'hex', placeholder: 'contoh: 1DA8', expected: '1DA8' }
      ],
      solutionText: `
<strong>Pembagian berulang dengan 16:</strong>
• 7562 ÷ 16 = 472 sisa 10 (A)
• 472 ÷ 16 = 29 sisa 8
• 29 ÷ 16 = 1 sisa 13 (D)
• 1 ÷ 16 = 0 sisa 1
Baca sisa dari bawah ke atas: <strong>1DA8₁₆</strong>
`
    }
  ],

  officialExercisesWeek2: [
    {
      id: 'w2_q1',
      badge: 'Modul Minggu 2 - Slide 23 & 24 (Latihan 1.1)',
      question: 'Tuliskan representasi <strong>-58₁₀</strong> dalam format 8-bit Two\'s Complement (C2), serta bentuk Oktal dan Hexadesimalnya!',
      inputs: [
        { label: '8-bit C2:', key: 'c2', placeholder: 'contoh: 11000110', expected: '11000110' },
        { label: 'Heksadesimal (0x..):', key: 'hex', placeholder: 'contoh: C6 atau 0xC6', expected: 'C6' }
      ],
      solutionText: `
<strong>Algoritma 3 Langkah 2\'s Complement:</strong>
1. 58 dalam 8-bit biner = 0011 1010₂
2. Inversi semua bit (NOT) = 1100 0101₂
3. Tambah 1 pada LSB = <strong>1100 0110₂</strong>
4. Dalam Hex: 1100₂ = C₁₆, 0110₂ = 6₁₆ → <strong>0xC6</strong>
`
    },
    {
      id: 'w2_q2',
      badge: 'Modul Minggu 2 - Slide 23 & 24 (Latihan 1.2)',
      question: 'Hitung nilai desimal dari bilangan 8-bit Two\'s Complement: <strong>1011 1111₂</strong>!',
      inputs: [
        { label: 'Nilai Desimal:', key: 'dec', placeholder: 'contoh: -65', expected: '-65' }
      ],
      solutionText: `
<strong>Menggunakan Cara Cepat Modul:</strong>
• Nilai Unsigned (U) = 128 + 32 + 16 + 8 + 4 + 2 + 1 = 191₁₀
• Karena MSB = 1 (negatif), nilai = -(2⁸ - U)
• 256 - 191 = 65
→ Nilai desimal = <strong>-65₁₀</strong>
`
    },
    {
      id: 'w2_q3',
      badge: 'Modul Minggu 2 - Slide 23 & 24 (Latihan 1.3)',
      question: 'Hitung operasi pengurangan <strong>75 - 103</strong> dalam 8-bit C2 via penjumlahan [A + C2(B)]!',
      inputs: [
        { label: 'C2 dari 103 (8-bit):', key: 'c2_b', placeholder: 'contoh: 10011001', expected: '10011001' },
        { label: 'Hasil Desimal:', key: 'result', placeholder: 'contoh: -28', expected: '-28' }
      ],
      solutionText: `
<strong>Langkah Perhitungan Aritmatika C2:</strong>
1. Nilai A = +75 = 0100 1011₂
2. Nilai B = +103 = 0110 0111₂
   C2 dari B (-103) = NOT(0110 0111) + 1 = 1001 1000 + 1 = <strong>1001 1001₂</strong>
3. Penjumlahan:
     0100 1011₂ (+75)
   + 1001 1001₂ (-103)
   ------------------
     1110 0100₂
4. Evaluasi hasil 1110 0100₂:
   U = 128 + 64 + 32 + 4 = 228
   Nilai = -(256 - 228) = <strong>-28₁₀</strong>
`
    },
    {
      id: 'w2_q4',
      badge: 'Modul Minggu 2 - Slide 25 & 26 (Latihan 2)',
      question: 'Tuliskan bilangan desimal <strong>-25₁₀</strong> dalam: a) Sign-Magnitude (8-bit) dan b) 1\'s Complement (8-bit)!',
      inputs: [
        { label: 'Sign-Magnitude (SM):', key: 'sm', placeholder: 'contoh: 10011001', expected: '10011001' },
        { label: '1\'s Complement (C1):', key: 'c1', placeholder: 'contoh: 11100110', expected: '11100110' }
      ],
      solutionText: `
<strong>Langkah:</strong>
1. +25 dalam 8-bit = 0001 1001₂
2. Sign-Magnitude (SM): Ubah MSB menjadi 1:
   <strong>1001 1001₂</strong>
3. 1\'s Complement (C1): Inversi semua bit dari +25:
   NOT(0001 1001) = <strong>1110 0110₂</strong>
`
    }
  ],

  /**
   * Render Soal ke Kontainer DOM
   */
  renderQuizList(containerId, exercises) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = exercises.map(ex => `
      <div class="quiz-card" id="card_${ex.id}">
        <div class="quiz-question-header">
          <span class="quiz-badge">${ex.badge}</span>
        </div>
        <p class="quiz-question-text">${ex.question}</p>

        <div class="quiz-input-group">
          ${ex.inputs.map(inp => `
            <div style="display:flex; flex-direction:column; gap:4px; flex:1; min-width:180px;">
              <label style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">${inp.label}</label>
              <input type="text" class="quiz-input" id="inp_${ex.id}_${inp.key}" placeholder="${inp.placeholder}">
            </div>
          `).join('')}
          <button class="quiz-btn" onclick="QuizEngine.checkAnswer('${ex.id}')">Periksa</button>
        </div>

        <div class="quiz-feedback-box" id="feedback_${ex.id}"></div>
        <button class="quiz-solution-toggle" onclick="QuizEngine.toggleSolution('${ex.id}')">👁️ Tampilkan Pembahasan Lengkap</button>
        <div class="quiz-solution-content" id="solution_${ex.id}">${ex.solutionText}</div>
      </div>
    `).join('');
  },

  /**
   * Evaluasi Jawaban Pengguna
   */
  checkAnswer(exId) {
    let allEx = [...this.officialExercisesWeek1, ...this.officialExercisesWeek2];
    let ex = allEx.find(e => e.id === exId);
    if (!ex) return;

    let isAllCorrect = true;
    let errors = [];

    ex.inputs.forEach(inp => {
      let elem = document.getElementById(`inp_${ex.id}_${inp.key}`);
      let userVal = (elem ? elem.value : '').trim().toUpperCase().replace(/^0X|^0O/, '').replace(/\s+/g, '');
      let expectedVal = inp.expected.trim().toUpperCase().replace(/^0X|^0O/, '').replace(/\s+/g, '');

      if (userVal !== expectedVal) {
        isAllCorrect = false;
        errors.push(`${inp.label} jawaban Anda belum tepat.`);
      }
    });

    let fb = document.getElementById(`feedback_${ex.id}`);
    let card = document.getElementById(`card_${ex.id}`);

    if (isAllCorrect) {
      fb.className = 'quiz-feedback-box correct';
      fb.innerHTML = '🎉 <strong>Luar Biasa!</strong> Jawaban Anda benar sesuai kaidah konversi digital!';
      if (card) card.classList.add('solved-correct');
    } else {
      fb.className = 'quiz-feedback-box wrong';
      fb.innerHTML = `⚠️ <strong>Masih ada yang keliru:</strong><br>${errors.join('<br>')}<br><em>Periksa kembali pengelompokan bit atau klik tombol di bawah untuk melihat langkah penyelesaian.</em>`;
      if (card) card.classList.remove('solved-correct');
    }
  },

  /**
   * Toggle Pembahasan
   */
  toggleSolution(exId) {
    let sol = document.getElementById(`solution_${exId}`);
    if (!sol) return;
    sol.classList.toggle('show');
  }
};

window.QuizEngine = QuizEngine;
