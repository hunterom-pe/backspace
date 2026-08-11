import type { SupabaseClient } from "@supabase/supabase-js";
import { PROFILE_COLUMNS, type Profile } from "@/lib/types";

export type FriendshipState =
  | { status: "none" }
  | { status: "pending_outgoing"; friendshipId: string }
  | { status: "pending_incoming"; friendshipId: string }
  | { status: "friends"; friendshipId: string };

export async function getFriendshipState(
  supabase: SupabaseClient,
  viewerId: string,
  targetId: string,
): Promise<FriendshipState> {
  if (viewerId === targetId) return { status: "none" };

  const { data } = await supabase
    .from("friendships")
    .select("id, requester_id, recipient_id, status")
    .or(
      `and(requester_id.eq.${viewerId},recipient_id.eq.${targetId}),and(requester_id.eq.${targetId},recipient_id.eq.${viewerId})`,
    )
    .maybeSingle();

  if (!data) return { status: "none" };
  if (data.status === "accepted") return { status: "friends", friendshipId: data.id };
  if (data.requester_id === viewerId) {
    return { status: "pending_outgoing", friendshipId: data.id };
  }
  return { status: "pending_incoming", friendshipId: data.id };
}

type FriendRow = { friendshipId: string; profile: Profile };

export async function getFriendsPageData(supabase: SupabaseClient, userId: string) {
  const { data: rows } = await supabase
    .from("friendships")
    .select("id, requester_id, recipient_id, status")
    .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`);

  const friendships = rows ?? [];
  const otherIds = Array.from(
    new Set(
      friendships.map((f) => (f.requester_id === userId ? f.recipient_id : f.requester_id)),
    ),
  );

  const profileById = new Map<string, Profile>();
  if (otherIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select(PROFILE_COLUMNS)
      .in("id", otherIds)
      .returns<Profile[]>();
    for (const profile of profiles ?? []) {
      profileById.set(profile.id, profile);
    }
  }

  const incoming: FriendRow[] = [];
  const outgoing: FriendRow[] = [];
  const friends: FriendRow[] = [];

  for (const row of friendships) {
    const otherId = row.requester_id === userId ? row.recipient_id : row.requester_id;
    const profile = profileById.get(otherId);
    if (!profile) continue;

    if (row.status === "accepted") {
      friends.push({ friendshipId: row.id, profile });
    } else if (row.requester_id === userId) {
      outgoing.push({ friendshipId: row.id, profile });
    } else {
      incoming.push({ friendshipId: row.id, profile });
    }
  }

  return { incoming, outgoing, friends };
}
