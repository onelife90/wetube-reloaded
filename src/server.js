import express from "express";
import morgan from "morgan";

const PORT = 4000;
const app = express();
const logger = morgan("dev");

app.use(logger);
app.get("/", (req, res) => {
  return res.send("I love middlewares");
});

app.get("/login", (req, res) => {
  return res.send({ message: "Login here." });
});

const handleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);
