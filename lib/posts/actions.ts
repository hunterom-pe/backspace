"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isGiphyUrl } from "@/lib/giphy";
import { getFeedPosts, type FeedPost } from "@/lib/posts/queries";
import { getPostComments, type PostComment } from "@/lib/posts/comments";

type ActionResult = { ok: true } | { ok: false; error: string };
type ToggleLikeResult =
  | { ok: true; liked: boolean; likeCount: number }
  | { ok: false; error: string };
type CommentResult = { ok: true; comment: PostComment } | { ok: false; error: string };

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

export async function loadMoreFeedPosts(cursor: string): Promise<FeedPost[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return getFeedPosts(supabase, user.id, { cursor });
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

export async function loadPostComments(postId: string): Promise<PostComment[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return getPostComments(supabase, postId);
}

export async function createPostComment(
  postId: string,
  content: string,
  gifUrl: string | null,
): Promise<CommentResult> {
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

  const { data: post } = await supabase
    .from("posts")
    .select("user_id")
    .eq("id", postId)
    .single();

  if (!post) {
    return { ok: false, error: "That post no longer exists." };
  }

  const { data: inserted, error } = await supabase
    .from("post_comments")
    .insert({ post_id: postId, author_id: user.id, content: trimmed, gif_url: gifUrl })
    .select("id, created_at")
    .single();

  if (error || !inserted) {
    return { ok: false, error: error?.message ?? "Something went wrong." };
  }

  if (post.user_id !== user.id) {
    await supabase.from("notifications").insert({
      user_id: post.user_id,
      type: "post_comment",
      actor_id: user.id,
      reference_id: postId,
    });
  }

  const { data: author } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .eq("id", user.id)
    .single();

  revalidatePath("/", "layout");
  return {
    ok: true,
    comment: {
      id: inserted.id,
      content: trimmed,
      gif_url: gifUrl,
      created_at: inserted.created_at,
      author: author ?? { id: user.id, username: "", display_name: null, avatar_url: null },
    },
  };
}

export async function deletePostComment(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const commentId = String(formData.get("comment_id") ?? "");
  if (commentId) {
    // RLS restricts this to the comment's author or the post's owner.
    await supabase.from("post_comments").delete().eq("id", commentId);
  }

  revalidatePath("/", "layout");
}
