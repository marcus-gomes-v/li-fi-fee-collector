import { Request, Response } from 'express';
import { fetchAndStoreFeeEvents, retrieveEventsForIntegrator } from './service';

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
  try {
    const events = await retrieveEventsForIntegrator(integrator);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
};
