import dotenv from "dotenv";
import express from "express";
import userRoutes from "./routes/userRoutes";
import { syncDatabase } from "./utils/db";

dotenv.config();

const app = express();

app.use(express.json());


// routes
app.use("/users", userRoutes);

// database
syncDatabase();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
