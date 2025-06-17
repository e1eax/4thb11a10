const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ MongoDB URI built from separate secrets
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v5wedkm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('✅ Connected to MongoDB');

    // Register gardeners route
    const gardenersRoute = require('./routes/gardeners')(client);
    app.use('/gardeners', gardenersRoute);

    // Register tips route (💡 passing the connected client)
    const tipsRoutes = require('./routes/tips')(client);
    app.use('/tips', tipsRoutes);

    // Home test route
    app.get('/', (req, res) => {
      res.send('🌱 Gardeners API is running');
    });

    // Start server
    app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });

  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
  }
}

run();
