import type { SupabaseClient } from "@supabase/supabase-js";

export type PostComment = {
  id: string;
  content: string;
  gif_url: string | null;
  created_at: string;
  author: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
};

export async function getPostComments(
  supabase: SupabaseClient,
  postId: string,
): Promise<PostComment[]> {
  const { data: rows } = await supabase
    .from("post_comments")
    .select("id, content, gif_url, created_at, author_id")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  const comments = rows ?? [];
  if (comments.length === 0) return [];

  const authorIds = Array.from(new Set(comments.map((c) => c.author_id)));
  const { data: authors } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .in("id", authorIds);

  const byId = new Map((authors ?? []).map((a) => [a.id, a]));

  return comments
    .map((c) => {
      const author = byId.get(c.author_id);
      if (!author) return null;
      return {
        id: c.id,
        content: c.content,
        gif_url: c.gif_url,
        created_at: c.created_at,
        author,
      };
    })
    .filter((c): c is PostComment => c !== null);
}
