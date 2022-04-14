import * as dotenv from "dotenv";

if(process.env.NODE_ENV !== "production") {
    const envFound = dotenv.config();

    if (envFound.error) {
        throw new Error("⚠️  Couldn't find .env file  ⚠️");
    }
}

export default {
    port: parseInt(process.env.PORT, 10),

    databaseURL: process.env.MONGODB_URI,
    secretKey: process.env.SECRET_KEY,
};
