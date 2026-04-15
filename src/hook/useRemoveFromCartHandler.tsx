import { useRemoveFromCartMutation } from "../redux/api/cartApiSlice";
import { toast } from "react-toastify";

export const useRemoveFromCartHandler = () => {
  const [removeFromCart] = useRemoveFromCartMutation();

  const removeFromCartHandler = async (productId: string) => {
    try {
      await removeFromCart(productId).unwrap();

      toast.success("Item removed from cart", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };

      toast.error(err?.data?.message || "Failed to remove from cart", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  return removeFromCartHandler;
};
