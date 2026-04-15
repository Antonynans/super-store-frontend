import { Link } from "react-router-dom";
import moment from "moment";
import { useState, useMemo, SetStateAction } from "react";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import getPrimaryImage from "../../Utils/getPrimaryImage";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paginationData = useMemo(() => {
    if (!products) return { paginatedProducts: [], totalPages: 0 };

    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);

    return { paginatedProducts, totalPages };
  }, [products, currentPage]);

  const { paginatedProducts, totalPages } = paginationData;

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPage = (page: SetStateAction<number>) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-muted to-surface-subtle flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-muted to-surface-subtle flex items-center justify-center">
        <div className="text-red-600 text-lg font-semibold">
          Error loading products
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-surface-muted to-surface-subtle p-6">
        <div className="max-w-7xl mx-auto mt-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              All Products
            </h1>
            <p className="text-text-secondary">
              Manage and update all products in your store • Total:{" "}
              <span className="font-semibold">{products?.length || 0}</span>
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-border text-gray-900 border-b border-gray-300">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Image
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Brand
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Created
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedProducts && paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product) => (
                      <tr
                        key={product._id}
                        className="hover:bg-surface-muted transition-colors"
                      >
                        <td className="px-6 py-4">
                          <img
                            src={getPrimaryImage(product.images)}
                            alt={product.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {product.name}
                            </p>
                            <p className="text-sm text-text-secondary mt-1">
                              {product.description?.substring(0, 40)}...
                            </p>
                          </div>
                        </td>
                        {/* <td className="px-6 py-4">
                          <span className="text-sm text-gray-700">
                            {product.brand || "N/A"}
                          </span>
                        </td> */}
                        <td className="px-6 py-4">
                          <span className="font-semibold text-pink-600">
                            ${product.price?.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              product.countInStock > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.countInStock || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-text-secondary">
                            {moment(product.createdAt).format("MMM Do YY")}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link to={`/admin/product/update/${product._id}`}>
                            <button className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-pink-500 hover:bg-pink-600 rounded-lg transition-colors">
                              Edit
                              <svg
                                className="w-4 h-4 ml-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-text-secondary"
                      >
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between p-6 bg-surface-subtle border-t border-border">
                <div className="text-sm text-gray-700">
                  Page{" "}
                  <span className="font-semibold text-gray-900">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-900">
                    {totalPages}
                  </span>{" "}
                  • Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {paginatedProducts.length}
                  </span>{" "}
                  products
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:bg-border disabled:text-gray-400 text-gray-900 rounded-lg font-semibold transition-colors"
                  >
                    ← Previous
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                            currentPage === page
                              ? "bg-pink-500 text-white"
                              : "bg-gray-300 hover:bg-gray-400 text-gray-900"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:bg-border disabled:text-gray-400 text-gray-900 rounded-lg font-semibold transition-colors"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllProducts;
