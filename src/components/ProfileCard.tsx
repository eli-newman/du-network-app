"use client";

import { Profile } from "@/types";
import { Globe, Github, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function Avatar({ name, photoUrl }: { name: string; photoUrl: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (photoUrl) {
    const isDataUrl = photoUrl.startsWith("data:");
    return (
      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-sm ring-1 ring-white/10">
        {isDataUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          <Image
            src={photoUrl}
            alt={name}
            fill
            className="object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-white/[0.04] ring-1 ring-white/8 text-white/40 text-xs font-medium">
      {initials}
    </div>
  );
}

const iconLink = "flex h-7 w-7 items-center justify-center text-white/25 hover:text-white/60 transition-colors";

export function ProfileCard({ profile }: { profile: Profile }) {
  const { name, major, gradYear, website, building, photoUrl, linkedin, github, twitter } = profile;

  return (
    <div className="flex flex-col gap-3.5 border border-white/[0.06] bg-white/[0.015] p-4 rounded-sm hover:border-white/[0.12] hover:bg-white/[0.03] transition-all duration-150">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <Avatar name={name} photoUrl={photoUrl} />
        <div className="min-w-0">
          <p className="text-sm text-white/85 font-medium truncate leading-tight">{name}</p>
          <p className="text-xs text-white/30 truncate mt-0.5">{major}{gradYear ? ` · ${gradYear}` : ""}</p>
        </div>
      </div>

      {/* Building */}
      {building && (
        <p className="text-xs text-white/45 leading-relaxed line-clamp-3 border-l border-white/[0.06] pl-3">
          {building}
        </p>
      )}

      {/* Links */}
      <div className="flex items-center gap-0.5 pt-0.5">
        {website && (
          <Link href={website} target="_blank" rel="noopener noreferrer" className={iconLink} title="Website">
            <Globe size={13} />
          </Link>
        )}
        {github && (
          <Link href={`https://github.com/${github.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className={iconLink} title="GitHub">
            <Github size={13} />
          </Link>
        )}
        {linkedin && (
          <Link href={linkedin.startsWith("http") ? linkedin : `https://linkedin.com/in/${linkedin}`} target="_blank" rel="noopener noreferrer" className={iconLink} title="LinkedIn">
            <Linkedin size={13} />
          </Link>
        )}
        {twitter && (
          <Link href={`https://twitter.com/${twitter.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className={iconLink} title="Twitter / X">
            <Twitter size={13} />
          </Link>
        )}
        {website && (
          <span className="ml-auto text-[11px] text-white/20 truncate max-w-[120px] sm:max-w-[100px]">
            {website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </span>
        )}
      </div>
    </div>
  );
}
