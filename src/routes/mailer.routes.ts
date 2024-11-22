import express from "express";
import { authentication } from "../middleware/authenticate";
import { sendMail } from "../controller";

const router = express.Router();

router.post('/:Id', authentication, sendMail);



export {router as MailerRoute}