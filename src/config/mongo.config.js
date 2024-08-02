import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DB_URL;

if (!dbUrl) {
    throw new Error("DB_URL is not defined in the environment variables.");
}

mongoose.connect(dbUrl).then(() => {
    console.log('mongoDB connect successfully.');
}).catch((err) => {
    console.log(err?.message ?? "failed mongoDB Connection!");
});
