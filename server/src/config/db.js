const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerpilot';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB connection warning: ${error.message}`);
    console.warn(`📌 Running in resilient fallback mode with in-memory persistence where applicable. To enable full MongoDB persistence, start MongoDB or update MONGO_URI in server/.env`);
    isConnected = false;
  }
};

const getDBStatus = () => ({
  isConnected,
  host: isConnected ? mongoose.connection.host : 'Offline/Fallback',
  name: isConnected ? mongoose.connection.name : 'careerpilot-memory'
});

module.exports = { connectDB, getDBStatus };
