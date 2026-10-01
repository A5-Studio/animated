import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import type React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const font = "Space Grotesk";
for (const weight of ["500", "700"]) {
  loadFont({
    family: font,
    url: staticFile(`SpaceGrotesk-${weight}.ttf`),
    weight,
  });
}

export const B = {
  ink: "#111111",
  paper: "#FFF4E0",
  white: "#FFFFFF",
  yellow: "#FFD93D",
  pink: "#FF6B9D",
  blue: "#4DA6FF",
  water: "#38B6FF",
  waterLight: "#A5DEFF",
  green: "#3DDC97",
  orange: "#FF8A3D",
  red: "#FF4D4D",
  purple: "#B18CFF",
  grass: "#7ED957",
  wood: "#C98B55",
  skin: "#FFC9A3",
  grey: "#8A8A8A",
};

// TikTok safe area at 1080×1920 (the reference spec is drawn at 540×960).
// The top strip (y 252–360) may also extend right to x 960.
export const SAFE = {
  left: 120,
  top: 252,
  right: 840,
  bottom: 1280,
  width: 720,
  height: 1028,
  stripRight: 960,
  stripBottom: 360,
};

export const STROKE = 6;
export const SHADOW = 10;
export const border = `${STROKE}px solid ${B.ink}`;
export const shadow = (n = SHADOW) => `${n}px ${n}px 0 ${B.ink}`;

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
export const snap = Easing.bezier(0.2, 1.4, 0.4, 1);
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

// Pops in with a slight overshoot, like a sticker slapped on.
export const popIn = (
  frame: number,
  at: number,
  rotate = 0,
): React.CSSProperties => ({
  opacity: interpolate(frame, [at, at + 4], [0, 1], clamp),
  scale: interpolate(frame, [at, at + 12], [0.6, 1], {
    ...clamp,
    easing: snap,
  }),
  rotate: `${rotate}deg`,
});

export const BrutalBg: React.FC<{
  readonly color?: string;
  readonly children: React.ReactNode;
}> = ({ color = B.paper, children }) => (
  <AbsoluteFill
    style={{
      fontFamily: font,
      color: B.ink,
      backgroundColor: color,
      backgroundImage: `radial-gradient(${B.ink}33 2.5px, transparent 2.5px)`,
      backgroundSize: "40px 40px",
    }}
  >
    {children}
  </AbsoluteFill>
);

// Kicker sticker + headline, anchored to the top-left of the safe area.
export const Title: React.FC<{
  readonly kicker?: string;
  readonly kickerColor?: string;
  readonly children: React.ReactNode;
}> = ({ kicker, kickerColor = B.yellow, children }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: SAFE.top + 8,
        width: SAFE.width,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 22,
      }}
    >
      {kicker ? (
        <div
          style={{
            background: kickerColor,
            border,
            boxShadow: shadow(6),
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: 3,
            padding: "6px 20px",
            ...popIn(frame, 0, -3),
          }}
        >
          {kicker}
        </div>
      ) : null}
      <div
        style={{
          fontSize: 76,
          fontWeight: 700,
          lineHeight: 1.02,
          letterSpacing: -2,
          textTransform: "uppercase",
          opacity: interpolate(frame, [4, 10], [0, 1], clamp),
          translate: interpolate(frame, [4, 18], ["-60px 0px", "0px 0px"], {
            ...clamp,
            easing: easeOut,
          }),
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Highlighted word inside a title.
export const Mark: React.FC<{
  readonly color: string;
  readonly children: string;
}> = ({ color, children }) => (
  <span
    style={{
      background: color,
      padding: "0 10px",
      border,
      boxDecorationBreak: "clone",
    }}
  >
    {children}
  </span>
);

// Bottom caption box; its bottom edge plus shadow stays inside the safe area.
export const Caption: React.FC<{
  readonly from: number;
  readonly to: number;
  readonly color?: string;
  readonly children: React.ReactNode;
}> = ({ from, to, color = B.white, children }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        width: SAFE.width - SHADOW,
        bottom: 1920 - SAFE.bottom + SHADOW,
        background: color,
        border,
        boxShadow: shadow(),
        fontSize: 44,
        fontWeight: 700,
        lineHeight: 1.2,
        padding: "20px 28px",
        opacity: interpolate(
          frame,
          [from, from + 4, to - 4, to],
          [0, 1, 1, 0],
          clamp,
        ),
        translate: interpolate(
          frame,
          [from, from + 12],
          ["0px 40px", "0px 0px"],
          {
            ...clamp,
            easing: snap,
          },
        ),
      }}
    >
      {children}
    </div>
  );
};

// Bordered panel that holds an illustration.
export const Panel: React.FC<{
  readonly top: number;
  readonly height: number;
  readonly color?: string;
  readonly children: React.ReactNode;
}> = ({ top, height, color = B.white, children }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top,
        width: SAFE.width - SHADOW,
        height,
        background: color,
        border,
        boxShadow: shadow(),
        overflow: "hidden",
        ...popIn(frame, 6),
      }}
    >
      {children}
    </div>
  );
};

export const Sticker: React.FC<{
  readonly at: number;
  readonly color: string;
  readonly rotate?: number;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ at, color, rotate = 0, style, children }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        background: color,
        border,
        boxShadow: shadow(6),
        fontSize: 40,
        fontWeight: 700,
        padding: "10px 22px",
        whiteSpace: "nowrap",
        ...popIn(frame, at, rotate),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

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

export const Drop: React.FC<{ readonly r: number; readonly fill?: string }> = ({
  r,
  fill = B.water,
}) => (
  <path
    d={`M 0 ${-r * 1.6} C ${r * 0.6} ${-r * 0.7} ${r} ${-r * 0.25} ${r} ${r * 0.25} A ${r} ${r} 0 1 1 ${-r} ${r * 0.25} C ${-r} ${-r * 0.25} ${-r * 0.6} ${-r * 0.7} 0 ${-r * 1.6} Z`}
    fill={fill}
    stroke={B.ink}
    strokeWidth={STROKE}
    strokeLinejoin="round"
  />
);

// Bucket; origin is top-centre of the rim. `fill` is 0..1.
export const Bucket: React.FC<{
  readonly fill: number;
  readonly id: string;
}> = ({ fill, id }) => {
  const body = "M -38 0 L 38 0 L 30 70 L -30 70 Z";
  return (
    <g>
      <path
        d="M -34 2 C -34 -46 34 -46 34 2"
        fill="none"
        stroke={B.ink}
        strokeWidth={STROKE}
      />
      <clipPath id={id}>
        <path d={body} />
      </clipPath>
      <path d={body} fill={B.orange} />
      <rect
        x={-40}
        y={70 - 64 * fill}
        width={80}
        height={80}
        fill={B.water}
        clipPath={`url(#${id})`}
        opacity={fill > 0.01 ? 1 : 0}
      />
      <path
        d={body}
        fill="none"
        stroke={B.ink}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
    </g>
  );
};

// Debug overlay of the TikTok safe area; toggled per composition.
export const SafeAreaGuide: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width={1080} height={1920}>
      <path
        d={`M 0 0 H 1080 V 1920 H 0 Z M ${SAFE.left} ${SAFE.top} V ${SAFE.bottom} H ${SAFE.right} V ${SAFE.stripBottom} H ${SAFE.stripRight} V ${SAFE.top} Z`}
        fill="rgba(255,0,80,0.28)"
        fillRule="evenodd"
      />
    </svg>
  </AbsoluteFill>
);

export type SfxName =
  | "pop"
  | "thud"
  | "water"
  | "whoosh"
  | "whip"
  | "switch"
  | "mouse-click"
  | "ding"
  | "page-turn";

// One-shot sound effect starting at scene-local frame `at`.
export const Sfx: React.FC<{
  readonly at: number;
  readonly name: SfxName;
  readonly volume?: number;
}> = ({ at, name, volume = 0.5 }) => {
  const { fps } = useVideoConfig();
  return (
    <Audio
      name={`SFX ${name}`}
      from={at}
      src={staticFile(`sfx/${name}.wav`)}
      volume={volume}
      premountFor={fps}
    />
  );
};
