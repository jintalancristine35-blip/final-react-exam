// components/ProductCard.jsx
import Link from 'next/link';
import { useState, useEffect } from 'react'; // <-- Imported useEffect

export default function ProductCard({
	product,
	cartQuantity, // Current quantity in the global cart (0 or more)
	onUpdateCart,
	onOpenDetails,
}) {
	const { id, name, price, quantity: stockLevel, image } = product;

	// State to hold the quantity the user is *staging* to add to cart
	const [stagedQuantity, setStagedQuantity] = useState(1); 
	
	// Sync the staged quantity with the cart quantity when the item is already in the cart.
	useEffect(() => {
		if (cartQuantity > 0) {
			setStagedQuantity(cartQuantity);
		} else {
			// If the cart quantity is 0, reset staged quantity to 1 for new adds.
			setStagedQuantity(1);
		}
	}, [cartQuantity]);

	const subtotal = price * stagedQuantity; // Use stagedQuantity for local subtotal display
	const isLowStock = stockLevel < 5;

	// This function now controls the local stagedQuantity state
	const handleStagedQuantityChange = (change) => {
		const newQuantity = stagedQuantity + change;
		// Limit the staged quantity by stock level
		if (newQuantity >= 1 && newQuantity <= stockLevel) {
			setStagedQuantity(newQuantity);
		}
	};

	// This function is called only when the ADD/UPDATE button is clicked
	const handleAddToCartClick = () => {
		// If the item is already in the cart, we want to update the cart to the staged quantity.
		// If the item is not in the cart (cartQuantity === 0), we add stagedQuantity.
		if (stagedQuantity >= 1 && stagedQuantity <= stockLevel) {
			onUpdateCart(id, stagedQuantity);
		}
	};
	
	// Logic for the REMOVE button (the '-' button when cartQuantity > 0)
	const handleRemoveFromCart = () => {
		onUpdateCart(id, 0); // Set quantity to 0 to remove from cart
	};


	return (
		<div className="border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow p-4 flex flex-col items-center text-center bg-white">

			{/* Image (click opens modal via onOpenDetails) */}
			<div 
				className="w-full cursor-pointer"
				onClick={() => onOpenDetails(product)}
			>
				<div className="relative w-full h-40 mb-3 rounded-lg overflow-hidden border border-gray-100 group">
					<img 
						src={image} 
						alt={`Feature image of ${name}`} 
						className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-300"
						onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/160x160/dddddd/333333?text=No+Image"; }}
					/>
					{/* Overlay for hover effect */}
					<div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
						<span className="text-white text-sm font-bold bg-black/60 px-3 py-1 rounded">View Details</span>
					</div>
				</div>
			</div>

			{/* Fixed-size info wrapper to keep cards uniform */}
			<div className="flex flex-col items-center justify-start h-36 w-full">
				{/* ... (Name, Price, Stock Badge remain unchanged) ... */}
				
				{/* Product Name */}
				<div className="h-14 flex items-center justify-center mb-1 px-2">
					<h4 className="text-lg font-semibold text-black text-center line-clamp-2">
						{name}
					</h4>
				</div>

				{/* Price */}
				<div className="h-8 flex items-center justify-center mb-1">
					<p className="text-2xl font-extrabold text-red-600">
						${price.toFixed(2)}
					</p>
				</div>

				{/* Stock Badge */}
				<div className="h-7 flex items-center justify-center">
					{isLowStock && stockLevel > 0 && (
						<p className="text-xs font-bold text-white bg-orange-500 px-2 py-0.5 rounded-full shadow-sm">
							Low Stock! ({stockLevel} left)
						</p>
					)}

					{isLowStock && stockLevel <= 0 && (
						<p className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full shadow-sm">
							OUT OF STOCK
						</p>
					)}
				</div>
			</div>

			{/* Quantity Controls (Now controls stagedQuantity) */}
			<div className="flex items-center space-x-3 my-3">
				<button
					// If cartQuantity > 0, the button removes the item from the cart
					onClick={cartQuantity > 0 ? handleRemoveFromCart : () => handleStagedQuantityChange(-1)}
					className="w-8 h-8 flex items-center justify-center border rounded-full text-black bg-gray-100 hover:bg-gray-200 transition-colors text-lg font-bold"
					disabled={cartQuantity === 0 && stagedQuantity <= 1} // Disable '-' if staged is 1 when cart is empty
				>
					{cartQuantity > 0 ? 'x' : '-'}
				</button>

				<span className="font-medium text-xl text-black w-8 text-center">
					{stagedQuantity} {/* Display staged quantity, which syncs with cart quantity */}
				</span>

				<button
					onClick={() => handleStagedQuantityChange(1)}
					className={`w-8 h-8 flex items-center justify-center border rounded-full text-white transition-colors text-lg font-bold ${
						stagedQuantity >= stockLevel || stockLevel === 0
							? 'bg-gray-400'
							: 'bg-red-500 hover:bg-red-600'
					}`}
					disabled={stagedQuantity >= stockLevel || stockLevel === 0}
				>
					+
				</button>
			</div>

			{/* Bottom section aligned to bottom */}
			<div className="mt-auto w-full">

				{/* Subtotal */}
				<p className="text-sm text-black mt-2">
					Subtotal: <span className="font-bold text-red-500">${subtotal.toFixed(2)}</span>
				</p>

				{/* Add to Cart button (Now uses stagedQuantity) */}
				<button
					onClick={handleAddToCartClick}
					className={`mt-4 w-full py-2 font-semibold rounded-lg transition-colors shadow-md ${
						cartQuantity === 0 ? "bg-green-500 text-white hover:bg-green-600" : "bg-blue-500 text-white hover:bg-blue-600"
					}`}
					disabled={stockLevel === 0 || stagedQuantity === cartQuantity}
				>
					{cartQuantity === 0 ? `Add ${stagedQuantity} to Cart` : `Update Cart to ${stagedQuantity}`}
				</button>

				{/* Max stock alert */}
				{stagedQuantity >= stockLevel && (
					<p className="text-xs text-red-500 mt-1 font-semibold">Maximum stock reached!</p>
				)}
				{/* Alert if staged quantity is less than cart quantity, suggesting user needs to click update */}
				{cartQuantity > 0 && stagedQuantity < cartQuantity && (
					<p className="text-xs text-orange-500 mt-1 font-semibold">Click Update to reduce cart quantity.</p>
				)}

			</div>
		</div>
	);
}