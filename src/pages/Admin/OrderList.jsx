import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import { useState, useMemo } from "react";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paginationData = useMemo(() => {
    if (!orders) return { paginatedOrders: [], totalPages: 0 };

    const totalPages = Math.ceil(orders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedOrders = orders.slice(startIndex, endIndex);

    return { paginatedOrders, totalPages };
  }, [orders, currentPage]);

  const { paginatedOrders, totalPages } = paginationData;

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <Loader />
        </div>
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="w-full">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-200 text-gray-900">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-semibold">
                    IMAGE
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">
                    ORDER ID
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">
                    CUSTOMER
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">
                    DATE
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">
                    TOTAL
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold">
                    PAID
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold">
                    DELIVERED
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold">
                    ACTION
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        {order.orderItems && order.orderItems[0] && (
                          <img
                            src={order.orderItems[0].image}
                            alt={order._id}
                            className="w-12 h-12 rounded object-cover"
                          />
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-mono text-gray-700">
                          {order._id.substring(0, 8)}...
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-700">
                          {order.user ? order.user.username : "N/A"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-700">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="text-sm font-semibold text-pink-600">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(order.totalPrice)}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-center">
                        {order.isPaid ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                            ✓ Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                            ⊘ Pending
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-center">
                        {order.isDelivered ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                            ✓ Delivered
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                            ⧗ In Transit
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-center">
                        <Link to={`/order/${order._id}`}>
                          <button className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold rounded-lg transition-colors">
                            View Details
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between p-6 bg-gray-100 border-t border-gray-200">
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
                  {paginatedOrders.length}
                </span>{" "}
                orders
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:text-gray-400 text-gray-900 rounded-lg font-semibold transition-colors"
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
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:text-gray-400 text-gray-900 rounded-lg font-semibold transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default OrderList;
