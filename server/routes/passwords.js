import express from "express";
import DB from "../models/database.js";
import verifyToken from "../middleware/verifyToken.js";
import crypto from "crypto";

const ROUTER = express.Router();

const algorithm = "aes-256-cbc";
const secretKey = process.env.SECRET_KEY || "your-secret-key";
const key = crypto.createHash('sha256').update(secretKey).digest('hex');

const encrypt = (text) => {
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString('hex')}:${encrypted}`; // Return both IV and encrypted text
};
const decrypt = (text) => {
    const [ivText, encryptedText] = text.split(":");
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(ivText, 'hex'));
    let decrypted = decipher.update(encryptedText, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
};

ROUTER.get("/", verifyToken, async (req, res) => {
    try {
        const passwords = await DB.query("SELECT * FROM passwords WHERE user_id = $1", [req.user.id]);
        const decryptedPasswords = passwords.rows.map((password) => ({
            ...password,
            service_password: decrypt(password.service_password),
        }));
        return res.status(200).json(decryptedPasswords);
    } catch (error) {
        console.error("Error fetching passwords:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

ROUTER.post("/", verifyToken, async (req, res) => {
    const { service_name, service_username, service_password, notes } = req.body;

    try {
        const encryptedPassword = encrypt(service_password);
        await DB.query(
            "INSERT INTO passwords (user_id, service_name, service_username, service_password, notes) VALUES ($1, $2, $3, $4, $5)",
            [req.user.id, service_name, service_username, encryptedPassword, notes]
        );
        return res.status(201).json({ message: "Password saved successfully" });
    } catch (error) {
        console.error("Error saving password:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

ROUTER.put("/:id", verifyToken, async (req, res) => {
    const { service_name, service_username, service_password, notes } = req.body;

    try {
        const encryptedPassword = encrypt(service_password);
        const result = await DB.query(
            "UPDATE passwords SET service_name = $1, service_username = $2, service_password = $3, notes = $4 WHERE id = $5 AND user_id = $6",
            [service_name, service_username, encryptedPassword, notes, req.params.id, req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Password not found or unauthorized" });
        }

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

ROUTER.delete("/:id", verifyToken, async (req, res) => {
    try {
        await DB.query("DELETE FROM passwords WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id]);
        return res.status(200).json({ message: "Password deleted successfully" });
    } catch (error) {
        console.error("Error deleting password:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default ROUTER;