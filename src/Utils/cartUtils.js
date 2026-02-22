export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

// Validate item stock
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
  // Filter out items that are out of stock or exceed available quantity
  state.cartItems = state.cartItems.filter((item) => {
    if (!item.countInStock || item.countInStock <= 0) {
      return false;
    }
    if (item.qty > item.countInStock) {
      item.qty = item.countInStock;
    }
    return true;
  });

  // Calculate the items price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
  );

  // Calculate the shipping price
  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);

  // Calculate the tax price
  state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));

  // Calculate the total price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  // Save the cart to localStorage
  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
