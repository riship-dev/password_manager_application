import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const TOKEN = req.header("Authorization")?.split(" ")[1];
    if (!TOKEN) {
        return res.status(401).json({ message: "Access denied" });
    }

    try {
        const verified = jwt.verify(TOKEN, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        return res.status(400).json({ message: "Invalid TOKEN" });
    }
};

export default verifyToken;