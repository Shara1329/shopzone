import type { Product } from "../data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  customer?: CustomerDetails;
}
