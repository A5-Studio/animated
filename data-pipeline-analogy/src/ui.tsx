import type React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, clamp, easeOut, fontFamily } from "./theme";

export const SceneBg: React.FC<{
  readonly children: React.ReactNode;
  readonly dark?: boolean;
}> = ({ children, dark }) => (
  <AbsoluteFill
    style={{
      fontFamily,
      color: dark ? C.white : C.ink,
      background: dark
        ? `linear-gradient(180deg, ${C.ink} 0%, #123B57 100%)`
        : `linear-gradient(180deg, ${C.bg} 0%, ${C.bgDeep} 100%)`,
    }}
  >
    {children}
  </AbsoluteFill>
);

// Kicker pill + headline at the top of a scene.
export const Title: React.FC<{
  readonly kicker?: string;
  readonly kickerColor?: string;
  readonly children: React.ReactNode;
  readonly sub?: string;
  readonly delay?: number;
}> = ({ kicker, kickerColor = C.water, children, sub, delay = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: 150,
        left: 80,
        right: 80,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 24,
        opacity: interpolate(frame, [delay, delay + 15], [0, 1], clamp),
        translate: interpolate(
          frame,
          [delay, delay + 20],
          ["0px 50px", "0px 0px"],
          { ...clamp, easing: easeOut },
        ),
      }}
    >
      {kicker ? (
        <div
          style={{
            background: kickerColor,
            color: C.white,
            fontSize: 38,
            fontWeight: 800,
            letterSpacing: 4,
            padding: "10px 28px",
            borderRadius: 999,
          }}
        >
          {kicker}
        </div>
      ) : null}
      <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.08 }}>
        {children}
      </div>
      {sub ? (
        <div
          style={{
            fontSize: 46,
            fontWeight: 500,
            color: C.muted,
            lineHeight: 1.3,
            opacity: interpolate(frame, [delay + 12, delay + 27], [0, 1], clamp),
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
};

// Bottom caption that fades in at `from` and out at `to` (scene-local frames).
export const Caption: React.FC<{
  readonly from: number;
  readonly to: number;
  readonly children: React.ReactNode;
}> = ({ from, to, children }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        bottom: 150,
        display: "flex",
        justifyContent: "center",
        opacity: interpolate(frame, [from, from + 10, to - 10, to], [0, 1, 1, 0], clamp),
        translate: interpolate(frame, [from, from + 15], ["0px 30px", "0px 0px"], {
          ...clamp,
          easing: easeOut,
        }),
      }}
    >
      <div
        style={{
          background: C.ink,
          color: C.white,
          fontSize: 48,
          fontWeight: 700,
          lineHeight: 1.3,
          textAlign: "center",
          padding: "26px 40px",
          borderRadius: 32,
          boxShadow: "0 12px 30px rgba(15,42,61,0.25)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Filled wave shape, for rivers and water surfaces.
export const wavePath = (
  x0: number,
  x1: number,
  y: number,
  amp: number,
  len: number,
  phase: number,
  bottom: number,
) => {
  let d = `M ${x0} ${bottom} L ${x0} ${y}`;
  for (let x = x0; x <= x1; x += 15) {
    d += ` L ${x} ${(y + Math.sin(((x - x0) / len) * 2 * Math.PI + phase) * amp).toFixed(1)}`;
  }
  return `${d} L ${x1} ${bottom} Z`;
};

// Water droplet icon centred on (0, 0), roughly 2r wide.
export const Drop: React.FC<{
  readonly r: number;
  readonly fill?: string;
}> = ({ r, fill = C.water }) => (
  <path
    d={`M 0 ${-r * 1.6} C ${r * 0.6} ${-r * 0.7} ${r} ${-r * 0.25} ${r} ${r * 0.25} A ${r} ${r} 0 1 1 ${-r} ${r * 0.25} C ${-r} ${-r * 0.25} ${-r * 0.6} ${-r * 0.7} 0 ${-r * 1.6} Z`}
    fill={fill}
  />
);

// Bucket with handle; origin is top-centre of the rim. `fill` is 0..1.
export const Bucket: React.FC<{
  readonly fill: number;
  readonly id: string;
}> = ({ fill, id }) => {
  const body = "M -38 0 L 38 0 L 30 70 L -30 70 Z";
  const top = 70 - 64 * fill;
  return (
    <g>
      <path
        d="M -34 4 C -34 -46 34 -46 34 4"
        fill="none"
        stroke={C.pipeDark}
        strokeWidth={5}
      />
      <clipPath id={id}>
        <path d={body} />
      </clipPath>
      <path d={body} fill={C.bucket} />
      <rect
        x={-40}
        y={top}
        width={80}
        height={80}
        fill={C.water}
        clipPath={`url(#${id})`}
        opacity={fill > 0.01 ? 1 : 0}
      />
      <rect x={-41} y={-4} width={82} height={10} rx={5} fill={C.bucketDark} />
    </g>
  );
};
