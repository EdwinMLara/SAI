import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import logger from './utils/logger';

import connectDB from './config/database';
import RequestMiddlware from './middlewares/Request.middleware';
import ResponseMiddlware from './middlewares/Response.middleware';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(RequestMiddlware);
app.use(ResponseMiddlware);

connectDB();

const PORT = process.env.PORT || 5001;
const toListen = process.env.LOCAL_IP || '0.0.0.0';

app.listen(Number(PORT), String(toListen), () => {
  logger.info(`[Express] Connected on  ${toListen}:${PORT}`);
});
