"use server";

import { createClient } from "@/lib/supabase/server";

export type ProfileSearchResult = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
};

const RESULT_LIMIT = 6;
const SEARCH_COLUMNS = "id, username, display_name, avatar_url";

export async function searchProfiles(query: string): Promise<ProfileSearchResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const pattern = `%${trimmed}%`;
  const [byUsername, byDisplayName] = await Promise.all([
    supabase.from("profiles").select(SEARCH_COLUMNS).ilike("username", pattern).limit(RESULT_LIMIT),
    supabase
      .from("profiles")
      .select(SEARCH_COLUMNS)
      .ilike("display_name", pattern)
      .limit(RESULT_LIMIT),
  ]);

  const merged = new Map<string, ProfileSearchResult>();
  for (const row of [...(byUsername.data ?? []), ...(byDisplayName.data ?? [])]) {
    merged.set(row.id, row);
  }

  return Array.from(merged.values()).slice(0, RESULT_LIMIT);
}
