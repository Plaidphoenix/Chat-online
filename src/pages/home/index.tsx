import React, { useState, useEffect } from "react";
import {
    addDoc,
    collection,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import db from "../../database";
import "./main.css";

function Home() {
    const [mensagem, setMensagem] = useState("");
    const [mensagens, setMensagens] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const userName = localStorage.getItem("userName");

        if (!userId || !userName) {
            navigate("/login");
        } else {
            const q = query(collection(db, "mensagens"), orderBy("timestamp", "desc"));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const mensagensArray = [];
                querySnapshot.forEach((doc) => {
                    const mensagemData = doc.data();
                    mensagensArray.push({
                        id: doc.id,
                        id_usuario: mensagemData.id_usuario,
                        texto: mensagemData.texto,
                        username: mensagemData.username,
                        timestamp: mensagemData.timestamp,
                    });
                });
                setMensagens(mensagensArray);
            });

            return () => {
                unsubscribe();
            };
        }
    }, [navigate]);

    const handleEnviarMensagem = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem("userId");
        const userName = localStorage.getItem("userName");

        try {
            if (mensagem.trim() !== "") {
                const novaMensagem = {
                    texto: mensagem,
                    id_usuario: userId,
                    timestamp: serverTimestamp(),
                    username: userName,
                };

                await addDoc(collection(db, "mensagens"), novaMensagem);

                setMensagem("");
            }
        } catch (error) {
            console.error("Erro ao adicionar mensagem: ", error);
        }
    };

    const handleApagarMensagem = async (mensagemId) => {
        try {
            await deleteDoc(doc(db, "mensagens", mensagemId));
        } catch (error) {
            console.error("Erro ao apagar mensagem: ", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        navigate("/login");
    };

    const userName = localStorage.getItem("userName");

    return (
        <>
            <header>
                <h1>{userName}</h1>
                <button className="Logout" onClick={handleLogout}>
                    Sair
                </button>
            </header>

            <main>
                <div className="lista">
                    {mensagens.map((msg) => (
                        <div key={msg.id} className={`mensagem ${msg.id_usuario === localStorage.getItem("userId") ? 'cliente' : 'usuario'}`}>
                            <h2 className="usuario_name">{msg.username}</h2>
                            <p className="mensagem_usuario">{msg.texto}</p>
                            {msg.id_usuario === localStorage.getItem("userId") && (
                                <button
                                    className="apagar_mensagem"
                                    onClick={() => handleApagarMensagem(msg.id)}
                                >
                                    Apagar
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <form className="postar_mensagem" onSubmit={handleEnviarMensagem}>
                    <h2>Adicione uma Mensagem</h2>
                    <textarea
                        className="mensagem_cliente"
                        placeholder="Digite sua mensagem..."
                        value={mensagem}
                        onChange={(e) => setMensagem(e.target.value)}
                    ></textarea>
                    <div className="btts">
                        <button
                            type="button"
                            className="Limpar"
                            onClick={() => setMensagem("")}
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="Enviar">
                            Enviar
                        </button>
                    </div>
                </form>
            </main>
        </>
    );
}

export default Home;
