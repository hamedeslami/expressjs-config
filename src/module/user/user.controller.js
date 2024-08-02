import { validationResult } from "express-validator";
import UserServices from "./user.services.js";
import UserMessage from "./user.message.js";

class UserController {
    #service;

    constructor() {
        this.#service = UserServices;
    }

    async create(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const allErrors = errors?.mapped();
                return res.status(400).json({
                    statusCode: 400,
                    message: UserMessage.fieldValidation,
                    data: allErrors
                });
            }

            const result = await this.#service.create(req.body);
            if (result) {
                res.status(200).json({
                    statusCode: 200,
                    message: UserMessage.createUserSuccess,
                    data: result
                });
            }
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController();