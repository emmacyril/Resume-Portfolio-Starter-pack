# Cyril Emmanuel — portfolio

[Live website](https://emmacyril.eminify.com/) · [GitHub](https://github.com/emmacyril) · [LinkedIn](https://www.linkedin.com/in/emmacyril/)

**An interactive engineering room by Cyril Emmanuel.**

A personal engineering portfolio covering payments, identity, operational platforms, AI integrations and developer tools.

## Experience

- An original Three.js workspace with a machined desk, monitor, laptop and individual keycaps.
- Selecting RewaPay, AddressDox, EMIWARP or Qub-Surf changes the 3D monitor to that project’s public preview.
- Drag and pointer response, keyboard-accessible rotation/reset buttons, pause/resume and reduced-motion support.
- An off-white and cobalt visual system, responsive project views and a personal engineering narrative.
- Six featured case studies and a searchable, filterable index of 24 projects.
- Public product screenshots with source captions and honest development status.
- An interactive payment retry model showing idempotency and mismatched-request rejection. It is synthetic demonstration data, not a live payment service.
- Keyboard-accessible native dialogs, responsive layouts and a downloadable résumé.
- Local fonts and image fallbacks; no analytics or third-party tracking scripts.

## Development

Requires Node.js 22.18+ or a newer supported LTS release.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Vite serves the local site at `http://127.0.0.1:4173`. Vercel builds the static `dist` directory using the repository configuration.

## Content and rendering

- `src/data.ts`: project copy, attribution, status and sources.
- `src/image-assets.ts`: selected public image URLs and local fallbacks.
- `src/StudioHero.tsx` and `src/StudioScene.tsx`: project selection and lazy-loaded 3D workspace; capped render rate and pixel ratio, offscreen suspension, resource disposal and a static fallback.
- `src/paymentBoundary.ts`: pure demonstration model; covered by invariant tests.
- `public/downloads/`: public engineering résumé.

Project names and product media remain the property of their respective owners. A case study describes Cyril’s documented contribution; it does not imply sole ownership or that an in-development product has launched. EMIWARP is Warp-derived and credits that foundation.

## Credits

This repository began as a fork of [Sonny Sangha’s Resume Portfolio Starter Pack](https://github.com/sonnysangha/Resume-Portfolio-Starter-pack). The original version is retained in Git history. The current application is a new React, TypeScript and Three.js implementation.

The workspace geometry, materials, scene composition and interaction code are authored for this portfolio. Cyril’s supplied header and original website image remain available in the repository. Project screenshots are credited in their case studies.

Uses [Three.js](https://threejs.org/) and [DM Sans](https://fonts.google.com/specimen/DM+Sans), distributed under their respective licences.
