import { useUpdateCartQtyMutation } from "../redux/api/cartApiSlice";
import { toast } from "react-toastify";

export const useUpdateCartQtyHandler = () => {
  const [updateCartQty] = useUpdateCartQtyMutation();

  const updateCartQtyHandler = async (productId: string, qty: number) => {
    if (qty < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    try {
      await updateCartQty({
        productId,
        qty,
      }).unwrap();

      toast.success("Cart updated", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 1500,
      });
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };

      toast.error(err?.data?.message || "Failed to update cart", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
      });
    }
  };

  return updateCartQtyHandler;
};
