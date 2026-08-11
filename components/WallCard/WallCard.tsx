import { Card } from "@/components/Card/Card";
import styles from "./WallCard.module.css";

type WallComment = {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
};

export function WallCard({ comments = [] }: { comments?: WallComment[] }) {
  return (
    <Card title="Wall">
      <form className={styles.composer}>
        <textarea
          className={styles.input}
          placeholder="Write something on this wall..."
          rows={2}
          disabled
          title="Wall comments are coming in a later build step"
        />
        <button type="submit" className={styles.submit} disabled>
          Post
        </button>
      </form>

      {comments.length === 0 ? (
        <p className={styles.empty}>No comments yet. Be the first to say something!</p>
      ) : (
        <ul className={styles.list}>
          {comments.map((comment) => (
            <li key={comment.id} className={styles.comment}>
              <p className={styles.commentAuthor}>{comment.authorName}</p>
              <p className={styles.commentBody}>{comment.content}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
