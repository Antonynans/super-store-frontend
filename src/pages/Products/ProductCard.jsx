import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
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

  return (
    <Link to={`/product/${p._id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer h-full flex flex-col">
        <div className="relative overflow-hidden bg-gray-100 h-64">
          <img
            className="cursor-pointer w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            src={p.image}
            alt={p.name}
          />

          <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {p?.brand || "No Brand"}
          </span>

          <div className="absolute top-3 right-3">
            <HeartIcon product={p} />
          </div>

          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
            <button
              onClick={(e) => {
                e.preventDefault();
                if (p?.countInStock > 0) {
                  addToCartHandler(p, 1);
                }
              }}
              disabled={p?.countInStock === 0}
              className={`${
                p?.countInStock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition`}
            >
              <AiOutlineShoppingCart size={20} />
              {p?.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col justify-between">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition">
            {p?.name}
          </h3>

          <Ratings value={p.rating} text={`${p.numReviews} reviews`} />

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {p?.description?.substring(0, 60)}...
          </p>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold text-gray-900">
              {p?.price?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </span>
          </div>

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
                if (p?.countInStock > 0) {
                  addToCartHandler(p, 1);
                }
              }}
              disabled={p?.countInStock === 0}
              className={`flex-1 py-2 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-1 ${
                p?.countInStock === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed border-2 border-gray-300"
                  : "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              }`}
            >
              <AiOutlineShoppingCart size={18} />
              {p?.countInStock === 0 ? "Out" : "Add"}
            </button>
          </div>

          <div className="hidden md:flex flex-col gap-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                if (p?.countInStock > 0) {
                  addToCartHandler(p, 1);
                }
              }}
              disabled={p?.countInStock === 0}
              className={`w-full py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                p?.countInStock === 0
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <AiOutlineShoppingCart size={18} />
              {p?.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
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
