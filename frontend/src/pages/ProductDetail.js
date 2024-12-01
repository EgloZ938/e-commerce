import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../src/components/Contexts/CartContext';
import { useAuth } from '../../src/components/Contexts/AuthContext';

function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();
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

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!product || product.countInStock === 0) {
      return;
    }

    try {
      await addToCart(product);
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
    <div className="flex justify-center items-center p-4 sm:p-8">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="w-full md:w-1/2 p-8 bg-gray-50">
            <img
              src={product.image.startsWith('/uploads')
                ? `http://localhost:5000${product.image}`
                : product.image
              }
              alt={product.name}
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Product Info Section */}
          <div className="w-full md:w-1/2 p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-indigo-600 font-semibold">{product.price.toFixed(2)} €</p>
            </div>

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

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-600">{product.description}</p>
            </div>

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
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={cartLoading || product.countInStock === 0}
                className={`w-full py-3 px-4 rounded-lg font-medium ${product.countInStock === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : cartLoading
                      ? 'bg-indigo-400 text-white'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
              >
                {cartLoading
                  ? 'Ajout en cours...'
                  : product.countInStock === 0
                    ? 'Indisponible'
                    : 'Ajouter au panier'
                }
              </button>

              <button
                onClick={() => navigate('/products')}
                className="w-full py-3 px-4 rounded-lg font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                Retour aux produits
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;