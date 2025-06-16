// Para desarrollo local:
const db = require("./data/database.mock");

// Para producción Firebase:
// const db = require('./data/database.firebase');

const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API funcionando");
});

// Puerto desde .env o por defecto 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
