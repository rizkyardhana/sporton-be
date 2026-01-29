import express from "express";
import cors from "cors";
import authRoutes from "./roules/auth.routes";
import { authenticate } from "./middlewares/auth.middlwares";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Sporton Backend API is Running");
});

app.get("/test-middleware", authenticate, (req, res) => {
    res.send("Hore, kamu bisa mengakses karena kamu pakai token");
});

// Auth Routes
app.use("/api/auth", authRoutes);

export default app;

