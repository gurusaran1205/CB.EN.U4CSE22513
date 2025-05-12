import express from "express";
import { getNumbers } from "../controller/number.controller.js";

const router = express.Router();
router.get("/:type", getNumbers);

export default router;
