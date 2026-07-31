---
name: Snow Leopard Engine
category: work
order: 2
img: /assets/projects/snow-leopard-engine.jpg
blurb: A C++ / OpenGL 4.6 game engine built by a 7-person MSc team at Leeds — where the Vultra story began.
links:
  - label: GitHub
    url: https://github.com/SnowLeopardEngine/SnowLeopardEngine
embed:
  kind: youtube
  videoId: z9oA2pugC6s
---

Snow Leopard Engine was the group project (COMP5530M, 2023/24) of the **High-Performance Graphics and Games Engineering** MSc programme at the University of Leeds: build a game engine from scratch, then prove it by shipping a game demo on top of it.

## What We Built

- Modern OpenGL 4.6 renderer with PBR and post-processing effects
- **DzShader** — a Unity-like, data-driven shader format. My first experiment with data-driven shading, an idea that later matured into vshadersystem.
- PhysX physics simulation, skeletal animation, simple in-game GUI, and an editor
- An attempted **C# scripting integration** — we never finished the API bindings, but the idea survived: the private VultraEngine is now built around CoreCLR C# scripting.

## The Team

| Name | Responsibility |
| --- | --- |
| Kexuan Zhang | Leader. Architecture, Core Systems, Rendering, Editor, Audio, Report |
| Ziyu Min | Associate Leader. Rendering, Shaders, Report |
| Jubiao Lin | Physics, In-Game GUI, Poster |
| Simiao Wang | Physics, Poster, Showcase Video |
| Ruofan He | GamePlay (Path-Finding) |
| Haodong Lin | Animation |
| Yanni Ma | Editor |

## Retrospective

The biggest gain was the people: seven teammates, each with their own strengths. The biggest regret was time — coursework and exams competed hard for everyone's hours, and as the leader I absorbed a lot of pressure holding the project together. Those regrets didn't go to waste: the shortcomings of a monolithic, OpenGL-era engine — and the wish to do it properly — are exactly what seeded the Vultra Ecosystem. MIT licensed.
