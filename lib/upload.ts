/** Uploads an image to imgbb and returns its public URL. */
export async function uploadImage(file: File): Promise<string> {
  const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!key) throw new Error("Image uploads aren't set up yet. Add NEXT_PUBLIC_IMGBB_API_KEY to .env.local.");

  const form = new FormData();
  form.append("image", file);

  let json: { success?: boolean; data?: { display_url?: string; url?: string }; error?: { message?: string } } | null;
  try {
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body: form });
    json = await res.json().catch(() => null);
  } catch {
    throw new Error("The image couldn't be uploaded. Check your connection and try again.");
  }

  const url = json?.data?.display_url ?? json?.data?.url;
  if (!json?.success || !url) throw new Error(json?.error?.message ?? "The image couldn't be uploaded. Try a different file.");
  return url;
}
