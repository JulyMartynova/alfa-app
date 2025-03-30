import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Filters } from '../types/product';
import { fetchProducts as apiFetchProducts } from '../api/productsApi';

interface ProductsStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  filters: Filters;
  fetchProducts: () => Promise<void>;
  fetchProduct: (id: number) => Product | undefined;
  createProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
  toggleLike: (id: number) => void;
  setFilters: (filters: Partial<Filters>) => void;
  getFilteredProducts: () => Product[];
}

export const useProductsStore = create<ProductsStore>()(
  persist(
    (set, get) => ({
      products: [],
      loading: false,
      error: null,
      filters: {
        category: 'all',
        showFavorites: false,
        searchQuery: '',
        priceMin: '',
        priceMax: '',
      },

      fetchProducts: async () => {
        set({ loading: true });
        try {
          const storedProducts = get().products;
          if (storedProducts.length === 0) {
            const products = await apiFetchProducts();
            set({ products });
          }
        } catch (error) {
          set({ error: 'Failed to load products' });
        } finally {
          set({ loading: false });
        }
      },

      fetchProduct: (id) => {
        return get().products.find(p => p.id === id);
      },

      createProduct: (product) => {
        const newProduct: Product = {
          ...product,
          id: Date.now(),
          liked: false,
          thumbnail: product.images?.[0] || 'https://via.placeholder.com/150',
        };
        set(state => ({ products: [...state.products, newProduct] }));
      },

      updateProduct: (product) => {
        set(state => ({
          products: state.products.map(p =>
            p.id === product.id ? product : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set(state => ({
          products: state.products.filter(p => p.id !== id)
        }));
      },

      toggleLike: (id) => {
        set(state => ({
          products: state.products.map(p =>
            p.id === id ? { ...p, liked: !p.liked } : p
          ),
        }));
      },

      setFilters: (filters) => {
        set(state => ({ filters: { ...state.filters, ...filters } }));
      },

      getFilteredProducts: () => {
        const { products, filters } = get();
        return products.filter(p => {
          const price = p.price;
          const minPrice = filters.priceMin ? Number(filters.priceMin) : 0;
          const maxPrice = filters.priceMax ? Number(filters.priceMax) : Infinity;

          return (
            price >= minPrice &&
            price <= maxPrice &&
            (filters.category === 'all' || p.category === filters.category) &&
            (!filters.showFavorites || p.liked) &&
            (p.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(filters.searchQuery.toLowerCase()))
          );
        });
      },
    }),
    {
      name: 'products-storage',
      partialize: (state) => ({
        products: state.products,
        filters: state.filters,
      }),
    }
  )
);
