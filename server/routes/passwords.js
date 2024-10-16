import express from "express";
import DB from "../models/database.js";
import verifyToken from "../middleware/verifyToken.js";
const ROUTER = express.Router();

ROUTER.get("/", verifyToken, async (req, res) => {
    try {
        const passwords = await DB.query("SELECT * FROM passwords WHERE user_id = $1", [req.user.id]);
        return res.status(200).json(passwords.rows);
    } catch (error) {
        console.error("Error fetching passwords:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

ROUTER.post("/", verifyToken, async (req, res) => {
    const { service_name, service_username, service_password, notes } = req.body;

    try {
        await DB.query(
            `INSERT INTO passwords (user_id, service_name, service_username, service_password, notes) VALUES ($1, $2, $3, $4, $5)`,
            [req.user.id, service_name, service_username, service_password, notes]
        );
        return res.status(201).json({ message: "Password saved successfully" });
    } catch (error) {
        console.error("Error saving password:", error);
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