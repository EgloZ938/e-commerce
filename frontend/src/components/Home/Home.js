import React, { useState, useEffect } from 'react';
import ProductCard from '../Products/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        setFeaturedProducts(data);
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-full mx-auto px-4">
      <section className="bg-gray-600 rounded-md text-white py-20">
        <div className="w-auto mx-auto px-4">
          <div className="space-y-16">
            <div className="text-center space-y-8">
              <h2 className="text-3xl md:text-4xl font-medium mb-4">
                Bienvenue
              </h2>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
                Achetez en ligne
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
                Découvrez notre collection exclusive de produits qui redéfinissent l'excellence
              </p>
              <div className="flex justify-center gap-6">
                <a href="/products" className="group">
                  <span className="text-xl text-primary-400">Acheter maintenant</span>
                  <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </a>
              </div>
            </div>

            <div className="mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              <div className="bg-gray-900 rounded-2xl p-8 transform hover:scale-105 transition-all duration-300">
                <h3 className="text-2xl font-semibold mb-4">Livraison rapide</h3>
                <p className="text-gray-400">Recevez votre commande en 24h</p>
              </div>
              <div className="bg-gray-900 rounded-2xl p-8 transform hover:scale-105 transition-all duration-300">
                <h3 className="text-2xl font-semibold mb-4">Garantie premium</h3>
                <p className="text-gray-400">2 ans de garantie sur tous nos produits</p>
              </div>
              <div className="bg-gray-900 rounded-2xl p-8 transform hover:scale-105 transition-all duration-300">
                <h3 className="text-2xl font-semibold mb-4">Service client 24/7</h3>
                <p className="text-gray-400">Une équipe à votre écoute</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mt-10 mb-6">Catégories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {['Electronics', 'Shoes'].map((category) => (
            <div
              key={category}
              className="bg-white rounded-lg shadow-md p-4 text-center cursor-pointer hover:bg-primary-50"
            >
              <span className="text-lg font-medium">{category}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden my-12 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mt-10 mb-6">Nos Produits Phares</h2>
        <div className="relative">
          <div className="flex space-x-14 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4">
            {featuredProducts.map((product) => (
              <div
                key={product._id}
                className="flex-none w-80 snap-center cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => window.location.href = `/product/${product._id}`}
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={product.image.startsWith('/uploads')
                        ? `http://localhost:5000${product.image}`
                        : product.image
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-primary-600 font-bold">{product.price.toFixed(2)} €</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="featured-products" className="max-w-7xl mx-auto mb-12">
        <h2 className="text-2xl font-bold mt-10 mb-6">Tous nos produits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={{
                ...product,
                image: product.image.startsWith('/uploads')
                  ? `http://localhost:5000${product.image}`
                  : product.image
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;