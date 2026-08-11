import { sendFriendRequest, respondToFriendRequest, removeFriendship } from "@/lib/friends/actions";
import type { FriendshipState } from "@/lib/friends/queries";
import styles from "./FriendButton.module.css";

export function FriendButton({
  targetId,
  state,
  redirectTo,
}: {
  targetId: string;
  state: FriendshipState;
  redirectTo: string;
}) {
  if (state.status === "friends") {
    return (
      <div className={styles.row}>
        <span className={styles.friendsBadge}>✓ Friends</span>
        <form action={removeFriendship}>
          <input type="hidden" name="friendship_id" value={state.friendshipId} />
          <input type="hidden" name="redirect_to" value={redirectTo} />
          <button type="submit" className={styles.textButton}>
            Remove
          </button>
        </form>
      </div>
    );
  }

  if (state.status === "pending_outgoing") {
    return (
      <form action={removeFriendship}>
        <input type="hidden" name="friendship_id" value={state.friendshipId} />
        <input type="hidden" name="redirect_to" value={redirectTo} />
        <button type="submit" className={styles.secondaryButton}>
          Request sent — cancel
        </button>
      </form>
    );
  }

  if (state.status === "pending_incoming") {
    return (
      <div className={styles.row}>
        <form action={respondToFriendRequest}>
          <input type="hidden" name="friendship_id" value={state.friendshipId} />
          <input type="hidden" name="decision" value="accept" />
          <input type="hidden" name="redirect_to" value={redirectTo} />
          <button type="submit" className={styles.primaryButton}>
            Accept
          </button>
        </form>
        <form action={respondToFriendRequest}>
          <input type="hidden" name="friendship_id" value={state.friendshipId} />
          <input type="hidden" name="decision" value="reject" />
          <input type="hidden" name="redirect_to" value={redirectTo} />
          <button type="submit" className={styles.secondaryButton}>
            Decline
          </button>
        </form>
      </div>
    );
  }

  return (
    <form action={sendFriendRequest}>
      <input type="hidden" name="recipient_id" value={targetId} />
      <input type="hidden" name="redirect_to" value={redirectTo} />
      <button type="submit" className={styles.primaryButton}>
        Add Friend
      </button>
    </form>
  );
}
