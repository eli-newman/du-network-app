import Link from "next/link";
import { getProfiles } from "@/lib/sheets";
import { Directory } from "@/components/Directory";
import { Hero } from "@/components/Hero";
import { Profile } from "@/types";

export const revalidate = 60;

export default async function Home() {
  let profiles: Profile[] = [];
  try {
    profiles = await getProfiles();
  } catch {
    // Sheets not configured yet — show empty state
  }

  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/[0.06]">
        <span className="text-sm text-crimson font-medium tracking-tight">
          du.network
        </span>
        <Link
          href="/join"
          className="text-xs text-white/40 hover:text-white/80 transition-colors"
        >
          join →
        </Link>
      </nav>

      {/* Hero — typing animation */}
      <Hero />

      {/* Directory */}
      <section id="directory" className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
        <div className="border-t border-white/[0.06] pt-10">
          <Directory profiles={profiles} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-4 sm:px-6 py-6">
        <p className="text-xs text-white/20">
          <span className="text-crimson/60">du.network</span> ·{" "}
          <Link href="/join" className="hover:text-white/40 transition-colors">
            add yourself
          </Link>
        </p>
      </footer>
    </main>
  );
}
