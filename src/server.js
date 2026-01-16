import "dotenv/config";
import express from "express";
import path from "path";
import userRoutes from "./routes/user.routes.js";
import showcaseRoutes from "./routes/showcase.routes.js"
import shinyCapturedRoutes from "./routes/shinyCaptured.routes.js"

const app = express();

app.use(express.json());

app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/users", userRoutes);
app.use("/showcase", showcaseRoutes)
app.use("/shinyCaptured", shinyCapturedRoutes)

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
