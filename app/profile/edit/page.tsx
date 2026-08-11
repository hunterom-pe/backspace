import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "@/lib/profile/actions";
import { PROFILE_COLUMNS, type Profile } from "@/lib/types";
import styles from "./edit-profile.module.css";

export default async function EditProfilePage(props: PageProps<"/profile/edit">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", user.id)
    .single<Profile>();

  if (!profile) {
    redirect("/login");
  }

  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : null;

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.header}>
          <p className={styles.title}>Edit profile</p>
          <Link href={`/profile/${profile.username}`} className={styles.cancel}>
            Cancel
          </Link>
        </div>

        {error ? <p className={styles.error}>{error}</p> : null}

        <form className={styles.form} action={updateProfile}>
          <div className={styles.avatarRow}>
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt="" className={styles.avatarPreview} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {(profile.display_name || profile.username).slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className={styles.field}>
              <label htmlFor="avatar">Avatar</label>
              <input id="avatar" name="avatar" type="file" accept="image/*" />
              <span className={styles.hint}>PNG or JPG, up to 5MB.</span>
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="display_name">Display name</label>
            <input
              id="display_name"
              name="display_name"
              type="text"
              defaultValue={profile.display_name ?? ""}
              maxLength={60}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="tagline">Tagline</label>
            <input
              id="tagline"
              name="tagline"
              type="text"
              placeholder="A short headline for your profile"
              defaultValue={profile.tagline ?? ""}
              maxLength={100}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              type="text"
              defaultValue={profile.location ?? ""}
              maxLength={100}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="mood_status">Mood / status</label>
            <input
              id="mood_status"
              name="mood_status"
              type="text"
              defaultValue={profile.mood_status ?? ""}
              maxLength={100}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="about_me">About me</label>
            <textarea
              id="about_me"
              name="about_me"
              rows={4}
              defaultValue={profile.about_me ?? ""}
              maxLength={2000}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="interests">Interests</label>
            <textarea
              id="interests"
              name="interests"
              rows={3}
              defaultValue={profile.interests ?? ""}
              maxLength={2000}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="spotify_embed_url">Spotify link</label>
            <input
              id="spotify_embed_url"
              name="spotify_embed_url"
              type="url"
              placeholder="https://open.spotify.com/track/..."
              defaultValue={profile.spotify_embed_url ?? ""}
            />
            <span className={styles.hint}>
              Paste a track, album, or playlist link from Spotify&apos;s share button.
            </span>
          </div>

          <button type="submit" className={styles.submit}>
            Save changes
          </button>
        </form>
      </div>
    </div>
  );
}
