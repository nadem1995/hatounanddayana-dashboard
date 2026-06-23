// composables/useImageConverter.ts
export const useImageConverter = () => {
  const urlToFile = async (
    url: string,
    filename?: string
  ): Promise<File | null> => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch image");

      const blob = await response.blob();
      const name = filename || url.split("/").pop() || "image.jpg";

      return new File([blob], name, { type: blob.type });
    } catch (error) {
      console.error("Error converting URL to File:", error);
      return null;
    }
  };

  return { urlToFile };
};
