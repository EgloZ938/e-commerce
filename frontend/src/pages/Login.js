import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Contexts/AuthContext';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Reset error when user starts typing
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.email) {
            setError('L\'email est requis');
            return false;
        }
        if (!formData.email.includes('@')) {
            setError('Veuillez entrer un email valide');
            return false;
        }
        if (!formData.password) {
            setError('Le mot de passe est requis');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset error state
        setError('');

        // Validate form
        if (!validateForm()) return;

        try {
            setLoading(true);
            const result = await login(formData.email, formData.password);

            if (result.success) {
                navigate('/');
            } else {
                setError(result.error || 'Une erreur est survenue lors de la connexion');
            }
        } catch (err) {
            setError('Email ou mot de passe incorrect');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
                        Connexion à votre compte
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Ou{' '}
                        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                            créer un nouveau compte
                        </Link>
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="animate-shake bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Login Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Adresse email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                placeholder="exemple@email.com"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Remember me & Forgot password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 cursor-pointer">
                                    Se souvenir de moi
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Connexion en cours...
                            </div>
                        ) : (
                            'Se connecter'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;