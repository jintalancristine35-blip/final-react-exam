// state/useGlobalCart.js
import { useState, useMemo } from 'react'; // REMOVED useEffect
import initialProducts from '../../data/products';

// Helper function to calculate subtotal
export const calculateSubtotal = (price, quantity) => price * quantity;

export const useGlobalCart = () => {
    // 1. **Initial State for all products** - Reset to static initial data on every render/refresh
    const [products, setProducts] = useState(initialProducts);
    
    // 2. **Primary Cart State**
    const [cart, setCart] = useState({}); 

    // --- Inventory Function ---
    const addProduct = (newProduct) => {
        setProducts(prevProducts => {
            // Add the new product to the beginning of the list for easy visibility
            return [newProduct, ...prevProducts];
        });
    };
    // -----------------------------
    
    // Function to update cart state (remains the same)
    const handleUpdateCart = (productId, newQuantity) => {
        setCart(prevCart => {
            if (newQuantity === 0) {
                const { [productId]: removed, ...rest } = prevCart;
                return rest;
            }
            return {
                ...prevCart,
                [productId]: newQuantity,
            };
        });
    };
    
    // --- Computation Logic (remains the same) ---

    // Filter products to get only items in the cart, and compute subtotal
    const cartItemsData = useMemo(() => {
        return products
            .filter(p => cart[p.id] > 0)
            .map(p => ({
                ...p,
                stockLevel: p.quantity,
                cartQuantity: cart[p.id],
                subtotal: calculateSubtotal(p.price, cart[p.id]), 
            }));
    }, [products, cart]);

    // Compute and display the overall total
    const overallTotal = useMemo(() => {
        return cartItemsData.reduce((acc, item) => acc + item.subtotal, 0);
    }, [cartItemsData]);
    
    // Total number of items
    const totalCartItems = useMemo(() => {
        return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    }, [cart]);

    return { 
        products, 
        cart, 
        cartItemsData, 
        handleUpdateCart, 
        overallTotal, 
        totalCartItems,
        addProduct,
    };
};