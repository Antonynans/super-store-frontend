import { Cart } from "../types";

export const addDecimals = (num: number) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const validateItemStock = (item: {
  countInStock: number;
  qty: number;
}) => {
  if (!item.countInStock || item.countInStock <= 0) {
    return false;
  }
  if (item.qty > item.countInStock) {
    return false;
  }
  return true;
};

export const updateCart = (state: Cart) => {
  state.cartItems = state.cartItems.filter((item) => {
    if (!item.countInStock || item.countInStock <= 0) {
      return false;
    }
    if (item.qty > item.countInStock) {
      item.qty = item.countInStock;
    }
    return true;
  });

  state.itemsPrice = Number(
    addDecimals(
      state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
    ),
  );

  state.shippingPrice = Number(addDecimals(state.itemsPrice > 100 ? 0 : 10));

  state.taxPrice = Number(
    addDecimals(Number((0.15 * state.itemsPrice).toFixed(2))),
  );

  state.totalPrice = Number(
    (
      Number(state.itemsPrice) +
      Number(state.shippingPrice) +
      Number(state.taxPrice)
    ).toFixed(2),
  );

  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
