// src/components/ProductCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../Contexts/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover mb-4 rounded"
      />
      <Link
        to={`/product/${product._id}`}
        className="text-lg font-semibold text-gray-800 hover:text-primary-600"
      >
        {product.name}
      </Link>
      <div className="text-primary-600 font-bold mt-2">{product.price} €</div>
      <p className="text-gray-600 mt-2 text-sm">{product.description}</p>
      <button
        onClick={() => addToCart(product)}
        className="w-full mt-4 bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700 transition duration-200"
      >
        Ajouter au panier
      </button>
    </div>
  );
};

export default ProductCard;

