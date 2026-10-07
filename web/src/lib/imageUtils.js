export const compressImage = (file, callback) => {
  if (!file) return;
  const reader = new FileReader();
  reader.onloadend = () => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 800;
      const MAX_HEIGHT = 800;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
      callback(compressedBase64);
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
};
