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
  user: art(
    [
      "                ",
      "      kkkk      ",
      "     kkkkkk     ",
      "    kknnnnkk    ",
      "    knnnnnnk    ",
      "    knknnknk    ",
      "    knnnnnnk    ",
      "    kknnnnkk    ",
      "     knnnnk     ",
      "      knnk      ",
      "    kkbbbbkk    ",
      "   kbbbbbbbbk   ",
      "  kbbbbbbbbbbk  ",
      "  kbbbwbbwbbbk  ",
      "  kbbbbbbbbbbk  ",
      "  kkkkkkkkkkkk  ",
    ],
    P
  ),
  drive: art(
    [
      "                ",
      "                ",
      "                ",
      "                ",
      "  kkkkkkkkkkkk  ",
      " kggggggggggggk ",
      " kggggggggggggk ",
      " kggggggggggggk ",
      " kGGGGGGGGGGGGk ",
      " kGGGGGGGeGkGGk ",
      "  kkkkkkkkkkkk  ",
      "                ",
      "                ",
      "                ",
      "                ",
      "                ",
    ],
    P
  ),
  gear: art(
    [
      "                ",
      "       kk       ",
      "   kk kggk kk   ",
      "  kggkkggkkggk  ",
      "   kggggggggk   ",
      "   kggkkkkggk   ",
      "  kggk    kggk  ",
      " kggk      kggk ",
      " kggk      kggk ",
      "  kggk    kggk  ",
      "   kggkkkkggk   ",
      "   kggggggggk   ",
      "  kggkkggkkggk  ",
      "   kk kggk kk   ",
      "       kk       ",
      "                ",
    ],
    P
  ),
  up: art(
    [
      "                ",
      "                ",
      "       k        ",
      "      kkk       ",
      "     kkkkk      ",
      "    kkkkkkk     ",
      "   kkkkkkkkk    ",
      "      kkk       ",
      "      kkk       ",
      "      kkk       ",
      "      kkk       ",
      "      kkkkkk    ",
      "                ",
      "                ",
      "                ",
      "                ",
    ],
    P
  ),
  github: art(
    [
      "                ",
      "                ",
      "   kk      kk   ",
      "   kkk    kkk   ",
      "   kkkkkkkkkk   ",
      "  kkkkkkkkkkkk  ",
      "  kkwwkkkkwwkk  ",
      "  kkkkkkkkkkkk  ",
      "  kkkkkkkkkkkk  ",
      "  kkkkkwwkkkkk  ",
      "   kkkkkkkkkk   ",
      "    kkkkkkkk    ",
      "     kkkkkk     ",
      "       kk       ",
      "       kk       ",
      "                ",
    ],
    P
  ),
  play: art(
    [
      "                ",
      "                ",
      "   k            ",
      "   kk           ",
      "   kkk          ",
      "   kkkk         ",
      "   kkkkk        ",
      "   kkkkkk       ",
      "   kkkkkk       ",
      "   kkkkk        ",
      "   kkkk         ",
      "   kkk          ",
      "   kk           ",
      "   k            ",
      "                ",
      "                ",
    ],
    P
  ),
  stop: art(
    [
      "                ",
      "                ",
      "                ",
      "   kkkkkkkkk    ",
      "   kkkkkkkkk    ",
      "   kkkkkkkkk    ",
      "   kkkkkkkkk    ",
      "   kkkkkkkkk    ",
      "   kkkkkkkkk    ",
      "   kkkkkkkkk    ",
      "   kkkkkkkkk    ",
      "   kkkkkkkkk    ",
      "   kkkkkkkkk    ",
      "                ",
      "                ",
      "                ",
    ],
    P
  ),
  prev: art(
    [
      "                ",
      "                ",
      "                ",
      "  kk    k    k  ",
      "  kk   kk   kk  ",
      "  kk  kkk  kkk  ",
      "  kk kkkk kkkk  ",
      "  kkkkkkkkkkkk  ",
      "  kkkkkkkkkkkk  ",
      "  kk kkkk kkkk  ",
      "  kk  kkk  kkk  ",
      "  kk   kk   kk  ",
      "  kk    k    k  ",
      "                ",
      "                ",
      "                ",
    ],
    P
  ),
  next: art(
    [
      "                ",
      "                ",
      "                ",
      "  k    k    kk  ",
      "  kk   kk   kk  ",
      "  kkk  kkk  kk  ",
      "  kkkk kkkk kk  ",
      "  kkkkkkkkkkkk  ",
      "  kkkkkkkkkkkk  ",
      "  kkkk kkkk kk  ",
      "  kkk  kkk  kk  ",
      "  kk   kk   kk  ",
      "  k    k    kk  ",
      "                ",
      "                ",
      "                ",
    ],
    P
  ),
  speaker: art(
    [
      "                ",
      "                ",
      "       k        ",
      "      kk    k   ",
      "     kkk  k  k  ",
      "  kkkkkk   k k  ",
      "  kkkkkk k k k  ",
      "  kkkkkk k k k  ",
      "  kkkkkk k k k  ",
      "  kkkkkk   k k  ",
      "     kkk  k  k  ",
      "      kk    k   ",
      "       k        ",
      "                ",
      "                ",
      "                ",
    ],
    P
  ),
  mute: art(
    [
      "                ",
      "                ",
      "       k        ",
      "      kk        ",
      "     kkk r   r  ",
      "  kkkkkk  r r   ",
      "  kkkkkk   r    ",
      "  kkkkkk  r r   ",
      "  kkkkkk r   r  ",
      "  kkkkkk        ",
      "     kkk        ",
      "      kk        ",
      "       k        ",
      "                ",
      "                ",
      "                ",
    ],
    P
  ),
  close: art(
    [
      "                ",
      "                ",
      "                ",
      "   kk      kk   ",
      "   kkk    kkk   ",
      "    kkk  kkk    ",
      "     kkkkkk     ",
      "      kkkk      ",
      "      kkkk      ",
      "     kkkkkk     ",
      "    kkk  kkk    ",
      "   kkk    kkk   ",
      "   kk      kk   ",
      "                ",
      "                ",
      "                ",
    ],
    P
  ),
  penguin: art(
    [
      "     kkkkkk     ",
      "    kkkkkkkk    ",
      "   kkwkkkkwkk   ",
      "   kkwkkkkwkk   ",
      "   kkkkkkkkkk   ",
      "   kkkooookkk   ",
      "   kkkkkkkkkk   ",
      "  krrrrrrrrrrk  ",
      "   kwwkkkkwwk   ",
      "  kkwwwkkwwwkk  ",
      " kokwwwwwwwwkok ",
      " kokwwwwwwwwkok ",
      "  kkwwwwwwwwkk  ",
      "   kkwwwwwwkk   ",
      "   kook  kook   ",
      "  kooook kooook ",
    ],
    P
  ),
  dos: art(
    [
      "                ",
      " kkkkkkkkkkkkk  ",
      " kgggggggggggk  ",
      " kkkkkkkkkkkkk  ",
      " k           k  ",
      " k ww        k  ",
      " k w         k  ",
      " k ww        k  ",
      " k w  ee     k  ",
      " k ww        k  ",
      " k           k  ",
      " k       ggg k  ",
      " k           k  ",
      " kkkkkkkkkkkkk  ",
      "                ",
      "                ",
    ],
    P
  ),
  clippy: art(
    [
      "                ",
      "     kkkkk      ",
      "    kykykyk     ",
      "   kyk   kyk    ",
      "   kyk   kyk    ",
      "   kyk   kyk    ",
      "   kyk   kyk    ",
      "   kyk  kkkkk   ",
      "   kyk kykkkyk  ",
      "   kyk kyk kyk  ",
      "   kykkkyk kyk  ",
      "    kykyk  kyk  ",
      "     kkk   kyk  ",
      "          kyk   ",
      "      kkkkyk    ",
      "       kkkk     ",
    ],
    P
  ),
  taskmgr: art(
    [
      "                ",
      " kkkkkkkkkkkkk  ",
      " kbbbbbbbbbbbk  ",
      " kkkkkkkkkkkkk  ",
      " kwwwwwwwwwwwk  ",
      " kw         wk  ",
      " kw e     e wk  ",
      " kw e  e  e wk  ",
      " kw e  e  e wk  ",
      " kwEe eE eEewk  ",
      " kwEe eE eEewk  ",
      " kwEeeEEeeEewk  ",
      " kwEeeEEeeEewk  ",
      " kwwwwwwwwwwwk  ",
      " kkkkkkkkkkkkk  ",
      "                ",
    ],
    P
  ),
  note: art(
    [
      "                ",
      "      kkkkkkkk  ",
      "     kkwwwwwwk  ",
      "    kkwkkkkkkk  ",
      "    kwk    kwk  ",
      "    kwk    kwk  ",
      "    kwk    kwk  ",
      "    kwk    kwk  ",
      "    kwk    kwk  ",
      "   kkwk   kkwk  ",
      "  kMMwk  kMMwk  ",
      " kMMMMk kMMMMk  ",
      " kMMMMk kMMMMk  ",
      "  kMMk   kMMk   ",
      "   kk     kk    ",
      "                ",
    ],
    P
  ),
  mine: art(
    [
      "                ",
      "       k        ",
      "   k   k   k    ",
      "    k kkk k     ",
      "     kkkkk      ",
      "    kkkkkkk     ",
      "   kkwwkkkkk    ",
      " kkkwkkkkkkkkk  ",
      "   kkkkkkkkk    ",
      "   kkkkkkkkk    ",
      "    kkkkkkk     ",
      "     kkkkk      ",
      "    k kkk k     ",
      "   k   k   k    ",
      "       k        ",
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
