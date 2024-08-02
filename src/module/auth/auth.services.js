import createHttpError from "http-errors";
import { verifyPassword } from "../../utils/password.js";
import { UserModel } from "../user/user.model.js";
import AuthMessage from "./auth.message.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import redis from "../../config/redis.config.js";

dotenv.config();

class AuthServices {
    #model;

    constructor() {
        this.#model = UserModel;
    }

    async login(username, password) {
        const user = await this.#findUserByMobile(username);
        if (user) {
            const result = verifyPassword(password, user.password);
            if (result) {
                const payload = {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    mobile: user.mobile
                }
                const token = this.#createToken(payload);
                if (token) {
                    const refreshToken = await this.#createRefreshToken(payload, user.uuid);
                    return {
                        ...payload,
                        accessToken: token,
                        refreshToken: refreshToken,
                        type: "Bearer",
                        expiresIn: 600,
                    };
                }

                throw new createHttpError.Unauthorized(AuthMessage.tokenField);
            }
        }
        throw new createHttpError.Unauthorized(AuthMessage.loginField);
    }

    async sendOTP(phoneNumber) {
        try {
            // Example logic for sending OTP
            // Ensure phoneNumber is valid and handle OTP generation
            // const user = await this.model.findOne({ phoneNumber });
            // if (user) {
            //     // Generate and send OTP
            // }
        } catch (error) {
            console.error('Error sending OTP:', error);
            throw new Error('Failed to send OTP');
        }
    }

    async checkOTP(phoneNumber, code) {
        try {
            // Example logic for checking OTP
            // Ensure phoneNumber and code are valid
            // const user = await this.model.findOne({ phoneNumber });
            // if (user && user.otp === code) {
            //     // OTP is correct, proceed with further actions
            // } else {
            //     throw new Error('Invalid OTP');
            // }
        } catch (error) {
            console.error('Error checking OTP:', error);
            throw new Error('Failed to check OTP');
        }
    }

    async #findUserByMobile(username) {
        const user = await this.#model.findOne({ where: { mobile: username }, raw: true });
        return user;
    }

    #createToken(payload) {
        const PrivateKey = process.env.API_PRIVATE_KEY;
        const options = {
            expiresIn: 60 * 10
        }
        if (!PrivateKey) throw new createHttpError.InternalServerError(AuthMessage.privateKeyNotSet);

        const token = jwt.sign(payload, PrivateKey, options);
        if(token) return token;
        throw new createHttpError.InternalServerError(AuthMessage.tokenField);
    }

    async #createRefreshToken(payload, userId){
        const PrivateKey = process.env.API_REFRESH_PRIVATE_KEY;
        const options = {
            expiresIn: 60 * 60
        }
        if (!PrivateKey) throw new createHttpError.InternalServerError(AuthMessage.privateKeyNotSet);


        const refreshToken = jwt.sign(payload, PrivateKey, options);
        if(refreshToken) {
            await redis.setEx(userId, 60 * 60, refreshToken);
            return refreshToken;
        }
        throw new createHttpError.InternalServerError(AuthMessage.refreshTokenField);
    }

    async verifyRefreshToken(refreshToken, token) {
        try {
            const PrivateRefreshKey = process.env.API_REFRESH_PRIVATE_KEY;
            if(!PrivateRefreshKey) throw new createHttpError.InternalServerError(AuthMessage.privateKeyNotSet);

            const PrivateTokenKey = process.env.API_PRIVATE_KEY;
            if(!PrivateTokenKey) throw new createHttpError.InternalServerError(AuthMessage.privateKeyNotSet);

            const parts = token.split(' ');

            if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) {
                return next(createHttpError.Unauthorized('Token not valid! 1'));
            }

            const credentials = parts[1];

            const tokenDecode = jwt.decode(credentials, PrivateTokenKey);
            if(!tokenDecode) throw new createHttpError.InternalServerError("token decode not valid");

            const payload = jwt.verify(refreshToken, PrivateRefreshKey);            
            if(payload && typeof payload === 'object' && 'mobile' in payload){
                if(tokenDecode.mobile !== payload.mobile) throw new createHttpError.InternalServerError("token and refresh token not for same user");

                const user = await this.#model.findOne({ where: { mobile: payload.mobile }, raw: true });
                if(!user) throw new createHttpError.Unauthorized(AuthMessage.userNotFound);

                const userRefreshToken = await redis.get(user.uuid);
                if(refreshToken === userRefreshToken) {
                    const data = {
                        firstname: user.firstname,
                        lastname: user.lastname,
                        mobile: user.mobile
                    };

                    const newToken = this.#createToken(data);
                    if(newToken) {
                        return {
                            accessToken: newToken,
                            type: "Bearer",
                            expiresIn: 600,
                        };
                    }
                }
            }
            throw new createHttpError.Unauthorized(AuthMessage.tokenField);
        } catch (error) {
            throw new createHttpError.Unauthorized(error.message);
        }
        
    }
}

export default new AuthServices();
