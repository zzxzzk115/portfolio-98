---
title: Dirt Boulevard
artist: Lazy_V
order: 3
---

// Dirt Boulevard — drum machine + bass (samples load from the net)
setcpm(90/4)
stack(
  s("bd sd [~ bd] sd"),
  s("hh*8").gain(0.4).pan(sine.slow(4)),
  note("<c2 c2 eb2 g1>")
    .s("sawtooth")
    .lpf(600)
    .gain(0.5)
)
