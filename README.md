# win98-portfolio

**Portfolio-98** 鈥?a personal homepage styled after Windows 98, built with Next.js.

- 馃枼锔?**Desktop**: draggable/resizable windows, taskbar, Start menu, shutdown easter egg
- 馃摫 **Mobile**: automatically switches to a retro **Pocket PC / PDA shell** ("Pocket Portfolio-98") 鈥?top bar, Today screen, full-screen apps
- 馃帹 **Replaceable wallpaper** via Display Properties (persisted in localStorage)
- 馃暪锔?**Games as apps**: the [Lazy-100](https://github.com/zzxzzk115/Lazy-100) fantasy console runs embedded in a window
- 馃搫 CV, publications, and projects rendered from a single data file

## Development

```bash
npm install
npm run dev
```

## Content editing

Everything content-related lives in [`src/data/profile.ts`](src/data/profile.ts) 鈥?bio, publications, projects, links. Apps render from it.

- Add an app: create a component in `src/apps/`, register it in
  [`src/system/registry.tsx`](src/system/registry.tsx). It appears on the
  desktop, Start menu, and PDA launcher based on its flags.
- Add a wallpaper: append to `WALLPAPERS` in
  [`src/system/Settings.tsx`](src/system/Settings.tsx) (any CSS background,
  including `url(...)` images 鈥?paper figures welcome).
- Pixel icons are hand-drawn 16脳16 maps in
  [`src/system/pixel-icons.tsx`](src/system/pixel-icons.tsx).

## Deployment

Pushes to `main` build a static export and deploy to GitHub Pages
(`NEXT_PUBLIC_BASE_PATH=/win98-portfolio`). See
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## Credits

- [98.css](https://jdan.github.io/98.css/) for the authentic widget styling
- Content originally from [zzxzzk115.github.io](https://zzxzzk115.github.io) (al-folio)
