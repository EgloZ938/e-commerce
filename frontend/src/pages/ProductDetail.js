import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../src/components/Contexts/CartContext';
import { useAuth } from '../../src/components/Contexts/AuthContext';

function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartItems, addToCart, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Produit non trouvé');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Erreur lors du chargement du produit:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const getAvailableQuantity = () => {
    const cartItem = cartItems.find(item => item.product._id === id);
    const currentQuantity = cartItem ? cartItem.quantity : 0;
    return product.countInStock - currentQuantity;
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Vérifie d'abord si le produit est en stock
    if (!product || product.countInStock === 0) {
      return;
    }

    // Ensuite vérifie la quantité disponible
    const availableQuantity = getAvailableQuantity();
    if (availableQuantity <= 0) {
      return;
    }

    try {
      await addToCart(product);
      setSuccessMessage('Produit ajouté au panier avec succès');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-4rem)]">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Produit non trouvé</h2>
        <button
          onClick={() => navigate('/products')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Retour aux produits
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Message de succès */}
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-r-lg">
            <p className="text-green-700 font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {successMessage}
            </p>
          </div>
        )}

        <div className="w-full bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Image du produit */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-4 sm:p-8">
              <div className="w-full h-[300px] md:h-[500px] flex items-center justify-center bg-white rounded-lg shadow-sm">
                <img
                  src={product.image.startsWith('/uploads')
                    ? `http://localhost:5000${product.image}`
                    : product.image
                  }
                  alt={product.name}
                  className="max-h-[250px] md:max-h-[450px] w-auto object-contain"
                />
              </div>
            </div>

            {/* Détails du produit */}
            <div className="w-full md:w-1/2 bg-white p-4 sm:p-8">
              {/* En-tête avec nom et bouton fermer */}
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
                <button
                  onClick={() => navigate('/products')}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Prix */}
              <div className="mb-6">
                <span className="text-3xl md:text-4xl font-bold text-indigo-600">
                  {product.price.toFixed(2)} €
                </span>
              </div>

              {/* Stock status */}
              <div className="mb-6">
                <div className="mb-4">
                  {product.countInStock > 10 ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      En stock
                    </span>
                  ) : product.countInStock > 0 ? (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                      Stock limité ({product.countInStock} restants)
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                      Rupture de stock
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-gray-600">{product.description}</p>
              </div>

              {/* Détails */}
              <div className="mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Marque</p>
                    <p className="font-medium">{product.brand}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Catégorie</p>
                    <p className="font-medium">{product.category}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Stock disponible</p>
                    <p className="font-semibold text-gray-900">{product.countInStock} unités</p>
                  </div>
                </div>
              </div>

              {/* Boutons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={cartLoading || product.countInStock === 0 || getAvailableQuantity() <= 0}
                  className={`w-full px-6 py-3 rounded-lg text-lg font-semibold transition-colors shadow-md hover:shadow-lg flex items-center justify-center ${product.countInStock === 0
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-50'
                      : getAvailableQuantity() <= 0
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-50'
                        : cartLoading
                          ? 'bg-indigo-400 text-white'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {cartLoading
                    ? 'Ajout en cours...'
                    : product.countInStock === 0
                      ? 'Stock épuisé'
                      : getAvailableQuantity() <= 0
                        ? 'Quantité maximum atteinte'
                        : 'Ajouter au panier'
                  }
                </button>
                <button
                  className="w-full bg-gray-100 text-gray-800 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-200 transition-colors"
                  onClick={() => navigate('/products')}
                >
                  Continuer les achats
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;