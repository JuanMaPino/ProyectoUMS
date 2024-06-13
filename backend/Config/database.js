require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conectado a mongoDB');
  } catch (error) {
    console.error('No se pudo conectar:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
