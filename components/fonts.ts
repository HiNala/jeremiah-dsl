import localFont from "next/font/local";

// Rock Salt display font
// Option A: place `RockSalt-Regular.ttf` next to this file (components/RockSalt-Regular.ttf)
// Option B: place it under `public/fonts/rock-salt/RockSalt-Regular.ttf` and update the path below
export const rockSalt = localFont({
  src: [{ path: "./RockSalt-Regular.ttf", weight: "400", style: "normal" }],
  variable: "--font-rock-salt",
  display: "swap",
});

// Body text font
export const bodyText = localFont({
  src: [{ path: "../public/fonts/rock-salt/textbodyfont/Girassol-Regular.ttf", weight: "400", style: "normal" }],
  variable: "--font-body-text",
  display: "swap",
});


