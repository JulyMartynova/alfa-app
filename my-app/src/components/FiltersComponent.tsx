import React from 'react';
import { Filters } from '../types/product';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import styles from './Filters.module.css';

interface FiltersProps {
  filters: Filters;
  categories: string[];
  onFilterChange: (filters: Partial<Filters>) => void;
  minPrice: number;
  maxPrice: number;
}

const FiltersComponent: React.FC<FiltersProps> = ({ 
  filters, 
  categories, 
  onFilterChange,
  minPrice,
  maxPrice
}) => {
  return (
    <div className={styles.filters}>
      <div className={styles.filterGroup}>
        <label>
          Price range: ${filters.priceMin || minPrice} - ${filters.priceMax || maxPrice}
        </label>
        <Slider
          range
          min={minPrice}
          max={maxPrice}
          value={[Number(filters.priceMin || minPrice), Number(filters.priceMax || maxPrice)]}
          onChange={(value) => {
            if (Array.isArray(value)) {
              onFilterChange({
                priceMin: value[0].toString(),
                priceMax: value[1].toString()
              });
            }
          }}
          trackStyle={{ backgroundColor: '#646cff' }}
          railStyle={{ backgroundColor: '#e0e0e0' }}
          handleStyle={{
            borderColor: '#646cff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        />
      </div>

      <div className={styles.filterGroup}>
        <input
          type="text"
          placeholder="Search products..."
          value={filters.searchQuery}
          onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
          className={styles.searchInput}
        />
      </div>
      
      <div className={styles.filterGroup}>
        <label>Category:</label>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange({ category: e.target.value })}
          className={styles.selectInput}
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      
      <div className={styles.filterGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={filters.showFavorites}
            onChange={(e) => onFilterChange({ showFavorites: e.target.checked })}
            className={styles.checkboxInput}
          />
          Show Favorites Only
        </label>
      </div>
    </div>
  );
};

export default FiltersComponent;