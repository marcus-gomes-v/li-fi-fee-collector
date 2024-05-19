import express from 'express';
import feesRouter from './fees';

const router = express.Router();

router.use('/fees', feesRouter);

export default router;
