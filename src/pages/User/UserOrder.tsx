import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import { FaClipboardList, FaCheckCircle, FaClock } from "react-icons/fa";
import { useState } from "react";
import getPrimaryImage from "../../Utils/getPrimaryImage";
import { toast } from "react-toastify";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();
  const [displayCount, setDisplayCount] = useState(5);

  const displayedOrders = orders?.slice(0, displayCount) || [];
  const hasMore = orders && displayCount < orders.length;

  return (
    <div className="min-h-screen bg-surface-muted50">
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <Loader />
          </div>
        ) : error ? (
          <div className="max-w-7xl mx-auto px-4 py-12">
            {toast.error(
              (error as any)?.data?.message || "Failed to load orders",
            )}
          </div>
        ) : orders && orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-8">
              <FaClipboardList className="mx-auto h-24 w-24 text-border-dark" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              No orders yet
            </h2>
            <p className="text-text-secondary mb-8">
              Start shopping to create your first order
            </p>
            <Link
              to="/shop"
              className="inline-block bg-primary hover:bg-primary text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-text-secondary">
                You have{" "}
                <span className="font-bold text-primary">
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
                          src={getPrimaryImage(order.orderItems[0]?.images)}
                          alt="Order item"
                          className="w-full h-32 object-cover rounded-lg border border-border"
                        />
                      </div>

                      <div className="md:col-span-1">
                        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">
                          Order ID
                        </h3>
                        <p className="text-text-primary font-mono text-sm break-all">
                          {order._id}
                        </p>
                        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mt-4 mb-2">
                          Order Date
                        </h3>
                        <p className="text-text-primary">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="md:col-span-1">
                        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">
                          Total Amount
                        </h3>
                        <p className=" font-bold text-primary mb-4">
                          $
                          {parseFloat(String(order.totalPrice || 0)).toFixed(2)}
                        </p>

                        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">
                          Items
                        </h3>
                        <p className="text-primary">
                          {order.orderItems?.length || 0}{" "}
                          {order.orderItems?.length === 1 ? "item" : "items"}
                        </p>
                      </div>

                      <div className="md:col-span-1">
                        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
                          Status
                        </h3>

                        <div className="space-y-3">
                          <div>
                            <p className="text-xs font-semibold text-text-secondary mb-1">
                              Payment
                            </p>
                            <div className="flex items-center gap-2">
                              {order.isPaid ? (
                                <>
                                  <FaCheckCircle className="text-amber" />
                                  <span className="inline-block bg-amber-light text-amber-dark text-xs font-semibold px-3 py-1 rounded-full">
                                    Paid
                                  </span>
                                </>
                              ) : (
                                <>
                                  <FaClock className="text-accent-subtle0" />
                                  <span className="inline-block bg-accent-subtle text-accent-dark text-xs font-semibold px-3 py-1 rounded-full">
                                    Pending
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-text-secondary mb-1">
                              Delivery
                            </p>
                            <div className="flex items-center gap-2">
                              {order.isDelivered ? (
                                <>
                                  <FaCheckCircle className="text-amber" />
                                  <span className="inline-block bg-amber-light text-amber-dark text-xs font-semibold px-3 py-1 rounded-full">
                                    Delivered
                                  </span>
                                </>
                              ) : (
                                <>
                                  <FaClock className="text-accent-subtle0" />
                                  <span className="inline-block bg-accent-subtle text-accent-dark text-xs font-semibold px-3 py-1 rounded-full">
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
                          <button className="bg-primary hover:bg-primary text-white font-semibold py-2 px-6 rounded-lg transition duration-300">
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
                  className="bg-primary hover:bg-primary text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
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
