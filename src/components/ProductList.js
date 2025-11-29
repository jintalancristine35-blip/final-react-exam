import { useState } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';

const ALL_CATEGORIES = ['All', 'Electronics', 'Furniture', 'Home & Kitchen', 'Apparel'];

export default function ProductList({ 
  products, 
  cart, 
  onUpdateCart, 
  selectedCategory, 
  setSelectedCategory,
  onOpenProductDetails, // This prop is coming from page.js
}) {
  const categories = ALL_CATEGORIES;

  return (
    <div className="py-8">
      {/* Category Filters */}
      <div className="flex flex-wrap gap-8 mb-8 justify-center p-4 bg-gray-50 rounded-xl shadow-inner">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`py-2 px-6 rounded-full font-semibold transition-all duration-200 shadow-md ${
              selectedCategory === category
                ? 'bg-red-600 text-white shadow-red-300 transform scale-[1.05]'
                : 'bg-white text-gray-700 hover:bg-red-100 hover:text-red-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map(product => (
          <ProductCard 
            key={product.id}
            product={product}
            cartQuantity={cart[product.id] || 0}
            onUpdateCart={onUpdateCart}
            onOpenDetails={onOpenProductDetails} // This passes the function from page.js
          />
        ))}
      </div>
    </div>
  );
}