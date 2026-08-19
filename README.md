# QRcode — Create. Track. Grow.

A premium, dark-first QR Code Generator & Design Studio. Create custom,
high-quality QR codes for URLs, text, Wi-Fi, email, contacts, events and more
— then download as PNG, SVG, WebP or JPEG. Everything runs 100% client-side;
nothing is uploaded to a server.

## 🎨 Theme

QRcode ships with a **premium SaaS color system** built on an electric
emerald/teal brand identity, with dark mode as the default experience.

| Token         | Value    | Role                                  |
| ------------- | -------- | ------------------------------------- |
| `brand`       | `#00C896`| Primary emerald/teal (actions, active)|
| `tech`        | `#3B82F6`| Blue — analytics / information        |
| `premium`     | `#8B5CF6`| Violet — advanced / premium features  |
| `marketing`   | `#F59E0B`| Orange — campaigns / marketing        |
| `surface`     | `#070B12`| Dark mode backgrounds & surfaces      |

All colors, typography, spacing, radius and shadow tokens are centralized in
**`src/theme/`**, and mirrored in `tailwind.config.js` so UI classes like
`bg-brand-500`, `text-brand-500`, `bg-surface-800` work everywhere. No raw hex
colors are hardcoded in components.

- **Dark mode** is the primary experience; toggle to light via the header icon.
- The chosen theme is persisted in `localStorage` and synced to the `dark`
  class on `<html>` (so Tailwind `dark:` variants behave consistently).

## ✨ Features

- 15+ QR content types: URL, Text, Email, Phone, SMS, Wi-Fi, vCard, Event,
  Location, Crypto/Wallet, and more
- Deep customization: module shapes, finder/eye styles, colors, gradients,
  embedded logos (with AI background removal), frames and error-correction
- Live preview updated in real time
- Export as PNG, SVG, WebP or JPEG at high resolution
- Built-in QR scanner (camera or image)
- QR history saved locally (`localStorage`)
- Responsive, animated UI (Framer Motion) + Lucide icons

## 🚀 Scripts

In the project directory you can run:

- `npm start` — runs the app in development mode at [http://localhost:3000](http://localhost:3000)
- `npm test` — launches the test runner in watch mode
- `npm run build` — builds the production bundle to the `build/` folder
- `npm run deploy` — builds and publishes to GitHub Pages (`gh-pages`)

## 🛠 Tech

Built with React 19, Tailwind CSS, Framer Motion, `@lglab/react-qr-code`,
`qr-code-styling`, `html-to-image` and `lucide-react`, bootstrapped with
[Create React App](https://github.com/facebook/create-react-app).

