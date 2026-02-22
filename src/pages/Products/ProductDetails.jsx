import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
  FaArrowLeft,
  FaCheck,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const addToCartHandler = () => {
    if (!product.countInStock || product.countInStock <= 0) {
      toast.error("Product is out of stock", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      return;
    }

    dispatch(addToCart({ ...product, qty }));
    toast.success("Product added to cart", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      {/* Back Button */}
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
          <Message variant="danger">
            {error?.data?.message || error.message}
          </Message>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4">
          {/* Product Main Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Left - Product Image */}
            <div className="flex flex-col">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6 relative group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 lg:h-full object-cover"
                />

                {/* Wishlist Button */}
                <div className="absolute top-4 right-4 z-10">
                  <HeartIcon product={product} />
                </div>

                {/* Stock Badge */}
                {product.countInStock > 0 && (
                  <div className="absolute bottom-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2">
                    <FaCheck size={16} />
                    In Stock
                  </div>
                )}

                {/* Out of Stock Overlay */}
                {product.countInStock <= 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold text-lg">
                      Out of Stock
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Right - Product Info */}
            <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col justify-between">
              {/* Product Name & Rating */}
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                <div className="mb-8">
                  <Ratings
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </div>

                {/* Price */}
                <div className="mb-8">
                  <p className="text-gray-600 text-sm mb-2 font-medium">Price</p>
                  <p className="text-5xl font-bold text-blue-600">
                    ${product.price}
                  </p>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  {product.description}
                </p>

                {/* Product Info Grid */}
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <FaStore className="text-blue-600 mt-1 flex-shrink-0" size={18} />
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Brand</p>
                          <p className="text-gray-900 font-semibold">
                            {product.brand}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <FaClock className="text-blue-600 mt-1 flex-shrink-0" size={18} />
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Added</p>
                          <p className="text-gray-900 font-semibold">
                            {moment(product.createdAt).fromNow()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <FaStar className="text-yellow-400 mt-1 flex-shrink-0" size={18} />
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Rating</p>
                          <p className="text-gray-900 font-semibold">
                            {Math.round(product.rating * 10) / 10}/5
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <FaBox className="text-green-600 mt-1 flex-shrink-0" size={18} />
                        <div>
                          <p className="text-sm text-gray-600 font-medium">In Stock</p>
                          <p className="text-gray-900 font-semibold">
                            {product.countInStock} items
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="space-y-4 border-t pt-8">
                {product.countInStock > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Quantity
                    </label>
                    <select
                      value={qty}
                      onChange={(e) => setQty(parseInt(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-gray-900 font-medium"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  onClick={addToCartHandler}
                  disabled={!product.countInStock || product.countInStock <= 0}
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

                {/* Features */}
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