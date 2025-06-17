const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = (client) => {
  const router = express.Router();
  const db = client.db('gardenDB');
  const tipsCollection = db.collection('tips');

  // GET /tips/public - Return all public tips
  router.get('/public', async (req, res) => {
    try {
      const tips = await tipsCollection.find({ availability: "Public" }).toArray();
      res.json(tips);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch public tips' });
    }
  });

  // GET /tips/:id - Return single tip by ID
  router.get('/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const tip = await tipsCollection.findOne({ _id: new ObjectId(id) });

      if (!tip) {
        return res.status(404).json({ error: 'Tip not found' });
      }

      res.json(tip);
    } catch (err) {
      console.error('Failed to fetch tip by ID:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // GET /tips - Return 6 tips (for homepage etc.)
  router.get('/', async (req, res) => {
    try {
      const tips = await tipsCollection.find().limit(6).toArray();
      res.json(tips);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch tips' });
    }
  });

  return router;
};
