import { del, put, head } from "@vercel/blob";

export async function uploadEditorImageToBlob(file: File): Promise<string> {
  const filename = `images/${file.name}`;
  const { url } = await put(filename, file.stream(), {
    access: "public",
  });
  return url;
}

export async function uploadImageToBlob(
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

// Generic file upload for any file type, with folder support and existence check
export async function uploadToBlob(
  file: File,
  folder: string = "",
): Promise<{ url: string } | { error: string }> {
  const filename = folder ? `${folder}/${file.name}` : file.name;
  // Check if file exists
  try {
    await head(filename); // Throws if not found
    return { error: "File with the same name already exists." };
  } catch (e) {
    // Not found, continue
    console.log("File not found, continuing", e);
  }
  // Upload
  const { url } = await put(filename, file, {
    access: "public",
    addRandomSuffix: false,
  });
  return { url };
}

export async function downloadFromBlob(url: string): Promise<string> {
  try {
    // Fetch the image from the URL
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Get the image data as an array buffer
    const arrayBuffer = await response.arrayBuffer();

    // Convert array buffer to buffer
    const buffer = Buffer.from(arrayBuffer);

    // Convert buffer to base64
    const base64String = buffer.toString("base64");

    // Get content type from response headers
    const contentType = response.headers.get("content-type") || "image/jpeg";

    // Return complete base64 string with data URI scheme
    return `data:${contentType};base64,${base64String}`;
  } catch (error) {
    console.error("Error downloading image:", error);
    throw error;
  }
}

export async function deleteFromBlob(url: string): Promise<void> {
  try {
    await del(url);
  } catch (error) {
    console.error("Error deleting blob:", error);
    throw error;
  }
}
