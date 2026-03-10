# Launch This at Your School

A builder directory for any university. Fork it, configure it, deploy it — takes about 30 minutes.

## What You Get

- A public directory of students who are building things
- A join form with photo upload/camera support
- An interactive network graph visualization
- A printable poster with QR code for recruiting members
- Manual approval workflow via Google Sheets

## Quick Start

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/du-network-app.git
cd du-network-app
npm install
```

### 2. Brand It (1 file)

Open **`src/config/school.ts`** and update everything:

```ts
export const school = {
  name: "Stanford University",
  shortName: "Stanford",
  domain: "stanford.builders",
  siteUrl: "https://stanford-builders.vercel.app",
  colors: {
    primary: "#8C1515",   // your school's primary color
    secondary: "#B83A4B",  // your school's secondary color
  },
  // ... update all the copy
};
```

Then update the two CSS color variables in **`src/app/globals.css`** to match:

```css
--color-gold: #B83A4B;       /* school.colors.secondary */
--color-crimson: #8C1515;    /* school.colors.primary */
```

> **Tip:** You can also rename the CSS variables (e.g., `--color-cardinal` instead of `--color-crimson`) — just find-and-replace the Tailwind class names (`text-crimson` → `text-cardinal`) across the components.

### 3. Set Up Google Sheets (Database)

This app uses a Google Sheet as its database — no server needed.

#### a) Create a Google Cloud Project
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (e.g., "my-school-network")
3. Enable the **Google Sheets API**

#### b) Create a Service Account
1. Go to **IAM & Admin → Service Accounts**
2. Click **Create Service Account**
3. Name it anything (e.g., "sheets-bot")
4. Click **Done** (no roles needed)
5. Click into the service account → **Keys** tab → **Add Key → Create new key → JSON**
6. Download the JSON file — you'll need `client_email` and `private_key` from it

#### c) Create Your Google Sheet
1. Create a new Google Sheet
2. Add these headers in Row 1:

| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| name | major | gradYear | website | building | photoUrl | linkedin | github | twitter | approval | timestamp |

3. **Share the sheet** with the `client_email` from your service account JSON (give it Editor access)
4. Copy the **Sheet ID** from the URL: `https://docs.google.com/spreadsheets/d/THIS_PART/edit`

#### d) Set Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your values:

```
GOOGLE_SHEET_ID=your-sheet-id
GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n"
```

> **Important:** The `GOOGLE_PRIVATE_KEY` must include the full key with `\n` newlines, wrapped in quotes.

### 4. Run Locally

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000). Submit a test profile, then go to your Google Sheet and set column J (`approval`) to `TRUE` for that row. Refresh — your profile should appear.

### 5. Deploy

#### Vercel (Recommended)

1. Push your fork to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo
3. Add your 3 environment variables in the Vercel dashboard
4. Deploy

Update `siteUrl` in `src/config/school.ts` to your Vercel URL (or custom domain).

## How It Works

- **Profiles** are stored in Google Sheets (one row per person)
- **Approval** is manual — set column J to `TRUE` to show a profile in the directory
- **Photos** are processed client-side (cropped to square, resized to 200px, JPEG compressed) and stored as data URLs in the sheet
- **The directory** auto-refreshes every 60 seconds (ISR)
- **The poster** (`/poster`) generates a printable 8.5×11" flyer with a QR code linking to `/join`

## File Structure

```
src/
├── config/
│   └── school.ts          ← 🏫 EDIT THIS — all branding lives here
├── app/
│   ├── layout.tsx          ← metadata (reads from config)
│   ├── page.tsx            ← homepage with directory
│   ├── join/page.tsx       ← join form
│   ├── poster/page.tsx     ← printable recruitment poster
│   ├── globals.css         ← 🎨 update 2 color variables here
│   └── api/submit/route.ts ← form submission endpoint
├── components/
│   ├── Hero.tsx            ← hero section with typing animation
│   ├── Directory.tsx       ← searchable profile grid
│   ├── ProfileCard.tsx     ← individual profile card
│   ├── NetworkGraph.tsx    ← force-directed graph (desktop)
│   └── MobileGraph.tsx     ← force-directed graph (mobile)
├── lib/
│   ├── sheets.ts           ← Google Sheets read/write
│   └── graph.ts            ← physics simulation for graph
└── types/
    └── index.ts            ← Profile type definition
```

## Customization Ideas

- **Add fields** — edit the `Profile` type in `src/types/index.ts`, update the form in `join/page.tsx`, and add the column to your Google Sheet
- **Auto-approval** — remove the approval check in `src/lib/sheets.ts` if you don't need manual review
- **Custom domain** — point a domain at your Vercel deployment and update `school.siteUrl`
- **Rename color variables** — find-and-replace `text-crimson` / `text-gold` with your school's color names

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- [Tailwind CSS](https://tailwindcss.com) 4
- [Framer Motion](https://www.framer.com/motion/) — animations
- [Google Sheets API](https://developers.google.com/sheets/api) — data storage
- [Vercel](https://vercel.com) — hosting (or any Node.js host)
