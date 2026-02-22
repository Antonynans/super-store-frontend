import { useEffect } from "react";
import { FaHeart, FaRegHeart, FaVaadin } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import {
  addToFavorites,
  removeFromFavorites,
  setFavorites,
} from "../../redux/features/favorites/favoriteSlice";

import {
  addFavoriteToLocalStorage,
  getFavoritesFromLocalStorage,
  removeFavoriteFromLocalStorage,
} from "../../Utils/localStorage";

const HeartIcon = ({ product }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites) || [];
  const isFavorite = favorites.some((p) => p._id === product._id);

  useEffect(() => {
    const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
    dispatch(setFavorites(favoritesFromLocalStorage));
  }, []);

  const toggleFavorites = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (isFavorite) {
      dispatch(removeFromFavorites(product));
      toast.error("Item removed from wishlist", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
      removeFavoriteFromLocalStorage(product._id);
    } else {
      dispatch(addToFavorites(product));
      toast.success("Item added to wishlist", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
      });
      addFavoriteToLocalStorage(product);
    }
  };

  return (
    <div
      className="absolute top-2 right-5 cursor-pointer hover:scale-125 transition-transform duration-300 z-10"
      onClick={toggleFavorites}
    >
      {isFavorite ? (
        <FaHeart className="text-pink-500 text-2xl" />
      ) : (
        <FaRegHeart className="text-yellow-400 text-2xl hover:text-pink-500" />
      )}
    </div>
  );
};

export default HeartIcon;
