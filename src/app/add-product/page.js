// add-product/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGlobalCart } from '../state/useGlobalCartContext';

const ALL_CATEGORIES = ['Electronics', 'Furniture', 'Home & Kitchen', 'Apparel'];

export default function AddProductPage() {
    const router = useRouter();
    const { addProduct } = useGlobalCart();

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        quantity: '',
        category: ALL_CATEGORIES[0],
        image: 'https://placehold.co/200x200/5283FF/ffffff?text=New+Product',
        description: '',
    });

    const [message, setMessage] = useState(null);
    const [imagePreview, setImagePreview] = useState(formData.image);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const url = e.target.value;
        setFormData(prev => ({ ...prev, image: url }));
        setImagePreview(url);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.price || !formData.quantity) {
            setMessage({ type: 'error', text: 'Please fill in Name, Price, and Quantity.' });
            return;
        }

        const newProduct = {
            ...formData,
            id: Date.now().toString(),
            price: Number(formData.price),
            quantity: Number(formData.quantity),
            isNew: true,
        };

        addProduct(newProduct);

        setMessage({ type: 'success', text: `Product "${newProduct.name}" added to inventory!` });

        setFormData({
            name: '',
            price: '',
            quantity: '',
            category: ALL_CATEGORIES[0],
            image: 'https://placehold.co/200x200/5283FF/ffffff?text=New+Product',
            description: '',
        });

        setImagePreview('https://placehold.co/200x200/5283FF/ffffff?text=New+Product');

        setTimeout(() => {
            router.push('/');
        }, 1500);
    };

    return (
        <div className="container mx-auto p-8 max-w-2xl bg-white rounded-xl shadow-2xl mt-10">
            <h1 className="text-3xl font-extrabold text-red-600 mb-6 border-b pb-3">
                Add a New Product
            </h1>

            <p className="text-sm text-gray-500 mb-6">
                *Note: Product data is temporarily stored in memory and resets on refresh.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Image Preview */}
                <div className="flex flex-col items-center border border-dashed p-4 rounded-lg bg-gray-50">
                    <img
                        src={imagePreview}
                        alt="Product Preview"
                        className="w-32 h-32 object-cover rounded-md mb-4 shadow-md"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/200x200/dddddd/333333?text=Image+Error";
                        }}
                    />

                    <label className="block text-sm font-medium text-gray-700">
                        Image URL
                    </label>

                    <input
                        type="url"
                        name="image"
                        placeholder="Paste image URL here"
                        value={formData.image.includes('New+Product') ? '' : formData.image}
                        onChange={handleImageChange}
                        className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Product Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    />
                </div>

                {/* Price + Quantity */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Price ($)
                        </label>
                        <input
                            type="number"
                            name="price"
                            min="0.01"
                            step="0.01"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Stock Quantity
                        </label>
                        <input
                            type="number"
                            name="quantity"
                            min="0"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        />
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    >
                        {ALL_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    ></textarea>
                </div>

                {/* Message */}
                {message && (
                    <div
                        className={`p-3 rounded-md font-medium ${
                            message.type === 'success'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full py-3 bg-red-600 text-white font-bold rounded-lg shadow-xl hover:bg-red-700 transition-colors transform hover:scale-[1.01]"
                >
                    Add Product to Inventory
                </button>

                <Link
                    href="/"
                    className="block text-center mt-3 text-blue-600 hover:text-blue-800 font-medium"
                >
                    ← Back to Product List
                </Link>
            </form>
        </div>
    );
}
