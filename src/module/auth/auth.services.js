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
                    const refreshToken = await this.#createRefreshToken(payload);
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

    async #createRefreshToken(payload){
        const PrivateKey = process.env.API_REFRESH_PRIVATE_KEY;
        const options = {
            expiresIn: 60 * 60
        }
        if (!PrivateKey) throw new createHttpError.InternalServerError(AuthMessage.privateKeyNotSet);


        const refreshToken = jwt.sign(payload, PrivateKey, options);
        if(refreshToken) return refreshToken;
        throw new createHttpError.InternalServerError(AuthMessage.refreshTokenField);
    }

    async verifyRefreshToken(refreshToken) {
        const PrivateRefreshKey = process.env.API_REFRESH_PRIVATE_KEY;
        if(!PrivateRefreshKey) throw new createHttpError.InternalServerError(AuthMessage.privateKeyNotSet);

        const payload = jwt.verify(refreshToken, PrivateRefreshKey);            
        if(payload && typeof payload === 'object' && 'mobile' in payload){
            const user = await this.#model.findOne({ where: { mobile: payload.mobile }, raw: true });
            if(!user) throw new createHttpError.Unauthorized(AuthMessage.userNotFound);

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
        throw new createHttpError.Unauthorized(AuthMessage.refreshTokenField);
    }
}

export default new AuthServices();
