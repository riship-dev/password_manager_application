import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
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

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/authentication/login", { email, password });
            localStorage.setItem("TOKEN", response.data.token);
            navigate("/dashboard");
        } catch (err) {
            setError("Invalid email or password");
        }
    };

    const handleRegisterRedirect = () => {
        navigate("/register"); // Navigate to the Register page
    };

    return (
        <div className="container">
            <h2>Login</h2>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleLogin}>
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
                <button type="submit" className="btn btn-primary">Login</button>
                <button onClick={handleRegisterRedirect} className="btn btn-link">
                    Register
                </button>
            </form>
        </div>
    );
}

export default Login;