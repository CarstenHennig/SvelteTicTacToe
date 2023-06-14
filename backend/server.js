// backend/server.js
const express = require("express");
const storage = require("./storage");

const app = express();
app.use(express.json());

app.post("/api/match", (req, res) => {
  const { result } = req.body;
  const winner = result === "draw" ? null : "Player " + result;
  storage.saveMatchResult({ result, winner });
  res.sendStatus(201);
});

app.get("/api/matches", (req, res) => {
  const matches = storage.getMatchResults().slice(-5).reverse(); // Retrieve the latest 5 match results and reverse the order
  res.json(matches);
});

app.listen(3001, () => {
  console.log("Server is running on port 3000");
});
