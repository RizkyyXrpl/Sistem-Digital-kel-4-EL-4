/**
 * ==========================================================================
 * MK SISTEM DIGITAL - ITERA
 * Core Engine: Central Binary Hub & Multi-Base Number Converter
 * ==========================================================================
 * Filosofi: Biner adalah pusat/jembatan transformasi seluruh basis bilangan:
 * Source -> [Biner Central] -> Heksadesimal (Grouping 4-bit/Nibble)
 *                           -> Oktal (Grouping 3-bit)
 *                           -> Desimal (Penjumlahan Bobot 2^n)
 */

const CentralBinaryConverter = {
  // Digit maps
  HEX_CHARS: '0123456789ABCDEF',
  
  /**
   * Parse input string based on source radix (2, 8, 10, 16)
   * Mendukung bilangan bulat maupun pecahan (dengan tanda titik '.')
   */
  parseInput(inputStr, base) {
    const cleaned = inputStr.trim().toUpperCase();
    if (!cleaned) throw new Error('Input tidak boleh kosong.');

    const parts = cleaned.split('.');
    if (parts.length > 2) throw new Error('Format salah: hanya boleh ada satu tanda titik desimal.');

    const intPart = parts[0] || '0';
    const fracPart = parts.length === 2 ? parts[1] : '';

    // Validate characters
    const validRegex = {
      2: /^[01]+$/,
      8: /^[0-7]+$/,
      10: /^[0-9]+$/,
      16: /^[0-9A-F]+$/
    };

    if (intPart !== '0' && !validRegex[base].test(intPart)) {
      throw new Error(`Karakter tidak valid untuk basis ${base} pada bagian bulat: "${intPart}"`);
    }
    if (fracPart && !validRegex[base].test(fracPart)) {
      throw new Error(`Karakter tidak valid untuk basis ${base} pada bagian pecahan: "${fracPart}"`);
    }

    return { intPart, fracPart };
  },

  /**
   * Step 1: Konversi Sumber ke Central Binary
   */
  convertToCentralBinary(intPart, fracPart, sourceBase) {
    let binaryInt = '';
    let binaryFrac = '';
    let stepsToBinary = [];

    if (sourceBase === 2) {
      binaryInt = intPart.replace(/^0+(?!$)/, '') || '0';
      binaryFrac = fracPart;
      stepsToBinary.push({
        title: 'Input Sudah Biner',
        detail: `Nilai langsung digunakan dalam format biner: ${binaryInt}${binaryFrac ? '.' + binaryFrac : ''}₂`
      });
    } else if (sourceBase === 10) {
      // Desimal Bulat -> Biner via Pembagian Berulang 2
      let num = BigInt(intPart);
      let divSteps = [];
      if (num === 0n) {
        binaryInt = '0';
        divSteps.push({ quotient: '0', remainder: '0', step: '0 ÷ 2 = 0 sisa 0' });
      } else {
        let current = num;
        let bits = [];
        while (current > 0n) {
          let rem = current % 2n;
          let next = current / 2n;
          divSteps.push({
            current: current.toString(),
            quotient: next.toString(),
            remainder: rem.toString(),
            formula: `${current} ÷ 2 = ${next} sisa ${rem}`
          });
          bits.push(rem.toString());
          current = next;
        }
        binaryInt = bits.reverse().join('');
      }

      stepsToBinary.push({
        title: 'Konversi Desimal Bulat ke Biner (Pembagian Berulang 2)',
        type: 'division_table',
        baseNum: intPart,
        rows: divSteps,
        resultBits: binaryInt,
        summary: `Membaca sisa bagi dari bawah ke atas (MSB ke LSB) menghasilkan biner bulat: ${binaryInt}₂`
      });

      // Desimal Pecahan -> Biner via Perkalian Berulang 2
      if (fracPart) {
        let multSteps = [];
        let fracVal = parseFloat('0.' + fracPart);
        let current = fracVal;
        let fracBits = [];
        let maxIter = 12; // safety limit
        
        while (current > 0 && fracBits.length < maxIter) {
          let multiplied = current * 2;
          let intCarry = Math.floor(multiplied);
          multSteps.push({
            current: current.toFixed(4),
            result: multiplied.toFixed(4),
            carry: intCarry,
            formula: `${current.toFixed(4)} × 2 = ${multiplied.toFixed(4)} → Simpan bit ${intCarry}`
          });
          fracBits.push(intCarry);
          current = multiplied - intCarry;
          if (Math.abs(current) < 1e-7) break;
        }
        binaryFrac = fracBits.join('');

        stepsToBinary.push({
          title: 'Konversi Desimal Pecahan ke Biner (Perkalian Berulang 2)',
          type: 'multiplication_table',
          fraction: '0.' + fracPart,
          rows: multSteps,
          resultBits: binaryFrac,
          summary: `Membaca digit carry dari atas ke bawah menghasilkan biner pecahan: 0.${binaryFrac}₂`
        });
      }
    } else if (sourceBase === 16) {
      // Heksadesimal -> Biner: Tiap 1 digit hex -> 4 bit biner
      let hexIntSteps = [];
      for (let ch of intPart) {
        let val = parseInt(ch, 16);
        let b = val.toString(2).padStart(4, '0');
        hexIntSteps.push({ char: ch, val, bits: b });
        binaryInt += b;
      }
      binaryInt = binaryInt.replace(/^0+(?!$)/, '') || '0';

      let hexFracSteps = [];
      for (let ch of fracPart) {
        let val = parseInt(ch, 16);
        let b = val.toString(2).padStart(4, '0');
        hexFracSteps.push({ char: ch, val, bits: b });
        binaryFrac += b;
      }

      stepsToBinary.push({
        title: 'Konversi Heksadesimal ke Biner (Ekspansi 1 Digit ke 4 Bit)',
        type: 'hex_expansion',
        intRows: hexIntSteps,
        fracRows: hexFracSteps,
        resultBits: `${binaryInt}${binaryFrac ? '.' + binaryFrac : ''}`
      });
    } else if (sourceBase === 8) {
      // Oktal -> Biner: Tiap 1 digit oktal -> 3 bit biner
      let octIntSteps = [];
      for (let ch of intPart) {
        let val = parseInt(ch, 8);
        let b = val.toString(2).padStart(3, '0');
        octIntSteps.push({ char: ch, val, bits: b });
        binaryInt += b;
      }
      binaryInt = binaryInt.replace(/^0+(?!$)/, '') || '0';

      let octFracSteps = [];
      for (let ch of fracPart) {
        let val = parseInt(ch, 8);
        let b = val.toString(2).padStart(3, '0');
        octFracSteps.push({ char: ch, val, bits: b });
        binaryFrac += b;
      }

      stepsToBinary.push({
        title: 'Konversi Oktal ke Biner (Ekspansi 1 Digit ke 3 Bit)',
        type: 'octal_expansion',
        intRows: octIntSteps,
        fracRows: octFracSteps,
        resultBits: `${binaryInt}${binaryFrac ? '.' + binaryFrac : ''}`
      });
    }

    return { binaryInt, binaryFrac, stepsToBinary };
  },

  /**
   * Step 2A: Central Binary -> Heksadesimal (Grouping 4-bit / Nibble)
   */
  binaryToHexGroups(binaryInt, binaryFrac) {
    // Integer part: group right-to-left (dari LSB)
    let intGroups = [];
    let cleanInt = binaryInt;
    let remInt = cleanInt.length % 4;
    let padCountInt = remInt === 0 ? 0 : 4 - remInt;
    let paddedInt = '0'.repeat(padCountInt) + cleanInt;

    for (let i = 0; i < paddedInt.length; i += 4) {
      let chunk = paddedInt.slice(i, i + 4);
      let val = parseInt(chunk, 2);
      let hexChar = val.toString(16).toUpperCase();
      let isFirstAndPadded = (i === 0 && padCountInt > 0);
      intGroups.push({
        rawBits: isFirstAndPadded ? chunk.slice(padCountInt) : chunk,
        paddedBits: chunk,
        paddingCount: isFirstAndPadded ? padCountInt : 0,
        padSide: 'left',
        val,
        symbol: hexChar
      });
    }

    // Fractional part: group left-to-right (dari radix point)
    let fracGroups = [];
    if (binaryFrac) {
      let remFrac = binaryFrac.length % 4;
      let padCountFrac = remFrac === 0 ? 0 : 4 - remFrac;
      let paddedFrac = binaryFrac + '0'.repeat(padCountFrac);

      for (let i = 0; i < paddedFrac.length; i += 4) {
        let chunk = paddedFrac.slice(i, i + 4);
        let val = parseInt(chunk, 2);
        let hexChar = val.toString(16).toUpperCase();
        let isLastAndPadded = (i + 4 >= paddedFrac.length && padCountFrac > 0);
        fracGroups.push({
          rawBits: isLastAndPadded ? chunk.slice(0, 4 - padCountFrac) : chunk,
          paddedBits: chunk,
          paddingCount: isLastAndPadded ? padCountFrac : 0,
          padSide: 'right',
          val,
          symbol: hexChar
        });
      }
    }

    let hexResult = intGroups.map(g => g.symbol).join('');
    if (fracGroups.length > 0) {
      hexResult += '.' + fracGroups.map(g => g.symbol).join('');
    }

    return { intGroups, fracGroups, hexResult };
  },

  /**
   * Step 2B: Central Binary -> Oktal (Grouping 3-bit)
   */
  binaryToOctalGroups(binaryInt, binaryFrac) {
    // Integer part: group right-to-left
    let intGroups = [];
    let cleanInt = binaryInt;
    let remInt = cleanInt.length % 3;
    let padCountInt = remInt === 0 ? 0 : 3 - remInt;
    let paddedInt = '0'.repeat(padCountInt) + cleanInt;

    for (let i = 0; i < paddedInt.length; i += 3) {
      let chunk = paddedInt.slice(i, i + 3);
      let val = parseInt(chunk, 2);
      let octChar = val.toString(8);
      let isFirstAndPadded = (i === 0 && padCountInt > 0);
      intGroups.push({
        rawBits: isFirstAndPadded ? chunk.slice(padCountInt) : chunk,
        paddedBits: chunk,
        paddingCount: isFirstAndPadded ? padCountInt : 0,
        padSide: 'left',
        val,
        symbol: octChar
      });
    }

    // Fractional part: group left-to-right
    let fracGroups = [];
    if (binaryFrac) {
      let remFrac = binaryFrac.length % 3;
      let padCountFrac = remFrac === 0 ? 0 : 3 - remFrac;
      let paddedFrac = binaryFrac + '0'.repeat(padCountFrac);

      for (let i = 0; i < paddedFrac.length; i += 3) {
        let chunk = paddedFrac.slice(i, i + 3);
        let val = parseInt(chunk, 2);
        let octChar = val.toString(8);
        let isLastAndPadded = (i + 3 >= paddedFrac.length && padCountFrac > 0);
        fracGroups.push({
          rawBits: isLastAndPadded ? chunk.slice(0, 3 - padCountFrac) : chunk,
          paddedBits: chunk,
          paddingCount: isLastAndPadded ? padCountFrac : 0,
          padSide: 'right',
          val,
          symbol: octChar
        });
      }
    }

    let octResult = intGroups.map(g => g.symbol).join('');
    if (fracGroups.length > 0) {
      octResult += '.' + fracGroups.map(g => g.symbol).join('');
    }

    return { intGroups, fracGroups, octResult };
  },

  /**
   * Step 2C: Central Binary -> Desimal (Penjumlahan Bobot 2^n)
   */
  binaryToDecimalWeights(binaryInt, binaryFrac) {
    let intWeights = [];
    let intTotal = 0n;
    let len = binaryInt.length;

    for (let i = 0; i < len; i++) {
      let bit = parseInt(binaryInt[i]);
      let power = len - 1 - i;
      let weightVal = 2n ** BigInt(power);
      let contribution = bit === 1 ? weightVal : 0n;
      intTotal += contribution;
      intWeights.push({
        bit,
        power,
        weightVal: weightVal.toString(),
        contribution: contribution.toString(),
        isActive: bit === 1
      });
    }

    let fracWeights = [];
    let fracTotal = 0;
    if (binaryFrac) {
      for (let j = 0; j < binaryFrac.length; j++) {
        let bit = parseInt(binaryFrac[j]);
        let power = -(j + 1);
        let weightVal = Math.pow(2, power);
        let contribution = bit === 1 ? weightVal : 0;
        fracTotal += contribution;
        fracWeights.push({
          bit,
          power,
          weightVal,
          contribution,
          isActive: bit === 1
        });
      }
    }

    let totalDecimalStr = intTotal.toString();
    if (binaryFrac) {
      let fracStr = fracTotal.toString().slice(2); // remove '0.'
      totalDecimalStr += '.' + (fracStr || '0');
    }

    return {
      intWeights,
      fracWeights,
      intTotal: intTotal.toString(),
      fracTotal,
      totalDecimalStr
    };
  },

  /**
   * Eksekusi Full Pipeline Konversi Central Binary
   */
  convert(inputStr, sourceBase = 10) {
    const { intPart, fracPart } = this.parseInput(inputStr, sourceBase);
    const { binaryInt, binaryFrac, stepsToBinary } = this.convertToCentralBinary(intPart, fracPart, sourceBase);
    const hexData = this.binaryToHexGroups(binaryInt, binaryFrac);
    const octalData = this.binaryToOctalGroups(binaryInt, binaryFrac);
    const decimalData = this.binaryToDecimalWeights(binaryInt, binaryFrac);

    return {
      source: { inputStr, sourceBase, intPart, fracPart },
      centralBinary: {
        binaryInt,
        binaryFrac,
        fullBinary: `${binaryInt}${binaryFrac ? '.' + binaryFrac : ''}`,
        stepsToBinary
      },
      hexadecimal: hexData,
      octal: octalData,
      decimal: decimalData
    };
  }
};

window.CentralBinaryConverter = CentralBinaryConverter;
