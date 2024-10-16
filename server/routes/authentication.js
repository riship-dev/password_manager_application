import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import DB from "../models/database.js";
import dotenv from "dotenv";
dotenv.config();
const ROUTER = express.Router();

ROUTER.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await DB.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await DB.query(
            `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *`,
            [username, email, hashedPassword]
        );

        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
ROUTER.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await DB.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        return res.status(200).json({ token });
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default ROUTER;