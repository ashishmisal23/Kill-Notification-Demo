require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 4000;

async function start() {
  // connect to database (optional)
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Notification backend running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
