import Image from "next/image";
import { Card } from "@/components/Card/Card";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { addPhoto, deletePhoto } from "@/lib/photos/actions";
import { ImageIcon, XIcon } from "@/components/icons";
import type { Photo } from "@/lib/photos/queries";
import styles from "./PhotosCard.module.css";

export function PhotosCard({
  photos,
  isOwnProfile,
  redirectTo,
}: {
  photos: Photo[];
  isOwnProfile: boolean;
  redirectTo: string;
}) {
  return (
    <Card title="Photos" icon={<ImageIcon size={17} aria-hidden="true" />}>
      {isOwnProfile ? (
        <form action={addPhoto} className={styles.uploadForm}>
          <input type="hidden" name="redirect_to" value={redirectTo} />
          <input
            type="text"
            name="caption"
            placeholder="Add a caption (optional)"
            className="field-input"
            maxLength={140}
          />
          <div className={styles.uploadRow}>
            <input type="file" name="photo" accept="image/*" required />
            <button type="submit" className="btn-primary">
              Upload
            </button>
          </div>
          <span className={styles.hint}>PNG or JPG, up to 5MB.</span>
        </form>
      ) : null}

      {photos.length === 0 ? (
        <EmptyState icon={<ImageIcon size={26} aria-hidden="true" />}>No photos yet.</EmptyState>
      ) : (
        <div className={styles.grid}>
          {photos.map((photo) => (
            <div key={photo.id} className={styles.photoWrap}>
              <a href={photo.photo_url} target="_blank" rel="noopener noreferrer">
                <Image
                  src={photo.photo_url}
                  alt={photo.caption ?? ""}
                  width={220}
                  height={220}
                  className={styles.photo}
                />
              </a>
              {isOwnProfile ? (
                <form action={deletePhoto} className={styles.deleteForm}>
                  <input type="hidden" name="photo_id" value={photo.id} />
                  <input type="hidden" name="redirect_to" value={redirectTo} />
                  <button type="submit" className={styles.deleteButton} aria-label="Delete photo">
                    <XIcon size={11} aria-hidden="true" />
                  </button>
                </form>
              ) : null}
              {photo.caption ? <p className={styles.caption}>{photo.caption}</p> : null}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
