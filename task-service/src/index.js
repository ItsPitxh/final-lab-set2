require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { pool } = require('./db/db');
const taskRoutes = require('./routes/tasks');

const app  = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use('/api/tasks', taskRoutes);

async function start() {
  let retries = 10;
  while (retries > 0) {
    try {
      await pool.query('SELECT 1');
      console.log('[task-service] Database connected');
      break;
    } catch (e) {
      console.log(`[task-service] Waiting for DB... (${retries} left)`);
      retries--;
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER NOT NULL,
      title       VARCHAR(255) NOT NULL,
      description TEXT,
      status      VARCHAR(20) NOT NULL DEFAULT 'TODO'
                  CHECK (status IN ('TODO','IN_PROGRESS','DONE')),
      priority    VARCHAR(10) NOT NULL DEFAULT 'medium'
                  CHECK (priority IN ('low','medium','high')),
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS logs (
      id         SERIAL       PRIMARY KEY,
      level      VARCHAR(10)  NOT NULL CHECK (level IN ('INFO','WARN','ERROR')),
      event      VARCHAR(100) NOT NULL,
      user_id    INTEGER,
      message    TEXT,
      meta       JSONB,
      created_at TIMESTAMP    DEFAULT NOW()
    );
  `);
  console.log('[task-service] Tables ready');

  app.listen(PORT, () => console.log(`[task-service] Running on :${PORT}`));
}

start();
