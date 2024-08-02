import AuthServices from "./auth.services.js";
import { validationResult } from "express-validator";
import AuthMessage from "./auth.message.js";

class AuthController {
  #service;

  constructor() {
    this.#service = AuthServices;
  }

  async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const allErrors = errors?.mapped();
        return res.status(400).json({
          statusCode: 400,
          message: AuthMessage.fieldValidation,
          data: allErrors,
        });
      }

      const result = await this.#service.login(
        req.body.username,
        req.body.password
      );
      if (result) {
        res.status(200).json({
          statusCode: 200,
          message: AuthMessage.loginSuccess,
          data: result,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async sendOTP(req, res, next) {
    try {
      // Replace the following with actual logic for sending OTP
      // const result = await this.service.sendOTP(req.body.phoneNumber);
      res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      // Handle specific error types if needed
      console.error("Error in sendOTP:", error);
      next(error);
    }
  }

  async checkOTP(req, res, next) {
    try {
      // Replace the following with actual logic for checking OTP
      // const result = await this.service.checkOTP(req.body.phoneNumber, req.body.code);
      res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
      // Handle specific error types if needed
      console.error("Error in checkOTP:", error);
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const allErrors = errors?.mapped();
        return res.status(400).json({
          statusCode: 400,
          message: AuthMessage.fieldValidation,
          data: allErrors,
        });
      }


      const token = req.headers.authorization;
      const refreshToken = req.body.refreshToken;

      const result = await this.#service.verifyRefreshToken(
        refreshToken, token
      );

      if (result) {
        res.status(200).json({
          statusCode: 200,
          message: '',
          data: result,
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
