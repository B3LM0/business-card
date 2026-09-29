# Contact Card

A two-page "digital business card".

- `#/` — **the card.** What a client sees after scanning: your photo, who you
  are, and tappable links to WhatsApp, GitHub, portfolio, email, LinkedIn and
  phone. No QR code here, on purpose.
- `#/qr` — **the QR page.** Separate, so you can screenshot or download your own
  code without it cluttering the client-facing card.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # test the production build
```

## Configure

**Edit only `src/data/profile.ts`.**

| Field | What it does |
|---|---|
| `profile` | Name, role, one-line bio, location, photo |
| `links[]` | The rows on the card, **in display order** |

Delete a link by removing its object, reorder by moving objects, add one by
copying an entry. Valid `icon` values: `whatsapp`, `github`, `website`, `email`,
`linkedin`, `phone`.

`photoUrl` can stay empty — the card falls back to your initials in a gradient
ring. Feed it any square image URL for a real photo.

### WhatsApp

`url` must be `https://wa.me/<number>` with the full international number and
**no `+`, no spaces**:

```
Morocco       → https://wa.me/212612345678
UK            → https://wa.me/447700900123
United States → https://wa.me/15551234567
```

### Theme

Colours live in `src/index.css` under `:root`. The whole site is driven by four
gradient stops:

```css
--a1: #ff7a59;  /* coral  */
--a2: #f5498f;  /* pink   */
--a3: #9d5cff;  /* violet */
--a4: #5b8cff;  /* indigo */
```

Change those four values and every gradient, ring, glow and hover accent updates
together. Per-service icon colours are set individually under `.icon-*`.

## The one thing you must not skip

The QR encodes `window.location.origin`. On localhost it encodes
`http://localhost:5173`, which means **nothing to a client**. It only becomes a
real link once you deploy:

```bash
npm run build
npx netlify-cli deploy --prod --dir=dist     # or
npx vercel --prod                             # or push dist/ to GitHub Pages
```

Verify with your phone camera before you print anything.

## Structure

```
src/data/profile.ts          all content + link order
src/App.tsx                  hash router (#/ and #/qr)
src/pages/CardPage.tsx       the card a client sees
src/pages/QrPage.tsx         the QR page + PNG download
src/hooks/useVCard.ts        builds the .vcf file
src/components/LinkIcon.tsx  inline SVG icons
src/index.css                palette, layout, animations
```

## Notes

- **Hash routing** (`#/qr`) instead of the History API, deliberately: it works on
  any static host with zero rewrite rules. A `/qr` path would 404 on GitHub
  Pages without extra config.
- **Save contact** downloads a vCard 3.0 file (`.vcf`). A client taps it and your
  number, email and links land in their phone contacts. More useful than a QR
  that only opens a page.
- **Download PNG** renders a 1024px code at error-correction level `H`, which
  tolerates the logo/print artefacts you get on a physical card.
- The aurora background is a fixed CSS gradient with a slow `drift` animation,
  disabled automatically under `prefers-reduced-motion`.
