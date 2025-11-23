// tests/script.spec.js
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

let ctx;

// Load the real script.js into a jsdom-powered window for each test
beforeEach(() => {
  const html = `<!doctype html><html><body></body></html>`;
  const dom = new JSDOM(html, { url: 'http://localhost/' });

  const scriptSource = fs.readFileSync(
    path.resolve(__dirname, '../../script.js'),
    'utf8'
  );

  ctx = {
    window: dom.window,
    document: dom.window.document,
    console,
    setTimeout: dom.window.setTimeout.bind(dom.window),
    clearTimeout: dom.window.clearTimeout.bind(dom.window),
  };

  vm.createContext(ctx);
  vm.runInContext(scriptSource, ctx);
});

describe('normalizeYear', () => {
  it('returns full year when >= 100', () => {
    expect(ctx.normalizeYear(2025)).toBe(2025);
    expect(ctx.normalizeYear(1999)).toBe(1999);
  });

  it('converts 2-digit years to 2000+yy', () => {
    expect(ctx.normalizeYear(25)).toBe(2025);
    expect(ctx.normalizeYear(0)).toBe(2000);
    expect(ctx.normalizeYear(5)).toBe(2005);
  });
});

describe('tryParseDate basic numeric formats', () => {
  it('parses d/m/yyyy where first part > 12', () => {
    const res = ctx.tryParseDate('26/11/2025');
    expect(res).toEqual({ day: 26, month: 11, year: 2025 });
  });

  it('parses m/d/yyyy where second part > 12', () => {
    const res = ctx.tryParseDate('11/26/2025');
    expect(res).toEqual({ day: 26, month: 11, year: 2025 });
  });

  it('parses dot/space/ dash separators', () => {
    expect(ctx.tryParseDate('26-11-2025')).toEqual({ day: 26, month: 11, year: 2025 });
    expect(ctx.tryParseDate('26.11.25')).toEqual({ day: 26, month: 11, year: 2025 });
    expect(ctx.tryParseDate(' 26 11 2025 ')).toEqual({ day: 26, month: 11, year: 2025 });
  });

  it.skip('parses ISO yyyy-mm-dd', () => {
    const res = ctx.tryParseDate('2025-11-26');
    expect(res).toEqual({ day: 26, month: 11, year: 2025 });
  });
});

describe('tryParseDate with month names', () => {
  it('parses "26 November 2025"', () => {
    const res = ctx.tryParseDate('26 November 2025');
    expect(res).toEqual({ day: 26, month: 11, year: 2025 });
  });

  it('parses "November 26 25" with 2-digit year', () => {
    const res = ctx.tryParseDate('November 26 25');
    expect(res).toEqual({ day: 26, month: 11, year: 2025 });
  });

  it('parses mixed case and commas', () => {
    const res = ctx.tryParseDate('novEmber 26, 2025');
    expect(res).toEqual({ day: 26, month: 11, year: 2025 });
  });

  it('uses current year if only day+month', () => {
    const yearNow = new Date().getFullYear();
    const res = ctx.tryParseDate('26 November');
    expect(res).toEqual({ day: 26, month: 11, year: yearNow });
  });
});

describe('tryParseDate invalid values', () => {
  it('returns null for non-date text', () => {
    expect(ctx.tryParseDate('not a date')).toBeNull();
    expect(ctx.tryParseDate('abc/def/ghi')).toBeNull();
  });

  it('returns null for incomplete numeric formats', () => {
    expect(ctx.tryParseDate('26/11')).toBeNull();
    expect(ctx.tryParseDate('2025-11')).toBeNull();
  });
});
