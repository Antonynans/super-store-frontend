import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppSelector } from "../../redux/store";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import { useAddToCartHandler } from "../../hook/useAddToCartHandler";
import Loader from "../../components/Loader";
import {
  FaBox,
  FaShoppingCart,
  FaStore,
  FaArrowLeft,
  FaCheck,
  FaChevronLeft,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import ProductImage from "../../components/ProductImage";
import { X } from "lucide-react";
import { motion } from "framer-motion";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [selectedIndex, setSelectedIndex] = useState(0);

  const dragStartX = useRef<number | null>(null);

  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId || "");

  const { userInfo } = useAppSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const addToCartHandler = useAddToCartHandler();

  const productImages = product?.images || [];
  const activeImage = productImages[selectedIndex] || "";

  const getErrorMessage = (err: any) => {
    if (err && typeof err === "object" && "data" in err) {
      return err.data?.message || err.data?.error || err.error;
    } else if (err && typeof err === "object" && "message" in err) {
      return err.message;
    } else if (err && typeof err === "object" && "error" in err) {
      return err.error;
    }
    return "An error occurred";
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [productId]);

  useEffect(() => {
    const preload = (index: number) => {
      if (productImages[index]) {
        const img = new Image();
        img.src = productImages[index];
      }
    };
    preload(selectedIndex + 1);
    preload(selectedIndex - 1);
  }, [selectedIndex, productImages]);

  useEffect(() => {
    thumbnailRefs.current[selectedIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [selectedIndex]);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const delta = dragStartX.current - e.clientX;
    const threshold = 50;

    if (delta > threshold) {
      setSelectedIndex((prev) => Math.min(prev + 1, productImages.length - 1));
    } else if (delta < -threshold) {
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    }

    dragStartX.current = null;
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) {
      toast.error("Product ID is missing");
      return;
    }
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success("Review created successfully");
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="bg-surface-subtle min-h-screen py-8">
      {product && (
        <div className="max-w-7xl mx-auto px-4 mb-6">
          <nav className="flex items-center gap-0 text-sm flex-wrap">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-primary font-medium hover:text-primary-dark transition-colors duration-200 mr-3"
            >
              <FaChevronLeft size={12} />
            </button>
            <Link
              to="/shop"
              className="text-primary hover:text-primary-dark font-medium transition-colors duration-200"
            >
              Products
            </Link>
            <FaChevronLeft size={12} className="mx-2" />
            {product.category && (
              <>
                <Link
                  to={`/shop?category=${encodeURIComponent(
                    typeof product.category === "string"
                      ? product.category
                      : product.category?.name || "",
                  )}`}
                  className="text-primary hover:text-primary-dark font-medium transition-colors duration-200 capitalize"
                >
                  {typeof product.category === "string"
                    ? product.category
                    : product.category?.name || "Category"}
                </Link>
                <FaChevronLeft size={12} className="mx-2" />
              </>
            )}
            <span
              className="text-text-primary-secondary font-medium truncate max-w-[200px] sm:max-w-xs md:max-w-sm"
              title={product.name}
            >
              {product.name}
            </span>
          </nav>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <Loader />
        </div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className=" rounded-2xl shadow-xl p-10 text-center relative overflow-hidden">
              <div className="absolute inset-0  pointer-events-none" />

              <div className="relative z-10 mb-6">
                <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-red-100 text-red-500 text-4xl shadow-sm">
                  ⚠️
                </div>
              </div>

              <h1 className="relative z-10 text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
                Product Not Found
              </h1>

              <p className="relative z-10 text-gray-500 text-lg max-w-md mx-auto mb-2">
                {getErrorMessage(error as any) ||
                  "This product may have been removed or is no longer available."}
              </p>

              <p className="relative z-10 text-sm text-gray-400">
                Try exploring similar products or continue shopping.
              </p>

              <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center mt-10">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition"
                >
                  <FaChevronLeft size={16} />
                  Go Back
                </button>

                <Link
                  to="/shop"
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition shadow-md hover:shadow-lg"
                >
                  <FaStore size={16} />
                  Continue Shopping
                </Link>

                <Link
                  to="/"
                  className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg transition"
                >
                  <FaBox size={16} />
                  Home
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      ) : !product ? (
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">
                <X color="red" />
              </div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Product Unavailable
              </h1>
              <p className="text-text-primary-secondary text-lg mb-2">
                This product could not be loaded. Please try again later.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300"
              >
                <FaArrowLeft size={18} />
              </button>
              <Link
                to="/shop"
                className="flex items-center justify-center gap-2 bg-status-success hover:bg-status-success/90 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300"
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
              <div
                className="bg-white lg:h-[38rem] h-96 rounded-lg shadow-lg overflow-hidden mb-6 relative group cursor-grab active:cursor-grabbing select-none"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
              >
                <ProductImage src={activeImage} alt={product.name} />

                {productImages.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 lg:hidden">
                    {productImages.map((_: string, i: number) => (
                      <span
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          i === selectedIndex ? "bg-primary w-3" : "bg-white/60"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {productImages.length > 1 && (
                <div className="h-24 flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory touch-pan-x">
                  {productImages.map((image: string, index: number) => (
                    <button
                      key={image}
                      ref={(el) => (thumbnailRefs.current[index] = el)}
                      type="button"
                      onClick={() => setSelectedIndex(index)}
                      className={`relative min-w-[90px] h-24 flex-shrink-0 snap-start overflow-hidden rounded-lg border-2 bg-white transition-all duration-200 ${
                        index === selectedIndex
                          ? "border-primary"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <ProductImage src={image} alt={product.name} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="h-fit bg-white rounded-lg shadow-lg p-8 flex flex-col justify-between">
              <div>
                <h1 className="md:text-4xl text-2xl font-bold text-text-primary">
                  {product.name}
                </h1>
                <p className="text-text-primary-secondary leading-relaxed mb-4">
                  {product.description}
                </p>
                <div className="flex items-center gap-8 mb-6">
                  <div>
                    <Ratings
                      value={product.rating}
                      text={`${product.numReviews} reviews`}
                    />
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-xs md:flex items-center gap-1">
                      <p className="text-text-primary-secondary font-medium">
                        Added
                      </p>
                      <p className="text-text-primary font-semibold">
                        {moment(product.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-8">
                  <p className="text-text-primary-secondary text-sm mb-2 font-medium">
                    Price
                  </p>
                  <p className="text-3xl font-bold text-primary-secondary">
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
                      In stock <br />
                      <strong>{product.countInStock} items</strong>
                    </span>
                  </div>
                )}

                <div className="flex gap-3 items-center h-[60px]">
                  <button
                    onClick={() =>
                      addToCartHandler(product, qty)
                    }
                    disabled={
                      !product.countInStock || product.countInStock <= 0
                    }
                    className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                      product.countInStock && product.countInStock > 0
                        ? "bg-primary hover:bg-primary-dark text-white hover:shadow-lg"
                        : "bg-text-subtle text-white cursor-not-allowed opacity-60"
                    }`}
                  >
                    <FaShoppingCart size={20} />
                    {product.countInStock && product.countInStock > 0
                      ? "Add to Cart"
                      : "Out of Stock"}
                  </button>
                  <div className="w-20 h-full flex flex-col items-center justify-center relative border border-[#e5e7eb] rounded-lg">
                    <HeartIcon product={product} />
                  </div>
                </div>

                <div className="bg-primary-subtle p-4 rounded-lg space-y-2">
                  <p className="text-sm text-primary-dark flex items-center gap-2">
                    <FaCheck size={14} className="text-status-success" />
                    Free shipping on orders over $50
                  </p>
                  <p className="text-sm text-primary-dark flex items-center gap-2">
                    <FaCheck size={14} className="text-status-success" />
                    30-day money back guarantee
                  </p>
                  <p className="text-sm text-primary-dark flex items-center gap-2">
                    <FaCheck size={14} className="text-status-success" />
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
