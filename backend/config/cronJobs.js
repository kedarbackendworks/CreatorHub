const Ban = require('../models/Ban');

const ONE_HOUR_MS = 3600000;

const runBanExpiryCheck = async () => {
  try {
    const result = await Ban.expireOldBans();
    const expiredCount = result?.modifiedCount ?? result?.nModified ?? 0;
    console.log(`Ban expiry check complete. ${expiredCount} bans expired.`);
  } catch (error) {
    console.error('Ban expiry check failed:', error.message);
  }
};

const initCronJobs = () => {
  runBanExpiryCheck();
  setInterval(runBanExpiryCheck, ONE_HOUR_MS);
};

module.exports = { initCronJobs };
