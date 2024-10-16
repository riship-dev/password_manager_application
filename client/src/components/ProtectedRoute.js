import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem("TOKEN") !== null;
    
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;