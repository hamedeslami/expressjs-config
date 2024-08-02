import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { UserModel } from '../../module/user/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

export default async function Authorization(req, res, next) {
    try {
        const token = req.headers.authorization;
        if (!token) return next(createHttpError.Unauthorized('You should login!'));

        const PrivateKey = process.env.API_PRIVATE_KEY;
        if (!PrivateKey) return next(createHttpError.InternalServerError('Private key not set'));

        const parts = token.split(' ');

        if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) {
            return next(createHttpError.Unauthorized('Token not valid! 1'));
        }

        const credentials = parts[1];
        const verifyToken = jwt.verify(credentials, PrivateKey);

        if (verifyToken && typeof verifyToken === 'object' && 'mobile' in verifyToken) {
            const user = await UserModel.findOne({ where: { mobile: verifyToken.mobile }, raw: true });
            if (!user) return next(createHttpError.Unauthorized('Token not valid! 3'));
            req.user = user;
            return next();
        }
        return next(createHttpError.Unauthorized('Token not valid! 4'));
    } catch (error) {
        return next(createHttpError.Unauthorized(error.message));
    }
}
