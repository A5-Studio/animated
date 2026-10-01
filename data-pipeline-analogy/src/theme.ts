import { loadFont } from "@remotion/fonts";
import { Easing, staticFile } from "remotion";

// Bundled locally so rendering doesn't depend on reaching Google Fonts.
export const fontFamily = "Plus Jakarta Sans";
for (const weight of ["500", "700", "800"]) {
  loadFont({
    family: fontFamily,
    url: staticFile(`PlusJakartaSans-${weight}.ttf`),
    weight,
  });
}

export const C = {
  bg: "#EAF6FB",
  bgDeep: "#D3ECF7",
  ink: "#0F2A3D",
  muted: "#4A6273",
  water: "#2FA8E0",
  waterLight: "#7FD1F5",
  waterDark: "#1B7DB0",
  bucket: "#FF8A3D",
  bucketDark: "#D9661C",
  bucketSoft: "#FFE6D5",
  pipe: "#5B6B7A",
  pipeDark: "#3E4C58",
  pipeSoft: "#D8EEF9",
  grass: "#8ED081",
  grassDark: "#5FAE5A",
  skin: "#F2C6A0",
  shirt: "#335C81",
  danger: "#E5484D",
  good: "#22A06B",
  white: "#FFFFFF",
};

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const pop = Easing.spring({ damping: 12 });

export const W = 1080;
export const H = 1920;
export const FPS = 30;
