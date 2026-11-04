---

> **Amendment (navigation, loading and people heroes, Oct 2026).** The navbar carries five links. **About** is a shadcn NavigationMenu dropdown (dark panel `#0c0918`, icon tile + title + one-line description) holding Our story and Team, with a footer row; on mobile it becomes a labelled group. Underlines use a named `group/link`. **Loading:** the site plays a once-per-session "blueprint to launch" splash (`SiteSplash`: wireframe draws in, fills, a green growth line rises, curtain lifts; ≈1.6s, click/key skips, never under reduced motion). The admin shows a "workspace boot" (`AdminSplash`) while the session is verified: six module icons light up around the logo on a progress ring, and the status line reports real state. **About and Team heroes never use headshots:** About shows a `tts/principles.md` panel cycling the studio's values; Team shows an example project thread (role-coloured initials: design violet, build sky, lead emerald), with the full text exposed to screen readers.

> **Amendment (code syntax palette, Oct 2026).** The hero Build panel renders illustrative code with a fixed syntax palette, used nowhere else: keyword `#c4b5fd` (violet-300), punctuation `rgb(255 255 255 / 0.75)`, function `#7dd3fc` (sky-300), tag `#f0abfc` (fuchsia-300), attribute `#fcd34d` (amber-300), string `#86efac` (green-300). These hues are allowed only inside code mock-ups (`.c-*` classes in `src/index.css`); the one-signal violet rule still governs all UI.

> **Amendment (Shadcn Space pages, Oct 2026).** Public pages are composed from Shadcn Space blocks themed by the shadcn variables: Home (hero custom; bento-grid-03 services, portfolio-01 work, feature-28 "Why TTS" with a lazily loaded GradientWaves WebGL card tinted violet, cta-02 marquee CTA, newsletter-01), About (about-us-01, feature-02, timeline-01, team-01), Services (services-02 explorer), Team (team-01, feature-02), Projects (portfolio-01), Blog (blog-01), Contact (faq-01), admin login (login-01), admin empty states (empty-state-02). Section intros use the block grammar: outline badge, heading, lede (`src/components/sections/SectionIntro.jsx`). Lazy routes go through `lazyRoute()` with a route error boundary.

> **Amendment (copy, Oct 2026).** No delivery day counts anywhere. The speed promise is "Launch sooner, without cutting corners." Build-log and process labels read `step 01` to `step 07`, never `day`.

> **Amendment (hero + admin, Oct 2026).** The homepage hero is now a **dark night surface** (`.dark` scope, `#06040d`) with a violet aurora, a planet-horizon arc, a glowing "What are we building?" brief prompt, and light beams feeding three illustrative panels (Design / Build / Grow). The light blueprint-grid hero described below is retired; the blueprint grid is no longer used anywhere. The admin console is built on **shadcn/ui + Shadcn Space** (`dashboard-shell-01`, Radix style): `src/components/ui/*` are shadcn primitives themed through the `:root` / `.dark` CSS variables in `src/index.css` (primary = TTS violet). The site's grey text token is `--color-dim` / `text-dim` (renamed from `muted`, which shadcn reserves for a surface tint). New blocks install with `npx shadcn@latest add @shadcn-space/<name>` (registry in `components.json`).

name: The Tech Space (TTS)
description: A Ghanaian design, development and marketing studio whose site is the proof it can build. Violet, engineered.
colors:
  brand: "#6d28d9"
  brand-bright: "#7c3aed"
  brand-soft: "#efeafe"
  canvas: "#f6f6f9"
  panel: "#ffffff"
  line: "#e3e3ea"
  line-strong: "#cfcfda"
  ink: "#0b0b14"
  muted: "#5a5a6e"
  night: "#120d24"
  night-line: "#2a2342"
  night-accent: "#c4b5fd"
  live: "#15803d"
typography:
  display:
    fontFamily: "Syne, Outfit, ui-sans-serif, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 4.4rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Syne, Outfit, ui-sans-serif, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Syne, Outfit, ui-sans-serif, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  lede:
    fontFamily: "Outfit, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "12px"
    fontWeight: 400
    letterSpacing: "-0.025em"
  status:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "11px"
    fontWeight: 500
rounded:
  md: "6px"
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  3xl: "24px"
  full: "9999px"
spacing:
  gutter: "16px"
  gutter-sm: "24px"
  tile-gap: "16px"
  panel-pad: "24px"
  panel-pad-lg: "28px"
  section-y: "96px"
  section-y-md: "128px"
  header-top: "144px"
  header-top-md: "176px"
  container: "1152px"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.panel}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.brand-bright}"
  button-secondary:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-light:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.night}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-ghost-on-dark:
    textColor: "{colors.panel}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-operate:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.panel}"
    rounded: "{rounded.lg}"
    padding: "8px 14px"
  panel:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.xl}"
    padding: "{spacing.panel-pad}"
  terminal-panel:
    backgroundColor: "{colors.night}"
    textColor: "{colors.panel}"
    rounded: "{rounded.2xl}"
  status-done:
    backgroundColor: "{colors.brand-soft}"
    textColor: "{colors.brand}"
    typography: "{typography.status}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  status-next:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.muted}"
    typography: "{typography.status}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  status-live:
    textColor: "{colors.live}"
    typography: "{typography.status}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  input:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "10px 14px"
  nav-pill:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.muted}"
    rounded: "{rounded.full}"
    padding: "8px 8px 8px 16px"
  admin-nav-item-active:
    backgroundColor: "{colors.brand-soft}"
    textColor: "{colors.brand}"
    rounded: "{rounded.lg}"
    padding: "8px 10px"
---

# Design System: The Tech Space (TTS)

## Overview

**Creative North Star: "Violet, engineered"**

The site is a working surface, not a brochure. A cool off-white canvas carries white panels drawn with 1px hairline rules and engineering-drawing registration ticks at their corners, as if each panel were a part on a drawing sheet. One violet does all the signalling: action, focus and selected state. Deep violet-night panels are where the system goes dark, reserved for the terminal build log and the closing call to action. The original TTS violet and Syne/Outfit pairing were kept by the owner's instruction ("maintain the original theme, techy and well built"); what changed is that the theme now reads as built rather than decorated.

Density is moderate and calm: generous section rhythm (96 to 128px), a single 1152px container, and panels that hold real artifacts (an illustrative client site, a browser frame, a terminal log, a search result) instead of icons in circles. Proof comes from showing work being done (named team cursors assembling a site, a seven-day log printing line by line) and from real people with real faces. It explicitly refuses the gradient-glow agency brochure: no glow blobs, no gradient text, no glassmorphism cards, no stock "global agency" imagery.

There is one authored moment, the hero's live build, and the rest of the site is quiet around it. The admin console is the same world in Operate mode: same tokens, no display face, no ticks, tighter radii, denser tables.

**Key Characteristics:**
- Cool off-white canvas, white panels, 1px hairline rules, corner registration ticks.
- One violet signal colour; green is reserved for "live".
- Violet-night panels for the terminal and the final CTA only.
- Syne display for public h1/h2 and tile titles, Outfit for everything else, JetBrains Mono for data only.
- One authored motion moment (the hero build); everything else is short state transitions.
- Placeholders are labelled in the UI; no invented metrics.

## Colors

A cool, near-neutral grey-violet ground with a single saturated violet voice and a violet-black night for the dark moments.

### Primary
- **TTS Violet** (`brand`): The single signal colour. Primary buttons, the highlighted word in the hero headline ("grow"), active nav underline, text links, focus outline, unread badges, the "done" status dot, the 404 numeral. Also the browser theme-color.
- **Bright Violet** (`brand-bright`): Hover state of anything violet (buttons, text links). Never used at rest.
- **Violet Wash** (`brand-soft`): Tinted background for selected/confirmed states: "done" status chips, the admin active nav item, the contact form's sent confirmation, icon discs in the contact channel list, icon-button hover.

### Neutral
- **Drafting Canvas** (`canvas`): Page background on every public and admin surface; also the inset fill inside panels (URL bars, search-result art, table row hover).
- **Panel White** (`panel`): Every raised surface: panels, bento tiles, forms, the navbar pill, the footer, the admin sidebar and cards.
- **Hairline** (`line`): Default 1px border on panels, section dividers, table rows, list dividers.
- **Strong Hairline** (`line-strong`): Input borders, secondary-button ring, the browser frame, registration ticks, browser-chrome dots, "next" status ring.
- **Ink** (`ink`): Headings and body text; the skip link and avatar fills; the visitor's "You" tag.
- **Graphite Muted** (`muted`): Ledes, secondary copy, mono metadata, inactive nav, icons at rest.

### Night (dark surfaces)
- **Violet Night** (`night`): Background of the build-log section and the final CTA panel, and the admin login identity panel. The terminal face itself sits a step deeper (`#0b0817`, a one-off inside the terminal panel only).
- **Night Rule** (`night-line`): Borders and dividers on night surfaces.
- **Night Violet** (`night-accent`, Tailwind violet-300): The violet as it appears on night: highlighted heading phrase, terminal day labels and check marks, the blinking caret.

### Semantic
- **Live Green** (`live`): Only for "live / published / launched" state: the live status chip, the launch row of the terminal (as green-400 on night), "all pages live" in the admin.
- Admin also uses Tailwind amber-50/amber-800 for "draft" and the "Sample data" notice, and red-50/red-200/red-700 for form error alerts. These are utility semantics, not brand colours.

### Named Rules
**The One Signal Rule.** Violet is the only accent. It marks action, focus and selection; if something violet is not clickable, focused, selected or the single headline highlight, it is wrong.

**The Green Means Live Rule.** Green appears only when something is actually live or published. It is never decoration and never a generic "success" tint for marketing copy.

**The Night Is Rare Rule.** Violet-night is used for at most the build log and the closing CTA on a page. Everything else sits on canvas and panel.

The hero's four team-cursor colours (violet, sky `#0369a1`, amber `#b45309`, pink `#be185d`) belong to the live-build illustration only and are not system colours.

## Typography

**Display Font:** Syne (with Outfit, ui-sans-serif)
**Body Font:** Outfit (with ui-sans-serif, system-ui)
**Label/Mono Font:** JetBrains Mono (with ui-monospace, SFMono-Regular)

**Character:** Syne's wide, slightly mechanical bold gives headlines an engineered edge; Outfit keeps body copy round, plain and readable on phones. Mono is the instrument readout: it appears only where the content is data.

Syne is applied automatically to every h1 and h2 inside the public site shell (`.site`), with -0.02em tracking and balanced wrapping. Tile and card titles opt in to Syne explicitly. The admin console sits outside `.site`, so its headings are Outfit.

### Hierarchy
- **Display** (Syne 700, 2.5rem mobile to 3.75rem at sm to 4.4rem at lg, line-height 1.02): The hero h1 and inner page-header h1s. One per page.
- **Headline** (Syne 700, 2rem to 3rem at sm, line-height 1.05): Section h2s via the section heading; the final CTA goes up to 2.2rem/3.75rem.
- **Title** (Syne 700, 1.25rem; 1.5 to 1.875rem for the large bento tile; 1.875rem for article panels): Bento tiles, Labs and Talent panels, the contact email link.
- **Body** (Outfit 400, 1rem, normal leading): Running copy, card text, form labels (500, 0.875rem).
- **Lede** (Outfit 400, 1.125rem, 1.625 leading, muted, max 36 to 42rem): The paragraph under every display or headline heading. Hero lede steps to 1.25rem at sm.
- **Label** (JetBrains Mono 400, 12px, tight tracking): URLs, day numbers, file paths, timestamps, years, categories in lowercase, terminal output.
- **Status** (JetBrains Mono 500, 11px): Text inside status chips and badges.

Weights in use: Outfit 400/500/600/700, Syne 700/800 (800 only for the 404 numeral and brand art), Mono 400/500/600.

### Named Rules
**The Data-Only Mono Rule.** JetBrains Mono is for data: days, statuses, timestamps, URLs, paths, counts. It is never a kicker, eyebrow or label above a heading, and never set in tracked uppercase.

**The No Eyebrow Rule.** Section headings are a display title plus an optional lede, nothing above them. The heading says the thing.

## Layout

A single centred container (max 1152px, 16px side padding, 24px from sm) holds every public section. Sections stack vertically on full-bleed bands of canvas, panel or night, separated by a 1px top rule when two light bands meet.

- **Section rhythm:** 96px vertical padding, 128px from md (Labs and Talent uses 112px at md). Content sections never squeeze below 80px (Contact).
- **Header clearance:** Hero and page headers open with 144px top padding (176px at md) to clear the floating navbar pill.
- **Heading to content:** 56px between a section heading and its grid (`mt-14`).
- **Grids:** 16px gaps for tiles and team cards. Services bento is 1 / 2 / 3 columns with the website tile spanning 2x2 and SEO spanning the full row at lg. Team strip is 2 / 3 / 5 columns. Two-column splits are asymmetric (0.9fr/1.1fr for the build log, 1.3fr/1fr for page headers, 1.2fr/1fr for contact).
- **Panel padding:** 24px, 28px from sm; large article panels 28px to 36px.
- **Measure:** ledes capped at roughly 42 to 48rem; headings capped at 48rem with balanced wrap.
- **Breakpoints:** Tailwind defaults (sm 640, md 768, lg 1024, xl 1280). The navbar collapses to a menu button below lg; the admin sidebar becomes a drawer below lg.
- **Illustration scaling:** the illustrative client site is sized in container-query units so the whole picture scales as one at any frame width.

**The Blueprint Belongs To The Build Rule.** The 48px violet hairline grid (`rgb(109 40 217 / 0.07)`, radially masked) appears only on the home hero, where it is the working canvas the live build is assembled on. Every other surface (page headers, CTA, admin, login) uses plain canvas or panel with hairline rules and corner ticks.

## Elevation & Depth

The system is flat and line-drawn. Depth comes from the tonal step between canvas and panel and from 1px rules, not from shadows. Shadows exist only where an object is meant to read as a physical frame lifted off the drawing: the hero browser frame, the miniature site in the website tile, the terminal, and the primary button's slight violet underglow. The navbar pill gains a soft shadow only once the page scrolls.

### Shadow Vocabulary
- **Frame lift** (`box-shadow: 0 30px 80px -30px rgb(18 13 36 / 0.35)`): The hero browser frame only.
- **Miniature lift** (`box-shadow: 0 18px 40px -24px rgb(18 13 36 / 0.4)`): Small framed artifacts inside tiles.
- **Primary press** (`box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.25), 0 8px 24px -10px rgb(109 40 217 / 0.7)`): Primary button at rest.
- **Pill scrolled** (`box-shadow: 0 8px 30px -12px rgb(18 13 36 / 0.18)`): Navbar after 50px of scroll.

### Named Rules
**The Lines Before Shadows Rule.** Panels and cards are separated by a hairline border and the canvas/panel step. A new card gets a border, not a shadow.

**The Registration Tick Rule.** Public panels that hold content or artifacts carry corner ticks: 9px by 1px strokes in strong hairline, drawn 5px outside each corner. Ticks are a public-site device; Operate mode does not use them.

## Shapes

Corners are softly rounded and consistent by role: pills (full) for buttons, chips, the navbar and cursor name tags; 12px for panels, tiles, team photos and admin cards; 16px for framed objects (hero browser frame, terminal, contact form panel, FAQ list); 24px for the single final CTA band; 8px for inputs, admin buttons and admin nav items; 6px for small inner chips (URL bar, flow steps, badges). Borders are always 1px. Imagery is clipped inside its rule (team photos 4:5, slightly desaturated at rest at 35% grayscale, full colour on hover).

## Components

### Buttons
Confident pills that always navigate somewhere real.
- **Shape:** fully rounded pill, 12px by 24px padding, 15px Outfit 600, 8px gap to an optional arrow.
- **Primary:** TTS Violet fill, white text, primary press shadow. Hover to Bright Violet; the trailing arrow nudges 2px right. 200ms colour transition.
- **Secondary:** Panel White with an inset strong-hairline ring, ink text; hover darkens the ring toward ink.
- **Light (on night):** white fill, night text; hover 90% white.
- **Ghost on night:** 5% white fill, 20% white inset ring; hover 10% white.
- **Focus:** the global 2px violet outline at 2px offset.
- **Submit:** full-width primary pill with a spinner and "Sending..." text while busy; 60% opacity when disabled.

### Status Chips
- **Style:** pill, 2px by 8px, 11px mono 500, a 6px dot plus a lowercase label, inset 1px ring.
- **Tones:** `done` (violet wash, violet text and dot), `live` (green-50, live green text and dot), `next` (white, muted text, strong-hairline ring and dot). Used for build state ("day 3", "live"), honest placeholders ("products announced soon", "portfolio update in progress") and pace ("fast launch").

### Cards / Containers
- **Corner Style:** 12px (16px for framed objects).
- **Background:** Panel White on canvas; Drafting Canvas for inset art inside a panel.
- **Shadow Strategy:** none at rest (see Elevation).
- **Border:** 1px hairline; interactive tiles shift the border to 50% violet on hover and the corner arrow turns violet.
- **Internal Padding:** 24px, 28px from sm.
- **Artifacts, not icons:** each service tile carries a small authored artifact (mini site, swatch row, flow chain, search result).

### Inputs / Fields
- **Style:** 8px radius, 1px strong-hairline border, white fill, 10px by 14px padding, 16px text, muted placeholder. Labels sit above in 14px Outfit 500.
- **Focus:** border turns violet plus a 2px violet ring at 25 to 30% opacity.
- **Error:** a red-50 alert block with a red-200 border and red-700 text, role alert, that always offers the email fallback.
- **Success:** a violet-wash confirmation block with a violet check, role status.

### Navigation
- **Public:** a floating white pill (70% white, blurred; 90% with shadow after scroll) centred at max 1024px. Links are 14px Outfit 500 muted, ink on hover and active, with a 2px violet underline that scales in from the left. The single nav CTA is a violet "Book a call" pill. Below lg it becomes a 44px menu button opening a rounded dropdown panel; Escape closes it.
- **Skip link:** an ink pill that drops in from the top on focus.

### Hero Live Build (signature)
A browser frame (16px radius, strong-hairline border, frame lift, corner ticks) whose chrome holds three grey dots, a mono URL in a canvas pill, and a status chip that counts "day 1" to "day 6" then flips to "live". Inside, an illustrative client site ("Ama's Kitchen") is assembled block by block by four named team cursors, each an arrow plus an 11px name tag in that person's colour, gliding on a 900ms `cubic-bezier(0.22, 1, 0.36, 1)`. A mono caption underneath reads "Illustrative build · not a client project". A black "You" tag follows the visitor's real pointer on fine-pointer devices. With reduced motion the frame renders the finished, live site and does not cycle.

### Terminal Build Log (signature)
A night panel (16px radius, night-rule borders, deep shadow) with a mono command line header, an ordered list of build steps (step number in night violet, a check, bold title, muted detail, mono "→ output"), the launch day in green on a faint white wash, and a prompt row with a blinking violet block caret. Lines print one by one when 35% of the panel scrolls into view (250ms then 420ms per line). A single violet border beam travels the edge. With reduced motion all lines show at once, the caret stops, and the beam is not rendered.

### Final CTA Band
A 24px-radius violet-night band on canvas, centred Syne headline with the second phrase in night violet, a light pill plus a ghost email pill, and a border beam. No grid.

### Operate Mode (admin)
Same tokens, restrained. Canvas page, a fixed 248px white sidebar with a hairline right rule (off-canvas drawer below lg), and a sticky 56px topbar in 85% blurred canvas. Headings are Outfit (outside `.site`), at 24px for the page title and 14px semibold for card titles. Buttons are 8px-radius rectangles, not pills. Cards are 12px hairline panels with a ruled header row; KPIs sit in a 1px-gap strip (the hairline shows through the gaps) with tabular figures. Nav items: muted at rest, canvas on hover, violet wash plus violet text when active, with a violet mono unread badge. Table statuses use rectangular mono chips (green published, amber draft, violet review). Mock data is always flagged with an amber "Sample data until the backend is connected" notice. No ticks, no beams, no display face.

## Do's and Don'ts

### Do:
- **Do** put every new surface on Drafting Canvas with Panel White panels, 1px hairline borders and, on the public site, corner registration ticks.
- **Do** use TTS Violet only for action, focus, selection and the single highlighted phrase in a headline; hover with Bright Violet.
- **Do** use JetBrains Mono for data (days, statuses, timestamps, URLs, paths, counts) in lowercase at 11 to 12px.
- **Do** open every section with a Syne headline and an optional muted lede, and nothing above the headline.
- **Do** label placeholder and illustrative content in the UI with a `next` status chip or a mono caption ("Illustrative build · not a client project", "portfolio update in progress").
- **Do** give every motion a reduced-motion state that shows the finished result (completed build, fully printed log) rather than hiding it.
- **Do** keep state transitions at 200 to 300ms with `cubic-bezier(0.22, 1, 0.36, 1)` for entrances.
- **Do** use rounded rectangles (8px) for admin buttons and pills for public buttons.

### Don't:
- **Don't** put a mono or uppercase-tracked kicker or eyebrow above a heading.
- **Don't** use the blueprint grid anywhere except the home hero canvas.
- **Don't** add a second accent hue, gradient text, glow blobs, floating orbs, grain overlays or glassmorphism cards.
- **Don't** use green for anything that is not actually live or published.
- **Don't** show invented metrics, client counts, percentages, trend deltas or testimonials; admin KPIs are plain counts.
- **Don't** put icons in tinted circles on a feature grid; show an authored artifact of the thing instead.
- **Don't** add a second authored motion moment; the hero build is the one, and the terminal print-on-view is its echo.
- **Don't** use more than one or two violet-night bands on a page.

## Legacy surfaces (not yet migrated)

These still run on the pre-redesign styles and are not part of the system: `src/pages/About.jsx` and `src/components/about/*`, `src/pages/Blogs.jsx`, `src/pages/BlogDetail.jsx`, `src/pages/ProjectDetail.jsx`, and the keyframes and utilities below the reduced-motion block in `src/index.css` (marquee, gradient shift, glow pulse, orbs, blob drift, shimmer, glass and glass-card, gradient borders, hex grid, cross-hatch, grain, dot grids, milestone glow, tech-rise and admin-float). The navbar's slate light-on-dark variant exists only for the legacy project case-study pages. When migrating these, rebuild on the tokens and rules above rather than carrying their devices forward.
