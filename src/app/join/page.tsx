"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, HelpCircle } from "lucide-react";

interface FormData {
  name: string;
  major: string;
  gradYear: string;
  website: string;
  building: string;
  photoUrl: string;
  linkedin: string;
  github: string;
  twitter: string;
}

const empty: FormData = {
  name: "",
  major: "",
  gradYear: "",
  website: "",
  building: "",
  photoUrl: "",
  linkedin: "",
  github: "",
  twitter: "",
};

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs text-white/35 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-white/20 mt-1">{hint}</p>}
    </div>
  );
}

export default function JoinPage() {
  const [form, setForm] = useState<FormData>(empty);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [photoHelp, setPhotoHelp] = useState(false);

  function set(field: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="space-y-3">
          <p className="text-xs text-white/25">// success</p>
          <p className="text-lg text-white/85 font-medium">you&apos;re on the list.</p>
          <p className="text-sm text-white/35">
            your profile is live on du.network.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-gold/70 transition-colors mt-4"
          >
            <ArrowLeft size={11} />
            back to directory
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 sm:px-6 py-10 sm:py-16">
      <div className="mx-auto max-w-md">
        {/* Nav */}
        <div className="flex items-center justify-between mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-white/25 hover:text-white/55 transition-colors"
          >
            <ArrowLeft size={11} />
            du.network
          </Link>
        </div>

        {/* Header */}
        <p className="text-xs text-white/20 mb-2">// join the network</p>
        <h1 className="text-xl font-medium text-white/85 mb-1">add your profile</h1>
        <p className="text-xs text-white/30 mb-10">
          university of denver builders only.
        </p>

        <form onSubmit={submit} className="space-y-6 sm:space-y-8">
          {/* Required */}
          <div className="space-y-5">
            <p className="text-[11px] text-white/20 uppercase tracking-widest border-b border-white/[0.06] pb-2">
              required
            </p>

            <Field label="full name">
              <input type="text" required value={form.name} onChange={set("name")} placeholder="jane smith" className="input" />
            </Field>

            <Field label="major / program">
              <input type="text" required value={form.major} onChange={set("major")} placeholder="computer science, b.s." className="input" />
            </Field>

            <Field label="class year" hint="e.g. 2027, or grad student / ph.d. candidate">
              <input type="text" required value={form.gradYear} onChange={set("gradYear")} placeholder="2027" className="input" />
            </Field>

            <Field label="what are you building?">
              <textarea
                required
                value={form.building}
                onChange={set("building")}
                placeholder="a short blurb — your project, startup, research, or what you're working on."
                rows={3}
                className="input resize-none"
              />
            </Field>
          </div>

          {/* Optional */}
          <div className="space-y-5">
            <p className="text-[11px] text-white/20 uppercase tracking-widest border-b border-white/[0.06] pb-2">
              links — optional
            </p>

            <Field label="personal website">
              <input type="url" value={form.website} onChange={set("website")} placeholder="https://yoursite.com" className="input" />
            </Field>

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <label className="text-xs text-white/35">photo url</label>
                <button
                  type="button"
                  onClick={() => setPhotoHelp((v) => !v)}
                  className="text-white/20 hover:text-white/50 transition-colors"
                  aria-label="how to get a photo url"
                >
                  <HelpCircle size={12} />
                </button>
              </div>
              <input type="url" value={form.photoUrl} onChange={set("photoUrl")} placeholder="https://..." className="input" />
              {photoHelp && (
                <div className="mt-2 text-[11px] text-white/30 bg-white/[0.02] border border-white/[0.06] rounded-sm px-3 py-2.5 space-y-2">
                  <p className="text-white/40 font-medium">// how to get an image url</p>
                  <div className="space-y-1.5">
                    <p><span className="text-gold/70">linkedin:</span> go to your profile → click your photo → right-click the large image → copy image address</p>
                    <p><span className="text-gold/70">github:</span> go to github.com/username → right-click your avatar → copy image address</p>
                    <p><span className="text-gold/70">any photo:</span> upload to <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="text-gold/60 hover:text-gold transition-colors underline underline-offset-2">imgur.com</a> → right-click → copy image address</p>
                  </div>
                  <p className="text-white/20">the url should end in .jpg, .png, or similar</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="github">
                <input type="text" value={form.github} onChange={set("github")} placeholder="username" className="input" />
              </Field>
              <Field label="linkedin">
                <input type="text" value={form.linkedin} onChange={set("linkedin")} placeholder="in/handle" className="input" />
              </Field>
              <Field label="twitter">
                <input type="text" value={form.twitter} onChange={set("twitter")} placeholder="@handle" className="input" />
              </Field>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400/70 bg-red-400/5 border border-red-400/10 rounded-sm px-3 py-2">
              error: {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="text-sm text-gold hover:text-gold/70 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "submitting..." : "submit →"}
          </button>
        </form>
      </div>
    </main>
  );
}
