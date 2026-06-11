import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

const app = express();
const apiV1Prefix = '/api/v1';

app.use(cors());
app.use(express.json());

app.use(`${apiV1Prefix}/auth`, authRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;
