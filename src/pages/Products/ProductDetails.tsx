import { useEffect, useCallback, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppSelector } from "../../redux/store";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import { useAddToCartHandler } from "../../hook/useAddToCartHandler";
import {
  FaShoppingCart,
  FaStore,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { X } from "lucide-react";
import moment from "moment";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import ProductImage from "../../components/ProductImage";
import { FiAlertTriangle } from "react-icons/fi";
import ProductDetailsSkeleton from "../../components/skeletons/ProductDetails";

function ThumbStrip({
  images,
  selectedIndex,
  onThumbClick,
  productName,
}: {
  images: string[];
  selectedIndex: number;
  onThumbClick: (i: number) => void;
  productName: string;
}) {
  const [emblaRef] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
    axis: "x",
  });

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-2.5 py-1">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onThumbClick(i)}
            className={`relative flex-shrink-0 w-[68px] h-[68px] rounded-xl overflow-hidden transition-all duration-200 border-2 ${
              i === selectedIndex
                ? "border-primary shadow-md scale-105"
                : "border-transparent opacity-50 hover:opacity-80 hover:scale-[1.02]"
            }`}
            aria-label={`View image ${i + 1}`}
          >
            <ProductImage src={src} alt={`${productName} thumbnail ${i + 1}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

function ImageCarousel({
  images,
  productName,
  product,
}: {
  images: string[];
  productName: string;
  product: any;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: images.length > 1,
    duration: 25,
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi],
  );

  return (
    <div className="space-y-3">
      <div className="relative rounded-2xl overflow-hidden bg-white border border-border-default shadow-sm group">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {images.map((src, i) => (
              <div
                key={i}
                className="relative flex-shrink-0 w-full"
                style={{ aspectRatio: "1 / 1" }}
              >
                <ProductImage
                  src={src}
                  alt={`${productName} — image ${i + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              aria-label="Previous image"
              disabled={!canScrollPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/85 backdrop-blur-md border border-border-default flex items-center justify-center shadow transition-all duration-200 opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-105 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <FaChevronLeft size={12} className="text-text-primary" />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next image"
              disabled={!canScrollNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/85 backdrop-blur-md border border-border-default flex items-center justify-center shadow transition-all duration-200 opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-105 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <FaChevronRight size={12} className="text-text-primary" />
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 lg:hidden">
            {images.map((_: string, i: number) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === selectedIndex
                    ? "w-5 h-1.5 bg-primary"
                    : "w-1.5 h-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 z-10 hidden lg:block bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full select-none">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <ThumbStrip
          images={images}
          selectedIndex={selectedIndex}
          onThumbClick={scrollTo}
          productName={productName}
        />
      )}
    </div>
  );
}

function ErrorState({
  message,
  onBack,
}: {
  message?: string;
  onBack: () => void;
}) {
  return (
    <motion.div
      className="max-w-lg mx-auto px-4 py-20 text-center"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center text-3xl">
        <FiAlertTriangle />
      </div>
      <h1 className="text-2xl font-bold text-text-primary mb-2">
        Product not found
      </h1>
      <p className="text-text-primary-secondary mb-8 text-sm">
        {message ||
          "This product may have been removed or is no longer available."}
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-hover text-text-primary font-medium transition hover:bg-surface-active border border-border-default"
        >
          <FaChevronLeft size={11} /> Go back
        </button>
        <Link
          to="/shop"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold transition hover:bg-primary-dark shadow-sm"
        >
          <FaStore size={13} /> Browse products
        </Link>
      </div>
    </motion.div>
  );
}

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
  } = useGetProductDetailsQuery(productId || "");
  const { userInfo } = useAppSelector((state) => state.auth);
  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();
  const addToCartHandler = useAddToCartHandler();

  const getErrorMessage = (err: any) => {
    if (err && "data" in err)
      return err.data?.message || err.data?.error || err.error;
    if (err && "message" in err) return err.message;
    return "An error occurred";
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
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-surface-subtle min-h-screen">
        <ErrorState
          message={getErrorMessage(error as any)}
          onBack={() => navigate(-1)}
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-surface-subtle min-h-screen flex justify-center items-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-border-default p-12 text-center max-w-md w-full">
          <X className="mx-auto mb-4 text-red-400" size={36} />
          <h1 className="text-xl font-bold text-text-primary mb-2">
            Product unavailable
          </h1>
          <p className="text-text-primary-secondary text-sm mb-6">
            This product could not be loaded.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl bg-surface-hover border border-border-default text-text-primary font-medium transition hover:bg-surface-active"
            >
              Go back
            </button>
            <Link
              to="/shop"
              className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold transition hover:bg-primary-dark"
            >
              Browse products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images: string[] = product.images || [];
  const inStock = product.countInStock && product.countInStock > 0;
  const categoryName =
    typeof product.category === "string"
      ? product.category
      : product.category?.name || "";

  return (
    <div className="bg-surface-subtle min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-4">
        <nav
          className="flex items-center gap-1.5 text-sm flex-wrap"
          aria-label="Breadcrumb"
        >
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg text-text-primary-secondary hover:text-text-primary hover:bg-surface-hover transition"
            aria-label="Go back"
          >
            <FaChevronLeft size={11} />
          </button>
          <Link
            to="/shop"
            className="text-text-primary-secondary hover:text-primary transition font-medium"
          >
            Products
          </Link>
          {categoryName && (
            <>
              <FaChevronRight size={10} className="text-text-subtle" />
              <Link
                to={`/shop?category=${encodeURIComponent(categoryName)}`}
                className="text-text-primary-secondary hover:text-primary transition font-medium capitalize"
              >
                {categoryName}
              </Link>
            </>
          )}
          <FaChevronRight size={10} className="text-text-subtle" />
          <span
            className="text-text-primary font-medium truncate max-w-[200px] sm:max-w-xs"
            title={product.name}
          >
            {product.name}
          </span>
        </nav>
      </div>

      <motion.div
        className="max-w-7xl mx-auto px-4 pb-16"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-14">
          <div className="lg:sticky lg:top-6 self-start">
            <ImageCarousel
              images={images}
              productName={product.name}
              product={product}
            />
          </div>

          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border border-border-default p-6 md:p-8">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary leading-snug">
                  {product.name}
                </h1>
                {inStock ? (
                  <span className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                    <FaCheck size={9} /> In stock
                  </span>
                ) : (
                  <span className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-100">
                    Out of stock
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 mb-5 flex-wrap">
                <Ratings
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
                <span className="text-xs text-text-primary-secondary">
                  Added {moment(product.createdAt).fromNow()}
                </span>
              </div>

              <p className="text-text-primary-secondary leading-relaxed text-sm md:text-base">
                {product.description}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-border-default p-6 md:p-8 space-y-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-text-subtle mb-1">
                  Price
                </p>
                <p className="text-4xl font-bold text-primary-secondary">
                  ${product.price}
                </p>
              </div>

              {inStock && (
                <div className="flex items-center gap-4">
                  <div className="inline-flex items-center rounded-xl border border-border-default overflow-hidden">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-10 h-10 flex items-center justify-center text-xl font-medium text-text-primary bg-surface-subtle hover:bg-surface-hover active:scale-95 transition"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-base font-bold text-text-primary select-none">
                      {qty}
                    </span>
                    <button
                      onClick={() =>
                        setQty(Math.min(product.countInStock, qty + 1))
                      }
                      className="w-10 h-10 flex items-center justify-center text-xl font-medium text-text-primary bg-surface-subtle hover:bg-surface-hover active:scale-95 transition"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-sm text-text-primary-secondary">
                    <strong className="text-text-primary font-semibold">
                      {product.countInStock}
                    </strong>{" "}
                    available
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => addToCartHandler(product, qty)}
                  disabled={!inStock}
                  className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl font-semibold text-[15px] transition-all duration-200 ${
                    inStock
                      ? "bg-primary hover:bg-primary-dark active:scale-[0.98] text-white shadow-sm hover:shadow-md"
                      : "bg-surface-subtle text-text-subtle cursor-not-allowed"
                  }`}
                >
                  <FaShoppingCart size={16} />
                  {inStock ? "Add to cart" : "Out of stock"}
                </button>
                <div className="w-14 h-14 flex items-center justify-center rounded-xl border border-border-default bg-surface-subtle hover:bg-surface-hover transition cursor-pointer">
                  <HeartIcon product={product} />
                </div>
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-border-default">
                {[
                  "Free shipping on orders over $50",
                  "30-day money back guarantee",
                  "24/7 customer support",
                ].map((perk) => (
                  <li
                    key={perk}
                    className="flex items-center gap-2.5 text-sm text-text-primary-secondary"
                  >
                    <span className="w-4 h-4 rounded-full bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
                      <FaCheck size={8} className="text-status-success" />
                    </span>
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 bg-white rounded-2xl shadow-sm border border-border-default p-6 md:p-8">
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
      </motion.div>
    </div>
  );
};

export default ProductDetails;
