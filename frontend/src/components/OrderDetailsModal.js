import React from 'react';

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="relative bg-white rounded-xl shadow-xl mx-4 w-full max-w-4xl">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-gray-900">
                        Détails de la commande #{order._id.slice(-6)}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Informations client */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold mb-2">Informations client</h4>
                        <p className="text-gray-600">
                            <span className="font-medium">Nom :</span> {order.user.name}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Email :</span> {order.user.email}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Date de commande :</span>{' '}
                            {new Date(order.createdAt).toLocaleDateString()} à {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                    </div>

                    {/* Produits */}
                    <div className="bg-white border rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Prix unitaire</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Quantité</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {order.orderItems.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img
                                                    src={item.image.startsWith('/uploads')
                                                        ? `http://localhost:5000${item.image}`
                                                        : item.image
                                                    }
                                                    alt={item.name}
                                                    className="w-16 h-16 object-cover rounded-md"
                                                />
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                            {item.price.toFixed(2)} €
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                            {item.qty}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {(item.price * item.qty).toFixed(2)} €
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Résumé */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Sous-total</span>
                            <span className="font-medium">{order.totalPrice.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">TVA (20%)</span>
                            <span className="font-medium">{(order.totalPrice * 0.2).toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                            <span className="font-semibold">Total</span>
                            <span className="font-bold text-lg text-indigo-600">{order.totalPrice.toFixed(2)} €</span>
                        </div>
                    </div>

                    {/* Statuts */}
                    <div className="flex space-x-4">
                        <div className={`flex-1 p-4 rounded-lg ${order.isPaid ? 'bg-green-50' : 'bg-yellow-50'}`}>
                            <h4 className="font-semibold mb-2">Statut du paiement</h4>
                            <p className={order.isPaid ? 'text-green-700' : 'text-yellow-700'}>
                                {order.isPaid ? `Payé le ${new Date(order.paidAt).toLocaleDateString()}` : 'En attente de paiement'}
                            </p>
                        </div>
                        <div className={`flex-1 p-4 rounded-lg ${order.isDelivered ? 'bg-green-50' : 'bg-blue-50'}`}>
                            <h4 className="font-semibold mb-2">Statut de la livraison</h4>
                            <p className={order.isDelivered ? 'text-green-700' : 'text-blue-700'}>
                                {order.isDelivered ? `Livré le ${new Date(order.deliveredAt).toLocaleDateString()}` : 'En cours de traitement'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;