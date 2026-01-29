"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
const PORT = parseInt(process.env.PORT || "5001");
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/sporton";
console.log("🚀 Starting Sporton Backend...");
console.log(`📦 MongoDB URL: ${MONGO_URL}`);
mongoose_1.default
    .connect(MONGO_URL)
    .then(() => {
    console.log("✅ Connected to MongoDB successfully!");
    console.log(`🌐 Starting server on port ${PORT}...`);
    app_1.default.listen(PORT, '0.0.0.0', () => {
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
