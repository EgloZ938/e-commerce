import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ImageDropzone from '../components/ImageDropzone';
import axios from 'axios';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState({
        name: '',
        price: '',
        description: '',
        brand: '',
        category: '',
        countInStock: ''
    });

    const fetchProduct = useCallback(async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
            setProduct(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `http://localhost:5000/api/products/${id}`,
                product,
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                }
            );
            navigate('/admin');
        } catch (error) {
            console.error(error);
            alert('Erreur lors de la modification du produit');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Modifier le produit</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Image du produit
                            </label>
                            <ImageDropzone
                                onImageUpload={(imagePath) => setProduct({ ...product, image: imagePath })}
                                initialImage={product.image}
                                token={userInfo.token}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nom du produit
                            </label>
                            <input
                                type="text"
                                value={product.name}
                                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Prix
                            </label>
                            <input
                                type="number"
                                value={product.price}
                                onChange={(e) => setProduct({ ...product, price: e.target.value })}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                value={product.description}
                                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                                rows="3"
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Marque
                                </label>
                                <input
                                    type="text"
                                    value={product.brand}
                                    onChange={(e) => setProduct({ ...product, brand: e.target.value })}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Catégorie
                                </label>
                                <input
                                    type="text"
                                    value={product.category}
                                    onChange={(e) => setProduct({ ...product, category: e.target.value })}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Stock
                            </label>
                            <input
                                type="number"
                                value={product.countInStock}
                                onChange={(e) => setProduct({ ...product, countInStock: e.target.value })}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        <div className="flex justify-end space-x-3 pt-6">
                            <button
                                type="button"
                                onClick={() => navigate('/admin')}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Sauvegarder
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;