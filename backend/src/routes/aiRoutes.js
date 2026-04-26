import express from "express";
import { generateResponse, compareResponses } from "../controllers/aiController.js";

const router = express.Router();

router.post("/generate", generateResponse);
router.post("/compare", compareResponses);

export default router;