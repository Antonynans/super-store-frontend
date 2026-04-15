export interface Product {
  _id: string;
  name: string;
  images: string[];
  category: string;
  description: string;
  reviews: Review[];
  rating: number;
  numReviews: number;
  price: number;
  countInStock: number;
  createdAt: string;
  updatedAt: string;
}

export interface AllProduct {
  _id: string;
  name: string;
  images: string[];
  category: {
    name: string;
    _id: string;
  };
  description: string;
  reviews: Review[];
  rating: number;
  numReviews: number;
  price: number;
  countInStock: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  name: string;
  rating: number;
  comment: string;
  user: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  page: number;
  pages: number;
  total: number;
}

export interface CartItem {
  product: {
    _id: string;
    name: string;
    images: string[];
    price: number;
  };
  name: string;
  images: string[];
  price: number;
  countInStock: number;
  qty: number;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Cart {
  _id: string;
  user: string;
  cartItems: CartItem[];
  shippingAddress?: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  error: any;
  _id: string;
  name: string;
}

export interface OrderItem {
  name: string;
  qty: number;
  images: string[];
  price: number;
  product: string;
}

export interface Order {
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
  orderItems: OrderItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentResult?: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Wishlist {
  _id: string;
  user: string;
  products: Product[];
  createdAt: string;
  updatedAt: string;
}
