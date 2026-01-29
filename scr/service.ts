import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const PORT = parseInt(process.env.PORT || "5001");
const MONGO_URI = process.env.MONGO_URI;

console.log("🚀 Starting Sporton Backend...");

if (!MONGO_URI) {
  console.error("❌ Error: MONGO_URI environment variable is not set!");
  console.error("Please set MONGO_URI environment variable or add it to .env file");
  console.error("For MongoDB Atlas, use: mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority");
  process.exit(1);
}

console.log(`📦 MongoDB URI: ${MONGO_URI.replace(/:([^:@]+)@/, ':****@')}`); // Hide password in logs

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully!");
    console.log(`🌐 Starting server on port ${PORT}...`);
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
      console.log(`📝 API Documentation:`);
      console.log(`   POST /api/auth/signin - User login`);
      console.log(`   POST /api/auth/initiate-admin-user - Create admin user`);
    });
  })
  .catch((error) => {
    console.error("❌ Error connecting to MongoDB:", error.message);
    console.error("Please make sure MongoDB is running!");
    console.error("To start MongoDB on macOS: brew services start mongodb-community");
    process.exit(1);
  });

