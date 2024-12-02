import { useCart } from '../Contexts/CartContext';
import { useAuth } from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { cartItems, addToCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const getAvailableQuantity = () => {
    const cartItem = cartItems.find(item => item.product._id === product._id);
    const currentQuantity = cartItem ? cartItem.quantity : 0;
    return product.countInStock - currentQuantity;
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Vérifie d'abord si le produit est en stock
    if (product.countInStock === 0) {
      return;
    }

    // Ensuite vérifie la quantité disponible
    const availableQuantity = getAvailableQuantity();
    if (availableQuantity <= 0) {
      return;
    }

    try {
      await addToCart(product);
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
    }
  };

  const navigateToProduct = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="bg-white rounded-3xl p-6 transition-all duration-300 hover:shadow-xl h-full flex flex-col">
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
            className="w-full h-full object-contain"
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
      <div className="flex-1 flex flex-col">
        <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm text-indigo-500 mb-2 font-medium">
          {product.brand}
        </p>
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
          {product.description}
        </p>
        <div className="space-y-3 mt-auto">
          <div className="flex items-center justify-between mb-4">
            <p className="text-lg font-semibold text-indigo-600">
              {product.price.toFixed(2)} €
            </p>
          </div>

          {/* Bouton Voir le produit */}
          <button
            onClick={navigateToProduct}
            className="w-full bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-indigo-100"
          >
            Voir le produit
          </button>

          {/* Bouton Ajouter au panier */}
          <button
            onClick={handleAddToCart}
            disabled={loading || product.countInStock === 0 || getAvailableQuantity() <= 0}
            className={`w-full rounded-lg transition-all duration-200 flex items-center justify-center px-4 py-2 text-sm font-medium ${product.countInStock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                : getAvailableQuantity() <= 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                  : loading
                    ? 'bg-indigo-100 text-indigo-400 cursor-wait'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
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
            {loading
              ? 'Ajout...'
              : product.countInStock === 0
                ? 'Stock épuisé'
                : getAvailableQuantity() <= 0
                  ? 'Quantité maximum atteinte'
                  : 'Ajouter au panier'
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;