import { SetStateAction, useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import ProductCard from "./ProductCard";
import Loader from "../../components/Loader";
import { FaStar, FaComments, FaBox } from "react-icons/fa";
import { Product, User } from "../../types";
import Select from "react-select";

type RatingOption = {
  value: number;
  label: string;
};

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}: {
  loadingProductReview: boolean;
  userInfo: User;
  submitHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  rating: number;
  setRating: (rating: number) => void;
  comment: string;
  setComment: (comment: string) => void;
  product: Product;
}) => {
  const { data, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);

  if (isLoading) {
    return <Loader />;
  }

  const handleTabClick = (tabNumber: SetStateAction<number>) => {
    setActiveTab(tabNumber);
  };

  const ratingOptions = [
    { value: 1, label: "⭐ Inferior" },
    { value: 2, label: "⭐⭐ Decent" },
    { value: 3, label: "⭐⭐⭐ Great" },
    { value: 4, label: "⭐⭐⭐⭐ Excellent" },
    { value: 5, label: "⭐⭐⭐⭐⭐ Exceptional" },
  ];

  const customStyles = {
    control: (base: any) => ({
      ...base,
      padding: "6px",
      borderRadius: "0.5rem",
      borderColor: "#e5e7eb",
    }),
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap border-b-2 border-border mb-8">
        <button
          onClick={() => handleTabClick(1)}
          className={`px-6 py-4 font-semibold text-lg transition-all border-b-4 ${
            activeTab === 1
              ? "border-primary text-primary"
              : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
        >
          <div className="flex items-center gap-2">
            <FaStar size={18} />
            Write Review
          </div>
        </button>

        <button
          onClick={() => handleTabClick(2)}
          className={`px-6 py-4 font-semibold text-lg transition-all border-b-4 ${
            activeTab === 2
              ? "border-primary text-primary"
              : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
        >
          <div className="flex items-center gap-2">
            <FaComments size={18} />
            All Reviews ({product.reviews?.length || 0})
          </div>
        </button>

        <button
          onClick={() => handleTabClick(3)}
          className={`px-6 py-4 font-semibold text-lg transition-all border-b-4 ${
            activeTab === 3
              ? "border-primary text-primary"
              : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
        >
          <div className="flex items-center gap-2">
            <FaBox size={18} />
            Related Products
          </div>
        </button>
      </div>

      <div className="w-full">
        {activeTab === 1 && (
          <div className="bg-surface-muted rounded-lg p-8">
            {userInfo ? (
              <form onSubmit={submitHandler} className="max-w-2xl">
                <div className="mb-6">
                  <label
                    htmlFor="rating"
                    className="block text-lg font-semibold text-text-primary mb-3"
                  >
                    Your Rating
                  </label>
                  <Select<RatingOption>
                    styles={customStyles}
                    inputId="rating"
                    options={ratingOptions}
                    value={
                      ratingOptions.find((opt) => opt.value === rating) || null
                    }
                    onChange={(selectedOption) =>
                      setRating(selectedOption?.value || 0)
                    }
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="comment"
                    className="block text-lg font-semibold text-text-primary mb-3"
                  >
                    Your Comment
                  </label>
                  <textarea
                    id="comment"
                    rows={5}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="w-full px-4 py-3 border-2 border-border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-text-primary font-medium resize-none"
                  />
                  <p className="text-sm text-text-secondary mt-2">
                    {comment.length}/500 characters
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className={`px-8 py-3 rounded-lg font-bold text-white transition-all ${
                    loadingProductReview
                      ? "bg-text-subtle cursor-not-allowed opacity-60"
                      : "bg-primary hover:bg-primary hover:shadow-lg"
                  }`}
                >
                  {loadingProductReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            ) : (
              <div className="bg-primary-subtle border-l-4 border-primary p-6 rounded">
                <p className="text-lg text-primary-dark">
                  Please{" "}
                  <Link
                    to="/login"
                    className="text-primary font-bold hover:text-primary-dark underline"
                  >
                    sign in
                  </Link>{" "}
                  to write a review
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 2 && (
          <div>
            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-4">
                {product.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-white border border-border rounded-lg p-6 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-text-primary text-lg">
                          {review.name}
                        </h3>
                        <p className="text-sm text-text-secondary">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Ratings value={review.rating} />
                      </div>
                    </div>

                    <p className="text-text-secondary leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-accent-subtle border border-accent-subtle rounded-lg p-8 text-center">
                <FaComments className="mx-auto text-accent mb-4" size={40} />
                <p className="text-lg text-accent-dark font-medium">
                  No reviews yet. Be the first to review this product!
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 3 && (
          <div>
            {!data ? (
              <Loader />
            ) : data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.slice(0, 8).map((relatedProduct) => (
                  <div key={relatedProduct._id}>
                    <ProductCard p={relatedProduct} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-primary-subtle border border-primary-subtle rounded-lg p-8 text-center">
                <FaBox className="mx-auto text-primary mb-4" size={40} />
                <p className="text-lg text-primary-dark font-medium">
                  No related products available
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
