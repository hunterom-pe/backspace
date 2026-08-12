"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

function target(formData: FormData) {
  return String(formData.get("redirect_to") ?? "/feed");
}

export async function addPhoto(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const redirectTo = target(formData);
  const file = formData.get("photo");
  const caption = String(formData.get("caption") ?? "").trim() || null;

  if (!(file instanceof File) || file.size === 0) {
    redirect(redirectTo);
  }
  if (!file.type.startsWith("image/") || file.size > MAX_PHOTO_BYTES) {
    redirect(redirectTo);
  }

  const photoId = crypto.randomUUID();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${user.id}/${photoId}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("photos")
    .upload(path, file, { contentType: file.type });

  if (uploadError) {
    redirect(redirectTo);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("photos").getPublicUrl(path);

  await supabase.from("photos").insert({
    id: photoId,
    owner_id: user.id,
    storage_path: path,
    photo_url: `${publicUrl}?v=${Date.now()}`,
    caption,
  });

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

export async function deletePhoto(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const redirectTo = target(formData);
  const photoId = String(formData.get("photo_id") ?? "");

  const { data: photo } = await supabase
    .from("photos")
    .select("storage_path, owner_id")
    .eq("id", photoId)
    .single();

  if (photo && photo.owner_id === user.id) {
    await supabase.storage.from("photos").remove([photo.storage_path]);
    await supabase.from("photos").delete().eq("id", photoId);
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}
