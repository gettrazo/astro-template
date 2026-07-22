# Site Template

Astro starter template with a pre-wired contact form. The form connects to a centralized backend (Trazo) that handles bot verification, email delivery, and submission storage. You don't set up any email service, database, or server-side code.

This guide covers the full path: getting the code into your own private GitHub repo, configuring it, building your site, and deploying to **Cloudflare Pages**. Cloudflare Pages is the supported hosting path. If you want to deploy to Netlify, Vercel, or anything else, the output in `dist/` is plain static files and will work.

## Prerequisites

- [Node.js](https://nodejs.org) 20 or newer
- [Git](https://git-scm.com) and a [GitHub](https://github.com) account
- A [Cloudflare](https://dash.cloudflare.com/sign-up) account (free tier is fine)
- Your Trazo credentials (API key (`sk_live_...`) and a Turnstile site key)
- Optional but recommended: the [GitHub CLI](https://cli.github.com) (`gh`)

## Step 1 — Get the code into your own private repo

Don't fork the template. You want a clean, private copy with its own history.

```bash
# 1. Clone the template, then detach it from the template's history
git clone https://github.com/gettrazo/astro-template my-client-site
cd my-client-site
rm -rf .git

# 2. Start fresh history
git init
git add .
git commit -m "Initial commit from site template"

# 3. Create a private GitHub repo and push (using the GitHub CLI)
gh repo create my-client-site --private --source=. --push
```

**No GitHub CLI?** Create the repo manually instead of step 3: go to [github.com/new](https://github.com/new), name it, set visibility to **Private**, create it *without* a README, then:

```bash
git remote add origin git@github.com:YOUR_USERNAME/my-client-site.git
git branch -M main
git push -u origin main
```

## Step 2 — Configure

Open `src/config.ts` and fill in the values you were given:

```ts
export const API_KEY = "sk_live_your_key_here";
export const TURNSTILE_SITE_KEY = "0x_your_turnstile_key_here";

export const SITE_NAME = "Your Client's Name";
export const SITE_DESCRIPTION = "One-sentence description for SEO.";
```

Then open `astro.config.mjs` and set the production URL:

```js
export default defineConfig({
  site: "https://yourclientdomain.com",
});
```

Commit the changes.

## Step 3 — Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:4321` and go to `/contact`. The form works from `localhost` out of the box — the backend allows `localhost` and `127.0.0.1` origins during development, and Turnstile supports localhost by default. Submit a test message and confirm you see the success state.

## Step 4 — Build your site

Replace the placeholder home page and styles with the client's actual site. See [Project Structure](#project-structure) and [Using the Contact Form](#using-the-contact-form) below for the rules.

The fastest way is with an AI agent. This repo ships an `AGENTS.md` that teaches any coding agent (Claude Code, Codex, Cursor, Antigravity, OpenCode, …) the template's constraints. See [Building with an AI agent](#building-with-an-ai-agent).

## Step 5 — Deploy to Cloudflare Pages

Use the Git integration so every push to `main` deploys automatically.

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com).
2. Go to **Workers & Pages** → **Create** → **Pages** tab → **Import an existing Git repository**.
3. Connect your GitHub account and authorize access to your private repo, then select it.
4. Configure the build:
   - **Framework preset:** `Astro`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Click **Save and Deploy**.

First build takes a minute or two. You'll get a `https://<project>.pages.dev` URL when it finishes.

> **Note:** the contact form will *not* work from the `.pages.dev` preview URL — the backend rejects origins that aren't registered for your site (`403 Origin not allowed`). That's expected. It will work once your real domain is connected below.

If the build fails with a Node version error, add an environment variable in the Pages project settings: **Settings** → **Variables and Secrets** → `NODE_VERSION` = `20` (or newer), then retry the deployment.

### Connect the custom domain

1. In your Pages project: **Custom domains** → **Set up a custom domain**.
2. Enter the client's domain (e.g. `yourclientdomain.com`).
   - **If the domain's DNS is on Cloudflare** (recommended): Cloudflare adds the DNS record for you — just confirm.
   - **If DNS is elsewhere:** add the CNAME record Cloudflare shows you at your DNS provider, or better, move the domain's nameservers to Cloudflare first.
3. Repeat for the `www.` variant if the client wants it.
4. Wait for the certificate to become active (usually minutes).

HTTPS is automatic; no certificate setup needed.

### Verify the form in production

The backend only accepts submissions from the exact domain (and its `www.` variant) registered for your site. If the production domain differs from what was registered when your API key was issued, contact Trazo to update the allowed origin — a `403 Origin not allowed` response is the symptom.

Once the domain is live:

- [ ] Submit the form with valid data → success message appears
- [ ] Submit with a required field empty → inline error, form data preserved
- [ ] Double-click submit rapidly → only one submission goes through (button disables)
- [ ] Confirm the notification email arrives at the client's inbox

## Step 6 — Ongoing deploys

Push to `main` → Cloudflare Pages builds and deploys automatically. Pull requests get their own preview URLs (where, again, the contact form's origin check will block submissions — that's normal).

---

## Project Structure

```
src/
├── config.ts              ← API keys and site metadata (the only file you must edit)
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

1. Collects name, email, and message
2. Validates required fields client-side
3. Verifies the user with a Cloudflare Turnstile challenge
4. POSTs the data to the backend API as JSON
5. Shows a success message or displays errors inline, resetting Turnstile either way

### What you can customize

- **All styling.** The form uses plain class names (`.contact-form`, `.form-group`, `.form-submit`, etc.). Override them in your CSS however you want.
- **The success message.** Edit the text inside `#cf-success` in `ContactForm.astro`.
- **Labels and placeholder text.** Change the `<label>` text and add `placeholder` attributes freely.
- **The layout around the form.** Wrap it in any container, grid, or section you need.

### What you should NOT change

- **The form field `name` attributes** (`name`, `email`, `message`) — the backend expects these exact keys.
- **The `data-*` attributes on the `<form>` tag** — the JS reads the API config from these.
- **The Turnstile `<div>`** — it must stay inside the form.
- **The submission JS logic** — it handles the API contract, error states, and Turnstile resets.

Extra fields (phone, company, subject, …) are supported by the backend via `custom_fields`, but wiring them up means extending the submission JS — ask before doing this, or have the AI agent do it following the skill's instructions.

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

---

## Building with an AI agent

The template's agent instructions live in **`AGENTS.md`** at the repo root — the vendor-neutral standard file that most coding agents read automatically. It teaches the agent this template's structure and hard rules: what it may restyle, and what it must never touch (the contact form's API wiring). One file, every tool.

Whichever agent you use, describe the site you want:

> Build the website for Jane's Bakery. It needs a home page with a hero and photo gallery, an about page, a menu page, and the contact page. Warm colors, rounded corners, friendly tone. Here's the copy for each page: …

The more content you provide up front (business name, page list, actual copy, brand colors, fonts, imagery notes), the better the result. The agent will scaffold the pages, apply the design in `global.css`, update the nav, and verify the build.

### Claude Code

Also ships with a skill at `.claude/skills/build-site/SKILL.md` that points the agent at `AGENTS.md` and triggers automatically on site-building requests.

```bash
cd my-client-site
claude
```

### OpenAI Codex

Codex reads `AGENTS.md` automatically.

```bash
npm install -g @openai/codex
cd my-client-site
codex
```

Works the same in the Codex IDE extension and Codex cloud — just open or point them at the repo.

### Cursor

Open the repo in Cursor and use **Agent** mode in the chat panel. Recent Cursor versions pick up `AGENTS.md` from the project root automatically. If you're on an older version (or want it as a persistent rule), start your first message with: *"Read AGENTS.md and follow it for all work in this repo."*

### Google Antigravity

Open the repo as a workspace in [Antigravity](https://antigravity.google) and give the task to an agent from the Agent Manager. It reads `AGENTS.md` from the workspace root; if the agent doesn't reference it, start your task with: *"Read AGENTS.md and follow it."*

### OpenCode

OpenCode uses `AGENTS.md` natively as its project instructions file.

```bash
curl -fsSL https://opencode.ai/install | bash
cd my-client-site
opencode
```

### Any other agent

Any tool that can read files works: start your session with *"Read AGENTS.md at the repo root and follow it for all work here."*

---

## Checklist Before Handoff

- [ ] `src/config.ts` has the real API key and Turnstile site key
- [ ] `astro.config.mjs` has the production `site` URL
- [ ] Repo is **private** on GitHub
- [ ] Cloudflare Pages connected to the repo, auto-deploys on push to `main`
- [ ] Custom domain connected, HTTPS active
- [ ] Production domain matches the origin registered with Trazo
- [ ] Contact form tested **on the live domain**: success state, validation errors, duplicate-click protection
- [ ] Notification email confirmed arriving
- [ ] All pages have appropriate `<title>` and `<meta description>`
- [ ] Favicon replaced (`public/favicon.svg`)
