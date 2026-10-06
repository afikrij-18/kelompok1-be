import express from "express";
import authMiddleware from "./middleware/authMiddleware.js";

const app = express();

app.use(express.json());

app.get("/api/test", authMiddleware, (req, res) => {
  res.json({
    message: "Authentication berhasil",
    user: req.user,
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});