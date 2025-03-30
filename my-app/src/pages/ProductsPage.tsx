import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductsStore } from '../storage/productStore';
import ProductList from '../components/ProductList';
import Filters from '../components/FiltersComponent';
import styles from './ProductsPage.module.css';

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    products,
    error,
    filters,
    setFilters,
    getFilteredProducts,
    deleteProduct,
    toggleLike,
    fetchProducts
  } = useProductsStore();

  const filteredProducts = getFilteredProducts();

  const categories = Array.from(
    new Set(products.map(p => p.category))
  );

  const minPrice = products.length > 0
    ? Math.min(...products.map(p => p.price))
    : 0;
  const maxPrice = products.length > 0
    ? Math.max(...products.map(p => p.price))
    : 1000;

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (products.length === 0) {
    return <div className={styles.empty}>
      No products found. <button onClick={() => navigate('/create-product')}>Create first</button>
    </div>;
  }

  return (
    <div className={styles.wrapper}>
      <h1>Products</h1>

      <Filters
        filters={filters}
        categories={categories}
        onFilterChange={setFilters}
        minPrice={minPrice}
        maxPrice={maxPrice}
      />

      <ProductList
        products={filteredProducts}
        onLike={toggleLike}
        onDelete={deleteProduct}
        onProductClick={(id) => navigate(`/products/${id}`)}
      />

      <button
        className={styles.create}
        onClick={() => navigate('/create-product')}
      >
        +
      </button>
    </div>
  );
};

export default ProductsPage;
