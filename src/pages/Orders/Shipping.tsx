import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ProgressSteps from "../../components/ProgressSteps";
import {
  useUpdatePaymentMethodMutation,
  useUpdateShippingAddressMutation,
} from "../../redux/api/cartApiSlice";
import {
  savePaymentMethod,
  saveShippingAddress,
} from "../../redux/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value || 0);

const Shipping = () => {
  const cart = useAppSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState(
    cart.paymentMethod || "PayPal",
  );
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || "",
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [updateShippingAddress, { isLoading: isSavingAddress }] =
    useUpdateShippingAddressMutation();
  const [updatePaymentMethod, { isLoading: isSavingPayment }] =
    useUpdatePaymentMethodMutation();

  const itemCount = cart.cartItems.reduce((acc, item) => acc + item.qty, 0);
  const isSaving = isSavingAddress || isSavingPayment;

  useEffect(() => {
    if (!cart.cartItems.length) {
      navigate("/cart");
    }
  }, [cart.cartItems.length, navigate]);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();

    const nextShippingAddress = { address, city, postalCode, country };

    try {
      await updateShippingAddress(nextShippingAddress).unwrap();
      await updatePaymentMethod({ paymentMethod }).unwrap();
      dispatch(saveShippingAddress(nextShippingAddress));
      dispatch(savePaymentMethod(paymentMethod));
      navigate("/placeorder");
    } catch (error: any) {
      toast.error(error?.data?.error || error?.data?.message || "Unable to save checkout details");
    }
  };

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h1 className="text-4xl font-bold text-text-primary">
            Shipping Details
          </h1>
          <p className="mt-2 text-text-secondary">
            Add your delivery address and confirm PayPal for a smooth checkout.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <ProgressSteps step1 step2 />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <form onSubmit={submitHandler} className="space-y-8">
              <div className="rounded-lg bg-white p-8 shadow-sm">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-text-primary">
                      Delivery Address
                    </h2>
                    <p className="mt-2 text-sm text-text-secondary">
                      We&apos;ll use this for shipping and order updates.
                    </p>
                  </div>
                  <span className="rounded-full bg-primary-subtle px-4 py-2 text-sm font-semibold text-primary">
                    Secure checkout
                  </span>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-text-secondary">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-border-dark px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-primary-light"
                      placeholder="123 Main Street"
                      value={address}
                      required
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-text-secondary">
                      City *
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-border-dark px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-primary-light"
                      placeholder="New York"
                      value={city}
                      required
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-text-secondary">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-border-dark px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-primary-light"
                        placeholder="10001"
                        value={postalCode}
                        required
                        onChange={(e) => setPostalCode(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-text-secondary">
                        Country *
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-border-dark px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-primary-light"
                        placeholder="United States"
                        value={country}
                        required
                        onChange={(e) => setCountry(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-text-primary">
                  Payment Method
                </h2>
                <p className="mb-8 mt-2 text-sm text-text-secondary">
                  You&apos;ll complete payment on PayPal right after placing the
                  order.
                </p>

                <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border-2 border-border-dark p-5 transition hover:border-primary-light hover:bg-primary-subtle">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      className="h-4 w-4 text-primary"
                      name="paymentMethod"
                      value="PayPal"
                      checked={paymentMethod === "PayPal"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="ml-3">
                      <span className="block font-medium text-text-secondary">
                        PayPal
                      </span>
                      <span className="text-sm text-text-secondary">
                        Pay with your PayPal balance or connected card.
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#FFC439]/15 px-3 py-1 text-xs font-semibold text-[#003087]">
                    Recommended
                  </span>
                </label>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    className="w-full rounded-lg border border-border px-4 py-3 font-semibold text-text-primary transition hover:bg-surface-muted"
                    onClick={() => navigate("/cart")}
                  >
                    Back to Cart
                  </button>
                  <button
                    className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-white transition duration-300 hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
                    type="submit"
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Review Order"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-4 rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-text-primary">
                Checkout Summary
              </h3>
              <p className="mb-6 mt-2 text-sm text-text-secondary">
                {itemCount} item{itemCount === 1 ? "" : "s"} ready to ship
              </p>

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

              <div className="rounded-lg border border-border bg-surface-muted p-4 text-sm text-text-secondary">
                PayPal opens after order placement so you can finish payment
                immediately.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
