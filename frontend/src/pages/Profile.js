import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/Contexts/AuthContext';
import { EyeIcon } from '@heroicons/react/24/outline';
import OrderDetailsModal from '../components/OrderDetailsModal';
import AvatarUploadModal from '../components/AvatarUploadModal';
import axios from 'axios';

function Profile() {
    const { user, updateUserProfile, updateUserAvatar } = useAuth();
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
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name,
                email: user.email
            }));
        }
    }, [user]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/orders/myorders`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setOrders(data);
                setLoadingOrders(false);
            } catch (error) {
                console.error('Erreur lors du chargement des commandes:', error);
                setLoadingOrders(false);
            }
        };

        fetchOrders();
    }, []);

    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setAvatarFile(null);
        setAvatarPreview('');
    };

    const handleCroppedImage = async (croppedFile) => {
        setAvatarFile(croppedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result);
        };
        reader.readAsDataURL(croppedFile);
        setIsModalOpen(false);
    };

    const handleAvatarUpload = async () => {
        if (!avatarFile) return;

        const formData = new FormData();
        formData.append('avatar', avatarFile);

        try {
            setLoading(true);
            const response = await axios.put(
                'http://localhost:5000/api/auth/profile/avatar',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.data.avatar) {
                // Utiliser la nouvelle fonction updateUserAvatar au lieu de updateUserProfile
                await updateUserAvatar(response.data.avatar);
                setSuccess('Photo de profil mise à jour avec succès');
                setAvatarFile(null);
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Erreur lors de la mise à jour de la photo de profil');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Réinitialiser les messages d'état
        setError('');
        setSuccess('');
    };

    const hasChanges = () => {
        if (!user) return false;

        // Ne considérer le mot de passe actuel comme un changement 
        // que s'il y a aussi un nouveau mot de passe
        const passwordChanged = formData.newPassword && formData.password;

        return formData.name !== user.name ||
            formData.email !== user.email ||
            passwordChanged;
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Vérifier s'il y a des changements
        if (!hasChanges()) {
            return setError('Aucune modification n\'a été effectuée');
        }

        // Si seul le mot de passe actuel est rempli sans nouveau mot de passe
        if (formData.password && !formData.newPassword) {
            return setError('Veuillez entrer un nouveau mot de passe ou laisser les champs de mot de passe vides');
        }

        // Validation du mot de passe
        if (formData.newPassword) {
            // Vérifier la longueur du nouveau mot de passe
            if (formData.newPassword.length < 6) {
                return setError('Le nouveau mot de passe doit contenir au moins 6 caractères');
            }

            // Vérifier que l'ancien mot de passe est fourni
            if (!formData.password) {
                return setError('Le mot de passe actuel est requis pour changer de mot de passe');
            }

            // Vérifier que les mots de passe correspondent
            if (formData.newPassword !== formData.confirmNewPassword) {
                return setError('Les nouveaux mots de passe ne correspondent pas');
            }
        }

        try {
            setError('');
            setSuccess('');
            setLoading(true);

            const updateData = {
                name: formData.name,
                email: formData.email
            };

            // N'inclure les mots de passe que s'ils sont fournis
            if (formData.password && formData.newPassword) {
                updateData.currentPassword = formData.password;
                updateData.newPassword = formData.newPassword;
            }

            const result = await updateUserProfile(updateData);

            if (result.error) {
                setError(result.error);
                return;
            }

            setSuccess('Profil mis à jour avec succès');
            setFormData(prev => ({
                ...prev,
                password: '',
                newPassword: '',
                confirmNewPassword: ''
            }));
        } catch (err) {
            setError(err.message || 'Erreur lors de la mise à jour du profil');
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
                        <div className="relative group" onClick={handleModalOpen}>
                            <div className="h-20 w-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden cursor-pointer">
                                {avatarPreview || user?.avatar ? (
                                    <img
                                        src={avatarPreview || `http://localhost:5000/uploads/${user.avatar}`}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    user?.name?.charAt(0).toUpperCase()
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                    <span className="text-white text-sm">Changer</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-grow">
                            <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
                            <p className="text-gray-600">Gérez vos informations personnelles et votre sécurité</p>
                        </div>
                        {avatarFile && (
                            <button
                                onClick={handleAvatarUpload}
                                disabled={loading}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Chargement...' : 'Sauvegarder la photo'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Form Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 animate-shake">
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
                                {/* Mot de passe actuel */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Mot de passe actuel
                                    </label>
                                    <div className="mt-1 relative">
                                        <input
                                            type={showPassword.current ? "text" : "password"}
                                            name="password"
                                            id="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                                            onClick={() => togglePasswordVisibility('current')}
                                        >
                                            {showPassword.current ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="sm:col-span-2 h-0.5 bg-gray-100" />

                                {/* Nouveau mot de passe */}
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                        Nouveau mot de passe
                                    </label>
                                    <div className="mt-1 relative">
                                        <input
                                            type={showPassword.new ? "text" : "password"}
                                            name="newPassword"
                                            id="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                                            onClick={() => togglePasswordVisibility('new')}
                                        >
                                            {showPassword.new ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirmer nouveau mot de passe */}
                                <div>
                                    <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                                        Confirmer le nouveau mot de passe
                                    </label>
                                    <div className="mt-1 relative">
                                        <input
                                            type={showPassword.confirm ? "text" : "password"}
                                            name="confirmNewPassword"
                                            id="confirmNewPassword"
                                            value={formData.confirmNewPassword}
                                            onChange={handleChange}
                                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                                            onClick={() => togglePasswordVisibility('confirm')}
                                        >
                                            {showPassword.confirm ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                disabled={loading || !hasChanges()}
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
                                ) : hasChanges() ? 'Mettre à jour le profil' : 'Aucune modification'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {/* Section Commandes */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Mes Commandes</h2>

                {loadingOrders ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Aucune commande pour le moment</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Commande</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Statut</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-medium text-gray-900">
                                                #{order._id.slice(-6)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                                            {order.totalPrice.toFixed(2)} €
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.isDelivered
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {order.isDelivered ? 'Livré' : 'En cours'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                <EyeIcon className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal de détails de commande */}
            <OrderDetailsModal
                isOpen={selectedOrder !== null}
                onClose={() => setSelectedOrder(null)}
                order={selectedOrder}
            />

            {/* Modal de téléchargement d'avatar */}
            <AvatarUploadModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSave={handleCroppedImage}
            />
        </div>
    );
}

export default Profile;