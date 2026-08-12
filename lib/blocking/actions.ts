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

export async function blockUser(formData: FormData) {
  const { supabase, user } = await requireUser();
  const blockedId = String(formData.get("blocked_id") ?? "");
  const redirectTo = target(formData);

  if (!blockedId || blockedId === user.id) {
    redirect(redirectTo);
  }

  await supabase.from("blocked_users").insert({ blocker_id: user.id, blocked_id: blockedId });

  // Blocking ends any existing friendship — being "friends" while blocked
  // doesn't make sense.
  await supabase
    .from("friendships")
    .delete()
    .or(
      `and(requester_id.eq.${user.id},recipient_id.eq.${blockedId}),and(requester_id.eq.${blockedId},recipient_id.eq.${user.id})`,
    );

  // Drop them from your own Top 8, if present.
  await supabase.from("top8").delete().eq("user_id", user.id).eq("friend_id", blockedId);

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

export async function unblockUser(formData: FormData) {
  const { supabase, user } = await requireUser();
  const blockedId = String(formData.get("blocked_id") ?? "");
  const redirectTo = target(formData);

  if (blockedId) {
    await supabase
      .from("blocked_users")
      .delete()
      .eq("blocker_id", user.id)
      .eq("blocked_id", blockedId);
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}
