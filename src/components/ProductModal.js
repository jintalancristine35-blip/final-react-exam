// ProductModal.js - FIXED VERSION
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function ProductModal({ product, onClose }) {
  if (!product) return null;

  const { name, price, description, specification, image, quantity, rating } = product;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Don't render anything on the server or during hydration
  if (!mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-black z-10 bg-white rounded-full w-8 h-8 flex items-center justify-center"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Image */}
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover rounded-md mb-3 border-2 border-gray-200"
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = "https://placehold.co/320x240/dddddd/333333?text=No+Image"; 
          }}
        />

        {/* Name */}
        <h2 className="text-2xl font-bold mb-1 text-center text-gray-800">{name}</h2>

        {/* Rating */}
        {rating !== undefined && (
          <p className="text-sm text-yellow-500 text-center mb-2">
            {'⭐'.repeat(Math.floor(rating))} {rating}/5.0
          </p>
        )}

        {/* Price */}
        <p className="text-3xl font-extrabold text-red-600 text-center mb-4">${price.toFixed(2)}</p>

        {/* Stock */}
        {quantity > 0 ? (
          <p className="text-base font-semibold text-green-700 text-center bg-green-50 py-1 rounded">In Stock: {quantity}</p>
        ) : (
          <p className="text-base font-semibold text-red-600 text-center bg-red-50 py-1 rounded">Out of Stock</p>
        )}

        <hr className="my-4"/>
        
        {/* Description */}
        {description && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Description</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        )}

        {/* Specification */}
        {specification && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Specifications</h3>
            <p className="text-sm text-gray-500 italic">{specification}</p>
          </div>
        )}
      </div>
    </div>
  );

  // Create portal directly to document.body instead of using a separate root
  return createPortal(modalContent, document.body);
}