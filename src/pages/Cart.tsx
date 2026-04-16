import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGetCartQuery } from "../redux/api/cartApiSlice";
import { useRemoveFromCartHandler } from "../hook/useRemoveFromCartHandler";
import { useUpdateCartQtyHandler } from "../hook/useUpdateCartQtyHandler";
import { CartItem } from "../types";
import Message from "../components/Message";
import CartLoader from "../components/skeletons/CartSkeleton";

const Cart = () => {
  const navigate = useNavigate();
  const { data: cart, isLoading, isError } = useGetCartQuery();
  const removeFromCartHandler = useRemoveFromCartHandler();
  const updateCartQtyHandler = useUpdateCartQtyHandler();
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const handleRemoveItem = async (productId: string) => {
    setRemovingItems((prev) => new Set(prev).add(productId));
    await removeFromCartHandler(productId);
    setRemovingItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };

  const handleUpdateQty = async (productId: string, newQty: number) => {
    setUpdatingItems((prev) => new Set(prev).add(productId));
    await updateCartQtyHandler(productId, newQty);
    setUpdatingItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
    exit: {
      opacity: 0,
      x: 100,
      scale: 0.5,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 20,
      },
    },
  };

  const emptyStateVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const priceVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    }),
  };

  if (isLoading) {
    return <CartLoader />;
  }

  if (isError) {
    return <Message variant="danger">Error loading cart</Message>;
  }

  const isEmpty = !cart?.cartItems || cart.cartItems.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="mt-2 text-gray-600">
            {isEmpty
              ? "Your cart is empty"
              : `${cart?.cartItems?.length} item${cart?.cartItems?.length !== 1 ? "s" : ""} in cart`}
          </p>
        </motion.div>

        {isEmpty ? (
          <motion.div
            variants={emptyStateVariants}
            initial="hidden"
            animate="visible"
            className="rounded-lg bg-white p-12 text-center shadow-md"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="mb-6 inline-block"
            >
              <svg
                className="h-24 w-24 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </motion.div>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Your cart is empty
            </h2>
            <p className="mb-8 text-gray-600">
              Add some items to your cart to get started shopping!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/shop")}
              className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <AnimatePresence mode="popLayout">
                  {cart?.cartItems?.map((item: CartItem) => (
                    <motion.div
                      key={item.product._id}
                      variants={itemVariants}
                      layout
                      className={`flex gap-4 rounded-lg bg-white p-4 shadow-md transition-all ${
                        removingItems.has(item.product._id)
                          ? "pointer-events-none opacity-50"
                          : ""
                      }`}
                    >
                      <motion.div
                        className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200"
                        whileHover={{ scale: 1.05 }}
                      >
                        <img
                          src={item.images?.[0]}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </motion.div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <motion.h3
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                            onClick={() =>
                              navigate(`/product/${item.product._id}`)
                            }
                          >
                            {item.name}
                          </motion.h3>
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.15 }}
                            className="mt-1 text-gray-600"
                          >
                            Stock: {item.product.countInStock}
                          </motion.p>
                        </div>

                        <motion.div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">
                            Qty:
                          </span>
                          <motion.div
                            className="flex items-center gap-2 rounded-lg border border-gray-300"
                            layout
                          >
                            <button
                              onClick={() => {
                                if (item.qty > 1) {
                                  handleUpdateQty(
                                    item.product._id,
                                    item.qty - 1,
                                  );
                                }
                              }}
                              disabled={
                                item.qty <= 1 ||
                                updatingItems.has(item.product._id)
                              }
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              −
                            </button>
                            <motion.span
                              key={item.qty}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 15,
                              }}
                              className="w-8 text-center font-medium"
                            >
                              {item.qty}
                            </motion.span>
                            <button
                              onClick={() => {
                                if (item.qty < item.product.countInStock) {
                                  handleUpdateQty(
                                    item.product._id,
                                    item.qty + 1,
                                  );
                                }
                              }}
                              disabled={
                                item.qty >= item.product.countInStock ||
                                updatingItems.has(item.product._id)
                              }
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              +
                            </button>
                          </motion.div>
                        </motion.div>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="text-right"
                        >
                          <p className="lg:text-2xl font-bold text-gray-900">
                            ${(item.price * item.qty).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">
                            ${item.price.toFixed(2)} each
                          </p>
                        </motion.div>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveItem(item.product._id)}
                          disabled={removingItems.has(item.product._id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg p-2 transition-colors disabled:opacity-50"
                        >
                          {removingItems.has(item.product._id) ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <svg
                                className="h-5 w-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 1119.414 4.614c-.446.214-.887.29-1.282.292a1 1 0 00-.998 1.062 7 7 0 01-6.519 6.52 1 1 0 101.062-.998c.002-.395.078-.836.292-1.282A7.002 7.002 0 115 5.101V4a1 1 0 01-2 0V2a1 1 0 011-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </motion.div>
                          ) : (
                            <svg
                              className="h-5 w-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="sticky top-20 rounded-lg bg-white p-6 shadow-md"
              >
                <h2 className="mb-6 text-xl font-bold text-gray-900">
                  Order Summary
                </h2>

                <motion.div className="space-y-4 border-b border-gray-200 pb-4">
                  {[
                    {
                      label: "Subtotal",
                      value: cart?.itemsPrice || 0,
                      index: 0,
                    },
                    {
                      label: "Shipping",
                      value: cart?.shippingPrice || 0,
                      index: 1,
                    },
                    {
                      label: "Tax",
                      value: cart?.taxPrice || 0,
                      index: 2,
                    },
                  ].map((item) => (
                    <motion.div
                      key={item.label}
                      variants={priceVariants}
                      initial="hidden"
                      animate="visible"
                      custom={item.index}
                      className="flex justify-between text-gray-600"
                    >
                      <span>{item.label}</span>
                      <span className="font-medium">
                        ${parseFloat(item.value.toString()).toFixed(2)}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  variants={priceVariants}
                  initial="hidden"
                  animate="visible"
                  custom={3}
                  className="mt-4 flex justify-between"
                >
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <motion.span
                    key={cart?.totalPrice}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                    className="text-2xl font-bold text-blue-600"
                  >
                    $
                    {parseFloat(cart?.totalPrice?.toString() || "0").toFixed(2)}
                  </motion.span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 space-y-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/shipping")}
                    className="w-full rounded-lg bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Proceed to Checkout
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/shop")}
                    className="w-full rounded-lg border-2 border-gray-300 bg-white py-3 text-gray-900 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Continue Shopping
                  </motion.button>
                </motion.div>

                {cart?.shippingPrice === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700"
                  >
                    🎉 Free shipping on your order!
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
