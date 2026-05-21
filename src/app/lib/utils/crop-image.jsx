export default function cropImageByRatio(widthRatio, heightRatio, file) {
  if (file.type === "image/svg+xml") return file;
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => (img.src = e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);

    img.onload = () => {
      const targetRatio = widthRatio / heightRatio;
      const imgRatio = img.width / img.height;

      let cropWidth, cropHeight, sx, sy;

      if (imgRatio > targetRatio) {
        // Wider than target → crop width
        cropHeight = img.height;
        cropWidth = cropHeight * targetRatio;
        sx = (img.width - cropWidth) / 2;
        sy = 0;
      } else {
        // Taller than target → crop height
        cropWidth = img.width;
        cropHeight = cropWidth / targetRatio;
        sx = 0;
        sy = (img.height - cropHeight) / 2;
      }

      // Step 1: Crop into canvas
      const canvas = document.createElement("canvas");
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(img, sx, sy, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

      // Step 2: Resize if largest side > 1024
      let finalWidth = cropWidth;
      let finalHeight = cropHeight;

      if (Math.max(cropWidth, cropHeight) > 1024) {
        if (cropWidth >= cropHeight) {
          finalHeight = (1024 / cropWidth) * cropHeight;
          finalWidth = 1024;
        } else {
          finalWidth = (1024 / cropHeight) * cropWidth;
          finalHeight = 1024;
        }
      }

      // If resizing needed → draw into a new canvas
      const outputCanvas = document.createElement("canvas");
      outputCanvas.width = finalWidth;
      outputCanvas.height = finalHeight;
      const outputCtx = outputCanvas.getContext("2d");
      outputCtx.drawImage(canvas, 0, 0, finalWidth, finalHeight);

      outputCanvas.toBlob((blob) => {
        const newFile = new File([blob], file.name, { type: file.type });
        resolve(newFile);
      }, file.type);
    };
  });
};