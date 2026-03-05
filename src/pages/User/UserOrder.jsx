import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import { FaClipboardList, FaCheckCircle, FaClock } from "react-icons/fa";
import { useState } from "react";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();
  const [displayCount, setDisplayCount] = useState(5);

  const displayedOrders = orders?.slice(0, displayCount) || [];
  const hasMore = orders && displayCount < orders.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <Loader />
          </div>
        ) : error ? (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <Message variant="danger">
              {error?.data?.error || error.error || "Failed to load orders"}
            </Message>
          </div>
        ) : orders && orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-8">
              <FaClipboardList className="mx-auto h-24 w-24 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-600 mb-8">
              Start shopping to create your first order
            </p>
            <Link
              to="/shop"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                You have{" "}
                <span className="font-bold text-blue-600">
                  {orders?.length || 0}
                </span>{" "}
                order{orders?.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="space-y-4">
              {displayedOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition duration-300"
                >
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                      <div className="md:col-span-1">
                        <img
                          src={order.orderItems[0]?.image}
                          alt="Order item"
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                      </div>

                      <div className="md:col-span-1">
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
                          Order ID
                        </h3>
                        <p className="text-gray-900 font-mono text-sm break-all">
                          {order._id}
                        </p>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mt-4 mb-2">
                          Order Date
                        </h3>
                        <p className="text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="md:col-span-1">
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
                          Total Amount
                        </h3>
                        <p className=" font-bold text-blue-600 mb-4">
                          ${parseFloat(order.totalPrice || 0).toFixed(2)}
                        </p>

                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
                          Items
                        </h3>
                        <p className="text-blue-600">
                          {order.orderItems?.length || 0}{" "}
                          {order.orderItems?.length === 1 ? "item" : "items"}
                        </p>
                      </div>

                      <div className="md:col-span-1">
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
                          Status
                        </h3>

                        <div className="space-y-3">
                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1">
                              Payment
                            </p>
                            <div className="flex items-center gap-2">
                              {order.isPaid ? (
                                <>
                                  <FaCheckCircle className="text-green-500" />
                                  <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                                    Paid
                                  </span>
                                </>
                              ) : (
                                <>
                                  <FaClock className="text-yellow-500" />
                                  <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
                                    Pending
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1">
                              Delivery
                            </p>
                            <div className="flex items-center gap-2">
                              {order.isDelivered ? (
                                <>
                                  <FaCheckCircle className="text-green-500" />
                                  <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                                    Delivered
                                  </span>
                                </>
                              ) : (
                                <>
                                  <FaClock className="text-yellow-500" />
                                  <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
                                    In Transit
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Link to={`/order/${order._id}`}>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300">
                            View
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setDisplayCount((prev) => prev + 5)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
                >
                  Load More Orders
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserOrder;
