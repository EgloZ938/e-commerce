import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../src/components/Contexts/CartContext';
import { useAuth } from '../../src/components/Contexts/AuthContext';
import { useState } from 'react';
import PaymentModal from '../components/PaymentModal';
import axios from 'axios';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();  // Ajoute ceci
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Vérifier la disponibilité des produits dans le panier
  const checkCartAvailability = () => {
    return cartItems.every(item =>
      item.product.countInStock >= item.quantity && item.product.countInStock > 0
    );
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      const response = await axios.post('http://localhost:5000/api/stripe/payment-success',
        {
          paymentIntentId: paymentIntent.id
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      if (response.data.success) {
        // Vider le panier
        await removeFromCart();
        // Rediriger vers la page d'accueil
        navigate('/');
        // Optionnel : Afficher un message de succès
        alert('Paiement effectué avec succès ! Merci pour votre commande.');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la finalisation de la commande');
    }
  };

  // Vérifier si un produit spécifique est disponible
  const isItemAvailable = (item) => {
    return item.product.countInStock >= item.quantity && item.product.countInStock > 0;
  };

  // Handler pour la mise à jour de la quantité avec vérification du stock
  const handleQuantityUpdate = async (productId, newQuantity, currentStock) => {
    if (newQuantity > currentStock) {
      alert(`Désolé, seulement ${currentStock} unité(s) disponible(s)`);
      return;
    }
    await updateQuantity(productId, newQuantity);
  };

  // Si non authentifié
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connectez-vous pour voir votre panier</h2>
          <p className="text-gray-600 mb-6">Vous devez être connecté pour accéder à votre panier</p>
          <Link
            to="/login"
            className="block w-full bg-indigo-600 text-white py-4 px-6 rounded-xl font-medium hover:bg-indigo-700 transition-colors duration-200"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  // Si le panier est vide
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-indigo-400"
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
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Votre panier est vide</h2>
          <p className="text-gray-600 mb-8">
            Découvrez notre sélection de produits et commencez votre shopping !
          </p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors duration-200"
          >
            <span>Découvrir nos produits</span>
            <svg
              className="ml-2 h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  const FREE_SHIPPING_THRESHOLD = 100;
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - getCartTotal();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Message livraison gratuite dynamique */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
          <p className="text-indigo-600 text-sm font-medium">
            {remainingForFreeShipping > 0
              ? `Plus que ${remainingForFreeShipping.toFixed(2)}€ pour bénéficier de la livraison offerte`
              : '✨ Félicitations ! Vous bénéficiez de la livraison gratuite'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale avec tableau */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Produit</th>
                    <th className="text-center py-4 px-6 text-sm font-medium text-gray-600">Quantité</th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">Sous-total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <tr
                      key={item.product._id}
                      className={!isItemAvailable(item) ? 'bg-red-50' : ''}
                    >
                      <td className="py-6 px-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.product.image.startsWith('/uploads')
                              ? `http://localhost:5000${item.product.image}`
                              : item.product.image
                            }
                            alt={item.product.name}
                            className="w-20 h-20 object-contain bg-gray-50 rounded-lg p-2"
                          />
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {item.product.name}
                              {!isItemAvailable(item) && (
                                <span className="ml-2 text-xs text-red-600 font-normal">
                                  Produit non disponible
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {item.product.price.toFixed(2)} €
                              {item.product.countInStock > 0 && (
                                <span className="ml-2 text-xs">
                                  ({item.product.countInStock} en stock)
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <div className="flex items-center justify-center gap-3">
                          {/* Bouton moins */}
                          <button
                            onClick={() => handleQuantityUpdate(
                              item.product._id,
                              Math.max(1, item.quantity - 1),
                              item.product.countInStock
                            )}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg border 
      ${!isItemAvailable(item) || item.quantity <= 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors'
                              }`}
                            disabled={!isItemAvailable(item) || item.quantity <= 1}
                            title={!isItemAvailable(item) ? "Produit non disponible" : "Diminuer la quantité"}
                          >
                            −
                          </button>

                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>

                          {/* Bouton plus */}
                          <button
                            onClick={() => handleQuantityUpdate(
                              item.product._id,
                              item.quantity + 1,
                              item.product.countInStock
                            )}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg border group relative
      ${!isItemAvailable(item) || item.quantity >= item.product.countInStock
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors'
                              }`}
                            disabled={!isItemAvailable(item) || item.quantity >= item.product.countInStock}
                            title={item.quantity >= item.product.countInStock ? "Stock maximum atteint" : "Augmenter la quantité"}
                          >
                            +
                            {/* Tooltip uniquement pour le bouton plus quand max atteint */}
                            {item.quantity >= item.product.countInStock && (
                              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                                Stock maximum atteint
                              </div>
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <div className="flex items-center justify-end gap-4">
                          <span className="text-sm font-medium">
                            {(item.product.price * item.quantity).toFixed(2)} €
                          </span>
                          <button
                            onClick={() => removeFromCart(item.product._id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Code promo */}
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Code promo ou carte cadeau"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Appliquer
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Total panier */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Total panier</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="text-gray-900 font-medium">{getCartTotal().toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">TVA (20%)</span>
                  <span className="text-gray-600">{(getCartTotal() * 0.2).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Livraison</span>
                  <span className="text-gray-600">
                    {remainingForFreeShipping <= 0 ? 'Gratuite' : 'Calculée à l\'étape suivante'}
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-indigo-600">{getCartTotal().toFixed(2)} €</span>
                  </div>
                </div>

                {!checkCartAvailability() && (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg text-red-600 text-sm">
                    Certains produits de votre panier ne sont plus disponibles.
                    Veuillez les retirer pour continuer.
                  </div>
                )}

                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className={`w-full mt-6 py-3 px-4 rounded-xl font-medium transition-colors
   ${checkCartAvailability()
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                  disabled={!checkCartAvailability()}
                >
                  Valider la commande
                </button>

                <Link
                  to="/products"
                  className="block text-center text-sm text-indigo-600 hover:text-indigo-700 mt-4"
                >
                  Continuer mes achats
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        total={getCartTotal()}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}

export default Cart;