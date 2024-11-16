import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Erreur lors du chargement des produits:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-gray-50 to-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-indigo-50 via-white to-indigo-50 py-16 mb-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                            Notre Collection
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                            Découvrez notre sélection de produits exceptionnels, choisis avec soin pour vous offrir le meilleur.
                        </p>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-4 pb-16">
                <div className="grid grid-cols-1 gap-6 min-[375px]:max-w-sm min-[375px]:mx-auto sm:max-w-none sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="bg-white rounded-3xl p-6 transition-all duration-300 hover:shadow-xl"
                        >
                            {/* Image Container */}
                            <div className="h-[250px] mb-6 relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white rounded-2xl" />
                                <div className="relative h-full flex items-center justify-center p-4">
                                    <img
                                        src={product.image.startsWith('/uploads')
                                            ? `http://localhost:5000${product.image}`
                                            : product.image
                                        }
                                        alt={product.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>

                            {/* Badge */}
                            <div className="mb-4">
                                {product.countInStock > 10 ? (
                                    <span className="inline-block bg-green-50 text-green-600 text-sm px-3 py-1 rounded-full">
                                        Disponible
                                    </span>
                                ) : product.countInStock > 0 ? (
                                    <span className="inline-block bg-yellow-50 text-yellow-600 text-sm px-3 py-1 rounded-full">
                                        Stock limité
                                    </span>
                                ) : (
                                    <span className="inline-block bg-red-50 text-red-600 text-sm px-3 py-1 rounded-full">
                                        Rupture de stock
                                    </span>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="flex flex-col">
                                <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                                    {product.name}
                                </h3>

                                <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                                    {product.description}
                                </p>

                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-lg font-semibold text-indigo-600">
                                        {product.price.toFixed(2)} €
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    {/* Bouton Voir le produit */}
                                    <button
                                        onClick={() => navigate(`/product/${product._id}`)}
                                        className="w-full bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-indigo-100"
                                    >
                                        Voir le produit
                                    </button>

                                    {/* Bouton Ajouter au panier */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            console.log('Ajout au panier:', product._id);
                                        }}
                                        disabled={product.countInStock === 0}
                                        className={`w-full rounded-lg transition-all duration-200 flex items-center justify-center px-4 py-2 text-sm font-medium ${product.countInStock === 0
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                                                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                                            }`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        Ajouter au panier
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductList;