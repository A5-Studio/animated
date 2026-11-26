import React from 'react';
import { BORDER, BODY, C, HEAD, MONO, shadow } from './theme';

/*
 * A spreadsheet window (Excel / Google Sheets look, neobrutalist frame):
 * title bar, formula bar with "fx", column letters, row numbers, cells.
 */

export type Ref = { cells: string[]; color: string };

const COLS = 'ABCDEFGH';
const parse = (a: string) => ({ c: COLS.indexOf(a[0]), r: parseInt(a.slice(1), 10) - 1 });

export const SheetUI: React.FC<{
  width?: number;
  cols?: number;
  rows?: number;
  colW?: number[];
  rowH?: number;
  cells?: Record<string, React.ReactNode>;
  /** extra style per cell, e.g. bold labels */
  cellStyle?: Record<string, React.CSSProperties>;
  selected?: string;
  /** colored range references, like Excel shows while you edit a formula */
  refs?: Ref[];
  /** contents of the formula bar */
  bar?: React.ReactNode;
  nameBox?: string;
  title?: string;
  /** rendered on top of the grid, positioned in grid pixels */
  overlay?: React.ReactNode;
}> = ({
  width = 980, cols = 4, rows = 6, colW, rowH = 88, cells = {}, cellStyle = {}, selected, refs = [], bar, nameBox, title = 'latihan.xlsx', overlay,
}) => {
  const rowHeadW = 70;
  const widths = colW ?? Array.from({ length: cols }, () => (width - 2 * BORDER - rowHeadW) / cols);
  const xOf = (c: number) => rowHeadW + widths.slice(0, c).reduce((a, b) => a + b, 0);
  const headH = 54;
  const yOf = (r: number) => headH + r * rowH;
  const gridH = headH + rows * rowH;

  const box = (a: string) => {
    const { c, r } = parse(a);
    return { left: xOf(c), top: yOf(r), width: widths[c], height: rowH };
  };

  return (
    <div
      style={{
        width, background: C.white, border: `${BORDER}px solid ${C.ink}`, borderRadius: 24, boxShadow: shadow(14),
        overflow: 'hidden', fontFamily: BODY, color: C.ink,
      }}
    >
      {/* title bar */}
      <div style={{ height: 70, background: C.formula, display: 'flex', alignItems: 'center', gap: 14, padding: '0 24px', borderBottom: `${BORDER}px solid ${C.ink}` }}>
        {[C.red, C.yellow, C.green].map((b) => (
          <div key={b} style={{ width: 22, height: 22, borderRadius: 11, background: b, border: `3px solid ${C.ink}` }} />
        ))}
        <div style={{ marginLeft: 12, color: C.white, fontFamily: HEAD, fontSize: 30, letterSpacing: 0.5 }}>{title}</div>
      </div>
      {/* formula bar */}
      <div style={{ height: 92, display: 'flex', alignItems: 'center', borderBottom: `4px solid ${C.ink}`, background: C.white }}>
        <div style={{ width: 130, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: `4px solid ${C.ink}`, fontFamily: MONO, fontSize: 30 }}>
          {nameBox ?? selected ?? 'A1'}
        </div>
        <div style={{ width: 84, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: `4px solid ${C.ink}`, fontFamily: 'serif', fontStyle: 'italic', fontWeight: 700, fontSize: 38, color: '#555' }}>
          fx
        </div>
        <div style={{ flex: 1, padding: '0 22px', fontFamily: MONO, fontSize: 40, whiteSpace: 'nowrap', overflow: 'hidden' }}>{bar}</div>
      </div>
      {/* grid */}
      <div style={{ position: 'relative', height: gridH, background: C.white }}>
        {/* column headers */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: headH, background: C.head, borderBottom: `2px solid ${C.grid}` }} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: rowHeadW, height: gridH, background: C.head, borderRight: `2px solid ${C.grid}` }} />
        {widths.map((w, c) => {
          const on = selected && parse(selected).c === c;
          return (
            <div key={c} style={{ position: 'absolute', left: xOf(c), top: 0, width: w, height: headH, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: on ? C.sel : '#555', background: on ? '#D3E3FD' : undefined, borderRight: `2px solid ${C.grid}` }}>
              {COLS[c]}
            </div>
          );
        })}
        {Array.from({ length: rows }, (_, r) => {
          const on = selected && parse(selected).r === r;
          return (
            <div key={r} style={{ position: 'absolute', left: 0, top: yOf(r), width: rowHeadW, height: rowH, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: on ? C.sel : '#555', background: on ? '#D3E3FD' : undefined, borderBottom: `2px solid ${C.grid}` }}>
              {r + 1}
            </div>
          );
        })}
        {/* grid lines */}
        {Array.from({ length: rows }, (_, r) => (
          <div key={'h' + r} style={{ position: 'absolute', left: rowHeadW, top: yOf(r + 1) - 2, right: 0, height: 2, background: C.grid }} />
        ))}
        {widths.map((_, c) => (
          <div key={'v' + c} style={{ position: 'absolute', left: xOf(c + 1) - 2, top: headH, width: 2, height: rows * rowH, background: C.grid }} />
        ))}
        {/* range refs (filled tint + colored border) */}
        {refs.map((ref, i) =>
          ref.cells.map((a) => (
            <div key={i + a} style={{ position: 'absolute', ...box(a), background: ref.color + '33', border: `4px solid ${ref.color}`, boxSizing: 'border-box' }} />
          )),
        )}
        {/* cell values */}
        {Object.entries(cells).map(([a, v]) => (
          <div
            key={a}
            style={{
              position: 'absolute', ...box(a), display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 18px', boxSizing: 'border-box',
              fontFamily: MONO, fontSize: 40, whiteSpace: 'nowrap', ...cellStyle[a],
            }}
          >
            {v}
          </div>
        ))}
        {/* selected cell */}
        {selected && (
          <div style={{ position: 'absolute', ...box(selected), border: `5px solid ${C.sel}`, boxSizing: 'border-box', boxShadow: '0 0 0 2px #fff inset' }}>
            <div style={{ position: 'absolute', right: -9, bottom: -9, width: 14, height: 14, background: C.sel, border: '2px solid #fff' }} />
          </div>
        )}
        {overlay}
      </div>
    </div>
  );
};

/** formula text where each reference is colored like Excel does */
export const Fx: React.FC<{ text: string; n?: number; colors?: Record<string, string>; caret?: boolean; markEq?: number; markName?: number }> = ({
  text, n, colors = {}, caret, markEq = 0, markName = 0,
}) => {
  const shown = n === undefined ? text : text.slice(0, Math.max(0, Math.floor(n)));
  const parts = shown.split(/(^=|[A-Z]{2,}(?=\()|[A-H][0-9]+(?::[A-H][0-9]+)?)/g).filter(Boolean);
  const hl = (on: number, color: string): React.CSSProperties =>
    on > 0 ? { background: color, outline: `${3 * on}px solid ${C.ink}`, borderRadius: 6, padding: '0 2px' } : {};
  return (
    <span>
      {parts.map((p, i) => {
        const isRef = /^[A-H][0-9]/.test(p);
        const isEq = p === '=' && i === 0;
        const isName = /^[A-Z]{2,}$/.test(p);
        return (
          <span
            key={i}
            style={{
              color: colors[p] ?? (isRef ? C.sel : C.formula),
              ...(isEq ? hl(markEq, C.yellow) : {}),
              ...(isName ? hl(markName, C.yellow) : {}),
            }}
          >
            {p}
          </span>
        );
      })}
      {caret && <span style={{ display: 'inline-block', width: 4, height: 44, background: C.ink, marginLeft: 3, verticalAlign: 'middle' }} />}
    </span>
  );
};
