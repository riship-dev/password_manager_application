import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import DB from "./models/database.js";
//import authenticationRoutes from "./routes/authentication.js";
//import passwordRoutes from "./routes/passwords.js";
dotenv.config();
DB.connect()
    .then(() => {
        console.log("Connected to PostgreSQL database successfully.");
    })
    .catch((error) => {
        console.error("Error connecting to PostgreSQL database:", error);
        process.exit(1);
    });
const APP = express();
const PORT = 5000;

APP.use(cors());
APP.use(express.json());
//APP.use("/api/authentication", authenticationRoutes);
//APP.use("/api/passwords", passwordRoutes);

APP.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});