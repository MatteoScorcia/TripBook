import * as Router from "koa-router";
import { JwtDto, ResponseApi, UserDto } from "@aindo/dto";
import { UserModel } from "../models/UserModel";

import * as jwt from "jsonwebtoken";
import config from "../config";

function wait(ms: number): Promise<void> {
    return new Promise((res) => {
        setTimeout(res, ms);
    });
}

const router = new Router();

const expireTime = 60 * 60; //in seconds

router.use(async (ctx, next) => {
    const user = ctx.request.body;

    if (user.name && user.name.length < 4) {
        ctx.status = 400;
        ctx.body = { error: "Invalid name field, at least 4 characters required" } as ResponseApi<UserDto>;
        return;
    }

    if (user.email && !user.email.toLowerCase().match(/^\S+@\S+\.\S+$/)) {
        ctx.status = 400;
        ctx.body = { error: "Invalid email field" } as ResponseApi<UserDto>;
        return;
    }

    if (user.password && user.password.length < 4) {
        ctx.status = 400;
        ctx.body = {
            error: "Invalid password field, at least 4 characters required",
        } as ResponseApi<UserDto>;
        return;
    }

    await next();
});

router.post("/signup", async (ctx) => {
    const userToSave = ctx.request.body.user as UserDto;

    if ((await UserModel.findOne({ name: userToSave.name })) !== null) {
        ctx.status = 409;
        ctx.body = { error: "Username already taken" };
        return;
    }

    if ((await UserModel.findOne({ email: userToSave.email })) !== null) {
        ctx.status = 409;
        ctx.body = { error: "Email already taken" };
        return;
    }

    const userSaved: UserDto = await UserModel.create(userToSave);

    ctx.auth = {
        userId: userSaved._id,
    };

    ctx.body = {
        data: {
            token: jwt.sign({ user: { userId: userSaved._id } }, config.secretKey, { expiresIn: expireTime }),
            expiresIn: expireTime - 1,
        },
    } as ResponseApi<JwtDto>;
});

router.post("/login", async (ctx) => {
    const userRequest = ctx.request.body.user as Omit<UserDto, "email">;
    const userFind = await UserModel.findOne({ name: userRequest.name });

    if (userFind === null) {
        ctx.status = 401;
        ctx.body = { error: "Wrong name or password" } as ResponseApi<UserDto>;
        await wait(Math.floor(Math.random() * 3 + 1)); //random delayed response to avoid timing attacks
    } else if (!(await userFind.validatePassword(userRequest.password))) {
        ctx.status = 401;
        ctx.body = { error: "Wrong name or password" } as ResponseApi<UserDto>;
        await wait(Math.floor(Math.random() * 3 + 1)); //random delayed response to avoid timing attacks
    } else {
        ctx.auth = {
            userId: userFind._id,
        };

        ctx.body = {
            data: {
                token: jwt.sign({ user: { userId: userFind._id } }, config.secretKey, {
                    expiresIn: expireTime,
                }),
                expiresIn: expireTime - 1,
            },
        } as ResponseApi<JwtDto>;
    }
});

export const AuthRouter = router;
