import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

// Initialiser Stripe en dehors du composant
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentModal = ({ isOpen, onClose, total, onPaymentSuccess }) => {
    const [clientSecret, setClientSecret] = useState(null);

    useEffect(() => {
        if (isOpen) {
            // Appeler l'API pour créer l'intention de paiement
            const createPaymentIntent = async () => {
                try {
                    const response = await fetch('http://localhost:5000/api/stripe/create-payment-intent', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({ amount: total })
                    });
                    const data = await response.json();
                    setClientSecret(data.clientSecret);
                } catch (error) {
                    console.error('Erreur:', error);
                }
            };
            createPaymentIntent();
        }
    }, [isOpen, total]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="relative bg-white rounded-lg shadow-xl p-8 m-4 max-w-xl w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Paiement sécurisé</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        ×
                    </button>
                </div>

                {clientSecret ? (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <CheckoutForm total={total} onSuccess={onPaymentSuccess} />
                    </Elements>
                ) : (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentModal;