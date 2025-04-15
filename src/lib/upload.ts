import { put } from "@vercel/blob";

export async function uploadToBlob(
  base64Image: string,
  filename: string,
): Promise<string> {
  // Remove the data:image/xyz;base64, prefix
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

  // Convert base64 to buffer
  const buffer = Buffer.from(base64Data, "base64");

  // Create a Blob from the buffer
  const blob = new Blob([buffer]);

  // Upload to Vercel Blob
  const { url } = await put(filename, blob, {
    access: "public",
  });

  return url;
}
