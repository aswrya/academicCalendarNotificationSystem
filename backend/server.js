// Add these two lines at the very top:
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') }); // robust: loads backend/.env even if cwd differs

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/tasks', require('./routes/taskRoutes'));

app.get('/api/health', (req, res) => res.json({ ok: true }));

if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      const PORT = process.env.PORT || 5001;
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
      console.error('Fatal startup error:', err.message);
      process.exit(1);
    }
  })();
}

module.exports = app;
