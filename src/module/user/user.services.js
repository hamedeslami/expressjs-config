import { hashPassword } from "../../utils/password.js";
import { UserModel } from "./user.model.js";
import createHttpError from "http-errors";
import UserMessage from "./user.message.js";

class UserServices {
    #model;

    constructor() {
        this.#model = UserModel;
    }

    async create(user) {
        const isUser = await this.#model.findOne({ where: { mobile: user.mobile }, raw: true });
        if (!isUser) {
            const password = hashPassword(user.password);
            const result = await this.#model.create({
                firstname: user.firstname,
                lastname: user.lastname,
                mobile: user.mobile,
                password: password
            });
            return result;
        }
        throw new createHttpError.BadRequest(UserMessage.userExist);
    }
}

export default new UserServices();