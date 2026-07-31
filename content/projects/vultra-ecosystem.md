---
name: Vultra Ecosystem
category: work
order: 1
blurb: A modular family of C++ libraries for real-time rendering, XR research, and game development — from foundation utilities to a multi-backend RHI and a modern engine.
links:
  - label: VRI on GitHub
    url: https://github.com/zzxzzk115/VRI
  - label: libvultra on GitHub
    url: https://github.com/zzxzzk115/libvultra
  - label: Vultra on GitHub
    url: https://github.com/zzxzzk115/Vultra
  - label: VRI Docs
    url: https://zzxzzk115.github.io/VRI/
---

**Vultra** is not a single repository — it is an ecosystem of MIT-licensed, XMake-built C++ libraries that I design, write, and maintain, covering everything from foundation utilities to a cross-API render hardware interface and a modern rendering engine. Each piece is a standalone, reusable library; together they form the stack my PhD research and my games run on.

## Origins

The story starts with Snow Leopard Engine, an OpenGL 4.6 group project at the University of Leeds. It taught me a lot — and left a lot to be desired: a legacy API, tightly coupled subsystems, and design decisions we could not undo late in the project. When I began my PhD, the framework behind my research projects gradually matured, and instead of one monolithic engine, I rebuilt everything as an ecosystem of focused libraries.

## Design Principles

- **Modularity and reuse.** Every library is its own package, reusable by any project.
- **Offline-first content.** Heavy work (shader compilation, mesh optimization, texture compression) happens at import/build time.
- **Full-platform ambition.** Desktop, Android, WebAssembly, and XR are first-class targets.
- **Research-friendly.** Program against the stack the way you program against raylib: no editor, no wizard, just code.

## Why Not an Existing Solution?

**bgfx** is built on OpenGL state-machine thinking, forfeiting the advanced features of modern APIs. **Diligent Engine** and **The Forge** don't fully cover the API matrix I need, and neither exploits Slang's single-source cross-backend compilation. **NRI** supports only Vulkan and DirectX. And none of them treat **OpenXR** as a design consideration — which, for someone whose research is high-performance VR rendering, was the final straw. So I wrote **VRI**: a RHI that satisfies my own requirements while aiming for the broadest platform support possible.

## The Stack

- **Foundation**: vbase (core utilities), vfilesystem (FS abstraction), vtask (task scheduling on enkiTS)
- **Content pipeline**: vshadersystem (Slang shader pipeline), vasset (offline asset pipeline), vrendergraph (render-graph schema)
- **Rendering**: VRI (multi-backend RHI for Vulkan, DX12, WebGPU, OpenGL/ES/WebGL, Metal) and VRI-Framework
- **Engine**: libvultra / VultraEngine

Proof of maturity: the Lazy-100 fantasy console ships on this stack.
