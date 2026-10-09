/**
 * Human-friendly inquiry references, e.g. "SHR-7K2M9Q" — read aloud over the phone by farmers and sales.
 * Alphabet: 32 symbols without the look-alikes 0/O and 1/I, so 256 % 32 === 0 keeps every symbol equally
 * likely (no modulo bias). 32^6 ≈ 1.07 billion combinations; the collection's unique index plus a retry in
 * the persistence layer handle the (astronomically rare) collision.
 */
export const REFERENCE_PREFIX = 'SHR'
export const REFERENCE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
export const REFERENCE_LENGTH = 6
export const REFERENCE_PATTERN = /^SHR-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/

type RandomSource = (bytes: Uint8Array) => Uint8Array

const webCrypto: RandomSource = (bytes) => globalThis.crypto.getRandomValues(bytes)

export function generateReference(random: RandomSource = webCrypto): string {
  const bytes = random(new Uint8Array(REFERENCE_LENGTH))
  let code = ''
  for (const byte of bytes) code += REFERENCE_ALPHABET[byte & 31]
  return `${REFERENCE_PREFIX}-${code}`
}
