import cron from "node-cron";
import JobPost from "./src/models/job_post.model.js";
import { Op } from "sequelize";

// Her gün gece 01:00'de çalışır
export function startJobPostExpirationCron() {
  cron.schedule("0 1 * * *", async () => {
    const now = new Date();
    try {
      const expiredJobs = await JobPost.update(
        { status: "expired" },
        {
          where: {
            status: "active",
            expires_at: { [Op.lt]: now },
          },
        }
      );
      if (expiredJobs[0] > 0) {
        console.log(`${expiredJobs[0]} job posts expired automatically.`);
      }
    } catch (err) {
      console.error("Job post expiration cron error:", err);
    }
  });
}
