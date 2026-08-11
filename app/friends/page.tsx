import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getFriendsPageData } from "@/lib/friends/queries";
import { respondToFriendRequest, removeFriendship } from "@/lib/friends/actions";
import { TopNav } from "@/components/TopNav/TopNav";
import { Card } from "@/components/Card/Card";
import { FriendListItem } from "@/components/FriendListItem/FriendListItem";
import styles from "./friends.module.css";

export default async function FriendsPage() {
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

  const { incoming, outgoing, friends } = await getFriendsPageData(supabase, user.id);

  return (
    <div className={styles.page}>
      <TopNav displayName={viewer.display_name || viewer.username} username={viewer.username} />
      <div className={styles.container}>
        <Card title={`Friend requests${incoming.length ? ` (${incoming.length})` : ""}`}>
          {incoming.length === 0 ? (
            <p className={styles.empty}>No pending requests.</p>
          ) : (
            <ul className={styles.list}>
              {incoming.map(({ friendshipId, profile }) => (
                <FriendListItem
                  key={friendshipId}
                  profile={profile}
                  action={
                    <div className={styles.actions}>
                      <form action={respondToFriendRequest}>
                        <input type="hidden" name="friendship_id" value={friendshipId} />
                        <input type="hidden" name="decision" value="accept" />
                        <input type="hidden" name="redirect_to" value="/friends" />
                        <button type="submit" className={styles.acceptButton}>
                          Accept
                        </button>
                      </form>
                      <form action={respondToFriendRequest}>
                        <input type="hidden" name="friendship_id" value={friendshipId} />
                        <input type="hidden" name="decision" value="reject" />
                        <input type="hidden" name="redirect_to" value="/friends" />
                        <button type="submit" className={styles.declineButton}>
                          Decline
                        </button>
                      </form>
                    </div>
                  }
                />
              ))}
            </ul>
          )}
        </Card>

        {outgoing.length > 0 ? (
          <Card title="Sent requests">
            <ul className={styles.list}>
              {outgoing.map(({ friendshipId, profile }) => (
                <FriendListItem
                  key={friendshipId}
                  profile={profile}
                  action={
                    <form action={removeFriendship}>
                      <input type="hidden" name="friendship_id" value={friendshipId} />
                      <input type="hidden" name="redirect_to" value="/friends" />
                      <button type="submit" className={styles.declineButton}>
                        Cancel
                      </button>
                    </form>
                  }
                />
              ))}
            </ul>
          </Card>
        ) : null}

        <Card title={`Friends${friends.length ? ` (${friends.length})` : ""}`}>
          {friends.length === 0 ? (
            <p className={styles.empty}>
              No friends yet. Visit a profile and click &quot;Add Friend&quot; to get started.
            </p>
          ) : (
            <ul className={styles.list}>
              {friends.map(({ friendshipId, profile }) => (
                <FriendListItem key={friendshipId} profile={profile} />
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
