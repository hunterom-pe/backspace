"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isGiphyUrl } from "@/lib/giphy";

type ActionResult = { ok: true } | { ok: false; error: string };

export async function sendMessage(
  recipientId: string,
  content: string,
  gifUrl: string | null,
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (recipientId === user.id) {
    return { ok: false, error: "You can't message yourself." };
  }

  const { data: blocked } = await supabase.rpc("is_blocked", { a: user.id, b: recipientId });
  if (blocked) {
    return { ok: false, error: "You can't message this user." };
  }

  const trimmed = content.trim();
  if (!trimmed && !gifUrl) {
    return { ok: false, error: "Say something or add a GIF." };
  }
  if (trimmed.length > 2000) {
    return { ok: false, error: "That message is too long." };
  }
  if (gifUrl && !isGiphyUrl(gifUrl)) {
    return { ok: false, error: "Invalid GIF." };
  }

  const { data: inserted, error } = await supabase
    .from("messages")
    .insert({ sender_id: user.id, recipient_id: recipientId, content: trimmed, gif_url: gifUrl })
    .select("id")
    .single();

  if (error || !inserted) {
    return { ok: false, error: error?.message ?? "Something went wrong." };
  }

  await supabase.from("notifications").insert({
    user_id: recipientId,
    type: "message",
    actor_id: user.id,
    reference_id: inserted.id,
  });

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function markThreadRead(otherUserId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("sender_id", otherUserId)
    .eq("recipient_id", user.id)
    .is("read_at", null);
}
