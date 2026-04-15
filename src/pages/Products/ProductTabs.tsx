import { SetStateAction, useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import ProductCard from "./ProductCard";
import Loader from "../../components/Loader";
import { FaStar, FaComments, FaBox } from "react-icons/fa";
import { Product, User } from "../../types";

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

  return (
    <div className="w-full">
      <div className="flex flex-wrap border-b-2 border-border mb-8">
        <button
          onClick={() => handleTabClick(1)}
          className={`px-6 py-4 font-semibold text-lg transition-all border-b-4 ${
            activeTab === 1
              ? "border-primary text-primary"
              : "border-transparent text-text-secondary hover:text-gray-900"
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
              : "border-transparent text-text-secondary hover:text-gray-900"
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
              : "border-transparent text-text-secondary hover:text-gray-900"
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
                    className="block text-lg font-semibold text-gray-900 mb-3"
                  >
                    Your Rating
                  </label>
                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(+e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900 font-medium"
                  >
                    <option value="">Select a rating</option>
                    <option value="1">⭐ Inferior</option>
                    <option value="2">⭐⭐ Decent</option>
                    <option value="3">⭐⭐⭐ Great</option>
                    <option value="4">⭐⭐⭐⭐ Excellent</option>
                    <option value="5">⭐⭐⭐⭐⭐ Exceptional</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="comment"
                    className="block text-lg font-semibold text-gray-900 mb-3"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900 font-medium resize-none"
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
                      ? "bg-gray-400 cursor-not-allowed opacity-60"
                      : "bg-primary hover:bg-blue-700 hover:shadow-lg"
                  }`}
                >
                  {loadingProductReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            ) : (
              <div className="bg-blue-50 border-l-4 border-primary p-6 rounded">
                <p className="text-lg text-blue-900">
                  Please{" "}
                  <Link
                    to="/login"
                    className="text-primary font-bold hover:text-blue-800 underline"
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
                        <h3 className="font-bold text-gray-900 text-lg">
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

                    <p className="text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
                <FaComments
                  className="mx-auto text-yellow-600 mb-4"
                  size={40}
                />
                <p className="text-lg text-yellow-900 font-medium">
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
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
                <FaBox className="mx-auto text-primary mb-4" size={40} />
                <p className="text-lg text-blue-900 font-medium">
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
