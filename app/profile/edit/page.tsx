import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "@/lib/profile/actions";
import { TopNav } from "@/components/TopNav/TopNav";
import { PencilIcon } from "@/components/icons";
import { PROFILE_COLUMNS, type Profile } from "@/lib/types";
import { PROFILE_THEMES } from "@/lib/theme";
import styles from "./edit-profile.module.css";

export const metadata: Metadata = { title: "Edit profile" };

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
    <div className={styles.page}>
      <TopNav
        viewerId={user.id}
        displayName={profile.display_name || profile.username}
        username={profile.username}
      />
      <div className={styles.wrap}>
        <div className={styles.card}>
          <div className={styles.header}>
            <p className={styles.title}>
              <PencilIcon size={20} aria-hidden="true" />
              Edit profile
            </p>
            <Link href={`/profile/${profile.username}`} className={styles.cancel}>
              Cancel
            </Link>
          </div>

          {error ? <p className={styles.error}>{error}</p> : null}

          <form className={styles.form} action={updateProfile}>
            <div className={styles.bannerRow}>
              {profile.banner_url ? (
                <Image
                  src={profile.banner_url}
                  alt=""
                  width={640}
                  height={140}
                  className={styles.bannerPreview}
                />
              ) : (
                <div className={styles.bannerPlaceholder} />
              )}
              <div className={styles.field}>
                <label htmlFor="banner">Banner</label>
                <input id="banner" name="banner" type="file" accept="image/*" />
                <span className={styles.hint}>PNG or JPG, up to 8MB. Wide images work best.</span>
              </div>
            </div>

            <div className={styles.avatarRow}>
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt=""
                  width={128}
                  height={128}
                  className={styles.avatarPreview}
                />
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
              <span id="theme-label" className={styles.fieldLabel}>
                Profile theme
              </span>
              <div
                className={styles.themeGrid}
                role="radiogroup"
                aria-labelledby="theme-label"
              >
                {PROFILE_THEMES.map((t) => (
                  <label
                    key={t.id}
                    className={styles.themeSwatch}
                    data-profile-theme={t.id}
                  >
                    <input
                      type="radio"
                      name="theme"
                      value={t.id}
                      defaultChecked={profile.theme === t.id}
                      className={styles.themeRadio}
                    />
                    <span className={styles.swatchPreview} aria-hidden="true" />
                    <span className={styles.swatchLabel}>{t.label}</span>
                  </label>
                ))}
              </div>
              <span className={styles.hint}>
                Recolors your profile page for anyone who visits it.
              </span>
            </div>

            <div className={styles.checkboxField}>
              <input
                id="is_private"
                name="is_private"
                type="checkbox"
                defaultChecked={profile.is_private}
              />
              <label htmlFor="is_private">Private profile</label>
              <span className={styles.hint}>
                Only accepted friends can see your Wall. Your name and avatar can still turn up
                in search.
              </span>
            </div>

            <div className={styles.field}>
              <label htmlFor="display_name">Display name</label>
              <input
                id="display_name"
                name="display_name"
                type="text"
                className="field-input"
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
                className="field-input"
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
                className="field-input"
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
                className="field-input"
                defaultValue={profile.mood_status ?? ""}
                maxLength={100}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="away_message">Away message</label>
              <input
                id="away_message"
                name="away_message"
                type="text"
                placeholder="BRB, walking the dog"
                className="field-input"
                defaultValue={profile.away_message ?? ""}
                maxLength={150}
              />
              <span className={styles.hint}>
                Shown on your profile whenever you&apos;re away from your keyboard.
              </span>
            </div>

            <div className={styles.field}>
              <label htmlFor="about_me">About me</label>
              <textarea
                id="about_me"
                name="about_me"
                rows={4}
                className="field-input"
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
                className="field-input"
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
                className="field-input"
                defaultValue={profile.spotify_embed_url ?? ""}
              />
              <span className={styles.hint}>
                Paste a track, album, or playlist link from Spotify&apos;s share button.
              </span>
            </div>

            <button type="submit" className={`btn-primary ${styles.submit}`}>
              Save changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
