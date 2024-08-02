import { body } from "express-validator"

export const LoginValidator = () => [
    body('username').notEmpty().isString().isLength({min: 11, max: 11}),
    body('password').notEmpty().isString().isLength({min: 8, max: 16}),
];


export const RefreshValidator = () => [
    body('refreshToken').notEmpty().isString(),
];