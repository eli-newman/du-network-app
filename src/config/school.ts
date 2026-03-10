/**
 * 🏫 SCHOOL CONFIGURATION
 *
 * This is the ONLY file you need to edit to rebrand this app for your school.
 * Change the values below, set up your Google Sheet + env vars, and deploy.
 */

export const school = {
  // ─── Identity ───────────────────────────────────────────
  name: "University of Denver",       // full school name
  shortName: "DU",                     // abbreviation used in copy
  domain: "du.network",                // your domain (shown in nav/footer)
  siteUrl: "https://du-network.vercel.app", // deployed URL (used for QR codes)

  // ─── Colors ─────────────────────────────────────────────
  // Your school's two brand colors. These are used in the poster,
  // QR code, and accent elements throughout the app.
  colors: {
    primary: "#862334",   // DU crimson — main accent color
    secondary: "#b8822e", // DU gold — secondary accent color
  },

  // ─── Hero Copy ──────────────────────────────────────────
  hero: {
    tagline: "// university of denver",
    headline: ["find the builders", "at your school."],
    description:
      "a directory of DU students shipping startups, research, projects, and open source work.",
  },

  // ─── Join Page Copy ─────────────────────────────────────
  join: {
    restriction: "university of denver builders only.",
    successMessage: "your profile is live on du.network.",
  },

  // ─── Poster Copy ────────────────────────────────────────
  poster: {
    subheadline:
      "Join the directory of DU students shipping startups, research, projects, and open-source work.",
    sectionTitle: "What is du.network?",
    bullets: [
      "A public directory of builders at DU",
      "Show off what you're working on",
      "Find collaborators, co-founders, and friends",
      "Connect with the DU builder community",
    ],
    cta: "Show DU what you're building.",
  },

  // ─── Metadata (SEO / OpenGraph) ─────────────────────────
  metadata: {
    title: "du.network — Builders at the University of Denver",
    description:
      "A directory of University of Denver students who are building things — startups, projects, research, and open source.",
    ogTitle: "du.network",
    ogDescription: "Find the builders at the University of Denver.",
  },
} as const;
