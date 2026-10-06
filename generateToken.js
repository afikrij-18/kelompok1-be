import jwt from "jsonwebtoken";

const JWT_SECRET = "development-secret-key";

const token = jwt.sign(
  {
    id: 1,
    email: "test@example.com",
  },
  JWT_SECRET,
  {
    expiresIn: "3h",
  }
);

console.log(token);