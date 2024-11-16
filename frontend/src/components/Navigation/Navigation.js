import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import { useCart } from '../Contexts/CartContext';

const Navigation = () => {
  const { isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo et Nom */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                E-Shop
              </span>
            </Link>
          </div>

          {/* Navigation Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              to="/products"
              className={`text-sm font-medium transition-colors duration-200 ${isActive('/products')
                  ? 'text-indigo-600'
                  : 'text-gray-700 hover:text-indigo-600'
                }`}
            >
              Nos Produits
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className={`text-sm font-medium transition-colors duration-200 ${isActive('/profile')
                      ? 'text-indigo-600'
                      : 'text-gray-700 hover:text-indigo-600'
                    }`}
                >
                  Mon Compte
                </Link>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                >
                  Inscription
                </Link>
              </div>
            )}

            {/* Panier */}
            <Link
              to="/cart"
              className="relative inline-flex items-center p-2 text-gray-700 hover:text-indigo-600 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-xs font-medium text-white bg-indigo-600 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>

          {/* Bouton Menu Mobile */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/products"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Nos Produits
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mon Compte
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inscription
                </Link>
              </>
            )}

            <Link
              to="/cart"
              className="flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Panier</span>
              {cartItems.length > 0 && (
                <span className="flex items-center justify-center h-5 w-5 text-xs font-medium text-white bg-indigo-600 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;