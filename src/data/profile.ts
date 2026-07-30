// All portfolio content, initially sourced from zzxzzk115.github.io (al-folio).
// Edit this file to update site content — the apps render from it.

export const profile = {
  name: "Kexuan Zhang",
  handle: "Lazy_V",
  osName: "Portfolio-98",
  pocketName: "Pocket Portfolio-98",
  title: "PhD Student in Perceptual Graphics",
  affiliation: "University of Leeds",
  location:
    "Room 2.04 & 2.26, Sir William Henry Bragg Building, University of Leeds, Woodhouse Lane, Leeds, United Kingdom",
  avatar: "/assets/prof_pic_2025.jpg",
  cvPdf: "/assets/CV.pdf",
  facts: [
    "🧑🏻‍🎓 PhD Student in VR & HPG",
    "🫖 Game & Graphics Programmer",
    "🧑🏻‍💻 C/C++/C#/Java/Python/Lua",
    "🛠️ XMake/CMake & vcpkg",
    "💻 Windows/macOS/Linux",
  ],
  bio: [
    "Hello, I am Kexuan Zhang from China, currently pursuing a PhD in Perceptual Graphics at the University of Leeds under the supervision of Dr. Rafael Kuffner dos Anjos, Dr. Markus Billeter, and Prof. Gordon Love. I previously obtained my Master of Science degree in High-Performance Graphics and Games Engineering. Before that, I worked as a game server development engineer, specializing in C#, multithreading, network communication, and performance optimization.",
    "My research interests are Virtual Reality (VR) and High-Performance Graphics (HPG). The relative topics are: Foveated Rendering, Color / Depth / Texture Perception, Stereo Reprojection (Warping), Image Inpainting (Hole-filling), combining with high-performance graphics techniques. The libraries that I mainly use are Vulkan and OpenXR.",
    "In my free time, I enjoy singing and coding — indeed, I feel uneasy without coding. I like to experiment with small projects, often porting games or software to my favorite handheld/console platforms or developing and implementing game engines and other tools, savoring the process of building something from scratch. I believe that the purpose of life is to satisfy one's curiosity, continually create, and gain a sense of achievement.",
  ],
  news: [
    { date: "Feb 01, 2025", text: "Started my PhD at the VCG group, University of Leeds! 🎉" },
  ],
  socials: {
    email: "K.Zhang@leeds.ac.uk",
    github: "zzxzzk115",
    linkedin: "kexuan-zhang-leeds",
    itch: "lazy-v",
    academicSite: "https://zzxzzk115.github.io",
  },
};

export interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  doi?: string;
  pdf?: string;
  external?: { label: string; url: string }[];
  abstract?: string;
  citationCn?: string;
}

export const publications: Publication[] = [
  {
    id: "li2021mobile",
    title: "Mobile Surveillance System Based on Remote APP Control",
    authors: "Shaowei Li, Kexuan Zhang",
    venue: "Computer Systems & Applications, 30(6), p.82",
    year: 2021,
    doi: "10.15888/j.cnki.csa.007939",
    pdf: "/assets/li_zhang_2021.pdf",
    external: [
      {
        label: "CNKI",
        url: "https://www.cnki.net/KCMS/detail/detail.aspx?dbcode=CJFD&dbname=CJFDLAST2021&filename=XTYY202106011&uniplatform=OVERSEA&v=gSJgB_xrLlAjeXJHQYAo4T38jwAKTkFrtG1FBaoRP2sBh86yWkU8n5gnBJ_jO4B3",
      },
    ],
    abstract:
      "A remote-control mobile video surveillance system is designed to expand the video monitoring range and enhance flexibility of a single camera. The system is composed of four modules. The smart car based on the Arduino system is equipped with a camera to receive user instructions for collecting videos. The embedded Linux system makes real-time acquisition of video data feasible through the V4L2 interface. Meanwhile, it sends the data to the forwarding server through the network and forwards the control commands from users to the smart car. The server transmits the video to the client while the user control instructions to the Linux system. Additionally, Android-based mobile terminal presents monitoring videos and provides a user control interface. Compared with the existing system, the new system enables monitoring without blind spots by a single camera.",
    citationCn:
      "李少伟,张可宣.移动远程视频监控系统[J].计算机系统应用,2021,30(06):82-87.DOI:10.15888/j.cnki.csa.007939.",
  },
];

export type ProjectCategory = "work" | "indie" | "fun";

export interface Project {
  slug: string;
  name: string;
  category: ProjectCategory;
  blurb: string;
  paragraphs: { heading?: string; text: string }[];
  links: { label: string; url: string }[];
  embed?:
    | { kind: "steam"; appId: string }
    | { kind: "itch"; embedId: string; url: string; title: string }
    | { kind: "youtube"; videoId: string }
    | { kind: "site"; url: string };
}

export const projects: Project[] = [
  {
    slug: "cells-of-division",
    name: "Cells of Division",
    category: "indie",
    blurb:
      "A top-down bullet hell roguelike on Steam — fight alongside clones of your past runs inside the immune system. Free demo out now!",
    paragraphs: [
      {
        text: "Cells of Division is a top-down bullet hell roguelike developed by High Path Games: fight alongside clones of your past runs (up to 6 allies), mix around 100 items, and take down 50+ bosses — destroying viruses to defend the immune system. Coming soon to Windows, macOS, and Linux on Steam.",
      },
      {
        heading: "My Role",
        text: "I am a co-founder of High Path Games and the programming lead on the project, responsible for program architecture design, core gameplay subsystem development, and leading the programming team — owning technical direction and delivery.",
      },
      {
        heading: "Wishlist It",
        text: "If bullet hell roguelikes are your thing, wishlist Cells of Division on Steam — it helps indie teams like ours more than you'd think. A free demo is out now on the Steam page.",
      },
    ],
    links: [
      {
        label: "Steam Page",
        url: "https://store.steampowered.com/app/3879680/Cells_of_Division/",
      },
    ],
    embed: { kind: "steam", appId: "3879680" },
  },
  {
    slug: "vultra-ecosystem",
    name: "Vultra Ecosystem",
    category: "work",
    blurb:
      "A modular family of C++ libraries for real-time rendering, XR research, and game development — from foundation utilities to a multi-backend RHI and a modern engine.",
    paragraphs: [
      {
        text: "Vultra is not a single repository — it is an ecosystem of MIT-licensed, XMake-built C++ libraries that I design, write, and maintain, covering everything from foundation utilities to a cross-API render hardware interface and a modern rendering engine. Each piece is a standalone, reusable library; together they form the stack my PhD research and my games run on.",
      },
      {
        heading: "Origins",
        text: "The story starts with Snow Leopard Engine, an OpenGL 4.6 group project at the University of Leeds. It taught me a lot — and left a lot to be desired: a legacy API, tightly coupled subsystems, and design decisions we could not undo late in the project. When I began my PhD, the framework behind my research projects gradually matured, and instead of one monolithic engine, I rebuilt everything as an ecosystem of focused libraries.",
      },
      {
        heading: "Design Principles",
        text: "Modularity and reuse — every library is its own package, reusable by any project. Offline-first content — heavy work (shader compilation, mesh optimization, texture compression) happens at import/build time. Full-platform ambition — desktop, Android, WebAssembly, and XR are first-class targets. Research-friendly — program against the stack the way you program against raylib: no editor, no wizard, just code.",
      },
      {
        heading: "Why Not an Existing Solution?",
        text: "bgfx is built on OpenGL state-machine thinking, forfeiting the advanced features of modern APIs. Diligent Engine and The Forge don't fully cover the API matrix I need, and neither exploits Slang's single-source cross-backend compilation. NRI supports only Vulkan and DirectX. And none of them treat OpenXR as a design consideration — which, for someone whose research is high-performance VR rendering, was the final straw. So I wrote VRI: a RHI that satisfies my own requirements while aiming for the broadest platform support possible.",
      },
      {
        heading: "The Stack",
        text: "Foundation: vbase (core utilities), vfilesystem (FS abstraction), vtask (task scheduling on enkiTS). Content pipeline: vshadersystem (Slang shader pipeline), vasset (offline asset pipeline), vrendergraph (render-graph schema). Rendering: VRI (multi-backend RHI for Vulkan, DX12, WebGPU, OpenGL/ES/WebGL, Metal) and VRI-Framework. Engine: libvultra / VultraEngine. Proof of maturity: the Lazy-100 fantasy console ships on this stack.",
      },
    ],
    links: [
      { label: "VRI on GitHub", url: "https://github.com/zzxzzk115/VRI" },
      { label: "libvultra on GitHub", url: "https://github.com/zzxzzk115/libvultra" },
      { label: "Vultra on GitHub", url: "https://github.com/zzxzzk115/Vultra" },
      { label: "vbase", url: "https://github.com/zzxzzk115/vbase" },
      { label: "vtask", url: "https://github.com/zzxzzk115/vtask" },
      { label: "VRI Docs", url: "https://zzxzzk115.github.io/VRI/" },
    ],
  },
  {
    slug: "lazy-100",
    name: "Lazy-100",
    category: "fun",
    blurb:
      "A fantasy game console in the spirit of PICO-8 / TIC-80 — built to prove VRI can carry a complete product. Playable in your browser!",
    paragraphs: [
      {
        text: "Lazy-100 is a fantasy game console: a 320×240 indexed-color screen with a 256-color palette, 16×16 sprites, and 4-channel audio, with a complete in-console editor suite — shell, code, sprite, map, sfx, and music editors. You make games inside the console.",
      },
      {
        heading: "Why This Exists",
        text: "Two reasons. First, the serious one: Lazy-100 is the proof that VRI can carry a mature, complete product — a real application exercising cross-backend rendering and web deployment end to end, not just triangle demos. Second, the honest one: I have always loved retro games, and building a fantasy console in the spirit of PICO-8 / TIC-80 / BASIC8 is its own reward. (The name? Lazy_V is my online handle; 100 just sounds nice.)",
      },
      {
        heading: "Highlights",
        text: "Scripting in Lua 5.4 (via sol2), with a bold twist: a dual-VM architecture that routes PICO-8 carts to a vendored z8lua VM, so PICO-8 games run natively. Carts are .lz100 text files or shareable .lz100.png images with the cart embedded in the picture. Built on VRI, SDL3, and miniaudio; runs on desktop and in the browser.",
      },
    ],
    links: [
      { label: "Play in Browser", url: "https://zzxzzk115.github.io/Lazy-100/" },
      { label: "GitHub", url: "https://github.com/zzxzzk115/Lazy-100" },
      { label: "Cart Catalog", url: "https://github.com/zzxzzk115/Lazy-100-games" },
    ],
    embed: { kind: "site", url: "https://zzxzzk115.github.io/Lazy-100/" },
  },
  {
    slug: "snow-leopard-engine",
    name: "Snow Leopard Engine",
    category: "work",
    blurb:
      "A C++ / OpenGL 4.6 game engine built by a 7-person MSc team at Leeds — where the Vultra story began.",
    paragraphs: [
      {
        text: "Snow Leopard Engine was the group project (COMP5530M, 2023/24) of the High-Performance Graphics and Games Engineering MSc programme at the University of Leeds: build a game engine from scratch, then prove it by shipping a game demo on top of it.",
      },
      {
        heading: "What We Built",
        text: "A modern OpenGL 4.6 renderer with PBR and post-processing effects; DzShader — a Unity-like, data-driven shader format that later matured into vshadersystem; PhysX physics simulation, skeletal animation, simple in-game GUI, and an editor; and an attempted C# scripting integration whose idea survived — the private VultraEngine is now built around CoreCLR C# scripting.",
      },
      {
        heading: "The Team",
        text: "I led the 7-person team (architecture, core systems, rendering, editor, audio, report), with Ziyu Min as associate leader on rendering and shaders, Jubiao Lin and Simiao Wang on physics, Ruofan He on gameplay path-finding, Haodong Lin on animation, and Yanni Ma on the editor.",
      },
      {
        heading: "Retrospective",
        text: "The biggest gain was the people: seven teammates, each with their own strengths. The biggest regret was time — coursework and exams competed hard for everyone's hours. Those regrets didn't go to waste: the shortcomings of a monolithic, OpenGL-era engine — and the wish to do it properly — are exactly what seeded the Vultra Ecosystem. MIT licensed.",
      },
    ],
    links: [
      {
        label: "GitHub",
        url: "https://github.com/SnowLeopardEngine/SnowLeopardEngine",
      },
    ],
    embed: { kind: "youtube", videoId: "z9oA2pugC6s" },
  },
  {
    slug: "omnilyrics",
    name: "OmniLyrics",
    category: "fun",
    blurb:
      "The lyric tool I always wanted — CLI, GUI, and status-bar modes, cross-platform, built with .NET 8 and Avalonia.",
    paragraphs: [
      {
        text: "There is no lyric app that is truly cross-platform and works well everywhere you'd want lyrics: as a desktop window, in the terminal, and in a status bar. OmniLyrics is my attempt to build the one I always wanted — CLI, GUI, and status-bar modes, on Windows, macOS, and Linux.",
      },
      {
        heading: "Design",
        text: "One core, many frontends: a shared .NET core with an Avalonia GUI and a CLI; the CLI's --mode line emits single-line output made for status bars — it drops straight into a Waybar module on Linux. Now-playing information comes from the platform's native media APIs — MPRIS on Linux, SMTC on Windows — and lyrics are fetched from online sources and synced to playback. A running instance acts as a daemon: --control play / pause / toggle / prev / next / seek lets scripts drive playback through it.",
      },
      {
        heading: "Status",
        text: "Development is paused for now — I'll return to it in spare moments between engine work.",
      },
    ],
    links: [{ label: "GitHub", url: "https://github.com/zzxzzk115/OmniLyrics" }],
  },
  {
    slug: "gold-miner-rebirth",
    name: "Gold Miner Rebirth",
    category: "fun",
    blurb:
      "A faithful remake of the classic Flash game, built with LÖVE2D for GameShell, Trimui, and other retro gaming handhelds.",
    paragraphs: [
      {
        text: "My friends and I loved this Flash game as kids, so I decided to bring it back — not as a reinterpretation, but as a faithful recreation, running on the retro gaming handhelds I collect: GameShell, Trimui Smart Pro and Brick, and anything else that can run LÖVE2D.",
      },
      {
        heading: "Design Notes",
        text: "Why LÖVE2D? I originally started on raylib, but on the GameShell it was unstable — even texture loading could fail. LÖVE 11.1 ran reliably on the handheld, so I switched, and the game inherited LÖVE's portability. The most fun part was learning to unpack the original .swf file — extracting the ActionScript and the original assets. That's what makes the remake taste like the original: same art, same feel, not a lookalike.",
      },
    ],
    links: [
      { label: "GitHub", url: "https://github.com/zzxzzk115/GoldMiner-Rebirth" },
      { label: "itch.io", url: "https://lazy-v.itch.io/goldminer-rebirth" },
    ],
    embed: {
      kind: "itch",
      embedId: "1548293",
      url: "https://lazy-v.itch.io/goldminer-rebirth",
      title: "GoldMiner-Rebirth by Lazy_V",
    },
  },
  {
    slug: "catmario-gb",
    name: "CatMario GB",
    category: "fun",
    blurb:
      "The troll platformer CatMario, rebuilt for the Game Boy with GB Studio — playable on itch.io or any GB emulator.",
    paragraphs: [
      {
        text: "This project is unfinished business. Years earlier I had started a GBC version of CatMario with GBDK and never completed it. When GB Studio took off, I saw the chance to finally finish the idea — its built-in platformer support meant the trolling gameplay came together fast, and I got to try my hand at drawing the pixel art myself, which turned out to be great fun.",
      },
      {
        heading: "Honest Retrospective",
        text: "It's a test piece more than a full game: completion is modest and there are only a few levels, so the reception was modest too — though some players did pick it up on itch.io after release. Still, it counts: a game I made, shipped, and that strangers actually played. Sometimes that's the whole point.",
      },
    ],
    links: [
      { label: "GitHub", url: "https://github.com/zzxzzk115/CatMarioGB" },
      { label: "itch.io", url: "https://lazy-v.itch.io/catmario-gb" },
    ],
    embed: {
      kind: "itch",
      embedId: "1490065",
      url: "https://lazy-v.itch.io/catmario-gb",
      title: "CatMario-GB by Lazy_V",
    },
  },
];

export const readmeText = `Welcome to ${profile.osName}!
==============================

This is the personal homepage of ${profile.name} (${profile.handle}),
lovingly styled after Windows 98.

Getting started:
 * Double-click a desktop icon to open an app.
 * Drag windows around by their title bars.
 * Right side of a window edge? Grab the corner to resize.
 * Use the Start menu for everything else.
 * Wallpaper looking dull? Open Display Properties.

On a phone? You are probably seeing the PDA edition
(${profile.pocketName}) instead. Same content, more pocketable.

Built with Next.js. Content lives in src/data/profile.ts.

(C) ${new Date().getFullYear()} ${profile.name}. No warranty, expressed
or implied. It is now safe to read the rest of this site.
`;
