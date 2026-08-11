import type { SupabaseClient } from "@supabase/supabase-js";
import { PROFILE_COLUMNS, type Profile } from "@/lib/types";

export async function getTop8(
  supabase: SupabaseClient,
  userId: string,
): Promise<(Profile | null)[]> {
  const slots: (Profile | null)[] = Array(8).fill(null);

  const { data: rows } = await supabase
    .from("top8")
    .select("friend_id, position")
    .eq("user_id", userId);

  if (!rows || rows.length === 0) return slots;

  const ids = rows.map((r) => r.friend_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .in("id", ids)
    .returns<Profile[]>();

  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
  for (const row of rows) {
    const profile = byId.get(row.friend_id);
    if (profile && row.position >= 1 && row.position <= 8) {
      slots[row.position - 1] = profile;
    }
  }

  return slots;
}
