import express from "express";

const PORT = 4000;
const app = express();

app.get("/", (req, res) => {
  return res.send("<h1>I still powerful!</h1>");
});

app.get("/login", (req, res) => {
  return res.send({ message: "Login here." });
});

const handleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);
