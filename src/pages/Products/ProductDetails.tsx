import { useEffect, useState } from "react";
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
} from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import BlurImage from "../../components/BlurImage";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

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
  const activeImage = selectedImage || productImages[0] || "";

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
    setSelectedImage("");
  }, [productId]);

  useEffect(() => {
    if (activeImage) {
      const img = new Image();
      img.src = activeImage;
    }
  }, [activeImage]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId) {
      toast.error("Product ID is missing");
      return;
    }

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
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="bg-surface-subtle min-h-screen py-8">
      {/* Breadcrumb Nav */}
      {product && (
        <div className="max-w-7xl mx-auto px-4 mb-6">
          <nav className="flex items-center gap-0 text-sm flex-wrap">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-primary font-medium hover:text-primary-dark transition-colors duration-200 mr-3"
            >
              <IoIosArrowBack size={12} />
            </button>

            <Link
              to="/shop"
              className="text-primary hover:text-primary-dark font-medium transition-colors duration-200"
            >
              Products
            </Link>

            <span className="mx-2 text-text-subtle select-none">|</span>

            {/* <Link
              to="/shop"
              className="text-primary hover:text-primary-dark font-medium transition-colors duration-200"
            >
              Categories
            </Link> */}

            {/* <span className="mx-2 text-text-subtle select-none">|</span> */}

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
                <span className="mx-2 text-text-subtle select-none">|</span>
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
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="mb-6">
              <div className="text-6xl text-status-error mb-4">⚠️</div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Product Not Found
              </h1>
              <p className="text-text-primary-secondary text-lg mb-2">
                {getErrorMessage(error as any)}
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
                Back to Shop
              </Link>
              <Link
                to="/"
                className="flex items-center justify-center gap-2 bg-text-primary-secondary hover:bg-text-secondary text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300"
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
              <div className="text-6xl text-accent-subtle0 mb-4">❌</div>
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
              <div className="bg-white lg:h-[38rem] h-96 rounded-lg shadow-lg overflow-hidden mb-6 relative group">
                <BlurImage
                  src={activeImage}
                  alt={product.name}
                  className="w-full transition duration-700 group-hover:scale-105"
                />
              </div>

              {productImages.length > 1 && (
                <div className="h-24 flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                  {productImages.map((image: string) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      className={`min-w-[90px] flex-shrink-0 snap-start overflow-hidden rounded-lg border-2 bg-white ${
                        activeImage === image
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                    >
                      <BlurImage
                        src={image}
                        alt={product.name}
                        className="h-24 w-full"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="h-fit bg-white rounded-lg shadow-lg p-8 flex flex-col justify-between">
              <div>
                {/* <p className="text-text-primary text-sm">{product.brand}</p> */}
                <h1 className="md:text-4xl text-2xl font-bold text-text-primary">
                  {product.name}
                </h1>
                <p className="text-text-primary-secondary leading-relaxed mb-4">
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
                      <p className=" text-text-primary-secondary font-medium">
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
                      In stock <br />{" "}
                      <strong>{product.countInStock} items</strong>
                    </span>
                  </div>
                )}

                <div className="flex gap-3 items-center h-[60px]">
                  <button
                    onClick={() =>
                      addToCartHandler(product._id, qty, true, product)
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
                  <div className="w-20 h-full flex flex-col items-center justify-center relative border border-[#e5e7eb] rounded-lg ">
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
