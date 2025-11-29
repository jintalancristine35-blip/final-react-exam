'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import ProductList from '../components/ProductList';
import ProductModal from '../components/ProductModal';

import { useGlobalCart } from '../app/state/useGlobalCartContext';

export default function HomePage() {
  // Use the global hook as the source of truth for cart data and functions
  const { 
    products, 
    cart, 
    handleUpdateCart, 
    overallTotal, 
    totalCartItems 
  } = useGlobalCart();

  // State local to HomePage (Product viewing/filtering)
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleOpenProductDetails = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseProductDetails = () => { 
    setSelectedProduct(null);
  };

  useEffect(() => {
    if (selectedCategory !== 'All') {
        setSelectedCategory('All');
    }
  }, [products.length]); 

  // Req 1: Filter the product list (remains local)
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') {
      return products;
    }
    return products.filter(product => product.category === selectedCategory);
  }, [products, selectedCategory]);
	
	return (
		<>
			<div className="container mx-auto p-4 max-w-9xl pb-28">
				<h1 className="text-4xl font-extrabold text-red-600 mb-1">Product Management App</h1>

				{/* Product List Component */}
				<ProductList
					products={filteredProducts}
					cart={cart}
					onUpdateCart={handleUpdateCart}
					selectedCategory={selectedCategory}
					setSelectedCategory={setSelectedCategory}
					onOpenProductDetails={handleOpenProductDetails} // NEW: Pass handler
				/>

				{/* Total Display and Checkout Button (Fixed to the bottom) */}
				<div className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-300 shadow-2xl">
					<div className="container mx-auto p-4 max-w-7xl flex justify-between items-center">
						<h2 className="text-2xl font-bold text-gray-800">Overall Cart Total ({totalCartItems} Items): 
							<span className="text-red-600 ml-2">
								${overallTotal.toFixed(2)}
							</span>
						</h2>

						{/* View Cart Button */}
						<Link 
							href="/cart" 
							className={`py-3 px-8 text-white font-bold rounded-lg shadow-lg transition-transform transform ${
								totalCartItems > 0 
									? 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02]' 
									: 'bg-gray-400 cursor-not-allowed'
							}`}>
							{totalCartItems > 0 ? `Checkout (${totalCartItems} Items)` : 'Cart Empty'}
						</Link>
					</div>
				</div>

				{/* ADD PRODUCT BUTTON (New Link) */}
				<div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 mb-5">
					<h3 className="text-xl font-semibold text-gray-700 mb-4">Inventory Management</h3>
					<p className="text-gray-500 mb-4">Want to add a temporary product to the inventory list?</p>
					<Link href="/add-product" className="py-3 px-8 bg-red-500 text-white font-bold rounded-lg shadow-lg hover:bg-red-600 transition-colors transform hover:scale-[1.02]">
						Go to Add Product Page
					</Link>
				</div>
			</div>
			{/* END OF MAIN CONTAINER DIV */}

			{/* RENDER PRODUCT MODAL AS A SIBLING (OUTSIDE main div) */}
			{selectedProduct && (
				<ProductModal 
					product={selectedProduct} 
					onClose={handleCloseProductDetails} 
				/>
			)}
		</>
	);
}
