"use server";

import { uploadImage } from "@/lib/cloudinary";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024;

function validate(formData: FormData): { file: File } | { error: string } {
  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "No file provided" };
  if (!ALLOWED_TYPES.has(file.type)) return { error: "Only JPG, PNG and WebP are allowed" };
  if (file.size > MAX_BYTES) return { error: "File must be under 5MB" };
  return { file };
}

export async function uploadPropertyImageAction(
  formData: FormData
): Promise<{ url: string } | { error: string }> {
  const v = validate(formData);
  if ("error" in v) return v;
  try {
    return { url: await uploadImage(v.file, "luxe-estate/properties") };
  } catch {
    return { error: "Upload failed. Please try again." };
  }
}

export async function uploadAvatarAction(
  formData: FormData
): Promise<{ url: string } | { error: string }> {
  const v = validate(formData);
  if ("error" in v) return v;
  try {
    return { url: await uploadImage(v.file, "luxe-estate/avatars") };
  } catch {
    return { error: "Upload failed. Please try again." };
  }
}
