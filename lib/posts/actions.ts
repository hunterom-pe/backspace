"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isGiphyUrl } from "@/lib/giphy";

type ActionResult = { ok: true } | { ok: false; error: string };
type ToggleLikeResult =
  | { ok: true; liked: boolean; likeCount: number }
  | { ok: false; error: string };

export async function createPost(
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

  const trimmed = content.trim();
  if (!trimmed && !gifUrl) {
    return { ok: false, error: "Say something or add a GIF." };
  }
  if (trimmed.length > 2000) {
    return { ok: false, error: "That post is too long." };
  }
  if (gifUrl && !isGiphyUrl(gifUrl)) {
    return { ok: false, error: "Invalid GIF." };
  }

  const { error } = await supabase
    .from("posts")
    .insert({ user_id: user.id, content: trimmed, gif_url: gifUrl });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deletePost(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const postId = String(formData.get("post_id") ?? "");
  if (postId) {
    // RLS restricts this to the post's own author.
    await supabase.from("posts").delete().eq("id", postId);
  }

  revalidatePath("/", "layout");
}

export async function toggleLike(postId: string): Promise<ToggleLikeResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: existing } = await supabase
    .from("post_likes")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("post_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await supabase
      .from("post_likes")
      .insert({ post_id: postId, user_id: user.id });
    if (error) return { ok: false, error: error.message };
  }

  const { data: post } = await supabase
    .from("posts")
    .select("like_count")
    .eq("id", postId)
    .single();

  revalidatePath("/", "layout");
  return { ok: true, liked: !existing, likeCount: post?.like_count ?? 0 };
}
