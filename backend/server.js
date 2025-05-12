import express from "express";
import numberRoutes from "./routes/number.route.js";

const app = express();
const PORT = 9876;

app.use("/numbers", numberRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
