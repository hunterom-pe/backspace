import type { SupabaseClient } from "@supabase/supabase-js";

export type Photo = {
  id: string;
  photo_url: string;
  caption: string | null;
  created_at: string;
};

export async function getPhotos(supabase: SupabaseClient, ownerId: string): Promise<Photo[]> {
  const { data } = await supabase
    .from("photos")
    .select("id, photo_url, caption, created_at")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  return data ?? [];
}
