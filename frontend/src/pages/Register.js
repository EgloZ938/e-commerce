import React from 'react';
import { useState } from 'react';

function Register() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        username: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your registration logic here
    };

    return (
        <div className="h-screen bg-white flex flex-col justify-center py-6 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Créer un compte
                </h2>
            </div>
            <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-6 px-4 shadow-lg sm:rounded-xl sm:px-10 border border-gray-100">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Nom d'utilisateur</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200"
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                placeholder="Entrez votre nom d'utilisateur"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Email</label>
                            <input
                                type="email"
                                required
                                className="mt-1 block w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                placeholder="Entrez votre email"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Mot de passe</label>
                            <input
                                type="password"
                                required
                                className="mt-1 block w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                placeholder="Entrez votre mot de passe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Confirmer le mot de passe</label>
                            <input
                                type="password"
                                required
                                className="mt-1 block w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition duration-200"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                placeholder="Confirmez votre mot de passe"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 transform hover:-translate-y-0.5"
                        >
                            S'inscrire
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;