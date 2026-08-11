"use server";

import { createClient } from "@/lib/supabase/server";

export async function setPresenceStatus(status: "online" | "away") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase
    .from("profiles")
    .update({ status, last_active_at: new Date().toISOString() })
    .eq("id", user.id);
}
