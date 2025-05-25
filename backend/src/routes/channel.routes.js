import express from "express";
import Channel from "../models/channel.model.js";
import { getMessagesByChannel } from "../controllers/message.controller.js";


const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const channels = await Channel.findAll();
    res.status(200).json(channels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching channels", error: error.message });
  }
});
router.get("/:channel_id/messages", getMessagesByChannel);
export default router;
