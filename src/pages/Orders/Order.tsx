import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";
import getPrimaryImage from "../../Utils/getPrimaryImage";
import { RootState } from "../../redux/store";

const Order = () => {
  const { id: orderId } = useParams<{ id: string }>();

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

  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

 const isPayPalReady = paypal?.clientId && order && !order.isPaid;

// useEffect(() => {
//   if (!isPayPalReady || errorPayPal || loadingPayPal) return;

//   paypalDispatch({
//     type: "setOptions",
//     value: {
//       "client-id": paypal.clientId,
//       currency: "USD",
//     },
//   });

//   paypalDispatch({ type: "setLoadingStatus", value: "pending" });
// }, [isPayPalReady, errorPayPal, loadingPayPal, paypalDispatch]);

  // const onApprove = async (data: any, actions: any) => {
  //   const details = await actions.order.capture();

  //   try {
  //     await payOrder({ orderId, details }).unwrap();
  //     refetch();
  //     toast.success("Order is paid");
  //   } catch (error: unknown) {
  //     const err = error as { data?: { message?: string }; message?: string };
  //     toast.error(err?.data?.message || err?.message);
  //   }
  // };

  const createOrder = (data: any, actions: any) => {
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

  const onError = (err: unknown) => {
    const error = err as { message?: string };
    toast.error(error?.message || "Payment error");
  };

  const deliverHandler = async () => {
    if (!orderId) return;

    await deliverOrder(orderId).unwrap();
    refetch();
  };
  return isLoading ? (
    <Loader />
  ) : error ? (
    toast.error((error as any)?.data?.message)
  ) : (
    <div className="container flex flex-col ml-[10rem] md:flex-row">
      <div className="md:w-2/3 pr-4">
        <div className="border gray-300 mt-5 pb-4 mb-5">
          {order?.orderItems.length === 0 ? (
            <Message>Order is empty</Message>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-[80%]">
                <thead className="border-b-2">
                  <tr>
                    <th className="p-2">Image</th>
                    <th className="p-2">Product</th>
                    <th className="p-2 text-center">Quantity</th>
                    <th className="p-2">Unit Price</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {order?.orderItems.map((item) => (
                    <tr key={item.product}>
                      <td className="p-2">
                        <img
                          src={getPrimaryImage(item.images)}
                          alt={item.name}
                          className="w-16 h-16 object-cover"
                        />
                      </td>

                      <td className="p-2">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </td>

                      <td className="p-2 text-center">{item.qty}</td>
                      <td className="p-2 text-center">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(item.price)}
                      </td>
                      <td className="p-2 text-center">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(item.qty * item.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="md:w-1/3">
        <div className="mt-5 border-gray-300 pb-4 mb-4">
          <h2 className="text-xl font-bold mb-2">Shipping</h2>
          <p className="mb-4 mt-4">
            <strong className="text-pink-500">Order:</strong> {order?._id}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Name:</strong>{" "}
            {order?.user?.username}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Email:</strong>{" "}
            {order?.user?.email}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Address:</strong>{" "}
            {order?.shippingAddress.address}, {order?.shippingAddress.city}{" "}
            {order?.shippingAddress.postalCode},{" "}
            {order?.shippingAddress.country}
          </p>

          <p className="mb-4">
            <strong className="text-pink-500">Method:</strong>{" "}
            {order?.paymentMethod}
          </p>

          {order?.isPaid ? (
            <Message variant="success">Paid on {order?.paidAt}</Message>
          ) : (
            <Message variant="danger">Not paid</Message>
          )}
        </div>

        <h2 className="text-xl font-bold mb-2 mt-[3rem]">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Items</span>
          <span>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(order?.itemsPrice ?? 0)}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(order?.shippingPrice ?? 0)}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tax</span>
          <span>
            {" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(order?.taxPrice ?? 0)}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Total</span>
          <span>
            {" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(order?.totalPrice ?? 0)}
          </span>
        </div>

        {!order?.isPaid && (
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
              <div>
                <h3 className="text-lg font-semibold mb-4">Payment</h3>
                <PayPalButtons
                  createOrder={createOrder}
                  // onApprove={onApprove}
                  onError={onError}
                ></PayPalButtons>
              </div>
            )}
          </div>
        )}

        {loadingDeliver && <Loader />}
        {userInfo &&
          userInfo.isAdmin &&
          order?.isPaid &&
          !order?.isDelivered && (
            <div>
              <button
                type="button"
                className="bg-pink-500 text-white w-full py-2"
                onClick={deliverHandler}
              >
                Mark As Delivered
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default Order;
