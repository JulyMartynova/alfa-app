import React from 'react';
import { Product } from '../types/product';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  onLike: () => void;
  onDelete: () => void;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onLike, 
  onDelete, 
  onClick 
}) => {
  return (
    <div className={styles.product} onClick={onClick}>
      <button 
        className={`${styles.favourite} ${product.liked ? styles.liked : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onLike();
        }}
      >
        {product.liked ? '♥' : '♡'}
      </button>
      
      <button 
        className={styles.toDelete}
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        ×
      </button>
      
      <img 
        src={product.images[0]} 
        alt={product.title} 
        className={styles.productImage}
      />
      
      <div className={styles.info}>
        <h3 className={styles.heading}>{product.title}</h3>
        <p className={styles.description}>
          {product.description.length > 100 
            ? `${product.description.substring(0, 100)}...` 
            : product.description}
        </p>
        <div className={styles.details}>
          <span className={styles.type}>{product.category}</span>
          <span className={styles.price}>${product.price}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;