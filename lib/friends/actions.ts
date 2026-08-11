"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { supabase, user };
}

function target(formData: FormData) {
  return String(formData.get("redirect_to") ?? "/friends");
}

export async function sendFriendRequest(formData: FormData) {
  const { supabase, user } = await requireUser();
  const recipientId = String(formData.get("recipient_id") ?? "");
  const redirectTo = target(formData);

  if (!recipientId || recipientId === user.id) {
    redirect(redirectTo);
  }

  const { data: existing } = await supabase
    .from("friendships")
    .select("id, requester_id, status")
    .or(
      `and(requester_id.eq.${user.id},recipient_id.eq.${recipientId}),and(requester_id.eq.${recipientId},recipient_id.eq.${user.id})`,
    )
    .maybeSingle();

  if (existing) {
    // If they already requested us, accept it instead of creating a duplicate.
    if (existing.status === "pending" && existing.requester_id === recipientId) {
      await supabase
        .from("friendships")
        .update({ status: "accepted", accepted_at: new Date().toISOString() })
        .eq("id", existing.id);
      await supabase.from("notifications").insert({
        user_id: recipientId,
        type: "friend_accepted",
        actor_id: user.id,
        reference_id: existing.id,
      });
    }
    revalidatePath("/", "layout");
    redirect(redirectTo);
  }

  const { data: created, error } = await supabase
    .from("friendships")
    .insert({ requester_id: user.id, recipient_id: recipientId, status: "pending" })
    .select("id")
    .single();

  if (!error && created) {
    await supabase.from("notifications").insert({
      user_id: recipientId,
      type: "friend_request",
      actor_id: user.id,
      reference_id: created.id,
    });
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

export async function respondToFriendRequest(formData: FormData) {
  const { supabase, user } = await requireUser();
  const friendshipId = String(formData.get("friendship_id") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const redirectTo = target(formData);

  const { data: friendship } = await supabase
    .from("friendships")
    .select("id, requester_id, recipient_id, status")
    .eq("id", friendshipId)
    .single();

  if (!friendship || friendship.recipient_id !== user.id || friendship.status !== "pending") {
    redirect(redirectTo);
  }

  if (decision === "accept") {
    await supabase
      .from("friendships")
      .update({ status: "accepted", accepted_at: new Date().toISOString() })
      .eq("id", friendshipId);
    await supabase.from("notifications").insert({
      user_id: friendship.requester_id,
      type: "friend_accepted",
      actor_id: user.id,
      reference_id: friendshipId,
    });
  } else {
    await supabase.from("friendships").delete().eq("id", friendshipId);
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

export async function removeFriendship(formData: FormData) {
  const { supabase, user } = await requireUser();
  const friendshipId = String(formData.get("friendship_id") ?? "");
  const redirectTo = target(formData);

  const { data: friendship } = await supabase
    .from("friendships")
    .select("id, requester_id, recipient_id")
    .eq("id", friendshipId)
    .single();

  if (
    friendship &&
    (friendship.requester_id === user.id || friendship.recipient_id === user.id)
  ) {
    await supabase.from("friendships").delete().eq("id", friendshipId);
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}
