const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const {getUsers, registrarUsuario, verificarCredenciales} = require ("./consultas")
const {reporteConsulta, checkCredentials, tokenVerification} = require("./middlewares")

const jwt = require("jsonwebtoken");

PORT = 3000;

// Iniciador de puerto
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });

app.use(cors());
app.use(express.json());


app.get("/usuarios", reporteConsulta, async (req, res) => {
  try {
    const usuarios = await getUsers();
    res.send(usuarios);
  } catch (error) {}
});



app.post("/usuarios", reporteConsulta, checkCredentials, async (req, res) => {
    try {
      const usuario = req.body;
      await registrarUsuario(usuario);
      res.send("Usuario creado con éxito");
    } catch (error) {
      res.status(500).send(error);
    }
  });


app.post("/login", checkCredentials, reporteConsulta, async (req, res) => {
  try {
    const { email, password } = req.body;
    await verificarCredenciales(email, password);
    const token = jwt.sign({ email }, process.env.SECRET_KEY);
    res.send(token);
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error);
  }
});

app.get("*", (req, res) => {
    res.status(404).send("Esta ruta no existe");
  });