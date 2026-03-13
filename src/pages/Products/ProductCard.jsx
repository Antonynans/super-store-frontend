import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useAddToCartMutation } from "../../redux/api/cartApiSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import { useState } from "react";

const ProductCard = ({ p }) => {
  const [hovered, setHovered] = useState(false);
  const [addToCart] = useAddToCartMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const addToCartHandler = async (product, qty) => {
    if (!userInfo) {
      toast.error("Please login to add items to cart", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      return;
    }

    try {
      await addToCart({
        product: product._id,
        qty,
      }).unwrap();
      toast.success("Item added successfully", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add to cart", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  return (
    <Link to={`/product/${p?._id}`}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl  cursor-pointer h-full flex flex-col"
        style={{ transform: hovered ? "translateY(-4px)" : "none" }}
      >
        <div className="relative overflow-hidden bg-gray-100 h-64">
          <img
            className="cursor-pointer w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            src={p?.image}
            alt={p?.name}
          />

          <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {p?.brand || "No Brand"}
          </span>

          <div className="absolute top-3 right-8">
            <HeartIcon product={p} />
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col justify-between">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition">
            {p?.name}
          </h3>

          <Ratings value={p?.rating} text={`${p?.numReviews} reviews`} />

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {p?.description?.substring(0, 60)}...
          </p>

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

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {p?.price?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            </div>
            <div className="">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (p?.countInStock > 0) {
                    addToCartHandler(p, 1);
                  }
                }}
                disabled={p?.countInStock === 0}
                className={`w-full rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 py-2 px-4 ${
                  p?.countInStock === 0
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <AiOutlineShoppingCart size={18} />
                {p?.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
