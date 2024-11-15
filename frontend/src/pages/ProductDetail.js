import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // Récupère l'ID depuis l'URL
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
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
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Image du produit */}
            <div className="md:w-1/2">
              <img
                src={product.image.startsWith('/uploads')
                  ? `http://localhost:5000${product.image}`
                  : product.image
                }
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Détails du produit */}
            <div className="md:w-1/2 p-8">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h1>
                <button
                  onClick={() => navigate('/products')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-bold text-indigo-600">{product.price.toFixed(2)} €</span>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-600">{product.description}</p>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Détails</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Marque</p>
                    <p className="font-medium">{product.brand}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Catégorie</p>
                    <p className="font-medium">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Stock</p>
                    <p className="font-medium">{product.countInStock} unités</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <button
                  className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
                  onClick={() => {
                    // Ajouter la logique du panier ici
                    console.log('Ajouter au panier:', product._id);
                  }}
                >
                  Ajouter au panier
                </button>
                <button
                  className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors"
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