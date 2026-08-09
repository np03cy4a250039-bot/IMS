const enc = new TextEncoder()

function bufToHex(buf) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("")
}

function hexToBuf(hex) {
  const out = new Uint8Array(hex.length / 2)
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.substr(i * 2, 2), 16)
  }
  return out
}

function randomHex(bytes) {
  const buf = new Uint8Array(bytes)
  crypto.getRandomValues(buf)
  return bufToHex(buf)
}

export async function hashPassword(password, saltHex) {
  const salt = saltHex ? hexToBuf(saltHex) : hexToBuf(randomHex(16))
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  )
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 150000,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  )
  return {
    salt: bufToHex(salt),
    hash: bufToHex(bits),
  }
}

export async function verifyPassword(password, saltHex, expectedHashHex) {
  const { hash } = await hashPassword(password, saltHex)
  return hash === expectedHashHex
}
