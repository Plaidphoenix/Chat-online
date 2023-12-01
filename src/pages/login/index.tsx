import React, { useState } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import db from "../../database";
import "./main.css";

function Login() {
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleCheckboxChange = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const q = query(collection(db, "usuarios"), where("email", "==", loginData.email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.size === 0) {
                alert("Email ou senha inválidos");
            } else {
                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    if (userData.password === loginData.password) {
                        localStorage.setItem("userId", doc.id);
                        localStorage.setItem("userName", userData.username);
                        navigate("/");
                    } else {
                        alert("Email ou senha inválidos");
                        window.location.reload();
                    }
                });
            }
        } catch (error) {
            console.error("Erro ao buscar usuário: ", error);
        }
    };

    return (
        <form className="form_login" onSubmit={handleSubmit}>
            <h1>Login</h1>
            <input
                type="email"
                name="email"
                placeholder="Email..."
                className="user_email"
                value={loginData.email}
                onChange={handleChange}
                required
            />
            <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Senha..."
                className="user_password"
                value={loginData.password}
                onChange={handleChange}
                required
            />
            <div className="show_password">
                <input
                    type="checkbox"
                    className="cbx_password"
                    checked={showPassword}
                    onChange={handleCheckboxChange}
                />
                <strong>Mostrar a Senha</strong>
            </div>
            <button type="submit" className="Submit">
                Entrar
            </button>
            <p>
                Não tem uma conta? <a href="/cadastro">Cadastre-se</a>
            </p>
        </form>
    );
}

export default Login;