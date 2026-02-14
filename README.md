# Ahmed Alaa Portfolio

Place `resume.pdf` in the project root next to `index.html` so the "Download CV" buttons work.

Suggested next steps:
- Add a server endpoint or use Formspree for the contact form.
- Add analytics (e.g., Google Analytics or Plausible).
- Add dark/light theme toggle with `prefers-color-scheme` support.
- Add image optimization and srcset for hero/profile images.
- Add social proof section (testimonials, logos of organizations).
- Make the CV downloadable as multiple formats (PDF + online resume page).

Build Tailwind CSS locally (recommended for production)
1. Ensure Node.js is installed.
2. Install dev dependencies:

```bash
npm install
```

3. Build the CSS once:

```bash
npm run build:css
```

Or watch during development:

```bash
npm run watch:css
```

Why: `https://cdn.tailwindcss.com` is intended for quick demos only. Building locally avoids runtime warnings and gives better control over generated CSS.

Chrome extension runtime.lastError note
- The console warning `Could not establish connection. Receiving end does not exist.` is usually caused by a browser extension trying to message the page and can be ignored for the site itself. If you see it locally, try disabling extensions to confirm.
