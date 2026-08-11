import type { SupabaseClient } from "@supabase/supabase-js";

export type NotificationType =
  | "friend_request"
  | "friend_accepted"
  | "wall_comment"
  | "message"
  | "top8_added";

export type AppNotification = {
  id: string;
  type: NotificationType;
  created_at: string;
  read_at: string | null;
  actor: { username: string; display_name: string | null; avatar_url: string | null } | null;
};

export async function getNotifications(
  supabase: SupabaseClient,
  userId: string,
  limit = 15,
): Promise<AppNotification[]> {
  const { data: rows } = await supabase
    .from("notifications")
    .select("id, type, created_at, read_at, actor_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  const notifications = rows ?? [];
  if (notifications.length === 0) return [];

  const actorIds = Array.from(
    new Set(notifications.map((n) => n.actor_id).filter((id): id is string => !!id)),
  );

  const actorById = new Map<string, { username: string; display_name: string | null; avatar_url: string | null }>();
  if (actorIds.length > 0) {
    const { data: actors } = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url")
      .in("id", actorIds);
    for (const actor of actors ?? []) {
      actorById.set(actor.id, actor);
    }
  }

  return notifications.map((n) => ({
    id: n.id,
    type: n.type,
    created_at: n.created_at,
    read_at: n.read_at,
    actor: n.actor_id ? (actorById.get(n.actor_id) ?? null) : null,
  }));
}

export async function getUnreadCount(supabase: SupabaseClient, userId: string): Promise<number> {
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .is("read_at", null);

  return count ?? 0;
}
