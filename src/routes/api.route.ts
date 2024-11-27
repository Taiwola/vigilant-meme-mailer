import express from "express";
import { authentication } from "../middleware/authenticate";
import { generateApiKey } from "../controller";

const router = express.Router();

router.get('/apiKey', authentication, generateApiKey);


export {router as ApiRouter};