import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { AuthRequest } from "../middlewares/auth.middlwares";

const JWT_SECRET = process.env.JWT_SECRET || "Sporton123";

// REGISTER USER
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, name } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            email,
            password: hashedPassword,
            name
        });

        await newUser.save();

        // Create JWT Token
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).json({
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// SIGNIN USER (LOGIN)
export const signin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }

        // Create JWT Token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Signin Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// INITIATE ADMIN USER (Create first admin)
export const initiateAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, name } = req.body;

        // Check if any user already exists
        const count = await User.countDocuments({});
        if (count > 0) {
            res.status(400).json({
                message: "Admin user already exists. Only one admin allowed."
            });
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create admin user
        const newUser = new User({
            email,
            password: hashedPassword,
            name
        });

        await newUser.save();

        res.status(201).json({ message: "Admin user created successfully!" });
    } catch (error) {
        console.error("Initiate admin user error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// GET USER PROFILE (with token authentication)
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // req.user comes from authenticate middleware
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: "User ID not found in token" });
            return;
        }

        // Find user by ID (exclude password)
        const user = await User.findById(userId).select("-password");

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json({
            message: "Hore, kamu bisa mengakses karena kamu pakai token",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

