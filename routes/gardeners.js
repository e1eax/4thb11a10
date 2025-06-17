module.exports = (client) => {
  const router = require('express').Router();
  const db = client.db('gardenDB');
  const gardenersCollection = db.collection('gardeners');

  // ➤ Existing: Get 6 active gardeners (for Featured Gardeners)
  router.get('/', async (req, res) => {
    try {
      const activeGardeners = await gardenersCollection
        .find({ status: 'active' })
        .limit(6)
        .toArray();
      res.json(activeGardeners);
    } catch (error) {
      console.error('Failed to fetch gardeners:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ➤ NEW: Get all gardeners (for Explore page)
  router.get('/all', async (req, res) => {
    try {
      const allGardeners = await gardenersCollection.find({}).toArray();
      res.json(allGardeners);
    } catch (error) {
      console.error('Failed to fetch all gardeners:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};
