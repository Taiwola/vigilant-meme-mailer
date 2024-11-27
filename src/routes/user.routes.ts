import express from "express";
import { authentication } from "../middleware/authenticate";
import { findAllUsers, findOneUser, generateApiKey, remove, update } from "../controller";
const router = express.Router();

router.get('/', authentication, findAllUsers);
router.get('/:Id', authentication,findOneUser);


router.patch('/:id', authentication, update);

router.delete('/:Id', authentication, remove);

export {router as UserRoute}