import type { SupabaseClient } from "@supabase/supabase-js";

export type ProfileVisit = {
  visitedAt: string;
  visitor: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
};

export async function getRecentVisitors(
  supabase: SupabaseClient,
  profileId: string,
  limit = 10,
): Promise<ProfileVisit[]> {
  const { data: rows } = await supabase
    .from("profile_visits")
    .select("visitor_id, visited_at")
    .eq("profile_id", profileId)
    .order("visited_at", { ascending: false })
    .limit(limit);

  const visits = rows ?? [];
  if (visits.length === 0) return [];

  const visitorIds = visits.map((v) => v.visitor_id);
  const { data: visitors } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .in("id", visitorIds);

  const byId = new Map((visitors ?? []).map((v) => [v.id, v]));

  return visits
    .map((v) => {
      const visitor = byId.get(v.visitor_id);
      if (!visitor) return null;
      return { visitedAt: v.visited_at, visitor };
    })
    .filter((v): v is ProfileVisit => v !== null);
}
