import type React from "react";
import { useCurrentFrame } from "remotion";
import { B, border, popIn, shadow } from "../brutal/kit";

// Flat neobrutalist card that pops in at `at`.
export const Card: React.FC<{
  readonly at: number;
  readonly color?: string;
  readonly rotate?: number;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ at, color = B.white, rotate = 0, style, children }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        background: color,
        border,
        boxShadow: shadow(),
        boxSizing: "border-box",
        ...popIn(frame, at, rotate),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Small square badge with a number, used for step numbers.
export const NumBadge: React.FC<{
  readonly n: number;
  readonly color?: string;
}> = ({ n, color = B.ink }) => (
  <div
    style={{
      width: 56,
      height: 56,
      flexShrink: 0,
      background: color,
      color: color === B.ink ? B.white : B.ink,
      border,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 34,
      fontWeight: 700,
    }}
  >
    {n}
  </div>
);

export const Check: React.FC<{ readonly size?: number }> = ({ size = 56 }) => (
  <svg
    viewBox="-30 -30 60 60"
    style={{ width: size, height: size, flexShrink: 0 }}
  >
    <circle r={27} fill={B.green} stroke={B.ink} strokeWidth={5} />
    <path
      d="M -12 1 L -4 9 L 13 -9"
      fill="none"
      stroke={B.ink}
      strokeWidth={6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Frying pan with jiggling rice, centred on (0, 0) in a -160..160 box.
export const Pan: React.FC<{ readonly frame: number }> = ({ frame }) => (
  <g transform={`rotate(${Math.sin(frame / 5) * 3})`}>
    <rect x={95} y={-14} width={150} height={28} rx={6} fill={B.ink} />
    <ellipse
      cx={0}
      cy={0}
      rx={120}
      ry={70}
      fill={B.grey}
      stroke={B.ink}
      strokeWidth={6}
    />
    <ellipse
      cx={0}
      cy={-4}
      rx={95}
      ry={50}
      fill={B.yellow}
      stroke={B.ink}
      strokeWidth={5}
    />
    {[
      [-50, -10],
      [-20, -25],
      [15, -5],
      [45, -20],
      [60, 5],
      [-35, 15],
      [5, 18],
      [30, 10],
    ].map(([x, y], i) => (
      <ellipse
        key={i}
        cx={x}
        cy={y + Math.sin(frame / 3 + i) * 4}
        rx={9}
        ry={5}
        fill={B.white}
        stroke={B.ink}
        strokeWidth={2}
      />
    ))}
  </g>
);
