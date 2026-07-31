---
title: Chip Commute
artist: Lazy_V
order: 2
---

// Chip Commute — square-wave arps, GameShell energy
setcpm(112/4)
stack(
  n("0 3 5 7 12 7 5 3")
    .scale("C:minor")
    .s("square")
    .decay(0.15).sustain(0)
    .gain(0.4),
  n("<0 -3>(3,8)")
    .scale("C2:minor")
    .s("sawtooth")
    .lpf(500)
    .gain(0.5),
  n("12 ~ 10 ~")
    .scale("C5:minor")
    .s("triangle")
    .delay(0.3)
    .gain(0.3)
)
