import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import ProductCard from "./Products/ProductCard";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <>
      {!keyword ? <Header /> : null}

      <div className="min-h-screen bg-gray-50">
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <Loader />
          </div>
        ) : isError ? (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <Message variant="danger">
              {isError?.data?.message || isError.error}
            </Message>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Special Products
                </h1>
                <p className="text-gray-600">
                  Browse our latest collection of premium products
                </p>
              </div>

              <Link
                to="/shop"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 flex items-center gap-2"
              >
                Browse All
                <span className="text-xl">→</span>
              </Link>
            </div>

            <div className="mb-8">
              <p className="text-gray-600">
                Showing{" "}
                <span className="font-bold text-blue-600">
                  {data?.products?.length || 0}
                </span>{" "}
                products
              </p>
            </div>

            {/* Products Grid */}
            {data?.products && data.products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.products.map((product) => (
                  <div key={product._id}>
                    <ProductCard p={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-gray-600 mb-6">
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