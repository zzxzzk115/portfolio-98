import type { JSX } from "react";

// Hand-drawn 16x16 pixel icons rendered as SVG. Each icon is a list of rows;
// characters index into its palette, space = transparent.

export interface PixelArt {
  palette: Record<string, string>;
  rows: string[];
}

const P = {
  k: "#000000", // black
  w: "#ffffff", // white
  g: "#c0c0c0", // silver
  G: "#808080", // gray
  t: "#008080", // teal
  b: "#000080", // navy
  B: "#0000ff", // blue
  c: "#00ffff", // cyan
  y: "#ffff00", // yellow
  Y: "#808000", // olive
  o: "#ffa500", // orange
  r: "#ff0000", // red
  R: "#800000", // maroon
  e: "#00ff00", // green
  E: "#008000", // dark green
  m: "#ff00ff", // magenta
  M: "#800080", // purple
  f: "#ffe9ad", // folder light
  F: "#e8b158", // folder dark
  s: "#87ceeb", // sky
  n: "#ffdbac", // skin
};

const art = (rows: string[], palette: Record<string, string>): PixelArt => ({
  rows,
  palette,
});

export const ICONS: Record<string, PixelArt> = {
  computer: art(
    [
      "                ",
      " kkkkkkkkkkkkk  ",
      " kgggggggggggk  ",
      " kgkkkkkkkkkgk  ",
      " kgkbbbbbbbkgk  ",
      " kgkbcbbbbbkgk  ",
      " kgkbbbbbbbkgk  ",
      " kgkbbbbbbbkgk  ",
      " kgkkkkkkkkkgk  ",
      " kgggggggggggk  ",
      " kkkkkkkkkkkkk  ",
      "     kgggk      ",
      "   kkkkkkkkk    ",
      "  kgggggggggk   ",
      "  kgggkkkgGgk   ",
      "  kkkkkkkkkkk   ",
    ],
    P
  ),
  document: art(
    [
      "   kkkkkkkkk    ",
      "   kwwwwwwwkk   ",
      "   kwwwwwwwkwk  ",
      "   kwwwwwwwkkkk ",
      "   kwGGGGGGGGwk ",
      "   kwwwwwwwwwwk ",
      "   kwGGGGGGGGwk ",
      "   kwwwwwwwwwwk ",
      "   kwGGGGGGGGwk ",
      "   kwwwwwwwwwwk ",
      "   kwGGGGGwwwwk ",
      "   kwwwwwwwwwwk ",
      "   kwGGGGGGGwwk ",
      "   kwwwwwwwwwwk ",
      "   kwwwwwwwwwwk ",
      "   kkkkkkkkkkkk ",
    ],
    P
  ),
  folder: art(
    [
      "                ",
      "                ",
      "  kkkkkk        ",
      " kffffffk       ",
      "kffffffffkkkkkk ",
      "kfffffffffffffk ",
      "kfffffffffffffk ",
      "kfffffffffffffk ",
      "kfffffffffffffk ",
      "kfffffffffffffk ",
      "kFFFFFFFFFFFFFk ",
      "kFFFFFFFFFFFFFk ",
      "kFFFFFFFFFFFFFk ",
      " kkkkkkkkkkkkk  ",
      "                ",
      "                ",
    ],
    P
  ),
  book: art(
    [
      "                ",
      "  kkkkkkkkkkk   ",
      " kRRRRRRRRRRRk  ",
      " kRwwwwwwwwwRk  ",
      " kRwRRRRRRRwRk  ",
      " kRwwwwwwwwwRk  ",
      " kRRRRRRRRRRRk  ",
      " kRRRRRRRRRRRk  ",
      " kRwwwwwwwwwRk  ",
      " kRwGGGGGGGwRk  ",
      " kRwwwwwwwwwRk  ",
      " kRRRRRRRRRRRk  ",
      " kRRRRRRRRRRRk  ",
      " kwwwwwwwwwwwk  ",
      "  kkkkkkkkkkk   ",
      "                ",
    ],
    P
  ),
  joystick: art(
    [
      "                ",
      "      rrr       ",
      "     rrrrr      ",
      "     rrRrr      ",
      "      rrr       ",
      "       kk       ",
      "       kk       ",
      "       kk       ",
      "   kkkkkkkkk    ",
      "  kggggggggGk   ",
      " kggggggggggGk  ",
      " kgykggggggkgk  ",
      " kggggggggggGk  ",
      " kGGGGGGGGGGGk  ",
      "  kkkkkkkkkkk   ",
      "                ",
    ],
    P
  ),
  display: art(
    [
      "                ",
      " kkkkkkkkkkkkk  ",
      " kgggggggggggk  ",
      " kgkkkkkkkkkgk  ",
      " kgkssssssskgk  ",
      " kgkssEEssskgk  ",
      " kgksEEEEsskgk  ",
      " kgkyyEEssskgk  ",
      " kgkkkkkkkkkgk  ",
      " kgggggggggggk  ",
      " kkkkkkkkkkkkk  ",
      "     kgggk      ",
      "   kkkkkkkkk    ",
      "  kgggggggggk   ",
      "  kkkkkkkkkkk   ",
      "                ",
    ],
    P
  ),
  mail: art(
    [
      "                ",
      "                ",
      "                ",
      " kkkkkkkkkkkkkk ",
      " kwwwwwwwwwwwwk ",
      " kwkwwwwwwwwkwk ",
      " kwwkwwwwwwkwwk ",
      " kwwwkwwwwkwwwk ",
      " kwwwwkwwkwwwwk ",
      " kwwwwwkkwwwwwk ",
      " kwwwwwwwwwwwwk ",
      " kwwwwwwwwwwwwk ",
      " kwwwwwwwwwwwwk ",
      " kkkkkkkkkkkkkk ",
      "                ",
      "                ",
    ],
    P
  ),
  notepad: art(
    [
      "                ",
      "  kwkwkwkwkwk   ",
      "  kkkkkkkkkkkk  ",
      "  kwwwwwwwwwwk  ",
      "  kwGGGGGGGGwk  ",
      "  kwwwwwwwwwwk  ",
      "  kwGGGGGGGGwk  ",
      "  kwwwwwwwwwwk  ",
      "  kwGGGGGGGGwk  ",
      "  kwwwwwwwwwwk  ",
      "  kwGGGGGwwwwk  ",
      "  kwwwwwwwwwwk  ",
      "  kwwwwwwwwwwk  ",
      "  kkkkkkkkkkkk  ",
      "                ",
      "                ",
    ],
    P
  ),
  flask: art(
    [
      "                ",
      "     kkkkkk     ",
      "     k    k     ",
      "      k  k      ",
      "      k  k      ",
      "      k  k      ",
      "      k  k      ",
      "     k    k     ",
      "    k      k    ",
      "   k        k   ",
      "  k   eeee   k  ",
      "  k eeeeeeee k  ",
      "  keeEeeeeEeek  ",
      "  keeeeEeeeeek  ",
      "   kkkkkkkkkk   ",
      "                ",
    ],
    P
  ),
  globe: art(
    [
      "                ",
      "     kkkkkk     ",
      "   kkBBBBBBkk   ",
      "  kBBeeBBBBBBk  ",
      "  kBeeeeBBeBBk  ",
      " kBBeeeeBBeeBBk ",
      " kBBBeeBBBeeeBk ",
      " kBBBBBBBeeeeBk ",
      " kBBBBBBBeeeBBk ",
      " kBBeeBBBBeBBBk ",
      " kBeeeeBBBBBBBk ",
      "  kBeeBBBBeBBk  ",
      "  kBBBBBBeeBBk  ",
      "   kkBBBBBBkk   ",
      "     kkkkkk     ",
      "                ",
    ],
    P
  ),
  gameboy: art(
    [
      "                ",
      "   kkkkkkkkk    ",
      "  kgggggggggk   ",
      "  kgkkkkkkkgk   ",
      "  kgkEEEEEkgk   ",
      "  kgkEeeEEkgk   ",
      "  kgkEEEEEkgk   ",
      "  kgkkkkkkkgk   ",
      "  kgggggggggk   ",
      "  kg k g g ggk  ",
      "  kgkkkg  rggk  ",
      "  kg k g r ggk  ",
      "  kgggggggggk   ",
      "  kgggggggGgk   ",
      "   kkkkkkkkk    ",
      "                ",
    ],
    P
  ),
  brush: art(
    [
      "                ",
      "          kkk   ",
      "         ksssk  ",
      "        ksssk   ",
      "       ksssk    ",
      "      ksssk     ",
      "     ksssk      ",
      "    ksssk       ",
      "   kyyyk        ",
      "  kyyyk         ",
      " kyyyk          ",
      " kyyk           ",
      " kkk            ",
      "                ",
      "                ",
      "                ",
    ],
    P
  ),
  flag: art(
    [
      "                ",
      "                ",
      "  rrrrr eeeee   ",
      "  rrrrr eeeee   ",
      " rrrrr eeeee    ",
      " rrrrr eeeee    ",
      " rrrr  eeee     ",
      "                ",
      "  BBBBB yyyyy   ",
      "  BBBBB yyyyy   ",
      " BBBBB yyyyy    ",
      " BBBBB yyyyy    ",
      " BBBB  yyyy     ",
      "                ",
      "                ",
      "                ",
    ],
    P
  ),
};

export function PixelIcon({
  name,
  size = 32,
}: {
  name: string;
  size?: number;
}): JSX.Element | null {
  const icon = ICONS[name];
  if (!icon) return null;
  const rects: JSX.Element[] = [];
  icon.rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === " ") continue;
      const color = icon.palette[ch];
      if (!color) continue;
      rects.push(
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={color} />
      );
    }
  });
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated" }}
      aria-hidden
    >
      {rects}
    </svg>
  );
}
