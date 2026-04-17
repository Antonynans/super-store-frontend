import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  PayPalButtons,
  usePayPalScriptReducer,
  DISPATCH_ACTION,
  SCRIPT_LOADING_STATE,
} from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import getPrimaryImage from "../../Utils/getPrimaryImage";
import { useClearCartMutation } from "../../redux/api/cartApiSlice";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";
import { resetCart } from "../../redux/features/cart/cartSlice";
import { RootState, useAppDispatch, useAppSelector } from "../../redux/store";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value || 0);

const formatDateTime = (value?: string) =>
  value
    ? new Date(value).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";

const Order = () => {
  const { id: orderId } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId!, {
    skip: !orderId,
  });

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const [clearCart] = useClearCartMutation();

  const { userInfo } = useAppSelector((state: RootState) => state.auth);
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  const isPayPalReady = paypal?.clientId && order && !order.isPaid;

  useEffect(() => {
    if (!isPayPalReady || errorPayPal || loadingPayPal) return;

    paypalDispatch({
      type: DISPATCH_ACTION.RESET_OPTIONS,
      value: {
        clientId: paypal.clientId,
        currency: "USD",
        intent: "capture",
      },
    });

    paypalDispatch({
      type: DISPATCH_ACTION.LOADING_STATUS,
      value: SCRIPT_LOADING_STATE.PENDING,
    });
  }, [
    errorPayPal,
    isPayPalReady,
    loadingPayPal,
    paypal?.clientId,
    paypalDispatch,
  ]);

  const createPayPalOrder = (_data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: order?.totalPrice?.toString() || "0",
          },
        },
      ],
    });
  };

  const onApprove = async (_data: any, actions: any) => {
    const details = await actions.order.capture();

    try {
      if (!orderId) return;

      await payOrder({ orderId, details }).unwrap();
      await clearCart().unwrap();
      dispatch(resetCart());
      refetch();
      toast.success("Payment completed successfully");
    } catch (nextError: any) {
      toast.error(
        nextError?.data?.error ||
          nextError?.data?.message ||
          nextError?.message ||
          "Unable to record payment",
      );
    }
  };

  const onError = (nextError: unknown) => {
    const paypalError = nextError as { message?: string };
    toast.error(paypalError?.message || "Payment error");
  };

  const deliverHandler = async () => {
    if (!orderId) return;

    await deliverOrder(orderId).unwrap();
    refetch();
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <Message variant="danger">
          {(error as any)?.data?.error ||
            (error as any)?.data?.message ||
            "Unable to load order"}
        </Message>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-muted py-10">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-6 rounded-3xl border border-border bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  Order confirmed
                </p>
                <h1 className="mt-2 text-3xl font-bold text-text-primary">
                  Complete your payment
                </h1>
                <p className="mt-2 text-text-secondary">
                  Order #{order?._id} is ready. Review the details below and
                  finish checkout with PayPal.
                </p>
              </div>
              <div className="rounded-2xl bg-surface-muted px-4 py-3 text-sm text-text-secondary">
                Placed {formatDateTime(order?.createdAt)}
              </div>
            </div>
          </div>

          <div className="mb-8 rounded-3xl border border-border bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-surface-muted p-5">
                <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-text-secondary">
                  Shipping
                </h2>
                <p className="mt-3 font-semibold text-text-primary">
                  {order?.user?.username}
                </p>
                <p className="mt-1 text-text-secondary">{order?.user?.email}</p>
                <p className="mt-3 text-text-secondary">
                  {order?.shippingAddress.address},{" "}
                  {order?.shippingAddress.city}{" "}
                  {order?.shippingAddress.postalCode},{" "}
                  {order?.shippingAddress.country}
                </p>
              </div>

              <div className="rounded-2xl bg-surface-muted p-5">
                <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-text-secondary">
                  Payment Status
                </h2>
                <p className="mt-3 font-semibold text-text-primary">
                  {order?.paymentMethod}
                </p>
                <div className="mt-3">
                  {order?.isPaid ? (
                    <Message variant="success">
                      Paid on {formatDateTime(order?.paidAt)}
                    </Message>
                  ) : (
                    <Message variant="danger">Awaiting PayPal payment</Message>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-text-primary">
                Items in this order
              </h2>
              <span className="rounded-full bg-primary-subtle px-3 py-1 text-sm font-semibold text-primary">
                {order?.orderItems.length || 0} item
                {order?.orderItems.length === 1 ? "" : "s"}
              </span>
            </div>

            {order?.orderItems.length === 0 ? (
              <Message>Order is empty</Message>
            ) : (
              <div className="space-y-4">
                {order?.orderItems.map((item) => (
                  <div
                    key={item.product}
                    className="flex flex-col gap-4 rounded-2xl border border-border p-4 sm:flex-row sm:items-center"
                  >
                    <img
                      src={getPrimaryImage(item.images)}
                      alt={item.name}
                      className="h-24 w-24 rounded-2xl object-cover"
                    />

                    <div className="flex-1">
                      <Link
                        to={`/product/${item.product}`}
                        className="text-lg font-semibold text-text-primary transition hover:text-primary"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-2 text-sm text-text-secondary">
                        {item.qty} x {formatCurrency(item.price)}
                      </p>
                    </div>

                    <div className="text-right text-lg font-semibold text-text-primary">
                      {formatCurrency(item.qty * item.price)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-3xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-text-primary">
              Order Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between text-text-secondary">
                <span>Items</span>
                <span>{formatCurrency(order?.itemsPrice ?? 0)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Shipping</span>
                <span>
                  {order?.shippingPrice === 0
                    ? "Free"
                    : formatCurrency(order?.shippingPrice ?? 0)}
                </span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Tax</span>
                <span>{formatCurrency(order?.taxPrice ?? 0)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-4 text-lg font-semibold text-text-primary">
                <span>Total</span>
                <span>{formatCurrency(order?.totalPrice ?? 0)}</span>
              </div>
            </div>

            {!order?.isPaid && (
              <div className="mt-6 rounded-2xl border border-border bg-surface-muted p-4">
                <h3 className="text-base font-semibold text-text-primary">
                  Finish with PayPal
                </h3>
                <p className="mt-2 text-sm text-text-secondary">
                  Pay now to confirm the order and start fulfillment.
                </p>

                <div className="mt-4">
                  {loadingPay && <Loader />}
                  {loadingPayPal ? (
                    <Loader />
                  ) : errorPayPal ? (
                    <Message variant="danger">
                      Unable to load PayPal. Please try again later.
                    </Message>
                  ) : isPending ? (
                    <Loader />
                  ) : (
                    <PayPalButtons
                      createOrder={createPayPalOrder}
                      onApprove={onApprove}
                      onError={onError}
                    />
                  )}
                </div>
              </div>
            )}

            {order?.isPaid && (
              <div className="mt-6 rounded-2xl bg-green-50 px-4 py-4 text-sm text-green-700">
                Payment received. We&apos;re preparing this order for shipment.
              </div>
            )}

            {loadingDeliver && <Loader />}
            {userInfo &&
              userInfo.isAdmin &&
              order?.isPaid &&
              !order?.isDelivered && (
                <button
                  type="button"
                  className="mt-6 w-full rounded-lg bg-primary py-3 font-semibold text-white transition hover:bg-primary"
                  onClick={deliverHandler}
                >
                  Mark As Delivered
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
