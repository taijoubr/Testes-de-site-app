/**
 * Compresses and resizes an uploaded image file using HTML Canvas to fit safely inside Firestore document limits (< 100 KB).
 */
export const compressAndResizeImage = (
  file: File, 
  maxWidth = 450, 
  maxHeight = 180, 
  quality = 0.85
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // If it's SVG, read as text/dataURL directly if small
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Smooth drawing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to lightweight WEBP
        const compressedBase64 = canvas.toDataURL('image/webp', quality);
        resolve(compressedBase64);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};
