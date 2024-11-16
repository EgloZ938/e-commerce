import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Contexts/AuthContext';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError('Les mots de passe ne correspondent pas');
        }
        try {
            setError('');
            setLoading(true);
            console.log('Tentative d\'inscription avec:', formData); // Log des données

            const result = await register(formData.name, formData.email, formData.password);
            console.log('Résultat inscription:', result); // Log du résultat

            if (result.success) {
                navigate('/');
            } else {
                setError(result.error || "Erreur lors de l'inscription");
            }
        } catch (err) {
            console.error('Erreur détaillée:', err); // Log de l'erreur
            setError("Erreur lors de l'inscription. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto space-y-8">
                <div>
                    <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
                        Créer un compte
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Ou{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            connectez-vous à votre compte
                        </Link>
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="name" className="sr-only">
                                Nom complet
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="Nom complet"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Adresse email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="Adresse email"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="Mot de passe"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="sr-only">
                                Confirmer le mot de passe
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="Confirmer le mot de passe"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </span>
                            ) : "S'inscrire"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;