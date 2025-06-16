// backend/data/database.js

// Aquí elegís la versión activa según ambiente:
const env = process.env.NODE_ENV || "development";

let db;

if (env === "production") {
  db = require("./database.firebase");
} else {
  db = require("./database.mock");
}

module.exports = db;
