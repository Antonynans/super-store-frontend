import { useSelector } from "react-redux";
import { useGetWishlistQuery } from "../../redux/api/wishlistApiSlice";

const FavoritesCount = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const { data: wishlist } = useGetWishlistQuery(undefined, {
    skip: !userInfo,
  });

  const favoriteCount = wishlist?.products.length;

  return (
    <div className="absolute left-1 top-0">
      {favoriteCount > 0 && (
        <span className="px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
          {favoriteCount}
        </span>
      )}
    </div>
  );
};

export default FavoritesCount;
