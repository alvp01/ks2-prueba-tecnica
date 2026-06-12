import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import houseRoutes from './routes/houseRoutes.js';

const app = express();
const apiV1Prefix = '/api/v1';
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true
  })
);
app.use(express.json());

app.use(`${apiV1Prefix}/auth`, authRoutes);
app.use(`${apiV1Prefix}/users`, userRoutes);
app.use(`${apiV1Prefix}/houses`, houseRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;
