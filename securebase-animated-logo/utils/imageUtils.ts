export const urlToBase64 = async (url: string): Promise<{ base64: string; mimeType: string }> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const blob = await response.blob();
    return blobToBase64(blob);
  } catch (error) {
    // Fallback for CORS issues: We cannot fetch typical external URLs directly in browser JS due to CORS.
    // In a real app, this would use a proxy.
    // We will throw a specific error to let the UI know to ask for upload.
    console.error("Fetch failed (likely CORS):", error);
    throw new Error("CORS_ERROR");
  }
};

export const blobToBase64 = (blob: Blob): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve({ base64, mimeType: blob.type });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
