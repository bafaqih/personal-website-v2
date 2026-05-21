export function cropToSquare(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get 2d context for canvas"));
          return;
        }

        const size = Math.min(img.width, img.height);
        const x = (img.width - size) / 2;
        const y = (img.height - size) / 2;

        const targetSize = Math.min(size, 1080);
        canvas.width = targetSize;
        canvas.height = targetSize;

        // Draw cropped image to canvas
        ctx.drawImage(
          img,
          x,
          y,
          size,
          size,
          0,
          0,
          targetSize,
          targetSize
        );

        let outputType = file.type;
        let name = file.name;

        // Convert SVG to PNG since SVG is vector and cannot be cropped/edited as raw vector easily on canvas
        if (file.type === "image/svg+xml") {
          outputType = "image/png";
          name = file.name.replace(/\.svg$/i, ".png");
        }

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas to Blob conversion failed"));
              return;
            }
            const croppedFile = new File([blob], name, {
              type: outputType,
              lastModified: Date.now(),
            });
            resolve(croppedFile);
          },
          outputType,
          0.9 // Quality: 90%
        );
      };
      img.onerror = (err) => {
        reject(new Error("Failed to load image: " + err));
      };
    };
    reader.onerror = (err) => {
      reject(new Error("Failed to read file: " + err));
    };
  });
}
