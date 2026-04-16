import { useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import { toast } from "react-toastify";

import {
  addToFavorites,
  removeFromFavorites,
  setFavoritesFromBackend,
} from "../../redux/features/favorites/favoriteSlice";

import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetWishlistQuery,
} from "../../redux/api/wishlistApiSlice";
import { Product } from "../../types";

const HeartIcon = ({ product }: { product: Product }) => {
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.auth);
  const favorites = useAppSelector((state) => state.favorites) || [];
  const isFavorite = favorites.some((p) => p?._id === product?._id);

  const [addToWishlist, { isLoading: addingToWishlist }] =
    useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: removingFromWishlist }] =
    useRemoveFromWishlistMutation();
  const { data: wishlist } = useGetWishlistQuery(undefined, {
    skip: !userInfo,
  });

  useEffect(() => {
    if (userInfo && wishlist?.products) {
      dispatch(setFavoritesFromBackend(wishlist));
    }
  }, [wishlist, userInfo, dispatch]);

  const toggleFavorites = async (e: {
    stopPropagation: () => void;
    preventDefault: () => void;
  }) => {
    e.stopPropagation();
    e.preventDefault();

    if (!userInfo) {
      toast.error("Please login to add items to wishlist", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      return;
    }

    try {
      if (isFavorite) {
        await removeFromWishlist(product?._id);
        dispatch(removeFromFavorites(product));
        toast.success("Item removed from wishlist", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      } else {
        await addToWishlist({ productId: product?._id });
        dispatch(addToFavorites(product));
        toast.success("Item added to wishlist", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      }
    } catch (error: any) {
      toast.error(
        (error as any)?.data?.message || "Failed to update wishlist",
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        },
      );
    }
  };

  const isLoading = addingToWishlist || removingFromWishlist;

  return (
    <div
      className={`absolute cursor-pointer hover:scale-125 transition-all duration-300 z-10 ${
        isLoading ? "opacity-50 pointer-events-none" : ""
      }`}
      onClick={toggleFavorites}
    >
      {isFavorite ? (
        <FaHeart className="text-pink-500 text-2xl" />
      ) : (
        <FaRegHeart className="text-accent text-2xl hover:text-pink-500" />
      )}
    </div>
  );
};

export default HeartIcon;
