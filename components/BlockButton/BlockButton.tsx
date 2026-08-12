import { blockUser, unblockUser } from "@/lib/blocking/actions";
import styles from "./BlockButton.module.css";

export function BlockButton({
  targetId,
  isBlocked,
  redirectTo,
}: {
  targetId: string;
  isBlocked: boolean;
  redirectTo: string;
}) {
  return (
    <form action={isBlocked ? unblockUser : blockUser}>
      <input type="hidden" name="blocked_id" value={targetId} />
      <input type="hidden" name="redirect_to" value={redirectTo} />
      <button type="submit" className={styles.blockButton}>
        {isBlocked ? "Unblock" : "Block"}
      </button>
    </form>
  );
}
