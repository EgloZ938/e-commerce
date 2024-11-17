import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../components/Contexts/CartContext';

function Cart() {
  const { 
    cartItems, 
    removeFromCart, 
    getCartTotal, 
    loading,
    error,
    successMessage 
  } = useCart();

  return (
      <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-4">Votre panier</h1>
          
          {/* Messages d'erreur et de succès */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {successMessage}
            </div>
          )}

          {cartItems.length === 0 ? (
              <p className="text-gray-500">Votre panier est vide</p>
          ) : (
              <div className="space-y-4">
                  {cartItems.map((item) => (
                      <div key={item._id} className="flex items-center justify-between p-4 border rounded-lg shadow-md">
                          <div className="flex items-center">
                              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg mr-4" />
                              <div>
                                  <h2 className="text-xl font-semibold">{item.name}</h2>
                                  <p className="text-gray-600">{item.price.toFixed(2)} €</p>
                                  <p className="text-gray-600">Quantité: {item.quantity}</p>
                              </div>
                          </div>
                          <button
                              onClick={() => removeFromCart(item._id)}
                              disabled={loading}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                          >
                              {loading ? 'Suppression...' : 'Supprimer'}
                          </button>
                      </div>
                  ))}
                  
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-xl font-semibold">
                          Total: {getCartTotal().toFixed(2)} €
                      </p>
                  </div>
                  
                  <div className="mt-4">
                      <Link 
                          to="/checkout" 
                          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 inline-block"
                      >
                          Procéder au paiement
                      </Link>
                  </div>
              </div>
          )}
      </div>
  );
}

export default Cart;