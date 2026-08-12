import type { SupabaseClient } from "@supabase/supabase-js";
import { PROFILE_COLUMNS, type Profile } from "@/lib/types";

export type BlockState = {
  blockedByViewer: boolean;
  blockedByTarget: boolean;
};

export async function getBlockState(
  supabase: SupabaseClient,
  viewerId: string,
  targetId: string,
): Promise<BlockState> {
  if (viewerId === targetId) {
    return { blockedByViewer: false, blockedByTarget: false };
  }

  const [{ data: mine }, { data: eitherWay }] = await Promise.all([
    supabase
      .from("blocked_users")
      .select("blocker_id")
      .eq("blocker_id", viewerId)
      .eq("blocked_id", targetId)
      .maybeSingle(),
    supabase.rpc("is_blocked", { a: viewerId, b: targetId }),
  ]);

  const blockedByViewer = Boolean(mine);
  return { blockedByViewer, blockedByTarget: Boolean(eitherWay) && !blockedByViewer };
}

export async function getBlockedProfiles(supabase: SupabaseClient, userId: string) {
  const { data: rows } = await supabase
    .from("blocked_users")
    .select("blocked_id")
    .eq("blocker_id", userId);

  const blockedIds = (rows ?? []).map((r) => r.blocked_id);
  if (blockedIds.length === 0) return [];

  const { data: profiles } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .in("id", blockedIds)
    .returns<Profile[]>();

  return profiles ?? [];
}
