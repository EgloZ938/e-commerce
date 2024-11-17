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

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
};

  const sampleProducts = [
    {
        _id: '1',
        name: 'iPhone 14 Pro',
        price: 1299.99,
        quantity: 1,
        image: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-pro-max-1.jpg'
    },
    {
        _id: '2',
        name: 'iPad Pro M2',
        price: 899.99,
        quantity: 2,
        image: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-ipad-pro-129-2022-1.jpg'
    },
    {
        _id: '3',
        name: 'Chemise Oxford Classic',
        price: 79.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80'
    },
    {
        _id: '4',
        name: 'Mercedes Classe A',
        price: 42999.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80'
    }
];

  return ( 
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Votre panier</h1>
        
        {/* Messages d'erreur et de succès */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-r-lg">
            <p className="text-green-700 font-medium">{successMessage}</p>
          </div>
        )}

        {sampleProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <p className="text-gray-500 text-lg">Votre panier est vide</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {sampleProducts.map((item, index) => (
                <div key={item._id} className={`p-6 ${index !== sampleProducts.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-20 h-20 object-contain"
                        />
                      </div>
                      <div className="flex flex-col">
                        <h2 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h2>
                        <p className="text-lg font-semibold text-indigo-600 mb-1">{item.price.toFixed(2)} €</p>
                        <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      disabled={loading}
                      className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors duration-200"
                    >
                      {loading ? 'Suppression...' : 'Supprimer'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg text-gray-600">Total</span>
                <span className="text-2xl font-bold text-gray-900">{getCartTotal().toFixed(2)} €</span>
              </div>
              
              <div className="space-y-4">
                <Link 
                  to="/checkout" 
                  className="w-full bg-indigo-600 text-white py-4 px-6 rounded-xl font-medium text-center hover:bg-indigo-700 transition-colors duration-200 inline-block"
                >
                  Procéder au paiement
                </Link>
                <Link 
                  to="/" 
                  className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-medium text-center hover:bg-gray-200 transition-colors duration-200 inline-block"
                >
                  Continuer les achats
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;