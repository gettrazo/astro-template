# Agent Instructions — Client Site Template

This repo is an Astro starter with a pre-wired contact form that submits to the Trazo backend (`https://gettrazo.app/api/v1/submissions`). Trazo handles bot verification, email delivery, and submission storage server-side. The agent's job is to turn the placeholder site into the client's real website **without breaking the contact form's API contract**.

## Before you start

Gather from the user (ask only for what's missing and genuinely needed):

1. Business name and one-line description (goes in `src/config.ts` → `SITE_NAME`, `SITE_DESCRIPTION`)
2. List of pages and the content/copy for each
3. Design direction: colors, fonts, tone, reference sites, imagery
4. Production domain (goes in `astro.config.mjs` → `site`)

If the user provides content, use it verbatim — do not invent facts about the business (hours, addresses, phone numbers, prices). Use clearly-marked placeholders like `[ADDRESS]` when required content is missing, and list them for the user at the end.

## Hard rules — never violate these

- **Never edit the `<script>` block in `src/components/ContactForm.astro`** except when adding custom fields per the procedure below. It implements the backend API contract, error states, and Cap widget resets.
- **Never change the form field `name` attributes** `name`, `email`, `message`, or the `data-endpoint` / `data-api-key` attributes on the `<form>` tag.
- **Never remove or move the `<cap-widget>` element** — it must stay inside the `<form>`, and its `data-cap-api-endpoint` attribute must stay as is.
- **Never change the values of `API_ENDPOINT`, `API_KEY`, `CAP_SITE_KEY`, or `CAP_BASE_URL`** in `src/config.ts` unless the user explicitly provides new credentials.
- **Every page containing `<ContactForm />` must pass `hasContactForm` to the `Base` layout** — this loads the Cap widget script in `<head>`. Without it the form cannot submit.
- **Never build alternative form submission logic** (no mailto, no third-party form services, no serverless functions). Trazo handles delivery.
- **Keep the site fully static.** Do not add SSR adapters or server endpoints.

## What you SHOULD freely customize

- All styling: rewrite `src/styles/global.css` entirely for the client's brand. The form uses plain class names (`.contact-form`, `.form-group`, `.form-submit`, `.form-status`, `.form-success`) — restyle them however the design demands.
- The success message text inside `#cf-success` in `ContactForm.astro`.
- Form `<label>` text and `placeholder` attributes.
- All pages in `src/pages/` — replace `index.astro`, add as many as needed.
- Nav links and footer in `src/layouts/Base.astro` (or replace via the `header` / `footer` slots per page).
- `<head>` additions in `Base.astro`: fonts, Open Graph tags, analytics the user asks for.
- `public/` assets: favicon, images, fonts.

## Workflow

1. **Read first**: `src/config.ts`, `src/layouts/Base.astro`, `src/components/ContactForm.astro`, `src/styles/global.css`, and existing pages, so your changes match the template's idioms.
2. **Config**: set `SITE_NAME`, `SITE_DESCRIPTION` in `src/config.ts` and `site` in `astro.config.mjs`.
3. **Design system**: define CSS custom properties (colors, type scale, spacing) at the top of `global.css`, then build component styles from them.
4. **Pages**: create each page with the `Base` layout, a unique `title`, and a page-specific `description`. Keep the contact form on `/contact` unless the user says otherwise.
5. **Nav**: update `.nav-links` in `Base.astro` to match the final page list.
6. **Verify**: run `npm run build` and fix any errors. If a dev server check is useful, `npm run dev` serves at `http://localhost:4321`.

## Adding custom form fields (phone, company, subject, …)

The backend accepts extra fields via a `custom_fields` object — flat, string values only, no nesting. This is the **only** sanctioned modification to the form JS:

1. Add the input to the form markup with a unique id, e.g.:
   ```html
   <div class="form-group">
     <label for="cf-phone">Phone (optional)</label>
     <input type="tel" id="cf-phone" name="phone" autocomplete="tel" />
   </div>
   ```
2. In the submit handler, read it and attach it *only if non-empty* — omit `custom_fields` entirely when there are no values:
   ```ts
   const phone = (form.querySelector("#cf-phone") as HTMLInputElement)?.value.trim();
   const submission: Record<string, unknown> = { name, email, message };
   const customFields: Record<string, string> = {};
   if (phone) customFields.phone = phone;
   if (Object.keys(customFields).length > 0) submission.custom_fields = customFields;
   ```
3. Do not touch anything else in the handler — the request structure `{ api_key, cap_token, submission }` and the response/error handling must stay exactly as is.

## Definition of done

- `npm run build` succeeds with no errors.
- Every page renders through `Base` with a real `title` and `description`.
- The contact page passes `hasContactForm`, the `<cap-widget>` is inside the form, and the form JS contract is untouched (except sanctioned `custom_fields` additions).
- Nav links match the actual pages; no dead links.
- No invented business facts; any placeholders are reported to the user.
