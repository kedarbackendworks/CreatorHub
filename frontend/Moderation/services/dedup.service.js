const Report = require('../models/ReportModel');
const { syncFromReport } = require('../../SupportTickets/services/ticket.service');

/**
 * File a report with deduplication against pending reports.
 * @param {{reportedBy:string,targetId:string,targetType:'post'|'user'|'dm',reason:string,comment?:string,targetOwnerId?:string}} reportData
 * @returns {Promise<{report:any,isDuplicate:boolean}>}
 */
async function fileReport(reportData) {
  const existing = await Report.findOne({
    targetId: reportData.targetId,
    targetType: reportData.targetType,
    status: 'pending',
  });

  if (existing) {
    await Report.updateOne(
      { _id: existing._id },
      { $addToSet: { additionalReporters: reportData.reportedBy } }
    );

    const updated = await Report.findById(existing._id);
    await syncFromReport(existing._id);
    return { report: updated, isDuplicate: true };
  }

  const created = await Report.create(reportData);
  await syncFromReport(created._id);
  return { report: created, isDuplicate: false };
}

module.exports = {
  fileReport,
};
