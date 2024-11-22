import express from "express";
import { authentication } from "../middleware/authenticate";
import { getSubscriberAnalytics } from "../controller";

const router = express.Router();

router.get('/', authentication, getSubscriberAnalytics);

export {router as AnalyticRoute} 