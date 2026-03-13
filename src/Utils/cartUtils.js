export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const validateItemStock = (item) => {
  if (!item.countInStock || item.countInStock <= 0) {
    return false;
  }
  if (item.qty > item.countInStock) {
    return false;
  }
  return true;
};

export const updateCart = (state) => {
  state.cartItems = state.cartItems.filter((item) => {
    if (!item.countInStock || item.countInStock <= 0) {
      return false;
    }
    if (item.qty > item.countInStock) {
      item.qty = item.countInStock;
    }
    return true;
  });

  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
  );

  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);

  state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));

  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
