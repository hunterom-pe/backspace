import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Called via navigator.sendBeacon on pagehide — best-effort only, since a
// closing tab can't reliably await a normal request. The Realtime presence
// channel (not the DB column) is what other clients treat as authoritative.
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase
      .from("profiles")
      .update({ status: "offline", last_active_at: new Date().toISOString() })
      .eq("id", user.id);
  }

  return NextResponse.json({ ok: true });
}
