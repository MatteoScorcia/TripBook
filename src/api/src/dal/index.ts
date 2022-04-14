import * as mongoose from "mongoose";
import config from "../config";

export async function connectToMongoDB() {
    await mongoose.connect(config.databaseURL);
}
