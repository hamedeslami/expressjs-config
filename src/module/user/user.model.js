import { DataTypes } from 'sequelize';
import { sequelize } from "../../config/postgres.config.js";

import {  } from 'sequelize';

export const UserModel = sequelize.define('user', {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
    },
    firstname: DataTypes.STRING(90),
    lastname: DataTypes.STRING(150),
    mobile: {
        type: DataTypes.STRING(15),
        unique: true
    },
    password: DataTypes.STRING()
});