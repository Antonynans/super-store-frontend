import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";
import { FaHeart, FaArrowLeft } from "react-icons/fa";

const Favorites = () => {
  const navigate = useNavigate();
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors"
          >
            <FaArrowLeft size={18} />
            Back
          </button>
          <div className="flex items-center gap-3 mb-2">
            <FaHeart className="text-red-500 text-3xl" />
            <h1 className="text-4xl font-bold text-gray-900">My Favorites</h1>
          </div>
          <p className="text-gray-600">
            {favorites.length === 0
              ? "Start adding products to your favorites"
              : `You have ${favorites.length} favorite ${
                  favorites.length === 1 ? "item" : "items"
                }`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-8">
              <FaHeart className="mx-auto h-24 w-24 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No favorites yet
            </h2>
            <p className="text-gray-600 mb-8">
              Start exploring and add your favorite products here
            </p>
            <Link
              to="/shop"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing{" "}
                <span className="font-bold text-blue-600">
                  {favorites.length}
                </span>{" "}
                favorite {favorites.length === 1 ? "product" : "products"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {favorites.map((product) => (
                <div key={product._id}>
                  <Product product={product} />
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
