import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductsStore } from '../storage/productStore';
import { Product } from '../types/product';
import styles from './ProductDetailsPage.module.css';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { fetchProduct, updateProduct } = useProductsStore();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (!id) throw new Error('Product ID not provided');
        setLoading(true);
        const data = fetchProduct(parseInt(id));
        if (data) {
          setProduct(data);
          setEditedProduct(data);
          setImagePreviews(data.images);
        } else {
          throw new Error('Product not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id, fetchProduct]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editedProduct) return;

    if (editedProduct.price < 0) {
      setError("Price can't be negative");
      return;
    }

    const updatedProduct = {
      ...editedProduct,
      images: imagePreviews,
      thumbnail: imagePreviews[0],
    };

    updateProduct(updatedProduct);
    setProduct(updatedProduct);
    setIsEditing(false);
    setNewImages([]);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProduct(product);
    setNewImages([]);
    setImagePreviews(product?.images || []);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setEditedProduct(prev => {
      if (!prev) return null;
      
      if (name === 'price') {
        const numValue = parseFloat(value);
        return { ...prev, [name]: isNaN(numValue) ? 0 : numValue };
      }
      
      return { ...prev, [name]: value };
    });
  };

  const handlePriceBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setEditedProduct(prev => prev && { ...prev, price: parseFloat(value.toFixed(2)) });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImages([...newImages, ...files]);

      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);

    if (index >= (product?.images.length || 0)) {
      const updatedNewImages = [...newImages];
      updatedNewImages.splice(index - (product?.images.length || 0), 1);
      setNewImages(updatedNewImages);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!product) return <div className={styles.notFound}>Product not found</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => navigate('/products')}
        >
          ← Back to Products
        </button>
        <button className={styles.editButton} onClick={handleEdit}>
          Edit Product
        </button>
      </div>

      <div className={styles.productContainer}>
        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            <img
              src={imagePreviews[activeImageIndex]}
              alt={product.title}
              className={styles.image}
            />
          </div>
          {imagePreviews.length > 0 && (
            <div className={styles.thumbnails}>
              {imagePreviews.map((img, index) => (
                <div key={index} className={styles.thumbnailContainer}>
                  <button
                    className={`${styles.thumbnail} ${index === activeImageIndex ? styles.active : ''}`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} />
                  </button>
                  {isEditing && (
                    <button
                      className={styles.removeImageButton}
                      onClick={() => handleRemoveImage(index)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          {isEditing && (
            <button
              className={styles.addImageButton}
              onClick={triggerFileInput}
            >
              + Add Image
            </button>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            multiple
            style={{ display: 'none' }}
          />
        </div>

        <div className={styles.details}>
          <div className={styles.heading}>
            <h1 className={styles.title}>{product.title}</h1>
            <span className={styles.category}>{product.category}</span>
          </div>

          <div className={styles.priceSection}>
            <span className={styles.price}>${product.price.toFixed(2)}</span>
            {product.price > 500 && (
              <span className={styles.discount}>Free Shipping</span>
            )}
          </div>

          <div className={styles.descriptionSection}>
            <h2 className={styles.subtitle}>Description</h2>
            <p className={styles.description}>{product.description}</p>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Edit Product</h2>
              <button className={styles.closeButton} onClick={handleCancel}>
                ×
              </button>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.filters}>
              <div className={styles.filterGroup}>
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={editedProduct?.title || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.filterGroup}>
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={editedProduct?.category || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.filterGroup}>
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  value={editedProduct?.price.toString() || '0'}
                  onChange={handleInputChange}
                  onBlur={handlePriceBlur}
                />
              </div>
              <div className={styles.filterGroup}>
                <label>Description</label>
                <textarea
                  name="description"
                  value={editedProduct?.description || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.filterGroup}>
                <label>Images</label>
                <div className={styles.thumbnails}>
                  {imagePreviews.map((img, index) => (
                    <div key={index} className={styles.thumbnailContainer}>
                      <div className={styles.thumbnail}>
                        <img src={img} alt={`Preview ${index + 1}`} />
                      </div>
                      <button
                        className={styles.removeImageButton}
                        onClick={() => handleRemoveImage(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className={styles.addImageButton}
                >
                  Add Images
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                onClick={handleSave}
                className={`${styles.button} ${styles.saveButton}`}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;