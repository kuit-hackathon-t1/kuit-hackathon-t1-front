import { useEffect, useState } from "react";

import { getLocalImage } from "@/features/collection/lib/localImageStorage";

export function useLocalImageUrl(imageId?: string | null) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    async function loadImage() {
      setImageUrl(null);
      if (!imageId) return;

      setIsLoading(true);
      try {
        const localImage = await getLocalImage(imageId);
        if (!localImage || cancelled) return;
        objectUrl = URL.createObjectURL(localImage.blob);
        setImageUrl(objectUrl);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadImage();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [imageId]);

  return { imageUrl, isLoading };
}
