require('dotenv').config();
const app = require('./app');
const db = require('./db');

const PORT = process.env.PORT || 5000;

async function startServer() {
  console.log('====================================================');
  console.log('  Dhaniti Education Lending Dashboard - Backend API  ');
  console.log('====================================================');

  // Verify PostgreSQL connection status
  if (process.env.DATABASE_URL) {
    const isDbConnected = await db.checkConnection();
    if (isDbConnected) {
      console.log('✅ PostgreSQL connected successfully via DATABASE_URL');
    } else {
      console.warn('⚠️  PostgreSQL connection failed. Using verified in-memory dataset.');
      console.warn('   To seed PostgreSQL, run: npm run db:seed');
    }
  } else {
    console.log('ℹ️  No DATABASE_URL configured. Running with in-memory cleaned CSV data.');
  }

  // Pre-load in-memory store
  db.getInMemoryStore();
  console.log('✅ Master data and 150 application records loaded and cleaned.');

  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
    console.log(`📡 API Endpoints available at http://localhost:${PORT}/api/`);
    console.log('====================================================\n');
  });
}

startServer();
