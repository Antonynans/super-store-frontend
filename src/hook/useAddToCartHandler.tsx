import { useAppSelector, useAppDispatch } from "../redux/store";
import { useAddToCartMutation } from "../redux/api/cartApiSlice";
import { addToCart as addToCartRedux } from "../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import { Product } from "../types";

export const useAddToCartHandler = () => {
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.auth);
  const [addToCart] = useAddToCartMutation();

  const addToCartHandler = async (product: Product, qty: number = 1) => {
    if (!userInfo) {
      toast.error("Please login to add items to cart");
      return;
    }

    if (!product.countInStock || qty > product.countInStock) {
      toast.error("Not enough stock available");
      return;
    }

    dispatch(
      addToCartRedux({
        _id: product._id,
        name: product.name,
        price: product.price,
        images: product.images,
        countInStock: product.countInStock,
        product: {
          _id: product._id,
          name: product.name,
          images: product.images,
          price: product.price,
          countInStock: product.countInStock,
        },
        qty,
      }),
    );

    try {
      await addToCart({
        productId: product._id,
        qty,
      }).unwrap();
      toast.success("Cart updated", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 1500,
      });
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to add to cart");
    }
  };

  return addToCartHandler;
};
