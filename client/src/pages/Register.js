import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("TOKEN") !== null;

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/authentication/register", { username, email, password });
            navigate("/login");
        } catch (err) {
            setError("Registration failed");
        }
    };

    const handleLoginRedirect = () => {
        navigate("/login"); // Navigate to the Login page
    };

    return (
        <div className="container">
            <h2>Register</h2>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleRegister}>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
                <button onClick={handleLoginRedirect} className="btn btn-link">
                    Already have an account? Login
                </button>
            </form>
        </div>
    );
}

export default Register;