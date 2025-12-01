import express from 'express';
import { createJobPostInChannel, getJobPostsForJobChannel } from '../controllers/job.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/job-posts', protectRoute, createJobPostInChannel);

router.get('/job-posts', getJobPostsForJobChannel);

export default router;
