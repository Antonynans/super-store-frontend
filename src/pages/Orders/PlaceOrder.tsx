import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaClipboardList } from "react-icons/fa";
import ProgressSteps from "../../components/ProgressSteps";
import getPrimaryImage from "../../Utils/getPrimaryImage";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { useAppSelector } from "../../redux/store";
import { CartItem } from "../../types";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value || 0);

const PlaceOrder = () => {
  const navigate = useNavigate();
  const cart = useAppSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.cartItems.length) {
      navigate("/cart");
      return;
    }

    if (!cart.shippingAddress.address || !cart.paymentMethod) {
      navigate("/shipping");
    }
  }, [
    cart.cartItems.length,
    cart.paymentMethod,
    cart.shippingAddress.address,
    navigate,
  ]);

  const getCartItemImages = (item: CartItem): string[] => {
    if (Array.isArray(item.images)) {
      return item.images;
    }

    if (item.product?.images) {
      return item.product.images;
    }

    return [];
  };

  const getCartItemProductId = (item: CartItem): string => {
    if (item.product && typeof item.product === "object") {
      return item.product._id;
    }

    return item._id || "";
  };

  const getOrderItems = () =>
    cart.cartItems.map((item) => ({
      _id: getCartItemProductId(item),
      name: item.name,
      qty: item.qty,
      images: getCartItemImages(item),
      price: item.price,
    }));

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: getOrderItems(),
        shippingAddress: {
          address: cart.shippingAddress.address,
          city: cart.shippingAddress.city,
          postalCode: cart.shippingAddress.postalCode,
          country: cart.shippingAddress.country,
        },
        paymentMethod: cart.paymentMethod,
      }).unwrap();

      navigate(`/order/${res._id}`);
    } catch (nextError: any) {
      toast.error(
        nextError?.data?.error ||
          nextError?.data?.message ||
          nextError?.error ||
          "Unable to place order",
      );
    }
  };

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="mb-2 flex items-center gap-3">
            <FaClipboardList className="text-3xl text-primary" />
            <h1 className="text-4xl font-bold text-text-primary">
              Order Review
            </h1>
          </div>
          <p className="text-text-secondary">
            Check your items, delivery details, and total before moving to
            PayPal.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <ProgressSteps step1 step2 step3 />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-12">
        {cart.cartItems.length === 0 ? (
          <div className="py-16 text-center">
            <p className="mb-6 text-xl text-text-secondary">
              Your cart is empty
            </p>
            <Link
              to="/shop"
              className="inline-block rounded-lg bg-primary px-8 py-3 font-semibold text-white transition hover:bg-primary"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-8 overflow-hidden rounded-lg bg-white shadow-sm">
                <div className="border-b border-border p-6">
                  <h2 className="text-xl font-semibold text-text-primary">
                    Order Items
                  </h2>
                </div>

                <div className="divide-y divide-border">
                  {cart.cartItems.map((item, index) => {
                    const itemImages = getCartItemImages(item);
                    const productId = getCartItemProductId(item);

                    return (
                      <div
                        key={productId || index}
                        className="p-6 transition hover:bg-surface-muted"
                      >
                        <div className="flex flex-col gap-6 sm:flex-row">
                          <div className="flex-shrink-0">
                            <img
                              src={getPrimaryImage(itemImages)}
                              alt={item.name}
                              className="h-24 w-24 rounded-lg border border-border object-cover"
                            />
                          </div>

                          <div className="flex-1">
                            <Link
                              to={`/product/${productId}`}
                              className="mb-2 block text-lg font-semibold text-primary hover:text-primary"
                            >
                              {item.name}
                            </Link>
                            <div className="flex flex-wrap gap-6 text-text-secondary">
                              <div>
                                <span className="font-medium">Quantity:</span>{" "}
                                {item.qty}
                              </div>
                              <div>
                                <span className="font-medium">Price:</span>{" "}
                                {formatCurrency(item.price)}
                              </div>
                            </div>
                          </div>

                          <div className="text-right text-2xl font-bold text-text-primary">
                            {formatCurrency(item.qty * item.price)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-text-primary">
                  Shipping Address
                </h2>
                <div className="rounded-lg border border-border bg-surface-muted p-4">
                  <p className="text-text-secondary">
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

              <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-text-primary">
                  Payment Method
                </h2>
                <div className="rounded-lg border border-border bg-surface-muted p-4">
                  <p className="text-text-secondary">
                    <span className="font-semibold">{cart.paymentMethod}</span>
                  </p>
                  <p className="mt-2 text-sm text-text-secondary">
                    PayPal opens after this step so you can finish payment
                    immediately.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-4 rounded-lg bg-white p-6 shadow-sm">
                <h3 className="mb-6 text-xl font-semibold text-text-primary">
                  Ready to Place
                </h3>

                <div className="mb-6 space-y-4">
                  <div className="flex justify-between text-text-secondary">
                    <span>Items</span>
                    <span className="font-medium">
                      {formatCurrency(cart.itemsPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Shipping</span>
                    <span className="font-medium">
                      {cart.shippingPrice === 0
                        ? "Free"
                        : formatCurrency(cart.shippingPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Tax</span>
                    <span className="font-medium">
                      {formatCurrency(cart.taxPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-4">
                    <span className="text-lg font-semibold text-text-primary">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(cart.totalPrice)}
                    </span>
                  </div>
                </div>

                {error && (
                  <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                    {(error as any)?.data?.error ||
                      (error as any)?.data?.message ||
                      "Unable to place order"}
                  </p>
                )}

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-white transition duration-300 hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={cart.cartItems.length === 0 || isLoading}
                  onClick={placeOrderHandler}
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    "Place Order and Continue to PayPal"
                  )}
                </button>

                <p className="mt-3 rounded-lg bg-primary-subtle px-4 py-3 text-sm text-primary-dark">
                  Next step: approve the payment inside PayPal to finish
                  checkout.
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
