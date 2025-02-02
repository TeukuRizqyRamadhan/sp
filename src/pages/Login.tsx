import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const setToken = useAuthStore((state) => state.setToken);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        try {
            const response = await API.post("/auth/login", { email, password });
            const { token } = response.data;

            // Simpan token ke localStorage agar tetap login saat refresh
            localStorage.setItem("token", token);
            setToken(token);
            navigate("/dashboard");
        } catch (error) {
            setErrorMessage("Login gagal karena salah password atau username");
        }
    };

    return (
        <div className="h-screen flex items-center justify-center">
            <form className="bg-white p-6 shadow-md w-80" onSubmit={handleLogin}>
                <h2 className="text-xl font-bold mb-4 text-center">Login Admin</h2>
                {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}
                <input
                    className="border p-2 w-full mb-2"
                    type="text"
                    placeholder="Username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    className="border p-2 w-full mb-2"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button className="bg-blue-500 text-white p-2 w-full">Login</button>
            </form>
        </div>
    );
};

export default Login;
