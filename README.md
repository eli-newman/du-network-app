# builder.network

An open-source builder directory for universities. Show off what students at your school are working on — startups, research, projects, and open source.

**Live example:** [du-network.vercel.app](https://du-network.vercel.app) (University of Denver)

## Features

- Public directory of student builders with search and filters
- Join form with photo upload, camera capture, and URL paste
- Interactive force-directed network graph visualization
- Printable recruitment poster with auto-generated QR code (`/poster`)
- Google Sheets as the database — no server or DB setup needed
- Manual approval workflow (flip a cell to `TRUE`)
- Mobile-responsive, dark theme, typing animation

## Launch This at Your School

**Takes ~30 minutes.** See **[SETUP.md](SETUP.md)** for the full step-by-step guide.

The short version:

1. **Fork this repo**
2. **Edit one file** — `src/config/school.ts` — with your school name, colors, and copy
3. **Update 2 CSS variables** in `src/app/globals.css` to match your school colors
4. **Create a Google Sheet** with the required columns and a service account
5. **Deploy to Vercel** with your 3 env vars

```bash
npm install
cp .env.example .env.local  # fill in your Google Sheets credentials
npm run dev
```

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router, ISR)
- [Tailwind CSS](https://tailwindcss.com) 4
- [Framer Motion](https://www.framer.com/motion/)
- [Google Sheets API](https://developers.google.com/sheets/api)

## Project Structure

```
src/
├── config/school.ts       ← all branding lives here
├── app/
│   ├── page.tsx            ← homepage + directory
│   ├── join/page.tsx       ← join form
│   ├── poster/page.tsx     ← printable poster
│   └── api/submit/route.ts ← form submission
├── components/             ← Hero, Directory, ProfileCard, NetworkGraph
├── lib/sheets.ts           ← Google Sheets integration
└── types/index.ts          ← Profile type
```

## License

MIT — use it, fork it, make it yours.
