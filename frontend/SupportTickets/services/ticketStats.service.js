const { Ticket } = require('../models/TicketModel');

/**
 * Get support stats via single aggregation pipeline.
 */
async function getStats() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [facet] = await Ticket.aggregate([
    {
      $facet: {
        open: [{ $match: { status: 'open' } }, { $count: 'count' }],
        in_progress: [{ $match: { status: 'in_progress' } }, { $count: 'count' }],
        resolvedToday: [{ $match: { status: 'resolved', resolvedAt: { $gte: startOfToday } } }, { $count: 'count' }],
        highPriority: [{ $match: { priority: 'high', status: { $in: ['open', 'in_progress'] } } }, { $count: 'count' }],
      },
    },
  ]);

  return {
    open: facet?.open?.[0]?.count || 0,
    inProgress: facet?.in_progress?.[0]?.count || 0,
    resolvedToday: facet?.resolvedToday?.[0]?.count || 0,
    highPriority: facet?.highPriority?.[0]?.count || 0,
  };
}

module.exports = { getStats };
