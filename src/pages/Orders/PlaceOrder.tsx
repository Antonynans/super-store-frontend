import { Key, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import { FaClipboardList } from "react-icons/fa";
import getPrimaryImage from "../../Utils/getPrimaryImage";
import { useAppSelector } from "../../redux/store";
import { CartItem } from "../../types";

const PlaceOrder = () => {
  const navigate = useNavigate();

  const cart = useAppSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
        isPaid: false,
        isDelivered: false,
      }).unwrap();
      // dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error: any) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-2">
            <FaClipboardList className="text-blue-600 text-3xl" />
            <h1 className="text-4xl font-bold text-gray-900">Order Review</h1>
          </div>
          <p className="text-text-secondary">
            Review your order details before confirming purchase
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <ProgressSteps step1 step2 step3 />
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        {cart.cartItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-text-secondary mb-6">
              Your cart is empty
            </p>
            <Link
              to="/shop"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
                <div className="p-6 border-b border-border">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Order Items
                  </h2>
                </div>

                <div className="divide-y divide-border">
                  {cart.cartItems.map((item: CartItem, index: Key | null | undefined) => (
                    <div
                      key={index}
                      className="p-6 hover:bg-surface-muted transition"
                    >
                      <div className="flex gap-6">
                        <div className="flex-shrink-0">
                          <img
                            src={getPrimaryImage(item.images)}
                            alt={item.name}
                            className="h-24 w-24 object-cover rounded-lg border border-border"
                          />
                        </div>

                        <div className="flex-1">
                          <Link
                            to={`/product/${item.product}`}
                            className="text-lg font-semibold text-blue-600 hover:text-blue-700 block mb-2"
                          >
                            {item.name}
                          </Link>
                          <div className="flex gap-8 text-text-secondary">
                            <div>
                              <span className="font-medium">Quantity:</span>{" "}
                              {item.qty}
                            </div>
                            <div>
                              <span className="font-medium">Price:</span> $
                              {item.price.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            ${(item.qty * item.price).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Shipping Address
                </h2>
                <div className="bg-surface-muted rounded-lg p-4 border border-border">
                  <p className="text-gray-700">
                    <span className="font-semibold">
                      {cart.shippingAddress.address}
                    </span>
                  </p>
                  <p className="text-text-secondary">
                    {cart.shippingAddress.city},{" "}
                    {cart.shippingAddress.postalCode}
                  </p>
                  <p className="text-text-secondary">
                    {cart.shippingAddress.country}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Payment Method
                </h2>
                <div className="bg-surface-muted rounded-lg p-4 border border-border">
                  <p className="text-gray-700">
                    <span className="font-semibold">{cart.paymentMethod}</span>
                  </p>
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
                    <span>Items</span>
                    <span className="font-medium">
                      ${parseFloat(cart.itemsPrice || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Shipping</span>
                    <span className="font-medium">
                      ${parseFloat(cart.shippingPrice || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Tax</span>
                    <span className="font-medium">
                      ${parseFloat(cart.taxPrice || 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t border-border pt-4 flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${parseFloat(cart.totalPrice || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {error && (
                  <div className="mb-6">
                    {toast.error((error as any)?.data?.message)}
                  </div>
                )}

                <button
                  type="button"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={cart.cartItems.length === 0 || isLoading}
                  onClick={placeOrderHandler}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    "Confirm & Place Order"
                  )}
                </button>

                <p className="text-xs text-text-secondary text-center mt-3">
                  By placing an order, you agree to our terms
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceOrder;
