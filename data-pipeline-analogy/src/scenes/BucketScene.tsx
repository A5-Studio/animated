import { interpolate, useCurrentFrame } from "remotion";
import { C, clamp, easeOut } from "../theme";
import { Bucket, Caption, SceneBg, Title, wavePath } from "../ui";

const GROUND = 820;
const RIVER_X = 340;
const BARREL_X = 600;
const CYCLE = 90;

// One trip: walk to the river, fill, walk back (spilling), pour into the barrel.
const personX = (t: number) =>
  interpolate(t, [0, 25, 40, 70], [BARREL_X, RIVER_X, RIVER_X, BARREL_X], clamp);

const SPILLS = [46, 54, 62];

export const BucketScene: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame % CYCLE;
  const x = personX(t);
  const facing = t < 25 ? -1 : 1;
  const walking = (t > 0 && t < 25) || (t > 40 && t < 70);
  const swing = walking ? Math.sin(frame * 0.6) * 22 : 0;
  const bob = walking ? Math.abs(Math.sin(frame * 0.6)) * -6 : 0;
  const fill = interpolate(t, [27, 38, 40, 70, 74, 88], [0, 1, 1, 0.7, 0.7, 0], clamp);
  const dip = interpolate(t, [25, 30, 36, 40], [0, 60, 60, 0], clamp);
  const lift = interpolate(t, [70, 74], [0, -50], clamp) * (t >= 70 ? 1 : 0);
  const tilt = interpolate(t, [72, 80, 86, 90], [0, 75, 75, 0], clamp);
  const trips = Math.max(0, Math.floor((frame - 80) / CYCLE) + 1);
  const barrelLevel = Math.min(
    1,
    trips * 0.18 + (t >= 76 && t < 90 ? interpolate(t, [76, 88], [0, 0.18], clamp) : 0),
  );
  const tired = trips >= 2;

  return (
    <SceneBg>
      <Title kicker="CARA 1" kickerColor={C.bucket}>
        Ambil pakai ember
      </Title>

      <svg
        viewBox="0 420 1080 680"
        style={{
          position: "absolute",
          top: 780,
          left: 0,
          width: 1080,
          height: 680,
          opacity: interpolate(frame, [5, 20], [0, 1], clamp),
        }}
      >
        {/* ground + river */}
        <rect x={0} y={GROUND} width={1080} height={280} fill={C.grass} />
        <rect x={0} y={GROUND} width={1080} height={14} fill={C.grassDark} />
        <path
          d="M 0 790 L 230 790 Q 300 800 300 870 L 300 1100 L 0 1100 Z"
          fill={C.waterDark}
        />
        <path
          d={wavePath(0, 290, 810, 8, 120, frame / 6, 1100)}
          fill={C.water}
        />
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M ${40 + ((frame * 2 + i * 70) % 200)} ${880 + i * 60} q 20 -10 40 0`}
            stroke={C.waterLight}
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
          />
        ))}
        <text x={150} y={1060} textAnchor="middle" fontSize={40} fontWeight={800} fill={C.white}>
          SUNGAI
        </text>

        {/* house */}
        <g>
          <rect x={790} y={600} width={230} height={220} fill={C.white} />
          <path d="M 770 610 L 905 490 L 1040 610 Z" fill={C.bucketDark} />
          <rect x={880} y={710} width={60} height={110} rx={6} fill={C.shirt} />
          <rect x={815} y={650} width={50} height={50} rx={6} fill={C.waterLight} />
          <rect x={955} y={650} width={50} height={50} rx={6} fill={C.waterLight} />
        </g>
        <text x={905} y={890} textAnchor="middle" fontSize={36} fontWeight={800} fill={C.ink}>
          TIM BISNIS
        </text>

        {/* barrel */}
        <clipPath id="barrel">
          <rect x={660} y={700} width={100} height={120} rx={14} />
        </clipPath>
        <rect x={660} y={700} width={100} height={120} rx={14} fill="#B98555" />
        <rect
          x={660}
          y={820 - 110 * barrelLevel}
          width={100}
          height={120}
          fill={C.water}
          clipPath="url(#barrel)"
        />
        <rect x={656} y={730} width={108} height={8} fill="#8A5F3A" />
        <rect x={656} y={785} width={108} height={8} fill="#8A5F3A" />

        {/* spilled drops */}
        {SPILLS.map((s) => {
          const age = t - s;
          if (age < 0 || age > 18) return null;
          const sx = personX(s) + 55;
          const sy = interpolate(age, [0, 12], [GROUND - 30, GROUND], clamp);
          return (
            <g key={s} opacity={interpolate(age, [12, 18], [1, 0], clamp)}>
              {age < 12 ? (
                <circle cx={sx} cy={sy} r={9} fill={C.water} />
              ) : (
                <ellipse cx={sx} cy={GROUND + 4} rx={22} ry={6} fill={C.water} />
              )}
            </g>
          );
        })}

        {/* person */}
        <g transform={`translate(${x} ${GROUND + bob}) scale(${facing} 1)`}>
          <rect x={-22} y={-95} width={16} height={95} rx={8} fill={C.ink}
            transform={`rotate(${swing} -14 -90)`} />
          <rect x={6} y={-95} width={16} height={95} rx={8} fill={C.ink}
            transform={`rotate(${-swing} 14 -90)`} />
          <rect x={-36} y={-190} width={72} height={105} rx={26} fill={C.shirt} />
          <circle cx={0} cy={-225} r={36} fill={C.skin} />
          <path d="M -36 -232 A 36 36 0 0 1 36 -232 Z" fill={C.ink} />
          <circle cx={16} cy={-222} r={4} fill={C.ink} />
          {tired ? (
            <path d="M 8 -204 q 8 -6 16 0" stroke={C.ink} strokeWidth={3} fill="none" />
          ) : (
            <path d="M 8 -208 q 8 8 16 0" stroke={C.ink} strokeWidth={3} fill="none" />
          )}
          {tired ? (
            <g transform={`translate(-30 ${-250 + ((frame % 30) / 30) * 30})`}
              opacity={1 - (frame % 30) / 30}>
              <path d="M 0 -12 C 6 -4 8 0 8 4 A 8 8 0 1 1 -8 4 C -8 0 -6 -4 0 -12 Z"
                fill={C.waterLight} />
            </g>
          ) : null}
          <line x1={20} y1={-170} x2={55} y2={-120 + dip + lift}
            stroke={C.skin} strokeWidth={14} strokeLinecap="round" />
          <g transform={`translate(55 ${-115 + dip + lift}) rotate(${tilt})`}>
            <Bucket fill={fill} id="bucket-clip" />
          </g>
        </g>

        {/* pour stream */}
        {t >= 76 && t < 88 ? (
          <rect x={BARREL_X + 85} y={GROUND - 170} width={14} height={60} rx={7} fill={C.water} />
        ) : null}
      </svg>

      {/* trip counter */}
      <div
        style={{
          position: "absolute",
          top: 600,
          right: 80,
          background: C.white,
          borderRadius: 24,
          padding: "16px 28px",
          fontSize: 40,
          fontWeight: 700,
          color: C.muted,
          boxShadow: "0 8px 20px rgba(15,42,61,0.12)",
          opacity: interpolate(frame, [20, 35], [0, 1], clamp),
        }}
      >
        Bolak-balik: <span style={{ color: C.bucketDark, fontWeight: 800 }}>{trips}×</span>
      </div>

      <div
        style={{
          position: "absolute",
          top: 600,
          left: 80,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          fontSize: 36,
          fontWeight: 700,
          opacity: interpolate(frame, [30, 45], [0, 1], clamp),
          translate: interpolate(frame, [30, 45], ["-30px 0px", "0px 0px"], {
            ...clamp,
            easing: easeOut,
          }),
        }}
      >
        <div>
          <span style={{ color: C.water }}>Sungai</span> = sumber data
        </div>
        <div>
          <span style={{ color: C.bucketDark }}>Ember</span> = kerja manual
        </div>
      </div>

      <Caption from={20} to={165}>
        Butuh data? Ambil sendiri, manual.
      </Caption>
      <Caption from={170} to={340}>
        Export, copy-paste, kirim lewat email… lagi dan lagi.
      </Caption>
    </SceneBg>
  );
};
