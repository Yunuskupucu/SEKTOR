import express from "express";
import {
  getPublicGlobalStats,
  getMessageGlobalStats,
  getMessageStatsPerChannel,
  getWeeklyTrends,
  getWeeklyActivityStats
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/global", getPublicGlobalStats);

router.get("/messages/global", getMessageGlobalStats);

router.get("/messages/weekly-trends", getWeeklyTrends);
router.get("/messages/weekly-activity", getWeeklyActivityStats);
router.get("/messages/per-channel", getMessageStatsPerChannel);

export default router;