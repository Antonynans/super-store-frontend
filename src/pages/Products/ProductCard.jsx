import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import {
  useGetProductDetailsQuery,
} from "../../redux/api/productApiSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(p._id);

  return (
    <Link to={`/product/${p._id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer h-full flex flex-col">
        {/* Product Image Section */}
        <div className="relative overflow-hidden bg-gray-100 h-64">
          <img
            className="cursor-pointer w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            src={p.image}
            alt={p.name}
          />

          {/* Brand Badge */}
          <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {p?.brand || "No Brand"}
          </span>

          {/* Wishlist Icon */}
          <div className="absolute top-3 right-3">
            <HeartIcon product={p} />
          </div>

          {/* Add to Cart Overlay (Desktop) */}
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCartHandler(p, 1);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
            >
              <AiOutlineShoppingCart size={20} />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Product Info Section */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          {/* Product Name */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition">
            {p?.name}
          </h3>

          {/* Rating */}
         <Ratings
                  value={p.rating}
                  text={`${p.numReviews} reviews`}
                />

          {/* Description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {p?.description?.substring(0, 60)}...
          </p>

          {/* Price Section */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold text-gray-900">
              {p?.price?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </span>
          </div>

          {/* Stock Status */}
          <div className="mb-4">
            {p?.countInStock > 0 ? (
              <span className="text-xs text-green-600 font-semibold">
                ✓ In Stock
              </span>
            ) : (
              <span className="text-xs text-red-600 font-semibold">
                Out of Stock
              </span>
            )}
          </div>

          {/* Buttons - Mobile Only */}
          <div className="flex gap-2 md:hidden">
            <Link
              to={`/product/${p._id}`}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-sm transition text-center"
            >
              Details
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCartHandler(p, 1);
              }}
              className="flex-1 border-2 border-blue-600 text-blue-600 py-2 rounded-lg font-semibold text-sm hover:bg-blue-50 transition flex items-center justify-center gap-1"
            >
              <AiOutlineShoppingCart size={18} />
              Add
            </button>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex flex-col gap-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCartHandler(p, 1);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              <AiOutlineShoppingCart size={18} />
              Add to Cart
            </button>
            <Link
              to={`/product/${p._id}`}
              className="w-full border-2 border-blue-600 text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-50 transition text-center"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;