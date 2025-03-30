import React from 'react';
import { Product } from '../types/product';
import ProductCard from './ProductCard';
import styles from './ProductList.module.css';

interface ProductListProps {
  products: Product[];
  onLike: (id: number) => void;
  onDelete: (id: number) => void;
  onProductClick: (id: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onLike,
  onDelete,
  onProductClick
}) => {
  if (products.length === 0) {
    return <div className={styles.noProducts}>No products found</div>;
  }

  return (
    <div className={styles.productsContainer}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onLike={() => onLike(product.id)}
          onDelete={() => onDelete(product.id)}
          onClick={() => onProductClick(product.id)}
        />
      ))}
    </div>
  );
};

export default ProductList;