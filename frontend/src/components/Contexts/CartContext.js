import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  const updateProductStock = async (productId, newStock) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          countInStock: newStock,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update stock');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Error updating stock');
    }
  };

  const addToCart = async (product) => {
    setLoading(true);
    try {
      const existingItem = cartItems.find((item) => item._id === product._id);
      
      // Calculate new quantity
      const newQuantity = existingItem ? existingItem.quantity + 1 : 1;
      
      // Check if enough stock
      if (newQuantity > product.countInStock) {
        setError("Sorry, not enough items in stock");
        return;
      }

      // Update stock in database
      await updateProductStock(product._id, product.countInStock - 1);

      setCartItems((prevItems) => {
        if (existingItem) {
          return prevItems.map((item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prevItems, { ...product, quantity: 1 }];
      });

      setSuccessMessage("Item successfully added to cart");

    } catch (error) {
      setError("Failed to add item to cart");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    setLoading(true);
    try {
      const item = cartItems.find((item) => item._id === productId);
      if (!item) return;

      // Restore stock in database
      await updateProductStock(productId, item.countInStock + item.quantity);

      setCartItems((prevItems) =>
        prevItems.filter((item) => item._id !== productId)
      );

      setSuccessMessage("Item successfully removed from cart");

    } catch (error) {
      setError("Failed to remove item from cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    setLoading(true);
    try {
      const item = cartItems.find((item) => item._id === productId);
      if (!item) return;

      // Check if the new quantity is valid
      if (newQuantity <= 0) {
        await removeFromCart(productId);
        return;
      }

      // Check if enough stock for the new quantity
      if (newQuantity > item.countInStock + item.quantity) {
        setError("Not enough items in stock");
        return;
      }

      // Calculate stock difference
      const stockDiff = item.quantity - newQuantity;
      await updateProductStock(productId, item.countInStock + stockDiff);

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === productId ? { ...item, quantity: newQuantity } : item
        )
      );

      setSuccessMessage("Cart successfully updated");

    } catch (error) {
      setError("Failed to update quantity");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      // Restore all stock quantities
      await Promise.all(
        cartItems.map((item) =>
          updateProductStock(item._id, item.countInStock + item.quantity)
        )
      );

      setCartItems([]);
      setSuccessMessage("All items have been removed from cart");

    } catch (error) {
      setError("Failed to clear cart");
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

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
        clearCart,
        getCartTotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);