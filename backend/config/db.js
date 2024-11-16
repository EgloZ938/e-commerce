const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connecté: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Erreur: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;