## Be My Valentine (BMV)

**Single-page, cinematic Valentine’s Day invite** built with React, Vite, Framer Motion, and `@react-three/fiber`. All visible copy and date details live in `public/content.json` so you can tweak the experience without touching the code.

### Tech

- **React + Vite**
- **Framer Motion** for stage transitions and button motion
- **Three.js** via `@react-three/fiber` and `@react-three/drei` for the 3D background

### Content configuration

Edit `public/content.json`:

- `question` – main title + subtitle on the first screen
- `buttons` – labels for the Yes / No buttons
- `escalationMessages` – array of teasing messages when the No button is attempted; any length is supported, the last message is reused if needed
- `loader` – title, step texts, and fake compatibility result
- `confirmation` – final messages after “Yes”
- `dateDetails` – target ISO date, location text, and note
- `afterCountdown` – title + subtitle shown once the countdown reaches zero

Change texts freely (English, French, Chinese, inside jokes, etc.) and rebuild; the UI will pick up everything from JSON.

### Running locally

```bash
npm install
npm run dev
```

Then open the printed `http://localhost:5173/BMV/` URL (Vite base is configured for the GitHub Pages subpath).

### Building & deploying to GitHub Pages

1. Build the static site:

   ```bash
   npm run build
   ```

2. Push the `dist` folder to the `gh-pages` branch of `HOTP0T/BMV`, or configure your repo so that GitHub Pages serves from that branch / folder (depending on your setup).

The `vite.config.ts` `base` is already set to `/BMV/`, which matches the `https://<username>.github.io/BMV/` path.

# BMV
