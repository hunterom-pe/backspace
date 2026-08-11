import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getConversations } from "@/lib/messages/queries";
import { TopNav } from "@/components/TopNav/TopNav";
import { formatRelativeTime } from "@/lib/format-time";
import styles from "./messages.module.css";

export default async function MessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: viewer } = await supabase
    .from("profiles")
    .select("username, display_name")
    .eq("id", user.id)
    .single();

  if (!viewer) {
    redirect("/login");
  }

  const conversations = await getConversations(supabase, user.id);

  return (
    <div className={styles.page}>
      <TopNav
        viewerId={user.id}
        displayName={viewer.display_name || viewer.username}
        username={viewer.username}
      />
      <div className={styles.container}>
        <h1 className={styles.heading}>Messages</h1>

        {conversations.length === 0 ? (
          <p className={styles.empty}>
            No conversations yet. Visit a profile and click &quot;Message&quot; to start one.
          </p>
        ) : (
          <ul className={styles.list}>
            {conversations.map((c) => {
              const name = c.partner.display_name || c.partner.username;
              const initials = name.slice(0, 2).toUpperCase();
              const preview = c.lastMessage.content || (c.lastMessage.gif_url ? "Sent a GIF" : "");

              return (
                <li key={c.partner.id}>
                  <Link
                    href={`/messages/${c.partner.username}`}
                    className={`${styles.item} ${c.unreadCount > 0 ? styles.unread : ""}`}
                  >
                    {c.partner.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.partner.avatar_url} alt="" className={styles.avatar} />
                    ) : (
                      <div className={styles.avatarFallback}>{initials}</div>
                    )}
                    <div className={styles.itemBody}>
                      <div className={styles.itemHeader}>
                        <span className={styles.itemName}>{name}</span>
                        <span className={styles.itemTime}>
                          {formatRelativeTime(c.lastMessage.created_at)}
                        </span>
                      </div>
                      <p className={styles.itemPreview}>
                        {c.lastMessage.fromMe ? "You: " : ""}
                        {preview}
                      </p>
                    </div>
                    {c.unreadCount > 0 ? (
                      <span className={styles.badge}>{c.unreadCount}</span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
