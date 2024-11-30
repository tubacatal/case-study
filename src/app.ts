import dotenv from "dotenv";
import express from "express";
import bookRoutes from "./routes/bookRoutes";
import userRoutes from "./routes/userRoutes";
import { syncDatabase } from "./utils/db";

dotenv.config();

const app = express();

app.use(express.json());

// routes
app.use("/users", userRoutes);
app.use("/books", bookRoutes);

// database
syncDatabase();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
