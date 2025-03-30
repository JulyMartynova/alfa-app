import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductsStore } from '../storage/productStore';

import styles from './CreateProductPage.module.css';

const CreateProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { createProduct } = useProductsStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    images: [] as string[]
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);

      const validImages = files.filter(file =>
        file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB
      );

      if (validImages.length !== files.length) {
        setError('Please upload only images (max 5MB each)');
        return;
      }

      const newPreviews = validImages.map(file => URL.createObjectURL(file));

      setImagePreviews([...imagePreviews, ...newPreviews]);
      setFormData({
        ...formData,
        images: [...formData.images, ...newPreviews]
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);

    setImagePreviews(updatedPreviews);
    setFormData({
      ...formData,
      images: updatedPreviews
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.description || !formData.category) {
      setError('Please fill all required fields');
      return;
    }

    if (formData.images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    createProduct({
      title: formData.title,
      price: parseFloat(formData.price),
      description: formData.description,
      category: formData.category,
      images: formData.images,
      thumbnail: formData.images[0]
    });

    imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    navigate('/products');
  };

  return (
    <div className={styles.wrapper}>
      <h1>Create Product</h1>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className={styles.input}
            placeholder="Enter product title"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Price *</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            className={styles.input}
            placeholder="0.00"
          />
        </div>

        <div className={styles.formGroup}>
          <label>Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className={styles.textarea}
            placeholder="Enter detailed description"
            rows={5}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Category *</label>
          <input
                  type="text"
                  name="category"
                  placeholder='Введите имя категории'
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                />
        </div>

        <div className={styles.formGroup}>
          <label>Images *</label>
          <div className={styles.imageUploadContainer}>
            {imagePreviews.map((preview, index) => (
              <div key={index} className={styles.imagePreviewWrapper}>
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className={styles.imagePreview}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className={styles.removeImageButton}
                >
                  ×
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={triggerFileInput}
              className={styles.uploadButton}
            >
              {imagePreviews.length > 0 ? 'Add More Images' : 'Upload Images'}
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              style={{ display: 'none' }}
            />

            {imagePreviews.length > 0 && (
              <p className={styles.imageHint}>
                {imagePreviews.length} image(s) selected. Click to add more.
              </p>
            )}
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className={styles.cancelButton}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={!formData.title || !formData.price || !formData.description || !formData.category || formData.images.length === 0}
          >
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProductPage;
