import { Router } from "express";
import UserController from "./user.controller.js";
import { CreateUserValidator } from "./user.validator.js";

const router = Router();

router.post('/create', CreateUserValidator(), (req, res, next) => {
    UserController.create(req, res, next)
});


const UserRouter = router;

export default UserRouter;
