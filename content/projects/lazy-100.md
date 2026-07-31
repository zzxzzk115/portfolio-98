---
name: Lazy-100
category: fun
order: 1
blurb: A fantasy game console in the spirit of PICO-8 / TIC-80 — built to prove VRI can carry a complete product. Playable in your browser!
links:
  - label: Play in Browser
    url: https://zzxzzk115.github.io/Lazy-100/
  - label: GitHub
    url: https://github.com/zzxzzk115/Lazy-100
  - label: Cart Catalog
    url: https://github.com/zzxzzk115/Lazy-100-games
embed:
  kind: site
  url: https://zzxzzk115.github.io/Lazy-100/
---

**Lazy-100** is a fantasy game console: a 320×240 indexed-color screen with a 256-color palette, 16×16 sprites, and 4-channel audio, with a complete in-console editor suite — shell, code, sprite, map, sfx, and music editors. You make games _inside_ the console.

## Why This Exists

Two reasons. First, the serious one: Lazy-100 is the proof that VRI can carry a _mature, complete product_ — a real application exercising cross-backend rendering and web deployment end to end, not just triangle demos. Second, the honest one: I have always loved retro games, and building a fantasy console in the spirit of PICO-8 / TIC-80 / BASIC8 is its own reward.

(The name? **Lazy_V** is my online handle; **100** just sounds nice.)

## Highlights

- Scripting in **Lua 5.4** (via sol2), with a bold twist: a **dual-VM architecture** that routes PICO-8 carts to a vendored z8lua VM, so PICO-8 games run natively. Purely for fun — but it works.
- Carts are `.lz100` text files or shareable **`.lz100.png`** images with the cart embedded in the picture.
- Built on VRI, SDL3, and miniaudio; runs on desktop and in the browser.
