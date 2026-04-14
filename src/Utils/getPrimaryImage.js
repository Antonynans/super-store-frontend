const getPrimaryImage = (images = []) =>
  Array.isArray(images) && images.length > 0 ? images[0] : "";

export default getPrimaryImage;
