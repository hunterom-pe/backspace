import { Card } from "@/components/Card/Card";
import styles from "./PostsFeed.module.css";

type Post = {
  id: string;
  authorName: string;
  content: string;
  likeCount: number;
  createdAt: string;
};

export function PostsFeed({ posts = [] }: { posts?: Post[] }) {
  return (
    <Card title="Posts">
      <form className={styles.composer}>
        <textarea
          className={styles.input}
          placeholder="What's on your mind?"
          rows={3}
          disabled
          title="Posting is coming in a later build step"
        />
        <div className={styles.composerActions}>
          <button type="button" className={styles.gifButton} disabled>
            GIF
          </button>
          <button type="submit" className={styles.submit} disabled>
            Post
          </button>
        </div>
      </form>

      {posts.length === 0 ? (
        <p className={styles.empty}>No posts yet. Add friends to see their updates here.</p>
      ) : (
        <ul className={styles.list}>
          {posts.map((post) => (
            <li key={post.id} className={styles.post}>
              <p className={styles.postAuthor}>{post.authorName}</p>
              <p className={styles.postBody}>{post.content}</p>
              <p className={styles.postMeta}>❤ {post.likeCount}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
