---
name: OmniLyrics
category: fun
order: 2
img: /assets/projects/omnilyrics.png
blurb: The lyric tool I always wanted — CLI, GUI, and status-bar modes, cross-platform, built with .NET 8 and Avalonia.
links:
  - label: GitHub
    url: https://github.com/zzxzzk115/OmniLyrics
---

There is no lyric app that is truly cross-platform _and_ works well everywhere you'd want lyrics: as a desktop window, in the terminal, and in a status bar. Every existing tool covers one platform or one surface and stops. OmniLyrics is my attempt to build the one I always wanted — **CLI, GUI, and status-bar modes, on Windows, macOS, and Linux**.

## Design

- **One core, many frontends.** A shared .NET core with an Avalonia GUI and a CLI; the CLI's `--mode line` emits single-line output made for status bars — it drops straight into a Waybar module on Linux.
- **Knows what you're playing.** Now-playing information comes from the platform's native media APIs — **MPRIS** on Linux, **SMTC** on Windows — and lyrics are fetched from online sources and synced to playback.
- **Remote-controllable.** A running instance acts as a daemon: `--control play / pause / toggle / prev / next / seek` lets scripts and keybindings drive playback through it.
- **Why C# / .NET 8?** I knew Avalonia well from earlier projects, and it's the same .NET affinity that shows up elsewhere in my work — the private VultraEngine bets on CoreCLR for scripting.

## Status

Development is paused for now — I'll return to it in spare moments between engine work.
