import { Product } from '../types/product';

const API_URL = 'https://dummyjson.com/products';

export interface ApiResponse<T> {
    data: T;
    status: number;
  }
  
  // Пример реализации функций API:
  export const fetchProducts = async (): Promise<Product[]> => {
    try {
      const response = await fetch('https://dummyjson.com/products');
      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  };


