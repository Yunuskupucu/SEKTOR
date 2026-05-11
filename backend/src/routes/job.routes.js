import express from 'express';
import {
  createJobPostInChannel,
  getJobPostsForJobChannel,
  updateJobPost,
  deleteJobPost,
  passiveJobPost,
} from '../controllers/job.controller.js';

import { protectRoute, optionalAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/job-posts', protectRoute, createJobPostInChannel);

router.get('/job-posts', optionalAuth, getJobPostsForJobChannel);

// ilan düzenleme
router.put('/job-posts/:id', protectRoute, updateJobPost);

// ilan pasif yapma
router.patch('/job-posts/:id/passive', protectRoute, passiveJobPost);

// ilan silme
router.delete('/job-posts/:id', protectRoute, deleteJobPost);

export default router;