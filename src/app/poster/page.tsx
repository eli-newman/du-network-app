"use client";

import { useRef } from "react";
import { school } from "@/config/school";

const SITE_URL = school.siteUrl;
const JOIN_URL = `${SITE_URL}/join`;
const QR_API = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(JOIN_URL)}&bgcolor=ffffff&color=${school.colors.primary.replace("#", "")}`;

export default function PosterPage() {
  const posterRef = useRef<HTMLDivElement>(null);

  function handlePrint() {
    window.print();
  }

  return (
    <>
      {/* Print button — hidden when printing */}
      <div className="no-print fixed top-4 right-4 z-50 flex gap-3">
        <button
          onClick={handlePrint}
          className="text-white text-sm font-semibold px-5 py-2.5 rounded-md transition-colors shadow-lg"
          style={{ background: school.colors.primary }}
        >
          Print / Save PDF
        </button>
        <a
          href="/"
          className="bg-gray-200 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-gray-300 transition-colors shadow-lg"
        >
          Back
        </a>
      </div>

      {/* Poster */}
      <div
        ref={posterRef}
        className="poster-page mx-auto bg-white text-black"
        style={{
          width: "8.5in",
          minHeight: "11in",
          padding: "0.6in 0.7in",
          fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        {/* Top accent bar */}
        <div className="flex gap-1.5 mb-8">
          <div className="h-2 flex-1 rounded-full" style={{ background: school.colors.primary }} />
          <div className="h-2 w-24 rounded-full" style={{ background: school.colors.secondary }} />
        </div>

        {/* University tag */}
        <p
          className="text-sm font-bold tracking-[0.25em] uppercase mb-4"
          style={{ color: school.colors.primary }}
        >
          {school.name}
        </p>

        {/* Main headline */}
        <h1
          className="font-black leading-[0.95] mb-2"
          style={{ fontSize: "4.2rem", color: "#1a1a1a" }}
        >
          Are you
          <br />
          building
          <br />
          <span style={{ color: school.colors.primary }}>something?</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl font-medium text-gray-500 mt-4 mb-10 max-w-md leading-snug">
          {school.poster.subheadline}
        </p>

        {/* Two-column: info + QR */}
        <div className="flex items-start gap-8 mb-10">
          {/* Left: what you get */}
          <div className="flex-1">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">
              {school.poster.sectionTitle}
            </p>
            <div className="space-y-3">
              {school.poster.bullets.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="mt-1.5 h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ background: i % 2 === 0 ? school.colors.primary : school.colors.secondary }}
                  />
                  <p className="text-base font-semibold text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: QR code */}
          <div className="shrink-0 flex flex-col items-center">
            <div
              className="p-3 rounded-xl border-2"
              style={{ borderColor: school.colors.primary }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={QR_API}
                alt={`QR code to join ${school.domain}`}
                width={180}
                height={180}
                className="block"
              />
            </div>
            <p
              className="text-xs font-bold mt-3 tracking-wide text-center"
              style={{ color: school.colors.primary }}
            >
              SCAN TO JOIN
            </p>
          </div>
        </div>

        {/* CTA section */}
        <div
          className="rounded-xl px-8 py-6 mb-8"
          style={{ background: school.colors.primary }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-2xl font-extrabold">
                Add your profile today.
              </p>
              <p className="text-white/70 text-sm font-medium mt-1">
                It takes 30 seconds. {school.poster.cta}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-white font-bold text-lg">{school.siteUrl.replace(/^https?:\/\//, "")}</p>
              <p className="text-white/50 text-xs font-medium">/join</p>
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="flex items-center gap-4 mt-auto">
          <div className="flex gap-1.5 flex-1">
            <div className="h-1.5 w-16 rounded-full" style={{ background: school.colors.secondary }} />
            <div className="h-1.5 flex-1 rounded-full" style={{ background: school.colors.primary }} />
          </div>
          <p className="text-xs font-semibold text-gray-400">
            {school.domain}
          </p>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            margin: 0;
            padding: 0;
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .poster-page {
            margin: 0 !important;
            padding: 0.5in 0.6in !important;
            box-shadow: none !important;
            width: 100% !important;
            min-height: 100vh !important;
          }
        }
        @media screen {
          body {
            background: #e5e7eb !important;
          }
          .poster-page {
            margin-top: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 4px 24px rgba(0,0,0,0.15);
          }
        }
      `}</style>
    </>
  );
}
