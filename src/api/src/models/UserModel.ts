import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt";

const SALT_COST_FACTOR = 10; //this is the cost factor of the bcrypt

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "username required!"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "password required!"],
    },
    email: {
        type: String,
        required: [true, "email required!"],
        unique: true,
    },
});

UserSchema.pre("save", async function (next) {
    const user = this;

    try {
        const salt = await bcrypt.genSalt(SALT_COST_FACTOR);
        user.password = await bcrypt.hash(user.password, salt);
        return next();
    } catch (err) {
        return next(err);
    }
});

UserSchema.methods.validatePassword = async function validatePassword(plainPassword: string) {
    return bcrypt.compare(plainPassword, this.password);
};

export const UserModel = mongoose.model("User", UserSchema);
