import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { PlusIcon } from '@heroicons/react/24/outline';
import ProductModal from '../components/ProductModal';
import ProductTable from '../components/ProductTable';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
        image: 'placeholder.jpg',
        brand: '',
        category: '',
        countInStock: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/products');
            setProducts(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            try {
                await axios.delete(`http://localhost:5000/api/products/${id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });
                setProducts(products.filter(product => product._id !== id));
                alert('Produit supprimé avec succès');
            } catch (error) {
                console.error('Erreur lors de la suppression:', error.response?.data?.message || error.message);
                alert('Erreur lors de la suppression du produit');
            }
        }
    };

    const handleNewProductSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/products', newProduct, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            setProducts([...products, response.data]);
            setNewProduct({
                name: '',
                price: '',
                description: '',
                image: 'placeholder.jpg',
                brand: '',
                category: '',
                countInStock: ''
            });
            setShowForm(false);
        } catch (error) {
            console.error(error);
            alert('Erreur lors de la création du produit');
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des Produits</h1>
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Nouveau Produit
                    </button>
                </div>

                <ProductModal
                    isOpen={showForm}
                    onClose={() => setShowForm(false)}
                    title="Ajouter un nouveau produit"
                    product={newProduct}
                    setProduct={setNewProduct}
                    onSubmit={handleNewProductSubmit}
                    buttonText="Ajouter"
                    userInfo={userInfo}
                />

                <ProductTable
                    products={products}
                    onEdit={(product) => navigate(`/admin/product/${product._id}`)}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
};

export default AdminDashboard;