import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/store";
import { FaHeart, FaArrowLeft } from "react-icons/fa";
import { useGetWishlistQuery } from "../../redux/api/wishlistApiSlice";
import ProductCard from "./ProductCard";
import { Product } from "../../types";

const Favorites = () => {
  const navigate = useNavigate();
  const { userInfo } = useAppSelector((state) => state.auth);

  const { data: wishlist } = useGetWishlistQuery(undefined, {
    skip: !userInfo,
  });

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-surface-muted flex items-center justify-center">
        <div className="text-center">
          <FaHeart className="mx-auto h-24 w-24 text-border-dark mb-6" />
          <h1 className="text-2xl font-bold text-text-primary mb-4">
            Please log in to view your favorites
          </h1>
          <Link
            to="/login"
            className="inline-block bg-primary hover:bg-primary text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const products = Array.isArray(wishlist?.products) ? wishlist.products : [];

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-primary hover:text-primary font-medium mb-4 transition-colors"
          >
            <FaArrowLeft size={18} />
            Back
          </button>
          <div className="flex items-center gap-3 mb-2">
            <FaHeart className="text-danger text-3xl" />
            <h1 className="text-4xl font-bold text-text-primary">
              My Favorites
            </h1>
          </div>
          <p className="text-text-secondary">
            {products.length === 0
              ? "Start adding products to your favorites"
              : `You have ${products.length} favorite ${
                  products.length === 1 ? "item" : "items"
                }`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-8">
              <FaHeart className="mx-auto h-24 w-24 text-border-dark" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              No favorites yet
            </h2>
            <p className="text-text-secondary mb-8">
              Start exploring and add your favorite products here
            </p>
            <Link
              to="/shop"
              className="inline-block bg-primary hover:bg-primary text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-text-secondary">
                Showing{" "}
                <span className="font-bold text-primary">
                  {products.length}
                </span>{" "}
                favorite {products.length === 1 ? "product" : "products"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product: Product) => (
                <div key={product._id} className="relative group">
                  <ProductCard p={product} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;
