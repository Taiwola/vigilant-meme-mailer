import express from "express";
import { authentication } from "../middleware/authenticate";
import { createSubscriber, deleteSubscriber, getAllSubcriber, getSubscriberById } from "../controller";

const router = express.Router();


router.get("/", authentication, getAllSubcriber);
router.get('/:Id', authentication, getSubscriberById);

router.post('/', createSubscriber);

router.delete("/:Id", authentication, deleteSubscriber)


export {router as SubcriberRoute}