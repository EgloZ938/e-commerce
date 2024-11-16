import React, { useState, useEffect, useRef } from 'react';
import ProductCard from '../Products/ProductCard';

const ProductCarousel = ({ products }) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const carouselRef = useRef(null);

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group">
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50"
          style={{ backdropFilter: 'blur(8px)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50"
          style={{ backdropFilter: 'blur(8px)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      <div
        ref={carouselRef}
        onScroll={handleScroll}
        className="flex space-x-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8"
      >
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => window.location.href = `/product/${product._id}`}
            className="flex-none w-[300px] snap-start cursor-pointer group"
          >
            <div className="bg-white rounded-3xl p-6 transition-all duration-300 hover:shadow-xl">
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
                    className="w-full h-full object-contain transform transition-transform duration-300 group-hover:scale-105"
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
              <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-lg font-semibold text-indigo-600">
                {product.price.toFixed(2)} €
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="text-center space-y-8">
            <h2 className="text-indigo-600 text-xl md:text-2xl font-medium tracking-wide uppercase">
              Bienvenue sur notre boutique
            </h2>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight">
              Des Produits d'Exception
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Découvrez notre collection exclusive de produits qui redéfinissent l'excellence
            </p>
            <div className="flex justify-center gap-6">
              <a
                href="/products"
                className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl hover:scale-105 transform duration-200"
              >
                Découvrir nos produits
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Services Cards */}
            <div className="bg-white rounded-xl p-8 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-100 hover:border-indigo-100 group">
              <div className="text-indigo-600 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Livraison rapide</h3>
              <p className="text-gray-600">Recevez votre commande en 24h</p>
            </div>

            <div className="bg-white rounded-xl p-8 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-100 hover:border-indigo-100 group">
              <div className="text-indigo-600 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Garantie premium</h3>
              <p className="text-gray-600">2 ans de garantie sur tous nos produits</p>
            </div>

            <div className="bg-white rounded-xl p-8 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-100 hover:border-indigo-100 group">
              <div className="text-indigo-600 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Service client 24/7</h3>
              <p className="text-gray-600">Une équipe à votre écoute</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Catégories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {['Electronics', 'Shoes'].map((category) => (
            <div
              key={category}
              className="bg-white rounded-xl shadow-md p-6 text-center cursor-pointer hover:shadow-xl transition-shadow duration-300 border border-gray-100 hover:border-indigo-100"
            >
              <span className="text-lg font-medium text-gray-900">{category}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Carousel */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Nos Produits Phares</h2>
          </div>
          <ProductCarousel products={featuredProducts} />
        </div>
      </section>

      {/* All Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Tous nos produits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        </div>
      </section>
    </div>
  );
};

export default Home;