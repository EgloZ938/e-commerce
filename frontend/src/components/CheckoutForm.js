import React, { useState } from 'react';
import {
    PaymentElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';

const CheckoutForm = ({ total, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/payment-success`,
                },
                redirect: 'if_required'
            });

            if (error) {
                setPaymentError(error.message);
            } else if (paymentIntent.status === 'succeeded') {
                onSuccess(paymentIntent);
            }
        } catch (err) {
            setPaymentError('Une erreur est survenue lors du paiement.');
        }

        setIsProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />

            {paymentError && (
                <div className="text-red-600 text-sm">
                    {paymentError}
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className={`w-full py-3 px-4 rounded-xl font-medium transition-colors
          ${isProcessing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'} text-white`}
            >
                {isProcessing ? 'Traitement...' : `Payer ${total.toFixed(2)} €`}
            </button>
        </form>
    );
};

export default CheckoutForm;