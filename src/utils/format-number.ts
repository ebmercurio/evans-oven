/* eslint-disable @typescript-eslint/no-explicit-any */
import numeral from 'numeral';

// ----------------------------------------------------------------------

function result(format: any, key = '.00') {
  const isInteger = format.includes(key);

  return isInteger ? format.replace(key, '') : format;
}

export function fNumber(number: number) {
  return numeral(number).format();
}

export function fCurrency(number: number) {
  const format = number ? numeral(number).format('$0,0.00') : '';

  return result(format, '.00');
}

export function fPercent(number: number) {
  const format = number ? numeral(Number(number) / 100).format('0.0%') : '';

  return result(format, '.0');
}

export function fShortenNumber(number: number) {
  const format = number ? numeral(number).format('0.0a') : '';

  return result(format, '.0');
}

export function fData(number: number) {
  const format = number ? numeral(number).format('0.0 b') : '';

  return result(format, '.0');
}
