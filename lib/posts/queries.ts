import type { SupabaseClient } from "@supabase/supabase-js";

export type FeedPost = {
  id: string;
  content: string;
  gif_url: string | null;
  like_count: number;
  comment_count: number;
  created_at: string;
  liked_by_viewer: boolean;
  author: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
};

export const FEED_PAGE_SIZE = 20;

export async function getFeedPosts(
  supabase: SupabaseClient,
  userId: string,
  { cursor }: { cursor?: string } = {},
): Promise<FeedPost[]> {
  const { data: friendships } = await supabase
    .from("friendships")
    .select("requester_id, recipient_id")
    .eq("status", "accepted")
    .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`);

  const friendIds = (friendships ?? []).map((f) =>
    f.requester_id === userId ? f.recipient_id : f.requester_id,
  );
  const authorIds = Array.from(new Set([userId, ...friendIds]));

  let query = supabase
    .from("posts")
    .select("id, user_id, content, gif_url, like_count, comment_count, created_at")
    .in("user_id", authorIds)
    .order("created_at", { ascending: false })
    .limit(FEED_PAGE_SIZE);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data: rows } = await query;

  const posts = rows ?? [];
  if (posts.length === 0) return [];

  const postIds = posts.map((p) => p.id);
  const [authorsRes, likesRes] = await Promise.all([
    supabase.from("profiles").select("id, username, display_name, avatar_url").in("id", authorIds),
    supabase.from("post_likes").select("post_id").eq("user_id", userId).in("post_id", postIds),
  ]);

  const authorById = new Map((authorsRes.data ?? []).map((a) => [a.id, a]));
  const likedPostIds = new Set((likesRes.data ?? []).map((l) => l.post_id));

  return posts
    .map((p) => {
      const author = authorById.get(p.user_id);
      if (!author) return null;
      return {
        id: p.id,
        content: p.content,
        gif_url: p.gif_url,
        like_count: p.like_count,
        comment_count: p.comment_count,
        created_at: p.created_at,
        liked_by_viewer: likedPostIds.has(p.id),
        author,
      };
    })
    .filter((p): p is FeedPost => p !== null);
}
