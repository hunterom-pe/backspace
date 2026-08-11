"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { setPresenceStatus } from "@/lib/presence/actions";

type LiveStatus = "online" | "away";
type PresenceMap = Record<string, LiveStatus>;

const PresenceContext = createContext<{ map: PresenceMap; synced: boolean }>({
  map: {},
  synced: false,
});

export function usePresenceStatus(
  userId: string,
  fallback: "online" | "away" | "offline",
): "online" | "away" | "offline" {
  const { map, synced } = useContext(PresenceContext);
  if (!synced) return fallback;
  return map[userId] ?? "offline";
}

function currentVisibilityStatus(): LiveStatus {
  return document.visibilityState === "visible" ? "online" : "away";
}

export function PresenceProvider({
  viewerId,
  children,
}: {
  viewerId: string;
  children: ReactNode;
}) {
  const [map, setMap] = useState<PresenceMap>({});
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;

    async function setup() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled) return;
      if (session) {
        supabase.realtime.setAuth(session.access_token);
      }

      channel = supabase.channel("presence:global", {
        config: { presence: { key: viewerId } },
      });

      channel
        .on("presence", { event: "sync" }, () => {
          const state = channel!.presenceState<{ status: LiveStatus }>();
          const next: PresenceMap = {};
          for (const key of Object.keys(state)) {
            const entries = state[key];
            if (entries.length > 0) {
              next[key] = entries[entries.length - 1].status;
            }
          }
          setMap(next);
          setSynced(true);
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED" && channel) {
            const initial = currentVisibilityStatus();
            await channel.track({ status: initial });
            setPresenceStatus(initial);
          }
        });
    }

    setup();

    function handleVisibility() {
      const next = currentVisibilityStatus();
      channel?.track({ status: next });
      setPresenceStatus(next);
    }

    function handlePageHide() {
      navigator.sendBeacon("/api/presence/offline", "");
    }

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pagehide", handlePageHide);
      if (channel) supabase.removeChannel(channel);
    };
  }, [viewerId]);

  return (
    <PresenceContext.Provider value={{ map, synced }}>{children}</PresenceContext.Provider>
  );
}
