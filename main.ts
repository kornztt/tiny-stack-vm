import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const I = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const O = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
function run(p, inp) {
  const m = new Int32Array(256), s = new Int32Array(257), c = new Int32Array(64);
  let sp = 0, cp = 0, pc = 0, ip = 0, steps = 0;
  const out = [], n = p.length, T = (k) => [out, k];
  while (true) {
    if (steps >= 1e6) return T(10);
    if (pc < 0 || pc >= n) return T(9);
    const op = p[pc];
    steps++;
    if (op === 0) return [out, 0];
    if (op === 1) {
      if (pc + 2 > n) return T(9);
      if (sp >= 256) return T(3);
      let v = p[pc + 1]; if (v >= 128) v -= 256;
      s[sp++] = v; pc += 2; continue;
    }
    if (op === 2) {
      if (pc + 5 > n) return T(9);
      if (sp >= 256) return T(3);
      s[sp++] = p[pc + 1] | (p[pc + 2] << 8) | (p[pc + 3] << 16) | (p[pc + 4] << 24);
      pc += 5; continue;
    }
    if (op === 3) { if (sp < 1) return T(2); sp--; pc++; continue; }
    if (op === 4) {
      if (sp < 1) return T(2); if (sp >= 256) return T(3);
      s[sp] = s[sp - 1]; sp++; pc++; continue;
    }
    if (op === 5) {
      if (sp < 2) return T(2);
      const t = s[sp - 1]; s[sp - 1] = s[sp - 2]; s[sp - 2] = t; pc++; continue;
    }
    if (op === 6) {
      if (sp < 2) return T(2); if (sp >= 256) return T(3);
      s[sp] = s[sp - 2]; sp++; pc++; continue;
    }
    if (op === 7) {
      if (sp < 3) return T(2);
      const t = s[sp - 3]; s[sp - 3] = s[sp - 2]; s[sp - 2] = s[sp - 1]; s[sp - 1] = t; pc++; continue;
    }
    if (op >= 0x10 && op <= 0x22 && op !== 0x17 && op !== 0x1b) {
      if (op === 0x1f) return T(5);
      if (sp < 2) return T(2);
      const a = s[sp - 2], b = s[sp - 1];
      let r;
      if (op === 0x10) r = (a + b) | 0;
      else if (op === 0x11) r = (a - b) | 0;
      else if (op === 0x12) r = Math.imul(a, b);
      else if (op === 0x13) { if (!b) return T(4); r = Math.trunc(a / b) | 0; }
      else if (op === 0x14) { if (!b) return T(4); r = (a % b) | 0; }
      else if (op === 0x15) { if (!b) return T(4); r = Math.trunc((a >>> 0) / (b >>> 0)) | 0; }
      else if (op === 0x16) { if (!b) return T(4); r = ((a >>> 0) % (b >>> 0)) | 0; }
      else if (op === 0x18) r = a & b;
      else if (op === 0x19) r = a | b;
      else if (op === 0x1a) r = a ^ b;
      else if (op === 0x1c) r = a << (b & 31);
      else if (op === 0x1d) r = a >> (b & 31);
      else if (op === 0x1e) r = (a >>> (b & 31)) | 0;
      else if (op === 0x20) r = a === b ? 1 : 0;
      else if (op === 0x21) r = a < b ? 1 : 0;
      else r = (a >>> 0) < (b >>> 0) ? 1 : 0;
      s[sp - 2] = r; sp--; pc++; continue;
    }
    if (op === 0x17) { if (sp < 1) return T(2); s[sp - 1] = (-s[sp - 1]) | 0; pc++; continue; }
    if (op === 0x1b) { if (sp < 1) return T(2); s[sp - 1] = ~s[sp - 1]; pc++; continue; }
    if (op === 0x30 || op === 0x31 || op === 0x32) {
      if (pc + 3 > n) return T(9);
      let o = p[pc + 1] | (p[pc + 2] << 8); if (o >= 32768) o -= 65536;
      if (op === 0x30) pc += 3 + o;
      else {
        if (sp < 1) return T(2);
        const v = s[--sp];
        pc = (op === 0x31 ? v === 0 : v !== 0) ? pc + 3 + o : pc + 3;
      }
      continue;
    }
    if (op === 0x33) {
      if (pc + 3 > n) return T(9);
      if (cp >= 64) return T(7);
      c[cp++] = pc + 3; pc = p[pc + 1] | (p[pc + 2] << 8); continue;
    }
    if (op === 0x34) { if (!cp) return T(8); pc = c[--cp]; continue; }
    if (op === 0x40) {
      if (sp < 1) return T(2);
      const a = s[sp - 1]; if (a < 0 || a > 255) return T(6);
      s[sp - 1] = m[a]; pc++; continue;
    }
    if (op === 0x41) {
      if (sp < 2) return T(2);
      const a = s[sp - 1]; if (a < 0 || a > 255) return T(6);
      m[a] = s[sp - 2]; sp -= 2; pc++; continue;
    }
    if (op === 0x50) {
      if (sp < 1) return T(2);
      const t = String(s[--sp]);
      if (out.length + t.length > 65536) return T(11);
      for (let i = 0; i < t.length; i++) out.push(t.charCodeAt(i));
      pc++; continue;
    }
    if (op === 0x51) {
      if (sp < 1) return T(2);
      if (out.length + 1 > 65536) return T(11);
      out.push(s[--sp] & 255); pc++; continue;
    }
    if (op === 0x52) {
      if (sp >= 256) return T(3);
      s[sp++] = ip < inp.length ? inp[ip++] : -1; pc++; continue;
    }
    if (op === 0x53) { if (sp < 1) return T(2); return [out, s[--sp] & 255]; }
    return T(5);
  }
}
for (const id of readdirSync(I).sort()) {
  const d = join(I, id);
  let p;
  try { p = readFileSync(join(d, 'program.bin')); } catch { continue; }
  let inp;
  try { inp = readFileSync(join(d, 'input.bin')); } catch { inp = Buffer.alloc(0); }
  const [out, code] = run(p, inp);
  mkdirSync(join(O, id), { recursive: true });
  writeFileSync(join(O, id, 'stdout.bin'), Buffer.from(out));
  writeFileSync(join(O, id, 'exit.txt'), String(code) + '\n');
}
