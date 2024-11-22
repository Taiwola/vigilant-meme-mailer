import express from "express";
import { authentication } from "../middleware/authenticate";
import { sendMail } from "../controller";

const router = express.Router();

router.post('/', authentication, sendMail);



export {router as MailerRoute}