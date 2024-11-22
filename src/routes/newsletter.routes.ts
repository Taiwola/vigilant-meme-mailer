import express from "express";
import { authentication } from "../middleware/authenticate";
import { deleteNewsletter, findAllNewsletter, findOneNewsletter, saveNewletter, updateNewsletter } from "../controller";

const router = express.Router();

router.get('/', authentication, findAllNewsletter );
router.get('/:Id', authentication, findOneNewsletter);

router.post('/', authentication, saveNewletter);
router.patch('/:Id', authentication, updateNewsletter);

router.delete('/:Id', authentication, deleteNewsletter)


export {router as NewsletterRouter}