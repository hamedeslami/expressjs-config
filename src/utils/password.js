import { compareSync, genSaltSync, hashSync } from "bcrypt";

export const hashPassword = (password) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
}


export const verifyPassword = (password, hash) => {
    return compareSync(password, hash);
}