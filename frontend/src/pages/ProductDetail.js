import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
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
        <div className="flex flex-col md:flex-row"> {/* Changé en flex-col pour mobile */}
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

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Détails */}
            <div className="mb-8">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Détails</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Marque</p>
                  <p className="font-semibold text-gray-900">{product.brand}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Catégorie</p>
                  <p className="font-semibold text-gray-900">{product.category}</p>
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
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
                onClick={() => {
                  console.log('Ajouter au panier:', product._id);
                }}
              >
                Ajouter au panier
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
  );
}

export default ProductDetail;