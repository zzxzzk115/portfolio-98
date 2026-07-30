# win98-portfolio

**Kexuan 98** — a personal homepage styled after Windows 98, built with Next.js.

- 🖥️ **Desktop**: draggable/resizable windows, taskbar, Start menu, shutdown easter egg
- 📱 **Mobile**: automatically switches to a retro **Pocket PC / PDA shell** ("Pocket Kexuan") — top bar, Today screen, full-screen apps
- 🎨 **Replaceable wallpaper** via Display Properties (persisted in localStorage)
- 🕹️ **Games as apps**: the [Lazy-100](https://github.com/zzxzzk115/Lazy-100) fantasy console runs embedded in a window
- 📄 CV, publications, and projects rendered from a single data file

## Development

```bash
npm install
npm run dev
```

## Content editing

Everything content-related lives in [`src/data/profile.ts`](src/data/profile.ts) —
bio, publications, projects, links. Apps render from it.

- Add an app: create a component in `src/apps/`, register it in
  [`src/system/registry.tsx`](src/system/registry.tsx). It appears on the
  desktop, Start menu, and PDA launcher based on its flags.
- Add a wallpaper: append to `WALLPAPERS` in
  [`src/system/Settings.tsx`](src/system/Settings.tsx) (any CSS background,
  including `url(...)` images — paper figures welcome).
- Pixel icons are hand-drawn 16×16 maps in
  [`src/system/pixel-icons.tsx`](src/system/pixel-icons.tsx).

## Deployment

Pushes to `main` build a static export and deploy to GitHub Pages
(`NEXT_PUBLIC_BASE_PATH=/win98-portfolio`). See
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## Credits

- [98.css](https://jdan.github.io/98.css/) for the authentic widget styling
- Content originally from [zzxzzk115.github.io](https://zzxzzk115.github.io) (al-folio)
