import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import { useAddToCartMutation } from "../../redux/api/cartApiSlice";
import Loader from "../../components/Loader";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStore,
  FaArrowLeft,
  FaCheck,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const [addToCart] = useAddToCartMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = async () => {
    if (!userInfo) {
      toast.error("Please login to add items to cart", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      return;
    }

    if (!product.countInStock || product.countInStock <= 0) {
      toast.error("Product is out of stock", {
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
      toast.success("Product added to cart", {
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
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 hover:shadow-lg"
        >
          <FaArrowLeft size={18} />
          Back
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <Loader />
        </div>
      ) : error ? (
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="mb-6">
              <div className="text-6xl text-red-500 mb-4">⚠️</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Product Not Found
              </h1>
              <p className="text-gray-600 text-lg mb-2">
                {error?.data?.message ||
                  error?.data?.error ||
                  "The product you're looking for doesn't exist or has been removed."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300"
              >
                <FaArrowLeft size={18} />
                Go Back
              </button>
              <Link
                to="/shop"
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300"
              >
                <FaStore size={18} />
                Back to Shop
              </Link>
              <Link
                to="/"
                className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300"
              >
                <FaBox size={18} />
                Home Page
              </Link>
            </div>
          </div>
        </div>
      ) : !product ? (
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="mb-6">
              <div className="text-6xl text-yellow-500 mb-4">❌</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Product Unavailable
              </h1>
              <p className="text-gray-600 text-lg mb-2">
                This product could not be loaded. Please try again later.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300"
              >
                <FaArrowLeft size={18} />
                Go Back
              </button>
              <Link
                to="/shop"
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300"
              >
                <FaStore size={18} />
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="flex flex-col">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6 relative group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 lg:h-full object-cover"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col justify-between">
              <div>
                <p className="text-gray-900 text-sm">{product.brand}</p>
                <h1 className="text-4xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {product.description}
                </p>

                <div className="flex items-center gap-8 mb-6">
                  <div className="">
                    <Ratings
                      value={product.rating}
                      text={`${product.numReviews} reviews`}
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="text-xs md:flex items-center gap-1">
                      <p className=" text-gray-600 font-medium">Added</p>
                      <p className="text-gray-900 font-semibold">
                        {moment(product.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-gray-600 text-sm mb-2 font-medium">
                    Price
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    ${product.price}
                  </p>
                </div>
              </div>

              <div className="space-y-4 border-t pt-8">
                {product.countInStock > 0 && (
                  <div className="flex items-center gap-4 mb-7">
                    <div className="flex items-center border border-[#e5e7eb] rounded-[10px] overflow-hidden">
                      <button
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        style={{
                          padding: "10px 16px",
                          border: "none",
                          background: "#f9fafb",
                          cursor: "pointer",
                          fontSize: 18,
                          fontWeight: 700,
                        }}
                      >
                        −
                      </button>
                      <span
                        style={{
                          padding: "10px 20px",
                          fontWeight: 700,
                          fontSize: 16,
                        }}
                      >
                        {qty}
                      </span>
                      <button
                        onClick={() => setQty(qty + 1)}
                        style={{
                          padding: "10px 16px",
                          border: "none",
                          background: "#f9fafb",
                          cursor: "pointer",
                          fontSize: 18,
                          fontWeight: 700,
                        }}
                      >
                        +
                      </button>
                    </div>
                    <span className="text-[#6b7280] text-[13px]">
                      In stock <br />{" "}
                      <strong>{product.countInStock} items</strong>
                    </span>
                  </div>
                )}

                <div className="flex gap-3 items-center h-[60px]">
                  <button
                    onClick={addToCartHandler}
                    disabled={
                      !product.countInStock || product.countInStock <= 0
                    }
                    className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                      product.countInStock && product.countInStock > 0
                        ? "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
                        : "bg-gray-400 text-white cursor-not-allowed opacity-60"
                    }`}
                  >
                    <FaShoppingCart size={20} />
                    {product.countInStock && product.countInStock > 0
                      ? "Add to Cart"
                      : "Out of Stock"}
                  </button>
                  <div className="w-20 h-full flex flex-col items-center justify-center relative border border-[#e5e7eb] rounded-lg ">
                    <HeartIcon product={product} />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm text-blue-900 flex items-center gap-2">
                    <FaCheck size={14} className="text-green-600" />
                    Free shipping on orders over $50
                  </p>
                  <p className="text-sm text-blue-900 flex items-center gap-2">
                    <FaCheck size={14} className="text-green-600" />
                    30-day money back guarantee
                  </p>
                  <p className="text-sm text-blue-900 flex items-center gap-2">
                    <FaCheck size={14} className="text-green-600" />
                    24/7 customer support
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <ProductTabs
              loadingProductReview={loadingProductReview}
              userInfo={userInfo}
              submitHandler={submitHandler}
              rating={rating}
              setRating={setRating}
              comment={comment}
              setComment={setComment}
              product={product}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
