import { Router } from "express";
import { fetchEvents, getEvents } from "./fees.controller";

const router = Router();

router.post("/fetch-events", fetchEvents);
router.get("/events/:integrator", getEvents);

export default router;