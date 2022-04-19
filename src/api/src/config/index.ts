export default {
    port: parseInt(process.env.PORT, 10),

    databaseURL: process.env.MONGODB_URI,
    secretKey: process.env.SECRET_KEY,
};
