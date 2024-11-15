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
            <div className="min-h-screen flex justify-center items-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-4">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-xl text-center font-bold text-gray-900 mb-4">Les produits</h1>
                <div className="grid grid-cols-1 gap-4 min-[375px]:max-w-sm min-[375px]:mx-auto sm:max-w-none sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                            onClick={() => navigate(`/product/${product._id}`)}
                        >
                            <img
                                src={product.image.startsWith('/uploads')
                                    ? `http://localhost:5000${product.image}`
                                    : product.image
                                }
                                alt={product.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h2 className="text-lg font-semibold text-gray-800 text-center">{product.name}</h2>
                                <p className="text-sm text-gray-600 mt-2 text-center">{product.description}</p>
                                <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
                                    <span className="text-xl font-bold text-indigo-600">{product.price.toFixed(2)} €</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Empêche la navigation lors du clic sur le bouton
                                            // Ajoutez ici la logique pour ajouter au panier
                                            console.log('Ajout au panier:', product._id);
                                        }}
                                        className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 text-sm rounded-md hover:bg-indigo-700 transition-colors"
                                    >
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