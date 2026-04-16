export const addFavoriteToLocalStorage = (product: { _id: string }) => {
  const favorites = getFavoritesFromLocalStorage();
  if (!favorites.some((p: { _id: string; }) => p._id === product._id)) {
    favorites.push(product);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
};

export const removeFavoriteFromLocalStorage = (productId: string) => {
  const favorites = getFavoritesFromLocalStorage();
  const updateFavorites = favorites.filter(
    (product: { _id: string }) => product._id !== productId,
  );

  localStorage.setItem("favorites", JSON.stringify(updateFavorites));
};

export const getFavoritesFromLocalStorage = () => {
  const favoritesJSON = localStorage.getItem("favorites");
  return favoritesJSON ? JSON.parse(favoritesJSON) : [];
};
