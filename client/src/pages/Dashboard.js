import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [passwords, setPasswords] = useState([]);
    const [newPassword, setNewPassword] = useState({
        service_name: "",
        service_username: "",
        service_password: "",
        notes: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPasswords = async () => {
            try {
                const TOKEN = localStorage.getItem("TOKEN");
                const response = await axios.get("http://localhost:5000/api/passwords", {
                    headers: { Authorization: `Bearer ${TOKEN}` },
                });
                setPasswords(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchPasswords();
    }, []);

    const handleAddPassword = async (e) => {
        e.preventDefault();
        try {
            const TOKEN = localStorage.getItem("TOKEN");
            await axios.post("http://localhost:5000/api/passwords", newPassword, {
                headers: { Authorization: `Bearer ${TOKEN}` },
            });
            setNewPassword({ service_name: "", service_username: "", service_password: "", notes: "" });
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeletePassword = async (id) => {
        try {
            const TOKEN = localStorage.getItem("TOKEN");
            await axios.delete(`http://localhost:5000/api/passwords/${id}`, {
                headers: { Authorization: `Bearer ${TOKEN}` },
            });
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("TOKEN");
        navigate("/login");
    };

    return (
        <div className="container">
            <h2>Your Passwords</h2>
            <ul className="list-group">
                {passwords.map((password) => (
                    <li key={password.id} className="list-group-item d-flex justify-content-between">
                        <div>
                            <strong>{password.service_name}</strong> - {password.service_username}
                        </div>
                        <button onClick={() => handleDeletePassword(password.id)} className="btn btn-danger">
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            <h3>Add New Password</h3>
            <form onSubmit={handleAddPassword}>
                <div className="form-group">
                    <label>Service Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={newPassword.service_name}
                        onChange={(e) => setNewPassword({ ...newPassword, service_name: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        className="form-control"
                        value={newPassword.service_username}
                        onChange={(e) => setNewPassword({ ...newPassword, service_username: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="text"
                        className="form-control"
                        value={newPassword.service_password}
                        onChange={(e) => setNewPassword({ ...newPassword, service_password: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Notes</label>
                    <textarea
                        className="form-control"
                        value={newPassword.notes}
                        onChange={(e) => setNewPassword({ ...newPassword, notes: e.target.value })}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Add Password</button>
            </form>
            <br/>
            <button onClick={handleLogout} className="btn btn-danger mb-3">Logout</button>
        </div>
    );
}

export default Dashboard;