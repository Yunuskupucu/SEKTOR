import express from "express";
import { getPublicGlobalStats } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/global", getPublicGlobalStats); 

export default router;