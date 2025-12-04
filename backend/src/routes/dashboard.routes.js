import express from "express";
import {
  getPublicGlobalStats,
  getMessageGlobalStats,
  getMessageStatsPerChannel,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/global", getPublicGlobalStats);

router.get("/messages/global", getMessageGlobalStats);


router.get("/messages/per-channel", getMessageStatsPerChannel);

export default router;