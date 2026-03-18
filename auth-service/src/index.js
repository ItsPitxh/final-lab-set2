require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { pool } = require('./db/db');
const authRoutes = require('./routes/auth');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

async function start() {
  let retries = 10;
  while (retries > 0) {
    try {
      await pool.query('SELECT 1');
      console.log('[auth-service] Database connected');
      break;
    } catch (e) {
      console.log(`[auth-service] Waiting for DB... (${retries} left)`);
      retries--;
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      username      VARCHAR(50)  UNIQUE NOT NULL,
      email         VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role          VARCHAR(20)  NOT NULL DEFAULT 'member',
      created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
      last_login    TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS logs (
      id         SERIAL       PRIMARY KEY,
      level      VARCHAR(10)  NOT NULL CHECK (level IN ('INFO','WARN','ERROR')),
      event      VARCHAR(100) NOT NULL,
      user_id    INTEGER,
      ip_address VARCHAR(45),
      message    TEXT,
      meta       JSONB,
      created_at TIMESTAMP    DEFAULT NOW()
    );
  `);
  console.log('[auth-service] Tables ready');

  app.listen(PORT, () => console.log(`[auth-service] Running on :${PORT}`));
}

start();
