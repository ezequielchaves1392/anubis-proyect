// backend/data/database.mock.js

const fs = require("fs");
const path = "./data/data.json";

function readData() {
  if (!fs.existsSync(path)) return {};
  const raw = fs.readFileSync(path);
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

module.exports = {
  getUsers: () => {
    const data = readData();
    return data.users || [];
  },
  addUser: (user) => {
    const data = readData();
    data.users = data.users || [];
    data.users.push(user);
    writeData(data);
  },
  // Más funciones según necesites...
};
