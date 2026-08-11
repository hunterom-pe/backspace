"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Top8Entry = { friendId: string; position: number };
type Top8Result = { ok: true } | { ok: false; error: string };

export async function setTop8(entries: Top8Entry[]): Promise<Top8Result> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (entries.length > 8) {
    return { ok: false, error: "Top 8 can only hold 8 friends." };
  }

  const positions = entries.map((e) => e.position);
  if (
    new Set(positions).size !== positions.length ||
    positions.some((p) => p < 1 || p > 8 || !Number.isInteger(p))
  ) {
    return { ok: false, error: "Invalid slot positions." };
  }

  const friendIds = entries.map((e) => e.friendId);
  if (new Set(friendIds).size !== friendIds.length) {
    return { ok: false, error: "Each friend can only appear once." };
  }

  if (friendIds.length > 0) {
    const { data: friendships } = await supabase
      .from("friendships")
      .select("requester_id, recipient_id")
      .eq("status", "accepted")
      .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`);

    const acceptedIds = new Set(
      (friendships ?? []).map((f) =>
        f.requester_id === user.id ? f.recipient_id : f.requester_id,
      ),
    );

    if (friendIds.some((id) => !acceptedIds.has(id))) {
      return { ok: false, error: "You can only add friends to your Top 8." };
    }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  const { error: deleteError } = await supabase.from("top8").delete().eq("user_id", user.id);
  if (deleteError) {
    return { ok: false, error: deleteError.message };
  }

  if (entries.length > 0) {
    const { error: insertError } = await supabase
      .from("top8")
      .insert(entries.map((e) => ({ user_id: user.id, friend_id: e.friendId, position: e.position })));
    if (insertError) {
      return { ok: false, error: insertError.message };
    }
  }

  revalidatePath("/", "layout");
  if (profile) {
    revalidatePath(`/profile/${profile.username}`);
  }

  return { ok: true };
}
