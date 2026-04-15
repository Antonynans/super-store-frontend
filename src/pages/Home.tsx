import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Message from "../components/Message";
import Header from "../components/Header";
import ProductCard from "./Products/ProductCard";

const Home = () => {
  const { keyword } = useParams();

  const { data, isLoading, isFetching, isError, error } = useGetProductsQuery({
    keyword,
  });

  return (
    <>
      {!keyword ? <Header /> : null}

      <div className="min-h-screen bg-surface-muted">
        {isLoading ? (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-8">
              <div className="h-6 w-48 shimmer rounded mb-2"></div>
              <div className="h-4 w-64 shimmer rounded"></div>
            </div>

            <div className="flex gap-6 overflow-x-auto scrollbar-hide px-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="min-w-[250px] sm:min-w-[280px] md:min-w-[300px] bg-white rounded-lg shadow-md p-4"
                >
                  <div className="h-48 shimmer rounded mb-4"></div>
                  <div className="h-4 shimmer rounded mb-2"></div>
                  <div className="h-4 w-2/3 shimmer rounded mb-4"></div>
                  <div className="h-3 w-1/2 shimmer rounded mb-3"></div>
                  <div className="h-6 w-20 shimmer rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ) : isError ? (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <Message variant="danger">
              {(error as any)?.data?.message ||
                (error as any)?.error ||
                "An error occurred"}
            </Message>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-12">
            {isFetching && (
              <p className="text-sm text-gray-400 mb-4 animate-pulse">
                Updating products...
              </p>
            )}

            <div className="flex justify-between items-center mb-12">
              <div>
                <h1 className="md:text-4xl text-2xl font-bold text-gray-900 mb-2">
                  Special Products
                </h1>
                <p className="text-text-secondary">
                  Browse our latest collection of premium products
                </p>
              </div>

              <Link
                to="/shop"
                className="bg-blue-600 hover:bg-blue-700 w-fit text-white text-sm font-semibold md:py-3 md:px-8 p-2 rounded-lg transition duration-300 flex items-center gap-2 whitespace-pre"
              >
                Browse All
                <span className="text-xl">→</span>
              </Link>
            </div>

            <div className="mb-8">
              <p className="text-text-secondary">
                Showing{" "}
                <span className="font-bold text-blue-600">
                  {data?.products?.length || 0}
                </span>{" "}
                products
              </p>
            </div>

            {data && data?.products?.length > 0 ? (
              <div className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4">
                {data.products.map((product) => (
                  <div key={product._id}>
                    <ProductCard p={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-text-secondary mb-6">
                  No products found
                </p>
                <Link
                  to="/shop"
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Go to Shop
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
