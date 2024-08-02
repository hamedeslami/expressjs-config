import { body } from "express-validator"

export const CreateUserValidator = () => [
    body('firstname').notEmpty().isString().isLength({max: 100}),
    body('lastname').notEmpty().isString().isLength({max: 150}),
    body('mobile').notEmpty().isString().isLength({min: 11, max: 11}),
    body('password').notEmpty().isString().isLength({min: 8, max: 16}),
];
