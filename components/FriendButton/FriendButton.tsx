import { sendFriendRequest, respondToFriendRequest, removeFriendship } from "@/lib/friends/actions";
import { ConfettiButton } from "@/components/ConfettiButton/ConfettiButton";
import { UserPlusIcon } from "@/components/icons";
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
        <button type="submit" className="btn-secondary">
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
          <ConfettiButton type="submit" className="btn-primary">
            Accept
          </ConfettiButton>
        </form>
        <form action={respondToFriendRequest}>
          <input type="hidden" name="friendship_id" value={state.friendshipId} />
          <input type="hidden" name="decision" value="reject" />
          <input type="hidden" name="redirect_to" value={redirectTo} />
          <button type="submit" className="btn-secondary">
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
      <button type="submit" className="btn-primary">
        <UserPlusIcon size={16} aria-hidden="true" />
        Add Friend
      </button>
    </form>
  );
}
