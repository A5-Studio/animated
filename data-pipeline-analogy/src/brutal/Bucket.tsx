import { interpolate, useCurrentFrame } from "remotion";
import { B, Bucket, Caption, clamp, Mark, Panel, STROKE, Sticker, Title, wavePath , BrutalBg } from "./kit";

const GROUND = 820;
const RIVER_X = 262;
const BARREL_X = 440;
const CYCLE = 90;
const SPILLS = [46, 54, 62];
const S = { stroke: B.ink, strokeWidth: STROKE, strokeLinejoin: "round" as const };

// One trip: walk to the river, fill, walk back (spilling), pour into the barrel.
const personX = (t: number) =>
  interpolate(t, [0, 25, 40, 70], [BARREL_X, RIVER_X, RIVER_X, BARREL_X], clamp);

export const BrutalBucket: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame % CYCLE;
  const x = personX(t);
  const facing = t < 25 ? -1 : 1;
  const walking = (t > 0 && t < 25) || (t > 40 && t < 70);
  const swing = walking ? Math.sin(frame * 0.6) * 22 : 0;
  const bob = walking ? Math.abs(Math.sin(frame * 0.6)) * -6 : 0;
  const fill = interpolate(t, [27, 38, 40, 70, 74, 88], [0, 1, 1, 0.7, 0.7, 0], clamp);
  const dip = interpolate(t, [25, 30, 36, 40], [0, 60, 60, 0], clamp);
  const lift = t >= 70 ? interpolate(t, [70, 74], [0, -50], clamp) : 0;
  const tilt = interpolate(t, [72, 80, 86, 90], [0, 75, 75, 0], clamp);
  const trips = Math.max(0, Math.floor((frame - 80) / CYCLE) + 1);
  const barrelLevel = Math.min(
    1,
    trips * 0.18 + (t >= 76 && t < 90 ? interpolate(t, [76, 88], [0, 0.18], clamp) : 0),
  );
  const tired = trips >= 2;

  return (
    <BrutalBg>
      <Title kicker="CARA 1" kickerColor={B.orange}>
        Ambil pakai <Mark color={B.orange}>ember</Mark>
      </Title>

      <Panel top={530} height={550} color={B.waterLight}>
        <svg viewBox="0 360 840 620" preserveAspectRatio="xMidYMax slice"
          style={{ width: "100%", height: "100%" }}>
          <rect x={0} y={GROUND} width={840} height={200} fill={B.grass} {...S} />
          <path d="M -10 795 L 160 795 Q 225 800 225 870 L 225 1100 L -10 1100 Z" fill={B.water} {...S} />
          <path d={wavePath(-10, 215, 815, 7, 110, frame / 6, 1100)} fill={B.waterLight} opacity={0.5} />
          <text x={105} y={950} textAnchor="middle" fontSize={34} fontWeight={700} fill={B.ink}>
            SUNGAI
          </text>

          {/* house */}
          <rect x={620} y={600} width={200} height={220} fill={B.white} {...S} />
          <path d="M 600 610 L 720 495 L 840 610 Z" fill={B.pink} {...S} />
          <rect x={692} y={720} width={56} height={100} fill={B.purple} {...S} />
          <rect x={640} y={650} width={44} height={44} fill={B.yellow} {...S} />
          <rect x={756} y={650} width={44} height={44} fill={B.yellow} {...S} />
          <text x={720} y={890} textAnchor="middle" fontSize={34} fontWeight={700} fill={B.ink}>
            TIM BISNIS
          </text>

          {/* barrel */}
          <clipPath id="b-barrel">
            <rect x={490} y={710} width={80} height={110} />
          </clipPath>
          <rect x={490} y={710} width={80} height={110} fill={B.wood} />
          <rect x={490} y={820 - 100 * barrelLevel} width={80} height={110} fill={B.water}
            clipPath="url(#b-barrel)" />
          <rect x={490} y={710} width={80} height={110} fill="none" {...S} />
          <line x1={490} y1={745} x2={570} y2={745} {...S} />

          {SPILLS.map((s) => {
            const age = t - s;
            if (age < 0 || age > 18) return null;
            const sx = personX(s) + 55;
            return (
              <g key={s} opacity={interpolate(age, [12, 18], [1, 0], clamp)}>
                {age < 12 ? (
                  <circle cx={sx} cy={interpolate(age, [0, 12], [GROUND - 30, GROUND], clamp)}
                    r={10} fill={B.water} stroke={B.ink} strokeWidth={4} />
                ) : (
                  <ellipse cx={sx} cy={GROUND - 4} rx={24} ry={7} fill={B.water} stroke={B.ink} strokeWidth={4} />
                )}
              </g>
            );
          })}

          {/* person */}
          <g transform={`translate(${x} ${GROUND + bob}) scale(${facing} 1)`}>
            <rect x={-22} y={-95} width={16} height={95} rx={8} fill={B.ink}
              transform={`rotate(${swing} -14 -90)`} />
            <rect x={6} y={-95} width={16} height={95} rx={8} fill={B.ink}
              transform={`rotate(${-swing} 14 -90)`} />
            <rect x={-36} y={-190} width={72} height={105} rx={14} fill={B.blue} {...S} />
            <circle cx={0} cy={-225} r={36} fill={B.skin} {...S} />
            <path d="M -38 -228 A 38 38 0 0 1 38 -228 Z" fill={B.ink} />
            <circle cx={16} cy={-222} r={5} fill={B.ink} />
            <path d={tired ? "M 6 -202 q 10 -8 20 0" : "M 6 -208 q 10 10 20 0"}
              stroke={B.ink} strokeWidth={4} fill="none" strokeLinecap="round" />
            {tired ? (
              <g transform={`translate(-34 ${-252 + ((frame % 30) / 30) * 30})`}
                opacity={1 - (frame % 30) / 30}>
                <path d="M 0 -14 C 7 -4 10 0 10 5 A 10 10 0 1 1 -10 5 C -10 0 -7 -4 0 -14 Z"
                  fill={B.waterLight} stroke={B.ink} strokeWidth={3} />
              </g>
            ) : null}
            <line x1={20} y1={-168} x2={55} y2={-120 + dip + lift}
              stroke={B.ink} strokeWidth={18} strokeLinecap="round" />
            <line x1={20} y1={-168} x2={55} y2={-120 + dip + lift}
              stroke={B.skin} strokeWidth={8} strokeLinecap="round" />
            <g transform={`translate(55 ${-115 + dip + lift}) rotate(${tilt})`}>
              <Bucket fill={fill} id="b-bucket" />
            </g>
          </g>
          {t >= 76 && t < 88 ? (
            <rect x={BARREL_X + 78} y={GROUND - 170} width={16} height={62} fill={B.water}
              stroke={B.ink} strokeWidth={4} />
          ) : null}
        </svg>

        <div style={{ position: "absolute", top: 20, left: 20, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
          <Sticker at={25} color={B.white} rotate={-2} style={{ fontSize: 28, padding: "6px 14px" }}>
            Sungai = sumber data
          </Sticker>
          <Sticker at={33} color={B.white} rotate={1} style={{ fontSize: 28, padding: "6px 14px" }}>
            Ember = kerja manual
          </Sticker>
        </div>
        <div style={{ position: "absolute", top: 20, right: 26 }}>
          <Sticker at={18} color={B.yellow} rotate={3} style={{ fontSize: 30, padding: "6px 14px" }}>
            Bolak-balik: {trips}×
          </Sticker>
        </div>
      </Panel>

      <Caption from={20} to={165}>
        Butuh data? Ambil sendiri, manual.
      </Caption>
      <Caption from={170} to={340}>
        Export, copy-paste, kirim email… lagi dan lagi.
      </Caption>
    </BrutalBg>
  );
};
