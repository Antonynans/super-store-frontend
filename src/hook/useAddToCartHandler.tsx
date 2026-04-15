import { useAppSelector } from "../redux/store";
import { useAddToCartMutation } from "../redux/api/cartApiSlice";
import { toast } from "react-toastify";
import { Product } from "../types";

export const useAddToCartHandler = () => {
  const { userInfo } = useAppSelector((state) => state.auth);
  const [addToCart] = useAddToCartMutation();

  const addToCartHandler = async (
    productId: string,
    qty: number,
    checkStock: boolean = false,
    product?: Product,
  ) => {
    if (!userInfo) {
      toast.error("Please login to add items to cart", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      return;
    }

    if (checkStock && (!product?.countInStock || product?.countInStock <= 0)) {
      toast.error("Product is out of stock", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      return;
    }

    try {
      await addToCart({
        productId,
        qty,
      }).unwrap();
      toast.success("Product added to cart", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add to cart", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  return addToCartHandler;
};
