"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, Camera, Link2, X } from "lucide-react";

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

/** Center-crop and resize an image/video source to a square JPEG data URL */
function resizeToDataUrl(
  source: HTMLImageElement | HTMLVideoElement,
  maxSize = 200,
  quality = 0.7
): string {
  const canvas = document.createElement("canvas");
  canvas.width = maxSize;
  canvas.height = maxSize;
  const ctx = canvas.getContext("2d")!;

  const w =
    source instanceof HTMLVideoElement ? source.videoWidth : source.width;
  const h =
    source instanceof HTMLVideoElement ? source.videoHeight : source.height;
  const min = Math.min(w, h);
  const sx = (w - min) / 2;
  const sy = (h - min) / 2;

  ctx.drawImage(source, sx, sy, min, min, 0, 0, maxSize, maxSize);
  return canvas.toDataURL("image/jpeg", quality);
}

export default function JoinPage() {
  const [form, setForm] = useState<FormData>(empty);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  // Photo picker state
  const [photoMode, setPhotoMode] = useState<"none" | "camera" | "url">(
    "none"
  );
  const [cameraError, setCameraError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function set(field: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function setPhoto(url: string) {
    setForm((f) => ({ ...f, photoUrl: url }));
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        setPhoto(resizeToDataUrl(img));
        setPhotoMode("none");
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  async function startCamera() {
    setCameraError("");
    setPhotoMode("camera");
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 400 },
          height: { ideal: 400 },
        },
      });
      streamRef.current = s;
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.play();
      }
    } catch {
      setCameraError("camera not available — try uploading instead");
      setPhotoMode("none");
    }
  }

  function snapPhoto() {
    if (!videoRef.current) return;
    setPhoto(resizeToDataUrl(videoRef.current));
    stopCamera();
    setPhotoMode("none");
  }

  function clearPhoto() {
    setPhoto("");
    stopCamera();
    setPhotoMode("none");
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
          <p className="text-xs text-white/25">{"// success"}</p>
          <p className="text-lg text-white/85 font-medium">
            you&apos;re on the list.
          </p>
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
        <p className="text-xs text-white/20 mb-2">{"// join the network"}</p>
        <h1 className="text-xl font-medium text-white/85 mb-1">
          add your profile
        </h1>
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
              <input
                type="text"
                required
                value={form.name}
                onChange={set("name")}
                placeholder="jane smith"
                className="input"
              />
            </Field>

            <Field label="major / program">
              <input
                type="text"
                required
                value={form.major}
                onChange={set("major")}
                placeholder="computer science, b.s."
                className="input"
              />
            </Field>

            <Field
              label="class year"
              hint="e.g. 2027, or grad student / ph.d. candidate"
            >
              <input
                type="text"
                required
                value={form.gradYear}
                onChange={set("gradYear")}
                placeholder="2027"
                className="input"
              />
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

          {/* Photo */}
          <div className="space-y-4">
            <p className="text-[11px] text-white/20 uppercase tracking-widest border-b border-white/[0.06] pb-2">
              your photo — optional
            </p>

            {form.photoUrl ? (
              <div className="flex items-center gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm ring-1 ring-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.photoUrl}
                    alt="Your photo"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-white/40">photo added</p>
                  <button
                    type="button"
                    onClick={clearPhoto}
                    className="text-[11px] text-gold/60 hover:text-gold transition-colors"
                  >
                    change photo
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Option buttons — hidden while camera is open */}
                {photoMode !== "camera" && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-sm px-3 py-2 transition-all"
                    >
                      <Upload size={12} />
                      upload photo
                    </button>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-sm px-3 py-2 transition-all"
                    >
                      <Camera size={12} />
                      take selfie
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPhotoMode(photoMode === "url" ? "none" : "url")
                      }
                      className={`flex items-center gap-1.5 text-xs bg-white/[0.04] hover:bg-white/[0.08] border rounded-sm px-3 py-2 transition-all ${
                        photoMode === "url"
                          ? "text-gold/70 border-gold/20"
                          : "text-white/50 hover:text-white/80 border-white/[0.08]"
                      }`}
                    >
                      <Link2 size={12} />
                      paste url
                    </button>
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="hidden"
                />

                {/* Camera view */}
                {photoMode === "camera" && (
                  <div className="space-y-3">
                    <div className="relative aspect-square max-w-[200px] overflow-hidden rounded-sm ring-1 ring-white/10 bg-black">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="h-full w-full object-cover"
                        style={{ transform: "scaleX(-1)" }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={snapPhoto}
                        className="flex items-center gap-1.5 text-xs text-gold hover:text-gold/70 bg-gold/[0.08] border border-gold/20 rounded-sm px-3 py-2 transition-all"
                      >
                        <Camera size={12} />
                        snap
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          stopCamera();
                          setPhotoMode("none");
                        }}
                        className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/60 border border-white/[0.06] rounded-sm px-3 py-2 transition-all"
                      >
                        <X size={12} />
                        cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Camera error */}
                {cameraError && (
                  <p className="text-[11px] text-red-400/70">{cameraError}</p>
                )}

                {/* URL input */}
                {photoMode === "url" && (
                  <div className="space-y-1.5">
                    <input
                      type="url"
                      placeholder="https://..."
                      className="input"
                      onBlur={(e) => {
                        const val = e.target.value.trim();
                        if (val) {
                          setPhoto(val);
                          setPhotoMode("none");
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const val = (
                            e.target as HTMLInputElement
                          ).value.trim();
                          if (val) {
                            setPhoto(val);
                            setPhotoMode("none");
                          }
                        }
                      }}
                    />
                    <p className="text-[11px] text-white/20">
                      paste a direct image url and press enter
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Optional Links */}
          <div className="space-y-5">
            <p className="text-[11px] text-white/20 uppercase tracking-widest border-b border-white/[0.06] pb-2">
              links — optional
            </p>

            <Field label="personal website">
              <input
                type="url"
                value={form.website}
                onChange={set("website")}
                placeholder="https://yoursite.com"
                className="input"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="github">
                <input
                  type="text"
                  value={form.github}
                  onChange={set("github")}
                  placeholder="username"
                  className="input"
                />
              </Field>
              <Field label="linkedin">
                <input
                  type="text"
                  value={form.linkedin}
                  onChange={set("linkedin")}
                  placeholder="in/handle"
                  className="input"
                />
              </Field>
              <Field label="twitter">
                <input
                  type="text"
                  value={form.twitter}
                  onChange={set("twitter")}
                  placeholder="@handle"
                  className="input"
                />
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
