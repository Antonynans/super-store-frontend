const getPrimaryImage = (images: string[] = []): string =>
  Array.isArray(images) && images.length > 0 ? images[0] : "";

export default getPrimaryImage;
