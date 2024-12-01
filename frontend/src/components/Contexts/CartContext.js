import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { isAuthenticated, user } = useAuth();

  // Charger le panier depuis l'API quand l'utilisateur est connecté
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCart();
    }
  }, [isAuthenticated, user]);

  const fetchCart = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Erreur lors du chargement du panier');
      const data = await response.json();
      setCartItems(data.items || []);
    } catch (error) {
      setError("Erreur lors du chargement du panier");
    }
  };

  const addToCart = async (product) => {
    setLoading(true);
    try {
      if (!isAuthenticated) {
        setError("Veuillez vous connecter pour ajouter des articles au panier");
        return false;
      }

      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1
        })
      });

      if (!response.ok) throw new Error('Erreur lors de l\'ajout au panier');

      const updatedCart = await response.json();
      setCartItems(updatedCart.items);
      setSuccessMessage("Produit ajouté au panier avec succès");
      return true;

    } catch (error) {
      setError("Échec de l'ajout au panier");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      const updatedCart = await response.json();
      setCartItems(updatedCart.items);
      setSuccessMessage("Produit retiré du panier");

    } catch (error) {
      setError("Échec de la suppression du produit");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      // Mise à jour optimiste de l'UI
      const updatedItems = cartItems.map(item =>
        item.product._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
      setCartItems(updatedItems);

      // Appel API en arrière-plan
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          productId,
          quantity: newQuantity
        })
      });

      if (!response.ok) {
        // En cas d'erreur, on revient à l'état précédent
        fetchCart();
        setError("Erreur lors de la mise à jour");
      }

    } catch (error) {
      fetchCart();
      setError("Échec de la mise à jour");
    }
  };

  // Calculer le total du panier
  const getCartTotal = () => {
    return cartItems.reduce((total, item) =>
      total + item.product.price * item.quantity, 0);
  };

  // Obtenir le nombre total d'articles
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        successMessage,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);