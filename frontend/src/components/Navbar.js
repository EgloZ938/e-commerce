import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import {
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    UsersIcon,
    ShoppingBagIcon,
    CubeIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/loginAdmin');
    };

    const navItems = [
        { name: 'Produits', path: '/admin', icon: CubeIcon },
        { name: 'Utilisateurs', path: '/admin/users', icon: UsersIcon },
        { name: 'Commandes', path: '/admin/orders', icon: ShoppingBagIcon },
    ];

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <span
                                onClick={() => navigate('/admin')}
                                className="cursor-pointer text-xl font-bold text-blue-600"
                            >
                                Admin Panel
                            </span>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {navItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => navigate(item.path)}
                                    className={`inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium ${location.pathname === item.path
                                            ? 'border-blue-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-blue-500 hover:text-gray-700'
                                        }`}
                                >
                                    <item.icon className="h-5 w-5 mr-2" />
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <UserCircleIcon className="h-8 w-8 text-gray-400" />
                        </div>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                            Déconnexion
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;