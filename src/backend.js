const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();

// Middleware para permitir o parsing do JSON no corpo da requisição
app.use(express.json());

// Middleware para permitir o uso de cookies
app.use(cookieParser());

// Habilita CORS para permitir o envio de cookies entre diferentes domínios
app.use(
  cors({
    origin: "http://localhost:3000", // Substitua com a origem do seu frontend
    credentials: true, // Permite o envio de cookies
  })
);

// Rota para gerar o JWT (exemplo simples)
app.get("/api/get-jwt", (req, res) => {
  const roomName = req.query.room;

  // Criação do payload com a sala
  const payload = { room: roomName };
  const secret = "seu-segredo"; // Substitua com seu segredo real
  const options = { expiresIn: "1h" };

  // Gera o token JWT
  const token = jwt.sign(payload, secret, options);

  // Armazena o JWT no cookie com segurança
  res.cookie("jwt", token, {
    httpOnly: true, // O cookie não pode ser acessado por JavaScript
    secure: process.env.NODE_ENV === "production", // Só envia o cookie em conexões HTTPS
    sameSite: "Strict", // Impede o envio do cookie em requisições de outros sites
    maxAge: 1000 * 60 * 60 * 24, // Expira em 1 dia
  });

  // Retorna uma mensagem de sucesso
  res.json({ message: "Token gerado e armazenado em cookie!" });
});

// Rota para verificar o JWT (proteção de rota)
app.get("/api/protected", (req, res) => {
  const token = req.cookies.jwt; // Obtém o token do cookie

  if (!token) {
    return res.status(403).json({ message: "Token não encontrado" });
  }

  // Verifica e decodifica o token JWT
  jwt.verify(token, "seu-segredo", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido ou expirado" });
    }

    // Se o token for válido, retorna as informações do usuário ou sala
    res.json({ message: "Token válido", data: decoded });
  });
});

// Rota de logout para remover o cookie
app.post("/api/logout", (req, res) => {
  res.clearCookie("jwt"); // Remove o cookie do JWT
  res.json({ message: "Logout bem-sucedido!" });
});

// Inicia o servidor
app.listen(5000, () => {
  console.log("Servidor rodando na porta 5000");
});
