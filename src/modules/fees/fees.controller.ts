import { Request, Response } from 'express';
import { fetchAndStoreFeeEvents, retrieveEventsForIntegrator } from './fees.service';

export const fetchEvents = async (req: Request, res: Response) => {
  const { fromBlock, toBlock } = req.body;
  try {
    await fetchAndStoreFeeEvents(fromBlock, toBlock);
    res.status(200).send('Events fetched and stored successfully');
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
};

export const getEvents = async (req: Request, res: Response) => {
  const { integrator } = req.params;
  const { page = 1, limit = 10 } = req.query;
  try {
    const events = await retrieveEventsForIntegrator(integrator, parseInt(page as string, 10), parseInt(limit as string, 10));
    res.status(200).json(events);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
};
