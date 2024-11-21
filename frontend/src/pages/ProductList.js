import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Fonction de recherche améliorée
const searchProducts = (products, searchTerm) => {
    if (!searchTerm) return products;

    const searchLower = searchTerm.toLowerCase();
    return products.filter(product => {
        return (
            product.name.toLowerCase().includes(searchLower) ||
            product.brand.toLowerCase().includes(searchLower) ||
            product.category.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower) ||
            product.price.toString().includes(searchLower)
        );
    });
};

// Composant de la barre de recherche
const SearchSection = ({ searchTerm, setSearchTerm, resultCount }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className={`relative transition-all duration-300 ${isFocused ? 'transform -translate-y-2' : ''}`}>
                <div className={`relative flex items-center transition-all duration-300 ${isFocused ? 'shadow-lg' : 'shadow-md'
                    }`}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Rechercher par nom, marque, catégorie..."
                        className="w-full px-12 py-4  border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 transition-all duration-300 ${isFocused ? 'text-indigo-500 scale-110' : ''
                                }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    )}
                </div>
                {searchTerm && (
                    <div className="absolute -bottom-8 left-0 right-0 text-sm text-gray-500 text-center animate-fade-in">
                        {resultCount} résultat{resultCount !== 1 ? 's' : ''} trouvé{resultCount !== 1 ? 's' : ''}
                    </div>
                )}
            </div>
        </div>
    );
};

function ProductList() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category');

    // AJOUTER AU PANIER
    const addToCart = async (product) => {
        try {
            if (product.countInStock <= 0) {
                alert("Ce produit n'est plus en stock");
                return;
            }

            const response = await fetch(`http://localhost:5000/api/products/${product._id}/updateStock`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    countInStock: product.countInStock - 1
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de la mise à jour du stock');
            }

            const updatedProducts = products.map(p =>
                p._id === product._id
                    ? { ...p, countInStock: p.countInStock - 1 }
                    : p
            );
            setProducts(updatedProducts);

            const currentCart = JSON.parse(localStorage.getItem('cartItems')) || [];

            const cartItem = {
                _id: product._id,
                name: product.name,
                price: product.price,
                image: product.image.startsWith('/uploads')
                    ? `http://localhost:5000${product.image}`
                    : product.image,
                quantity: 1
            };

            const existingItemIndex = currentCart.findIndex(item => item._id === product._id);

            if (existingItemIndex !== -1) {
                currentCart[existingItemIndex].quantity += 1;
            } else {
                currentCart.push(cartItem);
            }

            localStorage.setItem('cartItems', JSON.stringify(currentCart));
            alert('Produit ajouté au panier avec succès !');

        } catch (error) {
            console.error('Erreur:', error);
            alert("Une erreur s'est produite lors de l'ajout au panier");
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');
                const data = await response.json();
                setProducts(data);

                const uniqueCategories = [...new Set(data.map(product => product.category))];
                setCategories(uniqueCategories);
            } catch (error) {
                console.error('Erreur lors du chargement des produits:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Filtrer les produits avec la recherche améliorée
    const filteredProducts = searchProducts(products, searchTerm).filter(
        product => !categoryFilter || product.category === categoryFilter
    );

    const clearFilters = () => {
        setSearchTerm('');
        navigate('/products');
    };

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
            <div className="bg-gradient-to-br from-indigo-50 via-white to-indigo-50 py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                            {categoryFilter ? `Collection ${categoryFilter}` : 'Notre Collection'}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                            {categoryFilter
                                ? `Découvrez nos produits de la catégorie ${categoryFilter}`
                                : 'Découvrez notre sélection de produits exceptionnels'
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-medium text-gray-900">Filtrer par catégorie :</h2>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => navigate(`/products?category=${category}`)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${categoryFilter === category
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                    {categoryFilter && (
                        <button
                            onClick={clearFilters}
                            className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                        >
                            Effacer les filtres
                        </button>
                    )}
                </div>
            </div>

            {/* Search Section */}
            <SearchSection
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                resultCount={filteredProducts.length}
            />

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-4 pb-16">
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-600 text-lg">
                            Aucun produit trouvé.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            Voir tous les produits
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 min-[375px]:max-w-sm min-[375px]:mx-auto sm:max-w-none sm:grid-cols-2 lg:grid-cols-3">
                        {filteredProducts.map((product) => (
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
                                    <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-2">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-indigo-500 mb-2 font-medium">
                                        {product.brand}
                                    </p>
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
                                                addToCart(product);
                                            }}
                                            disabled={product.countInStock === 0}
                                            className={`w-full rounded-lg transition-all duration-200 flex items-center justify-center px-4 py-2 text-sm font-medium ${product.countInStock === 0
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                                                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                                                }`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0 a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            Ajouter au panier
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductList;