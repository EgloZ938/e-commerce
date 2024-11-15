
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import { useCart } from '../Contexts/CartContext';

const Navigation = () => {
  const { isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-bold text-xl text-primary-600">
            E-Commerce
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/products" className="text-gray-700 hover:text-primary-600">
              Produits
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="text-gray-700 hover:text-primary-600">
                  Profil
                </Link>
                <Link to="/create-product" className="text-gray-700 hover:text-primary-600">
                  Vendre
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-primary-600"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600">
                  Connexion
                </Link>
                <Link to="/register" className="text-gray-700 hover:text-primary-600">
                  Inscription
                </Link>
              </>
            )}
            <Link
              to="/cart"
              className="relative inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Panier
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

