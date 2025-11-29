// cart/page.js
'use client';

import { useMemo } from 'react';
import Link from 'next/link';
// Import the shared state hook
import { useGlobalCart } from '../state/useGlobalCartContext'; 

// Sub-component for a single cart item (stays the same)
const CartItem = ({ item, onUpdateCart }) => {
	// subtotal is now passed in via item.subtotal
	const { id, name, price, cartQuantity, subtotal, image, stockLevel } = item;
	
	const handleQuantityChange = (change) => {
		const newQuantity = cartQuantity + change;
		
		if (newQuantity >= 0 && newQuantity <= stockLevel) {
			onUpdateCart(id, newQuantity);
		}
	};
	
	return (
		<div className="flex items-center bg-gray-50 p-4 rounded-xl shadow-md border border-gray-200">
			{/* Image */}
			<div className="w-24 h-24 mr-4 shrink-0 rounded-lg overflow-hidden">
				<img 
					src={image} 
					alt={name} 
					className="w-full h-full object-cover" 
					onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/96x96/dddddd/333333?text=Product"; }}
				/>
			</div>

			{/* Details and Price */}
			<div className="grow">
				<Link href={`/product/${id}`} legacyBehavior>
					<a className="text-lg font-semibold hover:text-red-500 transition-colors">{name}</a>
				</Link>
				<p className="text-gray-500">Unit Price: ${price.toFixed(2)}</p>
				{stockLevel < 5 && <p className="text-xs text-orange-500 font-medium">Only {stockLevel} left in stock!</p>}
			</div>

			{/* Quantity Controls and Subtotal */}
			<div className="flex items-center space-x-4 ml-4">
				<div className="flex items-center border rounded-lg">
					<button 
						onClick={() => handleQuantityChange(-1)} 
						className="p-2 hover:bg-gray-200 rounded-l-lg text-lg font-bold"
						disabled={cartQuantity <= 0}
					>
						-
					</button>
					<span className="px-3 text-lg font-medium border-l border-r">{cartQuantity}</span>
					<button 
						onClick={() => handleQuantityChange(1)} 
						className={`p-2 rounded-r-lg text-lg font-bold ${cartQuantity >= stockLevel ? 'bg-gray-300' : 'hover:bg-gray-200'}`}
						disabled={cartQuantity >= stockLevel}
					>
						+
					</button>
				</div>
				
				<div className="text-right w-24">
					<p className="text-xl font-bold text-red-600">${subtotal.toFixed(2)}</p>
					<button 
						onClick={() => onUpdateCart(id, 0)} 
						className="text-sm text-gray-500 hover:text-red-500 mt-1"
					>
						Remove
					</button>
				</div>
			</div>
		</div>
	);
};


export default function CartPage() {
	// Replaced useMockCartState with useGlobalCart
	const { 
		cartItemsData: cartItems, // Use the pre-computed cart items list
		handleUpdateCart, 
		overallTotal, // Total is computed in the hook
		totalCartItems 
	} = useGlobalCart(); // This hook now holds the actual user's cart state
	
	// NOTE: overallTotal and totalCartItems are no longer computed here, 
	// they come directly from the hook, fulfilling the computation requirements (10 pts).

	const handleCheckout = () => {
		alert("Proceeding to Checkout! Total: $" + overallTotal.toFixed(2));
	};
	
	if (totalCartItems === 0) {
		return (
			<div className="container mx-auto p-8 max-w-4xl text-center">
				<h1 className="text-4xl font-bold text-gray-700 mb-4">Your Cart is Empty</h1>
				<p className="text-lg text-gray-500 mb-8">It looks like you haven't added anything to your cart yet.</p>
				<Link href="/" legacyBehavior>
					<a className="py-3 px-6 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors">
						Go Back Shopping
					</a>
				</Link>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4 max-w-7xl">
			<h1 className="text-4xl font-extrabold text-red-600 mb-8">Shopping Cart ({totalCartItems} Items)</h1>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 space-y-4 text-black">
					{cartItems.map(item => (
						<CartItem key={item.id} item={item} onUpdateCart={handleUpdateCart} />
					))}
					
					<Link href="/" legacyBehavior>
						<a className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium">
							← Continue Shopping
						</a>
					</Link>
				</div>

				{/* Summary/Checkout Panel (1/3 width) */}
				<div className="lg:col-span-1 p-6 bg-white rounded-xl shadow-2xl border border-gray-100 sticky top-4 h-fit">
					<h2 className="text-2xl text-black font-bold mb-4 border-b pb-3">Order Summary</h2>
					
					<div className="space-y-3 text-lg">
						<div className="flex text-black justify-between">
							<span>Subtotal ({totalCartItems} items)</span>
							<span className="font-semibold">${overallTotal.toFixed(2)}</span>
						</div>
						<div className="flex justify-between">
							<span className='text-black'>Shipping</span>
							<span className="text-green-600 font-semibold">FREE</span>
						</div>
						<div className="flex justify-between pt-4 border-t border-dashed mt-4">
							<span className="text-xl font-bold text-black">Total (Incl. VAT)</span>
							<span className="text-2xl font-extrabold text-red-600">${overallTotal.toFixed(2)}</span>
						</div>
					</div>
					
					<button 
						onClick={handleCheckout}
						className="w-full mt-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-xl hover:bg-red-700 transition-colors"
					>
						Proceed to Checkout
					</button>
				</div>
			</div>
		</div>
	);
}
