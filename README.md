# Desktop Manga Reader (Electron + React + Tailwind)

A desktop manga reader with a glassmorphism macOS-inspired interface. The app runs with Electron for native desktop capabilities, React for UI, and Tailwind CSS for styling.

## Features (Current Foundation)

- Glass sidebar and content panel with `backdrop-filter: blur(20px)`.
- Local library grid with rounded glass cards and hover scaling effects.
- Import Folder support for `.jpg`, `.jpeg`, `.png`, `.webp` pages.
- Reader modes:
  - Vertical webtoon scrolling
  - Single page
  - Double page spread
- Zoom controls and previous/next navigation.
- Persistent storage through `electron-store`:
  - Imported libraries
  - Last read page per title
- Custom `manga://` protocol so local files can render safely inside the renderer.

## Project Structure

```txt
.
├── electron
│   ├── main.cjs
│   └── preload.cjs
├── src
│   ├── components
│   │   ├── Library.jsx
│   │   ├── Reader.jsx
│   │   └── Sidebar.jsx
│   ├── styles
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## Install & Run

```bash
npm install
npm run dev
```

## Next Steps

- Add richer metadata extraction (cover selection, chapter grouping).
- Add keyboard shortcuts and smooth inertial page snapping.
- Add virtualization for very long vertical chapters.
