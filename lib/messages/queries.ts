import type { SupabaseClient } from "@supabase/supabase-js";

export type Conversation = {
  partner: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
  lastMessage: {
    content: string;
    gif_url: string | null;
    created_at: string;
    fromMe: boolean;
  };
  unreadCount: number;
};

export async function getConversations(
  supabase: SupabaseClient,
  userId: string,
): Promise<Conversation[]> {
  const { data: rows } = await supabase
    .from("messages")
    .select("id, sender_id, recipient_id, content, gif_url, read_at, created_at")
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  const messages = rows ?? [];
  if (messages.length === 0) return [];

  const partnerIds = Array.from(
    new Set(messages.map((m) => (m.sender_id === userId ? m.recipient_id : m.sender_id))),
  );

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .in("id", partnerIds);
  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  const lastByPartner = new Map<string, (typeof messages)[number]>();
  const unreadByPartner = new Map<string, number>();

  for (const m of messages) {
    const partnerId = m.sender_id === userId ? m.recipient_id : m.sender_id;
    if (!lastByPartner.has(partnerId)) {
      lastByPartner.set(partnerId, m);
    }
    if (m.recipient_id === userId && !m.read_at) {
      unreadByPartner.set(partnerId, (unreadByPartner.get(partnerId) ?? 0) + 1);
    }
  }

  return partnerIds
    .map((id) => {
      const profile = profileById.get(id);
      const last = lastByPartner.get(id);
      if (!profile || !last) return null;
      return {
        partner: profile,
        lastMessage: {
          content: last.content,
          gif_url: last.gif_url,
          created_at: last.created_at,
          fromMe: last.sender_id === userId,
        },
        unreadCount: unreadByPartner.get(id) ?? 0,
      };
    })
    .filter((c): c is Conversation => c !== null)
    .sort(
      (a, b) =>
        new Date(b.lastMessage.created_at).getTime() -
        new Date(a.lastMessage.created_at).getTime(),
    );
}

export type ThreadMessage = {
  id: string;
  sender_id: string;
  content: string;
  gif_url: string | null;
  created_at: string;
};

export async function getThreadMessages(
  supabase: SupabaseClient,
  userId: string,
  otherUserId: string,
): Promise<ThreadMessage[]> {
  const { data } = await supabase
    .from("messages")
    .select("id, sender_id, content, gif_url, created_at")
    .or(
      `and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`,
    )
    .order("created_at", { ascending: true });

  return data ?? [];
}
