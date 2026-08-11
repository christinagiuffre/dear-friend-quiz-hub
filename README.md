# Dear Friend Check-Ins

A small, warm quiz hub built with React + Vite + Tailwind CSS. Mobile-first, no sign-up, no data collection.

Live home: `quiz.mach.global`

---

## Run it locally

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

Open the address it prints (usually `http://localhost:5173`).

To check the production build before deploying:

```bash
npm run build
npm run preview
```

---

## Where the content lives

Almost everything you'll want to change is in two files.

**`src/data/site.js`** — links, button labels, the sign-up wording, the disclaimer, the share URL. Change a link here and it updates everywhere.

**`src/data/quizzes.js`** — all quiz content: questions, options, results, share text, the "coming soon" list.

### Adding a second quiz

1. Open `src/data/quizzes.js`.
2. Copy the whole `whyDoIFeelWeird` object, rename it, and give it a new `id` (this becomes the URL, so use lowercase and hyphens).
3. Add it to the `quizzes` array: `export const quizzes = [whyDoIFeelWeird, yourNewQuiz]`.
4. Remove its title from the `comingSoon` list.

That's it — the hub page, intro, questions, scoring and result pages all read from that object. No component changes needed.

A quiz can have any number of questions and any number of result categories. Just make sure:

- every option's `result` matches a key in that quiz's `results` object
- `tiePriority` lists every result id, highest priority first

### Brand assets

Real Sunny & Sheepito artwork from the brand pack lives in `public/brand/`, served as WebP with a PNG fallback. `src/components/Characters.jsx` maps friendly names to files:

| Key | Artwork | Used on |
| --- | --- | --- |
| `spark` | Celebrating | SPARK result |
| `pause` | Blankets and hot chocolate | PAUSE result |
| `connection` | Hugging | CONNECTION result |
| `gentleness` | Sheepito comforting a tearful Sunny | GENTLENESS result |
| `treats` | Sharing cupcakes | Hub quiz card |
| `duo` | Floating together | Quiz intro, social preview |
| `books` | The four book covers | Books CTA on results |

To change which illustration a result uses, edit its `art` key in `src/data/quizzes.js`. To add new artwork, drop the files in `public/brand/` and add an entry to the `ART` object in `Characters.jsx`.

Brand rules applied: Montserrat Bold headings, Open Sans body, purple `#8848d8`, blue `#41a0e4`, grey boxes `#F4F4F4`, no all-caps titles. The header uses the full MACH type logo; the favicon uses the single-M mark drawn as a vector path so it renders without Montserrat installed.

---

## Routes

| URL | Screen |
| --- | --- |
| `/` | Quiz hub home |
| `/quiz/why-do-i-feel-weird` | Intro screen |
| `/quiz/why-do-i-feel-weird/play` | Questions |
| `/quiz/why-do-i-feel-weird/result/pause` | Result |

Result pages have their own URL, so a shared link opens straight to that result.

---

## Social preview image

`public/og-image.png` (1200×630) is what shows when the link is pasted into Instagram, WhatsApp, Facebook, iMessage or Slack. Without it those previews are blank, which badly hurts click-through.

It uses the real Sunny & Sheepito artwork and MACH logo. The **headline type is a substitute font** — it was generated in an environment without Montserrat. Everything else is final. To swap in real Montserrat:

1. Run `npm run dev` and open `http://localhost:5173/tools/og-image.html` (so the images resolve).
2. Wait a second for the font to load.
3. Open DevTools, right-click the `#card` element → **Capture node screenshot**.
4. Save it over `public/og-image.png`.

`public/favicon.svg` and `public/apple-touch-icon.png` are final.

After deploying, paste the URL into the [Facebook sharing debugger](https://developers.facebook.com/tools/debug/) to clear any cached preview.

---

## Push it to GitHub

```bash
git init
git add .
git commit -m "Dear Friend Check-Ins"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/dear-friend-checkins.git
git push -u origin main
```

Create the empty repo on GitHub first (no README, no .gitignore — this project already has one).

---

## Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. **Add New → Project**, then import the repo.
3. Vercel detects Vite automatically. Confirm the settings look like this and leave everything else as-is:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
4. Click **Deploy**.

Every push to `main` redeploys automatically. Pushes to other branches get their own preview URL.

`vercel.json` is already included — it makes sure direct links like `/quiz/why-do-i-feel-weird/result/pause` load correctly instead of 404ing.

---

## Connect quiz.mach.global

In Vercel: open the project → **Settings → Domains** → enter `quiz.mach.global` → **Add**.

Vercel will show you a DNS record to create. It's normally:

| Type | Name | Value |
| --- | --- | --- |
| CNAME | `quiz` | `cname.vercel-dns.com` |

Add that record wherever `mach.global`'s DNS is managed (your registrar or host). Use the exact value Vercel shows you rather than copying the table above, in case it differs.

Then wait. DNS usually propagates in a few minutes but can take up to 24 hours. Vercel's domain page shows a green tick once it's verified, and the HTTPS certificate is issued automatically.

Nothing in the main `mach.global` site is affected — you're only adding a subdomain record.

Once the domain is live, double-check `site.url` in `src/data/site.js` is `https://quiz.mach.global`, since that's what gets shared.

---

## Running it in Cursor — quick checklist

1. **Open the folder** — File → Open Folder → select `dear-friend-checkins`.
2. **Open a terminal** — `` Ctrl+` `` (or `Cmd+`` ` `` on Mac).
3. **Install** — `npm install` (once, takes a minute).
4. **Start** — `npm run dev`.
5. **Open** — Cmd/Ctrl-click the `http://localhost:5173` link in the terminal.
6. **Test on your phone** — run `npm run dev -- --host` instead, then open the “Network” address it prints on a phone on the same wifi. This is the one that matters most, since most traffic will be mobile.
7. **Edit content** — open `src/data/quizzes.js`. Saving reloads the browser instantly.
8. **Before deploying** — run `npm run build` to confirm it compiles cleanly.

If `npm` isn't recognised, install [Node.js](https://nodejs.org) (LTS) and reopen Cursor.

### What to click through when testing

- Home → **Start check-in** → answer all six → land on a result
- **Back** mid-quiz, change an answer, carry on
- Every result: **app**, **books**, **updates** links open mach.global in a new tab
- **Share my result** — on desktop it copies and shows a confirmation; on a phone it opens the native share sheet
- Reload a result URL directly, e.g. `/quiz/why-do-i-feel-weird/result/pause`
- Try a nonsense URL like `/quiz/nope` — should bounce you home, not error

---

## Privacy

Answers live in React state only. Nothing is written to a server, a database, localStorage or cookies. Closing the tab discards everything. There is no analytics script — if you add one later, be careful to keep it away from the answer data.
