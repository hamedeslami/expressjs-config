import { Router } from "express";
import AuthController from "./auth.controller.js";
import { LoginValidator, RefreshValidator } from "./auth.validator.js";
import Authorization from "../../common/middleware/authorization.middleware.js";

const router = Router();

router.post('/login', LoginValidator(), (req, res, next) => {
    AuthController.login(req, res, next)
});

router.post('/refresh-token', RefreshValidator(), (req, res, next) => {
    AuthController.refreshToken(req, res, next)
});

router.post('/send-otp', (req, res, next) => {
    AuthController.sendOTP(req, res, next)
});

router.post('/check-otp', (req, res, next) => {
    AuthController.checkOTP(req, res, next)
});

const AuthRouter = router;

export default AuthRouter;
