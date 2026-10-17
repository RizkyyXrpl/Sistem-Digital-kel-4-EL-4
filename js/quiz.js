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
3. 1's Complement (C1): Inversi semua bit dari +25:
   NOT(0001 1001) = <strong>1110 0110₂</strong>
`
    }
  ],

  // Soal Kurikulum Resmi dari Slide Pertemuan 3 ITERA
  officialExercisesWeek3: [
    {
      id: 'w3_q1',
      badge: 'Modul Minggu 3 - Slide 14 (Latihan 1)',
      question: 'Sederhanakan ekspresi logika berikut menggunakan hukum Aljabar Boolean:<br>a) Ubah ke bentuk SOP: <strong>(A + B + C)(Ā + B + C)</strong><br>b) Ubah ke bentuk POS: <strong>A·C̄ + A·B·C</strong>',
      inputs: [
        { label: 'Bentuk SOP (a):', key: 'sop', placeholder: 'contoh: B + C', expected: 'B+C' },
        { label: 'Bentuk POS (b):', key: 'pos', placeholder: 'contoh: A(B + C\')', expected: 'A(B+C\')' }
      ],
      solutionText: `
<strong>Langkah Penyelesaian (Slide 14):</strong>
1. Ubah ke bentuk SOP:
   (A + B + C)(Ā + B + C)
   Misalkan X = B + C, maka:
   (X + A)(X + Ā) = X·X + X·Ā + X·A + A·Ā
                  = X + X(A + Ā) + 0
                  = X + X(1) = X
   Substitusi kembali X: <strong>B + C</strong>

2. Ubah ke bentuk POS:
   A·C̄ + A·B·C
   • Faktorkan A: A(C̄ + B·C)
   • Gunakan hukum distributif: (C̄ + B)(C̄ + C) = (C̄ + B)(1) = B + C̄
   → Hasil: <strong>A(B + C')</strong>
`
    },
    {
      id: 'w3_q2',
      badge: 'Modul Minggu 3 - Slide 15 (Contoh)',
      question: 'Sederhanakan ekspresi logika 3-variabel berikut dengan hukum Aljabar Boolean: <strong>Y = ĀBC + ABC</strong>',
      inputs: [
        { label: 'Hasil Penyederhanaan:', key: 'result', placeholder: 'contoh: BC', expected: 'BC' }
      ],
      solutionText: `
<strong>Langkah Penyelesaian (Slide 15):</strong>
Y = ĀBC + ABC
Faktorkan variabel bersama BC:
Y = (Ā + A)BC
Karena Ā + A = 1 (Hukum Komplemen):
Y = (1)BC = <strong>BC</strong>
`
    },
    {
      id: 'w3_q3',
      badge: 'Modul Minggu 3 - Slide 18 (Latihan 3 Rangkaian Kombinasi)',
      question: 'Diberikan rangkaian kombinasi dengan input A dan B:<br>• Gerbang NAND menghasilkan sinyal C = (A·B)\'<br>• Gerbang XOR menghasilkan sinyal D = A ⊕ B<br>• Sinyal C dan D masuk ke gerbang XNOR menghasilkan Q.<br>Tentukan nilai keluaran <strong>Q saat A=1, B=1</strong> dan sebutkan <strong>satu gerbang logika tunggal</strong> yang setara untuk menggantikan seluruh rangkaian tersebut!',
      inputs: [
        { label: 'Nilai Q (saat A=1, B=1):', key: 'q_val', placeholder: '0 atau 1', expected: '1' },
        { label: 'Gerbang Tunggal Ekivalen:', key: 'gate_name', placeholder: 'contoh: OR', expected: 'OR' }
      ],
      solutionText: `
<strong>Langkah Analisis & Tabel Kebenaran (Slide 18):</strong>
1. Saat A = 1, B = 1:
   • C = NAND(1, 1) = (1·1)' = 0
   • D = XOR(1, 1) = 1 ⊕ 1 = 0
   • Q = XNOR(C, D) = (0 ⊕ 0)' = 1

2. Tabel Kebenaran Lengkap:
   • A=0, B=0 → C=1, D=0 → Q = (1 ⊕ 0)' = 0
   • A=0, B=1 → C=1, D=1 → Q = (1 ⊕ 1)' = 1
   • A=1, B=0 → C=1, D=1 → Q = (1 ⊕ 1)' = 1
   • A=1, B=1 → C=0, D=0 → Q = (0 ⊕ 0)' = 1
   Output Q bernilai 1 jika salah satu atau kedua input bernilai 1 (0, 1, 1, 1).
   Maka, rangkaian dapat diganti dengan <strong>Gerbang OR (A + B)</strong> tunggal!
`
    },
    {
      id: 'w3_q4',
      badge: 'Modul Minggu 3 - Slide 19 (Latihan 4)',
      question: 'Rangkaian: Gerbang AND menghasilkan sinyal C = A·B, gerbang OR menghasilkan sinyal D = A+B. Sinyal C dan D masuk ke gerbang XOR menghasilkan keluaran Q. Tuliskan <strong>persamaan aljabar Boolean</strong> paling sederhana untuk keluaran Q!',
      inputs: [
        { label: 'Persamaan Logika Q:', key: 'result', placeholder: 'contoh: A ^ B atau A XOR B', expected: 'A^B' }
      ],
      solutionText: `
<strong>Langkah Pembuktian Aljabar Boolean (Slide 19):</strong>
Q = C ⊕ D = (A·B) ⊕ (A + B)
Gunakan definisi XOR: X ⊕ Y = X̄Y + XȲ
Q = (A·B)'(A + B) + (A·B)(A + B)'
  = (Ā + B̄)(A + B) + (AB)(Ā·B̄)   [Hukum De Morgan]
  = (ĀA + ĀB + B̄A + B̄B) + 0
  = (0 + ĀB + AB̄ + 0)
  = ĀB + AB̄ = <strong>A ⊕ B (Gerbang XOR)</strong>
`
    }
  ],

  // Soal Kurikulum Resmi dari Slide Pertemuan 4 ITERA
  officialExercisesWeek4: [
    {
      id: 'w4_q1',
      badge: 'Modul Minggu 4 - Slide 11 & 12 (Latihan 1 K-Map 2-Var)',
      question: 'Sederhanakan ekspresi logika <strong>Q = AB\' + A\'B\'</strong> menggunakan prinsip pengelompokan K-Map 2 variabel!',
      inputs: [
        { label: 'Hasil Penyederhanaan:', key: 'result', placeholder: 'contoh: B\'', expected: 'B\'' }
      ],
      solutionText: `
<strong>Penyelesaian Menggunakan K-Map (Slide 12):</strong>
1. Isi sel K-Map 2 variabel:
   • AB' (A=1, B=0) bernilai 1
   • A'B' (A=0, B=0) bernilai 1
2. Keduanya berada pada kolom B=0 dan membentuk kelompok ukuran 2 sel (2x1).
3. Karena variabel A berubah (0 dan 1), sedangkan B bernilai tetap 0 (B'):
   → Hasil: <strong>Q = B'</strong>
`
    },
    {
      id: 'w4_q2',
      badge: 'Modul Minggu 4 - Slide 11 & 12 (Latihan 2 K-Map 3-Var)',
      question: 'Sederhanakan fungsi Boolean: <strong>Q = A\'B\'C + A\'BC + AB\'C + ABC + ABC\'</strong> menggunakan K-Map 3 variabel!',
      inputs: [
        { label: 'Ekspresi SOP Sederhana:', key: 'result', placeholder: 'contoh: AB + C', expected: 'AB+C' }
      ],
      solutionText: `
<strong>Penyelesaian Menggunakan K-Map 3 Variabel (Slide 12):</strong>
1. Minterm yang bernilai 1:
   • A'B'C (m1), A'BC (m3), AB'C (m5), ABC (m7), ABC' (m6)
2. Pengelompokan:
   • Kelompok 1: 4 sel pada baris C=1 (m1, m3, m5, m7) → variabel A dan B berubah, menyisakan <strong>C</strong>.
   • Kelompok 2: 2 sel pada kolom AB=11 (m7, m6) → variabel C berubah, menyisakan <strong>AB</strong>.
3. Gabungkan kedua kelompok:
   → Hasil: <strong>Q = AB + C</strong>
`
    },
    {
      id: 'w4_q3',
      badge: 'Modul Minggu 4 - Slide 13 (K-Map 4-Variabel)',
      question: 'Sederhanakan fungsi Boolean 4 variabel: <strong>Q = A\'BC\'D + ABC\'D + A\'BCD + ABCD</strong> menggunakan K-Map!',
      inputs: [
        { label: 'Hasil Penyederhanaan:', key: 'result', placeholder: 'contoh: BD', expected: 'BD' }
      ],
      solutionText: `
<strong>Penyelesaian (Slide 13):</strong>
1. Minterm: m5 (0101), m13 (1101), m7 (0111), m15 (1111).
2. Keempat minterm membentuk kelompok persegi 2x2 (ukuran 4) di kolom CD=01 & 11, dan baris AB=01 & 11.
3. Variabel A berubah (0 dan 1) serta C berubah (0 dan 1).
   Variabel yang tetap konstan adalah B=1 dan D=1.
4. Hasil: <strong>Q = BD</strong>
`
    },
    {
      id: 'w4_q4',
      badge: 'Modul Minggu 4 - Slide 14-16 (Studi Kasus Sistem Sensor ITERA)',
      question: 'Sebuah gedung memiliki 4 sensor: Pintu (A), Jendela (B), Gerak (C), dan Asap (D). Alarm menyala jika: pintu terbuka & ada gerakan (AC), jendela terbuka & ada gerakan (BC), atau ada asap (D). Tentukan ekspresi Boolean minimum dari sistem alarm menggunakan K-Map 4 variabel!',
      inputs: [
        { label: 'Ekspresi Alarm Minimum:', key: 'result', placeholder: 'contoh: D + AC + BC', expected: 'D+AC+BC' }
      ],
      solutionText: `
<strong>Penyelesaian Studi Kasus Sistem Keamanan Gedung (Slide 15-16):</strong>
1. Fungsi awal dari deskripsi sensor: Q(A, B, C, D) = AC + BC + D
2. Minterm aktif (11 minterm):
   • Asap (D=1): m1, m3, m5, m7, m9, m11, m13, m15 (8 minterm)
   • Pintu + Gerak (A=1, C=1): m10, m11, m14, m15
   • Jendela + Gerak (B=1, C=1): m6, m7, m14, m15
   Q = Σm{1, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15}
3. Masukkan ke K-Map 4x4 dan kelompokkan:
   • Kelompok 1 (8 sel pada kolom CD=01 & 11) → <strong>D</strong>
   • Kelompok 2 (4 sel: m10, m11, m14, m15) → <strong>AC</strong>
   • Kelompok 3 (4 sel: m6, m7, m14, m15) → <strong>BC</strong>
4. Hasil fungsi minimum: <strong>Q(A, B, C, D) = D + AC + BC</strong>
`
    },
    {
      id: 'w4_q5',
      badge: 'Modul Minggu 4 - Slide 18 (Latihan 2 Gerbang Parkir Otomatis)',
      question: 'Gerbang parkir otomatis memiliki 4 sensor: A (kartu valid), B (kendaraan di depan), C (kapasitas parkir penuh, 1=penuh), D (tombol darurat, 1=aktif). Gerbang terbuka (F=1) jika kendaraan ada di depan DAN kartu valid DAN kapasitas belum penuh, ATAU tombol darurat ditekan. Tentukan ekspresi logika gerbang terbuka!',
      inputs: [
        { label: 'Fungsi Gerbang (F):', key: 'result', placeholder: 'contoh: ABC\' + D', expected: 'ABC\'+D' }
      ],
      solutionText: `
<strong>Penyelesaian (Slide 18):</strong>
1. Analisis kondisi:
   • Kondisi 1: Kendaraan ada (B=1) dan kartu valid (A=1) dan kapasitas belum penuh (C=0, komplemen C̄ / C') → A·B·C'
   • Kondisi 2: Tombol darurat ditekan (D=1) → D
2. Hubungkan kedua kondisi dengan operasi OR (+):
   Hasil: <strong>F = A·B·C' + D</strong> (atau D + ABC')
`
    },
    {
      id: 'w4_q6',
      badge: 'Latihan K-Map 5-Variabel (Superposisi 3D)',
      question: 'Sederhanakan fungsi logika 5 variabel: <strong>Q(A, B, C, D, E) = Σm(0, 2, 8, 10, 16, 18, 24, 26)</strong> menggunakan K-Map 5 variabel (dua sub-peta 4×4)!',
      inputs: [
        { label: 'Ekspresi SOP Minimum:', key: 'result', placeholder: 'contoh: C\'E\'', expected: 'C\'E\'' }
      ],
      solutionText: `
<strong>Penyelesaian Menggunakan K-Map 5 Variabel:</strong>
1. Pemetaan ke Dua Sub-Peta:
   • Sub-peta A=0 memuat 4 sudut: m0 (00000), m2 (00010), m8 (01000), m10 (01010).
   • Sub-peta A=1 memuat 4 sudut identik: m16 (10000), m18 (10010), m24 (11000), m26 (11010).
2. Adjasensi Superposisi 3D:
   • 4 sudut di sub-peta A=0 membentuk grup 4 sel.
   • 4 sudut di sub-peta A=1 membentuk grup 4 sel pada posisi yang sama persis.
   • Karena posisinya bertumpuk antar-lapisan, kedelapannya digabung menjadi <strong>1 kelompok kubus 8 sel (2x2x2)</strong>.
3. Variabel yang Berubah dan Konstan:
   • A berubah (0 & 1) → A tereliminasi.
   • B berubah (0 & 1) → B tereliminasi.
   • C konstan bernilai 0 → C'.
   • D berubah (0 & 1) → D tereliminasi.
   • E konstan bernilai 0 → E'.
4. Hasil fungsi minimum: <strong>Q = C'E'</strong>
`
    }
  ],

  // Soal Kurikulum Resmi dari Slide Pertemuan 5 ITERA (Adder & Subtractor)
  officialExercisesWeek5: [
    {
      id: 'w5_q1',
      badge: 'Modul Minggu 5 - Slide 14-16 (Full Adder)',
      question: 'Tuliskan persamaan logika keluaran <strong>Sum (S)</strong> dan <strong>Carry-out (Cout)</strong> untuk Full Adder 3-input (A, B, Cin)!',
      inputs: [
        { label: 'Persamaan Sum (S):', key: 'sum', placeholder: 'contoh: A ^ B ^ Cin', expected: 'A^B^Cin' },
        { label: 'Persamaan Cout:', key: 'cout', placeholder: 'contoh: AB + Cin(A ^ B)', expected: 'AB+Cin(A^B)' }
      ],
      solutionText: `
<strong>Persamaan Logika Standar Full Adder (Slide 16):</strong>
1. <strong>Sum (S):</strong>
   • Menghasilkan nilai 1 jika jumlah bit 1 berhitung ganjil (1 atau 3 buah bit 1).
   • Formula gerbang XOR: <strong>S = A ⊕ B ⊕ Cin</strong>
2. <strong>Carry-out (Cout):</strong>
   • Menghasilkan carry jika minimal 2 dari 3 input bernilai 1.
   • Formula SOP: <strong>Cout = A·B + Cin·(A ⊕ B)</strong>
   • (Atau ekuivalen bentuk minterm kanonik: AB + BCin + ACin).
`
    },
    {
      id: 'w5_q2',
      badge: 'Modul Minggu 5 - Slide 19 (Propagasi Delay RCA)',
      question: 'Pada Ripple Carry Adder (RCA) 32-bit, berapa banyak tahapan perambatan carry (propagation delay stage) yang harus dilalui oleh carry dari bit terendah (LSB) ke bit tertinggi (MSB)? Serta sebutkan nama jenis adder yang dirancang untuk mengatasi delay tersebut dengan menghitung carry secara paralel!',
      inputs: [
        { label: 'Jumlah Tahapan Delay (angka):', key: 'stages', placeholder: 'contoh: 31', expected: '31' },
        { label: 'Solusi Adder Cepat (Singkatan):', key: 'solution_adder', placeholder: 'contoh: CLA', expected: 'CLA' }
      ],
      solutionText: `
<strong>Analisis Propagation Delay (Slide 19 & 20):</strong>
• Pada RCA n-bit, carry dari bit LSB (FA0) harus merambat secara serial melalui n-1 tahapan Full Adder berikutnya.
• Untuk RCA 32-bit: jumlah tahapan carry = 32 - 1 = <strong>31 tahapan delay</strong>.
• Solusi kecepatan tinggi pada ALU prosesor modern adalah <strong>CLA (Carry Lookahead Adder)</strong> yang menghitung semua carry secara serempak/paralel dengan logika Generate (G) dan Propagate (P).
`
    },
    {
      id: 'w5_q3',
      badge: 'Modul Minggu 5 - Slide 21 & 22 (Generate & Propagate CLA)',
      question: 'Diberikan Carry Lookahead Adder (CLA). Tuliskan rumus pembentuk <strong>Generate (Gi)</strong> dan <strong>Propagate (Pi)</strong> dari dua bit input Ai dan Bi, serta rumus untuk <strong>C1</strong>!',
      inputs: [
        { label: 'Rumus Generate (Gi):', key: 'gi', placeholder: 'contoh: Ai·Bi', expected: 'Ai·Bi' },
        { label: 'Rumus Propagate (Pi):', key: 'pi', placeholder: 'contoh: Ai ^ Bi', expected: 'Ai^Bi' },
        { label: 'Rumus C₁:', key: 'c1', placeholder: 'contoh: G0 + P0·C0', expected: 'G0+P0·C0' }
      ],
      solutionText: `
<strong>Konsep Dasar CLA (Slide 21 & 22):</strong>
1. <strong>Generate (Gi):</strong> Terjadi jika kedua bit input bernilai 1 sehingga pasti menghasilkan carry baru: <strong>Gi = Ai · Bi</strong>
2. <strong>Propagate (Pi):</strong> Terjadi jika salah satu input bernilai 1 sehingga meneruskan carry sebelumnya: <strong>Pi = Ai ⊕ Bi</strong>
3. <strong>Carry bit-1 (C1):</strong> <strong>C1 = G0 + P0 · C0</strong>
   (dan C2 = G1 + P1·G0 + P1·P0·C0 dihitung paralel tanpa menunggu C1 selesai merambat).
`
    },
    {
      id: 'w5_q4',
      badge: 'Modul Minggu 5 - Slide 27 (Half Subtractor)',
      question: 'Tuliskan persamaan logika untuk Half Subtractor: Difference (D) dan Borrow (B) dari dua bit input A dan B (A - B)!',
      inputs: [
        { label: 'Difference (D):', key: 'diff', placeholder: 'contoh: A ^ B', expected: 'A^B' },
        { label: 'Borrow (B):', key: 'borrow', placeholder: 'contoh: A\'B', expected: 'A\'B' }
      ],
      solutionText: `
<strong>Persamaan Logika Half Subtractor (Slide 27):</strong>
• <strong>Difference (D):</strong> Bernilai 1 jika A ≠ B → <strong>D = A ⊕ B</strong>
• <strong>Borrow (B):</strong> Bernilai 1 hanya jika pengurangan 0 - 1 (A=0 dan B=1) yang memerlukan pinjam → <strong>B = Ā · B (atau A'B)</strong>
`
    },
    {
      id: 'w5_q5',
      badge: 'Modul Minggu 5 - Slide 31-33 (Adder-Subtractor Terintegrasi)',
      question: 'Pada 4-Bit Adder-Subtractor Terintegrasi dengan kontrol mode M: Jika A = 1001₂ (9₁₀) dan B = 0101₂ (5₁₀), tentukan nilai kontrol <strong>M</strong> untuk pengurangan (A - B), serta tuliskan 4-bit hasil keluaran <strong>Sum (S3..S0)</strong> dan nilai <strong>Cout final</strong>!',
      inputs: [
        { label: 'Nilai M (0 atau 1):', key: 'mode_m', placeholder: '0 atau 1', expected: '1' },
        { label: 'Hasil 4-bit (S):', key: 'result_s', placeholder: 'contoh: 0100', expected: '0100' },
        { label: 'Cout Final:', key: 'cout_val', placeholder: '0 atau 1', expected: '1' }
      ],
      solutionText: `
<strong>Operasi Pengurangan Terintegrasi M=1 (Slide 33):</strong>
1. Kontrol mode pengurangan: <strong>M = 1</strong> (memicu XOR membalik B menjadi B' dan memberi Cin0 = 1 untuk 2's complement).
2. Input B = 0101₂ → B' = B ⊕ 1 = 1010₂
3. Penjumlahan A + B' + Cin0:
     1001₂ (9)
   + 1010₂
   +    1₂ (Cin0)
   -------
   1 0100₂
4. Hasil keluaran: <strong>S = 0100₂ (4₁₀)</strong>
5. Nilai <strong>Cout final = 1</strong> (menandakan hasil positif dan tidak ada borrow).
`
    }
  ],

  // Soal Kurikulum Resmi dari Slide Pertemuan 6 ITERA (Multilevel NAND/NOR & MUX)
  officialExercisesWeek6: [
    {
      id: 'w6_q1',
      badge: 'Modul Minggu 6 - Slide 15 & 16 (Latihan 1 & 2)',
      question: 'Implementasikan fungsi logika dasar berikut hanya dengan gerbang universal:<br>a) F(A, B) = A · B menggunakan HANYA gerbang NAND!<br>b) F(A, B) = A + B menggunakan HANYA gerbang NOR!',
      inputs: [
        { label: 'F = A·B via NAND:', key: 'nand_and', placeholder: 'contoh: ((AB)\')\'', expected: '((AB)\')\'' },
        { label: 'F = A+B via NOR:', key: 'nor_or', placeholder: 'contoh: ((A+B)\')\'', expected: '((A+B)\')\'' }
      ],
      solutionText: `
<strong>Penyelesaian Soal 1 & 2 Slide 16:</strong>
1. <strong>F(A,B) = A · B dengan NAND:</strong>
   • A·B = ((A·B)')'
   • Gunakan gerbang NAND pertama untuk menghasilkan (A·B)'.
   • Masukkan ke gerbang NAND kedua (kedua input digabung sebagai inverter) untuk mendapatkan ((A·B)')' = <strong>A · B</strong>.
2. <strong>F(A,B) = A + B dengan NOR:</strong>
   • A + B = ((A + B)')'
   • Gerbang NOR pertama menghasilkan (A + B)'.
   • Gerbang NOR kedua berfungsi sebagai inverter menghasilkan <strong>A + B</strong>.
`
    },
    {
      id: 'w6_q2',
      badge: 'Modul Minggu 6 - Slide 15 & 16 (Latihan 3 & 4 SOP via NAND)',
      question: 'Tuliskan implementasi fungsi SOP berikut dalam bentuk ekspresi NAND bertingkat (multilevel NAND):<br>a) F(A, B, C) = A·B̄ + B·C<br>b) F(A, B, C) = Ā·C + A·B·C̄',
      inputs: [
        { label: 'Ekspresi NAND (a):', key: 'res_a', placeholder: 'contoh: ((AB\')\'·(BC)\')\'', expected: '((AB\')\'·(BC)\')\'' },
        { label: 'Ekspresi NAND (b):', key: 'res_b', placeholder: 'contoh: ((A\'C)\'·(ABC\')\')\'', expected: '((A\'C)\'·(ABC\')\')\'' }
      ],
      solutionText: `
<strong>Penyelesaian Soal 3 & 4 Slide 16:</strong>
1. <strong>F = A·B̄ + B·C:</strong>
   • Suku 1: A·B̄ direalisasikan dengan gerbang NAND: (A·B̄)'
   • Suku 2: B·C direalisasikan dengan gerbang NAND: (B·C)'
   • OR antar suku menurut hukum De Morgan: X + Y = (X' · Y')'
   → <strong>F = ((A·B̄)' · (B·C)')'</strong> (rangkaian 2/3 level NAND).
2. <strong>F = Ā·C + A·B·C̄:</strong>
   • Suku 1: Ā·C di-NAND → (Ā·C)'
   • Suku 2: A·B·C̄ di-NAND → (A·B·C̄)'
   • Gabungkan dengan NAND: <strong>F = ((Ā·C)' · (A·B·C̄)')'</strong>
`
    },
    {
      id: 'w6_q3',
      badge: 'Modul Minggu 6 - Slide 15 & 16 (Latihan 5 4-Variabel)',
      question: 'Implementasikan fungsi 4-variabel berikut hanya dengan gerbang NAND:<br><strong>F(W, X, Y, Z) = W·X̄ + W̄·Y·Z + X·Z̄</strong>!',
      inputs: [
        { label: 'Bentuk NAND Bertingkat:', key: 'res_5', placeholder: 'contoh: ((WX\')\'·(W\'YZ)\'·(XZ\')\')\'', expected: '((WX\')\'·(W\'YZ)\'·(XZ\')\')\'' }
      ],
      solutionText: `
<strong>Penyelesaian Soal 5 Slide 16:</strong>
1. Realisasikan masing-masing suku AND dengan NAND:
   • Suku 1: W·X̄ = ((W·X̄)')'
   • Suku 2: W̄·Y·Z = ((W̄·Y·Z)')'
   • Suku 3: X·Z̄ = ((X·Z̄)')'
2. Gabungkan ketiga suku menggunakan hukum De Morgan pada gerbang OR:
   X + Y + Z = (X̄ · Ȳ · Z̄)'
3. Hasil akhir susunan NAND-only:
   <strong>F = ((W·X̄)' · (W̄·Y·Z)' · (X·Z̄)')'</strong>
`
    },
    {
      id: 'w6_q4',
      badge: 'Modul Minggu 6 - Slide 18-20 (Multiplexer 4:1)',
      question: 'Sebuah 4:1 Multiplexer memiliki input data D₀, D₁, D₂, D₃ dan select lines S₁S₀. Jika nilai <strong>S₁=1 dan S₀=0</strong>, input manakah yang diteruskan ke output Y? Serta tuliskan persamaan logika untuk 4:1 MUX!',
      inputs: [
        { label: 'Jalur Input Terpilih:', key: 'selected_d', placeholder: 'contoh: D2', expected: 'D2' },
        { label: 'Persamaan 4:1 MUX:', key: 'mux_eq', placeholder: 'contoh: S1\'S0\'D0 + S1\'S0D1 + S1S0\'D2 + S1S0D3', expected: 'S1\'S0\'D0+S1\'S0D1+S1S0\'D2+S1S0D3' }
      ],
      solutionText: `
<strong>Prinsip Kerja 4:1 MUX (Slide 20):</strong>
1. Kombinasi select lines: S₁=1, S₀=0 bernilai biner 10₂ = 2₁₀.
   Maka jalur input data yang diteruskan ke keluaran adalah <strong>D₂</strong>.
2. Persamaan Boolean output MUX 4:1:
   <strong>Y = S̄₁S̄₀D₀ + S̄₁S₀D₁ + S₁S̄₀D₂ + S₁S₀D₃</strong>
`
    }
  ],

  // Soal Kurikulum Resmi dari Slide Pertemuan 7 ITERA (Decoder, Encoder & 7-Segment)
  officialExercisesWeek7: [
    {
      id: 'w7_q1',
      badge: 'Modul Minggu 7 - Slide 10 & 11 (Decoder 2 to 4)',
      question: 'Tuliskan persamaan logika keluaran untuk jalur <strong>F₀</strong> dan jalur <strong>F₃</strong> pada Decoder 2-to-4 dengan input biner X dan Y!',
      inputs: [
        { label: 'Persamaan F₀:', key: 'f0', placeholder: 'contoh: X\'Y\'', expected: 'X\'Y\'' },
        { label: 'Persamaan F₃:', key: 'f3', placeholder: 'contoh: XY', expected: 'XY' }
      ],
      solutionText: `
<strong>Persamaan Logika Decoder 2 to 4 (Slide 11):</strong>
• F₀ aktif jika X=0, Y=0 → <strong>F₀ = X̄ · Ȳ (atau X'Y')</strong>
• F₁ aktif jika X=0, Y=1 → <strong>F₁ = X̄ · Y</strong>
• F₂ aktif jika X=1, Y=0 → <strong>F₂ = X · Ȳ</strong>
• F₃ aktif jika X=1, Y=1 → <strong>F₃ = X · Y</strong>
`
    },
    {
      id: 'w7_q2',
      badge: 'Modul Minggu 7 - Slide 15 & 16 (IC 74138 Octal Decoder)',
      question: 'IC 74138 adalah sebuah 3-to-8 decoder. Apakah sifat logika pada terminal keluarannya (Active HIGH atau Active LOW)? Serta tuliskan kondisi logika pada 3 kaki enable (Ē₁, Ē₂, E₃) agar IC ini aktif bekerja!',
      inputs: [
        { label: 'Sifat Output (Active LOW / Active HIGH):', key: 'output_type', placeholder: 'Active LOW atau Active HIGH', expected: 'Active LOW' },
        { label: 'Syarat Enable (E1, E2, E3):', key: 'enable_condition', placeholder: 'contoh: 0, 0, 1', expected: '0,0,1' }
      ],
      solutionText: `
<strong>Karakteristik IC 74138 (Slide 15 & 16):</strong>
• Terminal output Ȳ₀ s.d Ȳ₇ bertanda bar/lingkaran (bubble), yang berarti berkarakter <strong>Active LOW</strong> (output terpilih bernilai 0V / logika 0, sedangkan output lainnya bernilai 1).
• IC memiliki 3 pin enable: dua active-low (Ē₁, Ē₂) dan satu active-high (E₃).
• Agar IC aktif bekerja, kondisinya harus: <strong>Ē₁ = 0, Ē₂ = 0, dan E₃ = 1 (0, 0, 1)</strong>.
`
    },
    {
      id: 'w7_q3',
      badge: 'Modul Minggu 7 - Slide 26 (Priority Encoder 74LS148)',
      question: 'Pada Priority Encoder 8-to-3, jika input D₃, D₅, dan D₆ aktif secara bersamaan, input manakah yang memiliki hak prioritas tertinggi, dan berapakah nilai kode biner keluarannya (Y₂ Y₁ Y₀)?',
      inputs: [
        { label: 'Input Prioritas:', key: 'prio_input', placeholder: 'contoh: D6', expected: 'D6' },
        { label: 'Output Biner 3-bit (Y2 Y1 Y0):', key: 'binary_code', placeholder: 'contoh: 110', expected: '110' }
      ],
      solutionText: `
<strong>Prinsip Kerja Priority Encoder (Slide 26):</strong>
• Priority encoder menyelesaikan masalah konflik saat lebih dari satu input aktif dengan memilih input berindeks paling tinggi.
• Di antara D₃, D₅, dan D₆, input tertinggi adalah <strong>D₆</strong>.
• Nilai biner dari desimal 6 adalah <strong>110₂</strong> (Y₂=1, Y₁=1, Y₀=0).
`
    },
    {
      id: 'w7_q4',
      badge: 'Modul Minggu 7 - Slide 31 (Common Anode vs Common Cathode)',
      question: 'Pada perancangan 7-Segment Display, sebutkan nilai logika aktivasi segmen LED:<br>a) Pada Common Anode (CA), segmen LED menyala jika diberi logika apa (0 atau 1)?<br>b) Pada Common Cathode (CC), segmen LED menyala jika diberi logika apa (0 atau 1)?',
      inputs: [
        { label: 'Logika Aktif CA (0 atau 1):', key: 'ca_active', placeholder: '0 atau 1', expected: '0' },
        { label: 'Logika Aktif CC (0 atau 1):', key: 'cc_active', placeholder: '0 atau 1', expected: '1' }
      ],
      solutionText: `
<strong>Karakteristik Polaritas 7-Segment (Slide 31):</strong>
• <strong>Common Anode (CA):</strong> Semua kutub anoda (+) dihubungkan bersama ke VCC (+5V). Segmen akan menyala saat katodanya ditarik ke <strong>logika LOW (0V / logika 0)</strong> sehingga arus dapat mengalir.
• <strong>Common Cathode (CC):</strong> Semua kutub katoda (-) dihubungkan bersama ke GND (0V). Segmen akan menyala saat anodanya diberi tegangan <strong>logika HIGH (+5V / logika 1)</strong>.
`
    },
    {
      id: 'w7_q5',
      badge: 'Modul Minggu 7 - Slide 32 (Kode BCD 8421)',
      question: 'Konversikan bilangan desimal <strong>59₁₀</strong> ke dalam format kode BCD (Binary Coded Decimal 8421)!',
      inputs: [
        { label: 'Kode BCD 8421 (8-bit):', key: 'bcd_59', placeholder: 'contoh: 0101 1001', expected: '0101 1001' }
      ],
      solutionText: `
<strong>Konsep Representasi BCD (Slide 32):</strong>
• BCD mengkodekan SETIAP digit desimal secara terpisah menjadi 4-bit biner dengan bobot 8421.
• Digit pertama: 5₁₀ = 0101₂
• Digit kedua: 9₁₀ = 1001₂
• Gabungkan kedua grup 4-bit: 59₁₀ = <strong>0101 1001 (BCD)</strong>.
`
    }
  ],

  /**
   * Render Soal ke Kontainer DOM
   */
  renderQuizList(containerId, exercises) {
    const container = document.getElementById(containerId);
    if (!container || !exercises) return;

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
   * Helper Normalisasi Ekspresi Boolean
   */
  normalizeExpr(str) {
    if (!str) return '';
    return str
      .toUpperCase()
      .replace(/['’`]/g, "'")
      .replace(/[ĀĀ]/g, "A'")
      .replace(/[B̄B̄]/g, "B'")
      .replace(/[C̄C̄]/g, "C'")
      .replace(/[D̄D̄]/g, "D'")
      .replace(/[⊕\^]/g, '^')
      .replace(/XOR/g, '^')
      .replace(/·|\*/g, '')
      .replace(/\s+/g, '')
      .replace(/^0X|^0O/, '');
  },

  /**
   * Evaluasi Jawaban Pengguna
   */
  checkAnswer(exId) {
    let allEx = [
      ...this.officialExercisesWeek1,
      ...this.officialExercisesWeek2,
      ...(this.officialExercisesWeek3 || []),
      ...(this.officialExercisesWeek4 || []),
      ...(this.officialExercisesWeek5 || []),
      ...(this.officialExercisesWeek6 || []),
      ...(this.officialExercisesWeek7 || [])
    ];
    let ex = allEx.find(e => e.id === exId);
    if (!ex) return;

    let isAllCorrect = true;
    let errors = [];

    ex.inputs.forEach(inp => {
      let elem = document.getElementById(`inp_${ex.id}_${inp.key}`);
      let userRaw = elem ? elem.value : '';
      let userNorm = this.normalizeExpr(userRaw);
      let expNorm = this.normalizeExpr(inp.expected);

      // Support alternative sums order e.g. "B+C" vs "C+B", "AB+C" vs "C+AB", "D+AC+BC"
      let isMatch = userNorm === expNorm;

      if (!isMatch && expNorm.includes('+')) {
        let userTerms = userNorm.split('+').sort().join('+');
        let expTerms = expNorm.split('+').sort().join('+');
        if (userTerms === expTerms) isMatch = true;
      }

      if (!isMatch && expNorm.includes('^')) {
        let userTerms = userNorm.split('^').sort().join('^');
        let expTerms = expNorm.split('^').sort().join('^');
        if (userTerms === expTerms) isMatch = true;
      }

      // Check for XOR synonyms
      if (!isMatch && (expNorm === 'A^B' || expNorm === 'XOR')) {
        if (userNorm === 'A^B' || userNorm === 'XOR' || userNorm === 'AXORB' || userNorm === "A'B+AB'") {
          isMatch = true;
        }
      }

      // Check for OR gate synonym
      if (!isMatch && expNorm === 'OR') {
        if (userNorm === 'OR' || userNorm === 'A+B' || userNorm === 'GERBANGOR') {
          isMatch = true;
        }
      }

      if (!isMatch) {
        isAllCorrect = false;
        errors.push(`${inp.label} jawaban Anda belum tepat.`);
      }
    });

    let fb = document.getElementById(`feedback_${ex.id}`);
    let card = document.getElementById(`card_${ex.id}`);

    if (isAllCorrect) {
      fb.className = 'quiz-feedback-box correct';
      fb.innerHTML = '🎉 <strong>Luar Biasa!</strong> Jawaban Anda benar sesuai kaidah logika digital!';
      if (card) card.classList.add('solved-correct');
    } else {
      fb.className = 'quiz-feedback-box wrong';
      fb.innerHTML = `⚠️ <strong>Masih ada yang keliru:</strong><br>${errors.join('<br>')}<br><em>Periksa kembali penulisan persamaan atau klik tombol di bawah untuk melihat pembahasan lengkap.</em>`;
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
