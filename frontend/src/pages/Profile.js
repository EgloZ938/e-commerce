import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/Contexts/AuthContext';

function Profile() {
    const { user, updateUserProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name,
                email: user.email
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Réinitialiser les messages d'état
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmNewPassword) {
            return setError('Les nouveaux mots de passe ne correspondent pas');
        }
        try {
            setError('');
            setSuccess('');
            setLoading(true);
            await updateUserProfile({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                newPassword: formData.newPassword || undefined
            });
            setSuccess('Profil mis à jour avec succès');
            setFormData(prev => ({
                ...prev,
                password: '',
                newPassword: '',
                confirmNewPassword: ''
            }));
        } catch (err) {
            setError('Erreur lors de la mise à jour du profil');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <div className="flex items-center space-x-4">
                        <div className="h-20 w-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
                            <p className="text-gray-600">Gérez vos informations personnelles et votre sécurité</p>
                        </div>
                    </div>
                </div>

                {/* Main Form Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
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

                    {success && (
                        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-700">{success}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Informations Personnelles */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900">Informations Personnelles</h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Nom complet
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Adresse email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sécurité */}
                        <div className="space-y-4 pt-6 border-t border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">Sécurité</h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Mot de passe actuel
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div className="sm:col-span-2 h-0.5 bg-gray-100" />
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                        Nouveau mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        id="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                                        Confirmer le nouveau mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmNewPassword"
                                        id="confirmNewPassword"
                                        value={formData.confirmNewPassword}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Mise à jour en cours...
                                    </>
                                ) : (
                                    'Mettre à jour le profil'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Profile;