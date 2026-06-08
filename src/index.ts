import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hej från TypeScript backend!");
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hej världen" });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server kör på http://localhost:${PORT}`);
});