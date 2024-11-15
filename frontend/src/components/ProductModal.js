import React from 'react';
import ImageDropzone from './ImageDropzone';

const ProductModal = ({ isOpen, onClose, title, product, setProduct, onSubmit, buttonText, userInfo }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4 z-50">
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image du produit
                        </label>
                        <ImageDropzone
                            onImageUpload={(imagePath) => setProduct({ ...product, image: imagePath })}
                            initialImage={product.image}
                            token={userInfo?.token}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom du produit
                        </label>
                        <input
                            type="text"
                            value={product.name}
                            onChange={(e) => setProduct({ ...product, name: e.target.value })}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prix
                        </label>
                        <input
                            type="number"
                            value={product.price}
                            onChange={(e) => setProduct({ ...product, price: e.target.value })}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={product.description}
                            onChange={(e) => setProduct({ ...product, description: e.target.value })}
                            rows="3"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Marque
                            </label>
                            <input
                                type="text"
                                value={product.brand}
                                onChange={(e) => setProduct({ ...product, brand: e.target.value })}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Catégorie
                            </label>
                            <input
                                type="text"
                                value={product.category}
                                onChange={(e) => setProduct({ ...product, category: e.target.value })}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stock
                        </label>
                        <input
                            type="number"
                            value={product.countInStock}
                            onChange={(e) => setProduct({ ...product, countInStock: e.target.value })}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {buttonText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;