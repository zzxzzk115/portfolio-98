---
title: Teal Dreams
artist: Lazy_V
order: 1
---

// Teal Dreams — ambient pads for a teal desktop
setcpm(60/4)
stack(
  note("<c3 a2 f2 g2>")
    .s("sawtooth")
    .lpf(sine.range(300, 1500).slow(8))
    .attack(0.1).release(0.3)
    .gain(0.5),
  note("<c4 e4 g4 b4 a4 g4 e4 d4>*2")
    .s("triangle")
    .delay(0.5)
    .room(0.6)
    .gain(0.35)
)
