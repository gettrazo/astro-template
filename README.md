# Site Template

Astro starter template with a pre-wired contact form. The form connects to a centralized backend that handles bot verification, email delivery, and storage — you don't need to set up any of that.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:4321` and navigate to `/contact` to see the form.

## Setup (One-Time)

Open `src/config.ts` and fill in the three values you were given:

```ts
export const API_ENDPOINT = "https://api.example.com/api/v1/submissions";
export const API_KEY = "sk_live_your_key_here";
export const TURNSTILE_SITE_KEY = "0x_your_turnstile_key_here";
```

Also update `SITE_NAME` and `SITE_DESCRIPTION` while you're there.

That's it. The contact form will work immediately.

## Project Structure

```
src/
├── config.ts              ← Your API keys and site metadata (edit this)
├── layouts/
│   └── Base.astro         ← Base HTML layout with <head>, nav, footer
├── components/
│   └── ContactForm.astro  ← Drop-in contact form (don't edit the JS logic)
├── pages/
│   ├── index.astro        ← Home page (replace with your design)
│   └── contact.astro      ← Contact page (shows how to use ContactForm)
└── styles/
    └── global.css         ← Starter styles (replace with your design)
```

## Using the Contact Form

Import and drop it on any page. The only requirement is setting `hasContactForm` on the layout so the Turnstile script loads:

```astro
---
import Base from "../layouts/Base.astro";
import ContactForm from "../components/ContactForm.astro";
---

<Base title="Contact" hasContactForm>
  <ContactForm />
</Base>
```

### What the form does

1. Collects name, email, phone (optional), and message
2. Validates required fields client-side
3. Verifies the user with a Cloudflare Turnstile challenge
4. POSTs the data to the backend API
5. Shows a success message or displays errors inline

### What you can customize

- **All styling.** The form uses plain class names (`.contact-form`, `.form-group`, `.form-submit`, etc.). Override them in your CSS however you want.
- **The success message.** Edit the text inside `#cf-success` in `ContactForm.astro`.
- **Labels and placeholder text.** Change the `<label>` and add `placeholder` attributes freely.
- **The layout around the form.** Wrap it in any container, grid, or section you need.

### What you should NOT change

- **The form field `name` attributes** (`name`, `email`, `phone`, `message`) — the backend expects these exact keys.
- **The `data-*` attributes on the `<form>` tag** — the JS reads the API config from these.
- **The Turnstile `<div>`** — it must stay inside the form.
- **The submission JS logic** — it handles the API contract, error states, and Turnstile resets.

## Pages

Add new pages by creating `.astro` files in `src/pages/`. Each page should use the `Base` layout:

```astro
---
import Base from "../layouts/Base.astro";
---

<Base title="About">
  <section class="section">
    <div class="container">
      <h1>About Us</h1>
      <p>Page content here.</p>
    </div>
  </section>
</Base>
```

## Nav Links

The navigation is in `src/layouts/Base.astro`. Add or remove links in the `.nav-links` div. If you want a completely custom header, use the `header` slot:

```astro
<Base title="Home">
  <header slot="header">
    <!-- Your custom header here -->
  </header>
  <p>Page content</p>
</Base>
```

Same pattern works for the footer with `slot="footer"`.

## Building for Production

```bash
npm run build
```

Output goes to `dist/`. Deploy the contents of `dist/` to any static hosting (Cloudflare Pages, Netlify, Nginx, etc.).

## Checklist Before Handoff

- [ ] `src/config.ts` has the real API key, endpoint, and Turnstile key
- [ ] `astro.config.mjs` has the production `site` URL
- [ ] Contact form tested: submit with valid data, check success state appears
- [ ] Contact form tested: submit with empty fields, check error messages appear
- [ ] Turnstile widget renders on the contact page
- [ ] All pages have appropriate `<title>` and `<meta description>`
- [ ] Favicon replaced (`public/favicon.svg`)
