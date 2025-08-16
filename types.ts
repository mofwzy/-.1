
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  barcode: string;
}

export interface Customer {
  id: string;
  name:string;
  phone: string;
  email?: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  customerId?: string;
  createdAt: string; // ISO string
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  createdAt: string; // ISO string
}

export interface User {
    id: string;
    email: string;
    isManager: boolean;
}
