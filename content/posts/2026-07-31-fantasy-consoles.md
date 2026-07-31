---
title: Why I Built a Fantasy Console
date: 2026-07-30
---

People keep asking why [Lazy-100](https://github.com/zzxzzk115/Lazy-100)
exists when PICO-8 and TIC-80 are right there. The honest answer has two
halves.

The strategic half: Lazy-100 is a proof of maturity for
[VRI](https://github.com/zzxzzk115/VRI), my cross-backend render hardware
interface. A RHI that only runs triangle demos proves nothing; a RHI that
ships a complete product — 320×240 indexed color, sprite editor, sound
editor, a Lua VM, running on desktop *and* in the browser — proves the
abstraction holds under real load.

The honest half: I wanted one. Constraints are the fun part. A 256-color
palette and 16×16 sprites is not a limitation, it's a permission slip to
stop worrying about art quality and start making games.

(You can play it right here on this site — open **Games** on the desktop
and it runs inside a window. The 90s never had it this good.)
