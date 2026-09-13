/**
 * ==========================================================================
 * MK SISTEM DIGITAL - ITERA
 * Week 2 Engine: Signed Number Representations & 2's Complement Arithmetic
 * ==========================================================================
 * Mengimplementasikan modul Pertemuan 2 ITERA:
 * - Sign-Magnitude (SM)
 * - 1's Complement (C1) & End-Around Carry
 * - 2's Complement (C2) - Standar CPU/MCU
 * - Algoritma 3-Langkah C2 & Rumus Nilai -(2^n - U)
 * - Representasi Negatif dalam Hex & Oktal (2^n - |x|)
 * - Operasi Aritmatika Biner & Pengurangan via Penjumlahan A + C2(B)
 * - Deteksi Overflow: (Carry ke MSB) XOR (Carry keluar MSB) = 1
 * - Sign Extension (8-bit ke 16-bit)
 */

const SignedComplementEngine = {
  /**
   * Representasi Bilangan Bertanda n-bit (SM, C1, C2)
   */
  getSignedRepresentations(decimalVal, nBits = 8) {
    const num = parseInt(decimalVal, 10);
    const minC2 = -(2 ** (nBits - 1));
    const maxC2 = 2 ** (nBits - 1) - 1;
    const minSMC1 = -(2 ** (nBits - 1) - 1);
    const maxSMC1 = 2 ** (nBits - 1) - 1;

    if (num < minC2 || num > maxC2) {
      throw new Error(`Nilai ${num} di luar rentang valid untuk ${nBits}-bit C2 [${minC2} s.d. +${maxC2}]`);
    }

    const absVal = Math.abs(num);
    const absBinary = absVal.toString(2).padStart(nBits, '0');
    const isNegative = num < 0;

    // 1. Sign-Magnitude (SM)
    let smBits = '';
    let smValid = num >= minSMC1 && num <= maxSMC1;
    if (smValid) {
      if (!isNegative) {
        smBits = absBinary;
      } else {
        smBits = '1' + absVal.toString(2).padStart(nBits - 1, '0');
      }
    } else {
      smBits = 'Di luar rentang SM';
    }

    // 2. 1's Complement (C1)
    let c1Bits = '';
    let c1Valid = num >= minSMC1 && num <= maxSMC1;
    if (c1Valid) {
      if (!isNegative) {
        c1Bits = absBinary;
      } else {
        c1Bits = absBinary.split('').map(b => b === '0' ? '1' : '0').join('');
      }
    } else {
      c1Bits = 'Di luar rentang C1';
    }

    // 3. 2's Complement (C2) - 3 Langkah Algoritma
    let c2Bits = '';
    let step1_binary = absBinary;
    let step2_not = absBinary.split('').map(b => b === '0' ? '1' : '0').join('');
    let step3_plus1 = '';

    if (!isNegative) {
      c2Bits = absBinary;
      step3_plus1 = absBinary;
    } else {
      // Add 1 to step2_not
      let carry = 1;
      let resArr = step2_not.split('').reverse();
      for (let i = 0; i < resArr.length; i++) {
        let bit = parseInt(resArr[i]) + carry;
        if (bit === 2) {
          resArr[i] = '0';
          carry = 1;
        } else if (bit === 1) {
          resArr[i] = '1';
          carry = 0;
        } else {
          resArr[i] = '0';
          carry = 0;
        }
      }
      c2Bits = resArr.reverse().join('');
      step3_plus1 = c2Bits;
    }

    // Hex and Octal Representation of C2
    // Rumus: jika negatif -> 2^n - |x|
    const totalModulo = 2 ** nBits;
    const unsignedVal = isNegative ? totalModulo - absVal : num;
    const hexVal = '0x' + unsignedVal.toString(16).toUpperCase().padStart(Math.ceil(nBits / 4), '0');
    const octVal = '0o' + unsignedVal.toString(8).padStart(Math.ceil(nBits / 3), '0');

    // Sign Extension to 16-bit
    const msb = c2Bits[0];
    const extended16 = msb.repeat(16 - nBits) + c2Bits;

    return {
      decimalVal: num,
      nBits,
      isNegative,
      absVal,
      rangeC2: `[${minC2} s.d. +${maxC2}]`,
      rangeSMC1: `[${minSMC1} s.d. +${maxSMC1}]`,
      sm: { bits: smBits, valid: smValid },
      c1: { bits: c1Bits, valid: c1Valid },
      c2: {
        bits: c2Bits,
        step1: step1_binary,
        step2_not: step2_not,
        step3_plus1: step3_plus1,
        unsignedVal,
        hexVal,
        octVal,
        extended16
      }
    };
  },

  /**
   * Evaluasi Nilai Desimal dari Biner C2 Menggunakan Rumus Modul
   * Formula: -b_{n-1} * 2^{n-1} + sum(b_i * 2^i)
   * Cara Cepat: -(2^n - U)
   */
  c2BinaryToDecimal(c2BinaryStr) {
    const bits = c2BinaryStr.trim();
    const n = bits.length;
    const msb = parseInt(bits[0]);
    const unsignedVal = parseInt(bits, 2);

    let formulaSum = 0;
    let weightSteps = [];

    // MSB contribution
    let msbWeight = -(msb * (2 ** (n - 1)));
    formulaSum += msbWeight;
    weightSteps.push({
      bit: msb,
      power: n - 1,
      isMsb: true,
      term: msb === 1 ? `-(${2 ** (n - 1)})` : '0'
    });

    for (let i = 1; i < n; i++) {
      let b = parseInt(bits[i]);
      let p = n - 1 - i;
      let w = b * (2 ** p);
      formulaSum += w;
      weightSteps.push({
        bit: b,
        power: p,
        isMsb: false,
        term: b === 1 ? `+${2 ** p}` : '+0'
      });
    }

    // Cara cepat
    let fastDiff = (2 ** n) - unsignedVal;
    let fastResult = msb === 1 ? -fastDiff : unsignedVal;

    return {
      bits,
      n,
      msb,
      unsignedVal,
      formulaSum,
      weightSteps,
      fastDiff,
      fastResult,
      isNegative: msb === 1
    };
  },

  /**
   * Operasi Penjumlahan & Pengurangan via C2 A + C2(B)
   * Dilengkapi deteksi Carry dan Overflow: (Carry ke MSB) XOR (Carry keluar MSB) = 1
   */
  performArithmeticC2(valA, valB, operation = 'ADD', nBits = 8) {
    let numA = parseInt(valA, 10);
    let numB = parseInt(valB, 10);
    let effectiveB = operation === 'SUB' ? -numB : numB;

    let repA = this.getSignedRepresentations(numA, nBits);
    let repB = this.getSignedRepresentations(effectiveB, nBits);

    let binA = repA.c2.bits;
    let binB = repB.c2.bits;

    // Perform bit-by-bit addition with carry tracking
    let carries = new Array(nBits + 1).fill(0);
    let sumBits = new Array(nBits).fill('0');

    let cIn = 0;
    for (let i = nBits - 1; i >= 0; i--) {
      let bA = parseInt(binA[i]);
      let bB = parseInt(binB[i]);
      let bitSum = bA + bB + cIn;
      sumBits[i] = (bitSum % 2).toString();
      cIn = Math.floor(bitSum / 2);
      carries[i] = cIn; // carry into bit i-1
    }

    let resultBin = sumBits.join('');
    let carryIntoMSB = carries[1];
    let carryOutOfMSB = carries[0];
    let overflow = (carryIntoMSB ^ carryOutOfMSB) === 1;

    let theoreticalResult = numA + effectiveB;
    let actualDecimal = this.c2BinaryToDecimal(resultBin).formulaSum;

    return {
      numA,
      numB,
      operation,
      effectiveB,
      nBits,
      binA,
      binB,
      carries: carries.slice(0, nBits).join(''),
      carryIntoMSB,
      carryOutOfMSB,
      resultBin,
      overflow,
      theoreticalResult,
      actualDecimal,
      isNegative: resultBin[0] === '1',
      zeroFlag: resultBin.split('').every(b => b === '0')
    };
  }
};

window.SignedComplementEngine = SignedComplementEngine;
