import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "../../redux/store";
import { useGetWishlistQuery } from "../../redux/api/wishlistApiSlice";

const FavoritesCount = () => {
  const { userInfo } = useAppSelector((state) => state.auth);

  const { data: wishlist } = useGetWishlistQuery(undefined, {
    skip: !userInfo,
  });

  const favoriteCount = wishlist?.products.length;

  return (
    <div className="absolute left-1 top-0">
      <AnimatePresence mode="wait">
        {favoriteCount && favoriteCount > 0 && (
          <motion.span
            key={favoriteCount}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="absolute -top-1 -left-1.5 bg-pink-500 text-white text-2.5 font-bold rounded-full w-5 h-5 flex items-center justify-center"
          >
            {favoriteCount}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FavoritesCount;
