import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import db from "../../database";
import "./main.css";

function Cadastro() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCheckboxChange = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, "usuarios"), {
        username: userData.username,
        email: userData.email,
        password: userData.password,
      });

      console.log("Documento adicionado com ID: ", docRef.id);

      // Limpar os campos após o envio bem-sucedido
      setUserData({
        username: "",
        email: "",
        password: "",
      });

      // Redirecionar para /login após o cadastro bem-sucedido
      navigate("/login");
    } catch (error) {
      console.error("Erro ao adicionar documento: ", error);
    }
  };

  return (
    <form className="form_cadastro" onSubmit={handleSubmit}>
      <h1>Cadastro</h1>
      <input
        type="text"
        name="username"
        placeholder="Nome de usuário..."
        className="user_name"
        value={userData.username}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email..."
        className="user_email"
        value={userData.email}
        onChange={handleChange}
        required
      />
      <input
        type={showPassword ? "text" : "password"}
        name="password"
        placeholder="Senha..."
        className="user_password"
        value={userData.password}
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
        Criar
      </button>
      <p>
        Já tem uma conta? <a href="/login">Entrar</a>
      </p>
    </form>
  );
}

export default Cadastro;
