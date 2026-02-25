"use client";

import { NetworkGraph } from "./NetworkGraph";
import { Profile } from "@/types";

export function MobileGraph({ profiles }: { profiles: Profile[] }) {
  return (
    <div className="lg:hidden w-full h-[200px]">
      <NetworkGraph profiles={profiles} visible={true} />
    </div>
  );
}
