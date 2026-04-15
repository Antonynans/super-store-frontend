import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/store";
import { FaTrash } from "react-icons/fa";
import { useAddToCartHandler } from "../hook/useAddToCartHandler";
import { useRemoveFromCartHandler } from "../hook/useRemoveFromCartHandler";
import { useGetCartQuery } from "../redux/api/cartApiSlice";
import getPrimaryImage from "../Utils/getPrimaryImage";

const Cart = () => {
  const navigate = useNavigate();
  const { userInfo } = useAppSelector((state) => state.auth);

  const { data: cart } = useGetCartQuery(undefined, {
    skip: !userInfo,
  });

  const cartItems = cart?.cartItems || [];

  const addToCartHandler = useAddToCartHandler();
  const removeFromCartHandler = useRemoveFromCartHandler();

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-surface-muted flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to view your cart
          </h1>
          <Link
            to="/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-text-secondary">
            {cartItems.length === 0
              ? "Your cart is currently empty"
              : `Review your items before checkout`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-8">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-text-secondary mb-8">
              Add some items to get started with your shopping
            </p>
            <Link
              to="/shop"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {cartItems.length}{" "}
                    {cartItems.length === 1 ? "Item" : "Items"} in Cart
                  </h2>
                </div>

                <div className="divide-y divide-border">
                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="p-6 hover:bg-surface-muted transition duration-200"
                    >
                      <div className="flex gap-6">
                        <div className="flex-shrink-0">
                          <img
                            src={getPrimaryImage(item.images)}
                            alt={item.name}
                            className="h-24 w-24 object-cover rounded-lg border border-border"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${item.product?._id}`}
                            className="text-lg font-semibold text-blue-600 hover:text-blue-700 mb-1 block truncate"
                          >
                            {item.name}
                          </Link>

                          <p className="text-2xl font-bold text-gray-900">
                            ${item.price}
                          </p>
                        </div>

                        <div className="flex lg:flex-row flex-col lg:items-center items-end gap-4">
                          <div className="flex items-center border border-[#e5e7eb] rounded-[10px] overflow-hidden">
                            <button
                              onClick={() =>
                                addToCartHandler(
                                  item.product._id,
                                  Number(Math.max(1, item.qty - 1)),
                                )
                              }
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
                              {item.qty}
                            </span>
                            <button
                              onClick={() =>
                                addToCartHandler(
                                  item.product._id,
                                  Number(item.qty + 1),
                                )
                              }
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

                          <button
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition duration-200"
                            onClick={() => {
                              removeFromCartHandler(item.product._id);
                            }}
                            title="Remove from cart"
                          >
                            <FaTrash className="text-lg" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-text-secondary">
                    <span>Subtotal</span>
                    <span className="font-medium">
                      $
                      {cartItems
                        .reduce(
                          (acc: number, item: { qty: number; price: number }) =>
                            acc + item.qty * item.price,
                          0,
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Items</span>
                    <span className="font-medium">
                      {cartItems.reduce(
                        (acc: number, item: { qty: number }) => acc + item.qty,
                        0,
                      )}
                    </span>
                  </div>
                  <div className="border-t border-border pt-4 flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      $
                      {cartItems
                        .reduce(
                          (acc: number, item: { qty: number; price: number }) =>
                            acc + item.qty * item.price,
                          0,
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 mb-3"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed To Checkout
                </button>

                <Link
                  to="/shop"
                  className="w-full block text-center text-blue-600 hover:text-blue-700 font-semibold py-3 px-4 border border-blue-600 rounded-lg transition duration-300"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
