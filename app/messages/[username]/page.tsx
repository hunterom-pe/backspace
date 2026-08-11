import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getThreadMessages } from "@/lib/messages/queries";
import { markThreadRead } from "@/lib/messages/actions";
import { TopNav } from "@/components/TopNav/TopNav";
import { MessageThread } from "@/components/MessageThread/MessageThread";
import styles from "./thread.module.css";

export async function generateMetadata(
  props: PageProps<"/messages/[username]">,
): Promise<Metadata> {
  const { username } = await props.params;
  return { title: `@${username}` };
}

export default async function MessageThreadPage(props: PageProps<"/messages/[username]">) {
  const { username } = await props.params;

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

  const { data: partner } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .eq("username", username)
    .single();

  if (!partner) {
    notFound();
  }

  if (partner.id === user.id) {
    redirect("/messages");
  }

  await markThreadRead(partner.id);
  const messages = await getThreadMessages(supabase, user.id, partner.id);

  const partnerName = partner.display_name || partner.username;
  const initials = partnerName.slice(0, 2).toUpperCase();

  return (
    <div className={styles.page}>
      <TopNav
        viewerId={user.id}
        displayName={viewer.display_name || viewer.username}
        username={viewer.username}
      />
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/messages" className={styles.backLink}>
            ← Messages
          </Link>
          <Link href={`/profile/${partner.username}`} className={styles.partnerLink}>
            {partner.avatar_url ? (
              <Image
                src={partner.avatar_url}
                alt=""
                width={72}
                height={72}
                className={styles.partnerAvatar}
              />
            ) : (
              <div className={styles.partnerAvatarFallback}>{initials}</div>
            )}
            <span className={styles.partnerName}>{partnerName}</span>
          </Link>
        </div>

        <MessageThread otherUserId={partner.id} viewerId={user.id} initialMessages={messages} />
      </div>
    </div>
  );
}
