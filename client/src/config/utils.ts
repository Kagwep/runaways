import { shortString } from "starknet"
import { BigNumber } from "bignumber.js"
import { num, stark } from 'starknet';



export function isDarkMode(colorscheme: any): boolean {
    return colorscheme === 'dark' ? true : false
}

export function limitChars(str: string, count: number, show_dots: boolean) {
    if (count <= str.length) {
        return `${str.substring(0, count)} ${show_dots ? '...' : ''}`
    }
    return str
}

export function bigintToShortStr(bigintstr: string) {
    if (!bigintstr) return ""
    const bn = new BigNumber(bigintstr)
    const hex_sentence = `0x` + bn.toString(16)

    return shortString.decodeShortString(hex_sentence)
}

export function convertToReadableTokens(tokens: any, decimals: number) {
    if (!tokens || !decimals) return ""
    return new BigNumber(tokens).dividedBy(10 ** decimals).toNumber().toFixed(6)
}

export function bigintToLongStrAddress(bigintstr: string) {
    if (!bigintstr) return ""
    const bn = new BigNumber(bigintstr)
    const hex_sentence = `0x` + bn.toString(16)
    return hex_sentence;
}

export function bnCompare(bn: any, b: any) {
    return new BigNumber(bn).toString() === b
}

export function timeStampToDate(timestamp: number) {
    if (!timestamp) return null
    const timestampInMilliseconds = timestamp * 1000;
    const date = new Date(timestampInMilliseconds);
    return date;
}


export function getTwoAddressLetters(address: string) {
    if (!address) return "0x"
    return address?.substring(0, 4).substring(2, 4) ?? "0x"
}

export const encoder = (str: string) => {
    return shortString.encodeShortString(str);
}

export function getRealPrice(val: any) {
    let decimals = new BigNumber(val.decimals).toNumber()
    let ts = new BigNumber(val.last_updated_timestamp).toNumber()
    let real_price = {
        price: new BigNumber(val.price).dividedBy(10 ** decimals).toNumber(),
        last_updated_timestamp: timeStampToDate(ts),
        num_sources_aggregated: new BigNumber(val.num_sources_aggregated).toNumber()
    }
    return real_price
}

export function formatNumberInternational(number: number) {
    // Check if the Intl.NumberFormat is supported in the browser
    const DECIMALS = 4
    if (typeof Intl.NumberFormat === 'function') {
        // Format the number using the "en-US" locale
        const formatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: DECIMALS, maximumFractionDigits: DECIMALS});
        return formatter.format(number);
    } else {
        // Fallback for browsers that do not support Intl.NumberFormat
        console.warn('Intl.NumberFormat is not supported in this browser. Fallback may not provide accurate formatting.');
        // You can implement a custom fallback logic here if needed
        return number.toLocaleString('en-US');
    }
}

export function convertToStarknetAddress(bigIntAddress: bigint) {
    // Ensure the input is a BigInt
    const addressBigInt = BigInt(bigIntAddress);

    // Convert to hex string and remove '0x' prefix if present
    let hexAddress = num.toHex(addressBigInt);
    
    // Remove '0x' prefix if present
    hexAddress = hexAddress.startsWith('0x') ? hexAddress.slice(2) : hexAddress;

    // Pad to 64 characters
    hexAddress = hexAddress.padStart(64, '0');

    // Add '0x' prefix
    return '0x' + hexAddress;
}

export function feltToString(felt: any) {
    // Check if the input is a valid number
    if (typeof felt !== 'number' && typeof felt !== 'bigint') {
      throw new Error('Input must be a number or BigInt');
    }
  
    // Convert to hexadecimal string
    const hexString = felt.toString(16);
    
    // Ensure even length by padding with a leading zero if necessary
    const paddedHexString = hexString.length % 2 === 0 ? hexString : '0' + hexString;
  
    // Convert hex to ASCII
    let asciiString = '';
    for (let i = 0; i < paddedHexString.length; i += 2) {
      const hexChar = paddedHexString.substr(i, 2);
      const asciiCode = parseInt(hexChar, 16);
      // Only add printable ASCII characters
      if (asciiCode >= 32 && asciiCode <= 126) {
        asciiString += String.fromCharCode(asciiCode);
      }
    }
  
    return asciiString;
  }
  