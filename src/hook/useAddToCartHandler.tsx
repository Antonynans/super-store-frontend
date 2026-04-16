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
        image: product.images?.[0],
        countInStock: product.countInStock,
        qty,
      }),
    );

    try {
      await addToCart({
        productId: product._id,
        qty,
      }).unwrap();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add to cart");
    }
  };

  return addToCartHandler;
};
