"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isGiphyUrl } from "@/lib/giphy";

type PostResult = { ok: true } | { ok: false; error: string };

export async function postWallComment(
  profileId: string,
  content: string,
  gifUrl: string | null,
): Promise<PostResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const trimmed = content.trim();
  if (!trimmed && !gifUrl) {
    return { ok: false, error: "Say something or add a GIF." };
  }
  if (trimmed.length > 2000) {
    return { ok: false, error: "That comment is too long." };
  }
  if (gifUrl && !isGiphyUrl(gifUrl)) {
    return { ok: false, error: "Invalid GIF." };
  }

  const { data: inserted, error } = await supabase
    .from("wall_comments")
    .insert({ profile_id: profileId, author_id: user.id, content: trimmed, gif_url: gifUrl })
    .select("id")
    .single();

  if (error || !inserted) {
    return { ok: false, error: error?.message ?? "Something went wrong." };
  }

  if (profileId !== user.id) {
    await supabase.from("notifications").insert({
      user_id: profileId,
      type: "wall_comment",
      actor_id: user.id,
      reference_id: inserted.id,
    });
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteWallComment(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const commentId = String(formData.get("comment_id") ?? "");
  if (commentId) {
    // RLS restricts this to the comment's author or the wall owner.
    await supabase.from("wall_comments").delete().eq("id", commentId);
  }

  revalidatePath("/", "layout");
}
