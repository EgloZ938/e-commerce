const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const connectDB = require('../config/db');

dotenv.config();

const admin = {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    isAdmin: true
};

const products = [
    {
        name: 'Airpods Pro',
        price: 249.99,
        description: 'Écouteurs sans fil avec réduction de bruit active',
        image: 'airpods.jpg',
        brand: 'Apple',
        category: 'Electronics',
        countInStock: 10,
    },
    {
        name: 'MacBook Pro',
        price: 1299.99,
        description: 'Ordinateur portable puissant pour les professionnels',
        image: 'macbook.jpg',
        brand: 'Apple',
        category: 'Electronics',
        countInStock: 5,
    },
    {
        name: 'Nike Air Max',
        price: 129.99,
        description: 'Chaussures de sport confortables',
        image: 'nike.jpg',
        brand: 'Nike',
        category: 'Shoes',
        countInStock: 15,
    }
];

const importData = async () => {
    try {
        await connectDB();

        // Nettoyer la base de données
        await Product.deleteMany();
        await User.deleteMany();

        // Créer l'utilisateur admin
        const createdAdmin = await User.create(admin);

        // Ajouter l'ID de l'admin à chaque produit
        const sampleProducts = products.map(product => {
            return { ...product, user: createdAdmin._id };
        });

        // Insérer les produits
        await Product.insertMany(sampleProducts);

        console.log('Données importées avec succès !');
        console.log('Admin créé:');
        console.log('Email:', admin.email);
        console.log('Mot de passe:', admin.password);
        process.exit();
    } catch (error) {
        console.error('Erreur:', error);
        process.exit(1);
    }
};

// Modifier les options de connexion pour enlever les avertissements
mongoose.set('strictQuery', false);

importData();