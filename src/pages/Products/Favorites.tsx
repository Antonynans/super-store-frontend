import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/store";
import { FaHeart, FaChevronLeft } from "react-icons/fa";
import { useGetWishlistQuery } from "../../redux/api/wishlistApiSlice";
import ProductCard from "./ProductCard";
import { Product } from "../../types";
import { motion, AnimatePresence } from "framer-motion";
import WishlistSkeleton from "../../components/skeletons/WishlistSkeleton";

interface FavProps {
  showHeader?: boolean;
  setShowHeader?: (value: boolean) => void;
}
const Favorites = ({ showHeader = true, setShowHeader }: FavProps) => {
  const { userInfo } = useAppSelector((state) => state.auth);

  const navigate = useNavigate();

  const { data: wishlist, isLoading } = useGetWishlistQuery(undefined, {
    skip: !userInfo,
  });

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-surface-muted flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <FaHeart className="mx-auto h-20 w-20 text-border-dark mb-6" />
          <h1 className="text-2xl font-bold text-text-primary mb-3">
            Sign in to view your wishlist
          </h1>
          <p className="text-text-secondary mb-6">
            Save your favorite items and access them anytime
          </p>
          <Link
            to="/login"
            className="inline-block bg-primary text-white font-semibold py-3 px-8 rounded-lg hover:opacity-90 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <WishlistSkeleton />;
  }

  const products = Array.isArray(wishlist?.products) ? wishlist.products : [];

  return (
    <div className="min-h-screen bg-surface-muted">
      {showHeader && (
        <div className="bg-white border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center gap-2 text-sm text-text-secondary mb-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-primary font-medium hover:text-primary-dark transition-colors duration-200 mr-1"
              >
                <FaChevronLeft size={12} />
              </button>
              <Link to="/" className="hover:text-primary transition">
                Home
              </Link>
              <FaChevronLeft size={12} />
              <Link to="/shop" className="hover:text-primary transition">
                Shop
              </Link>
              <FaChevronLeft size={12} />
              <span className="text-text-primary font-medium">Wishlist</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-red-50">
                <FaHeart className="text-danger text-xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text-primary">
                  My Wishlist
                </h1>
                <p className="text-text-secondary text-sm mt-1">
                  {products.length === 0
                    ? "No saved items yet"
                    : `${products.length} saved ${
                        products.length === 1 ? "item" : "items"
                      }`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-10">
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <FaHeart className="mx-auto h-20 w-20 text-border-dark mb-6" />
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-text-secondary mb-6">
              Start exploring and save items you love ❤️
            </p>
            <Link
              to="/shop"
              className="inline-block bg-primary text-white font-semibold py-3 px-8 rounded-lg hover:opacity-90 transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-text-secondary">
                Showing{" "}
                <span className="font-semibold text-primary">
                  {products.length}
                </span>{" "}
                items
              </p>
            </div>

            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {products.map((product: Product) => (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      scale: 0.8,
                      y: -20,
                      transition: { duration: 0.25 },
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 120,
                      damping: 15,
                    }}
                    className="group"
                  >
                    <div className="transition-transform duration-300 group-hover:-translate-y-1">
                      <ProductCard p={product} />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;
