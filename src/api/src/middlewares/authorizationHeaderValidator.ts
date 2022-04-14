import {ErrorResponseApi, JwtToSignDto} from "@aindo/dto";
import * as jwt from "jsonwebtoken";
import config from "../config";
import {JwtPayload} from "jsonwebtoken";

export function authorizationHeaderValidator() {
	return async (ctx, next) => {
		console.log("validate auhth")
		if (!ctx.header.authorization) {
			ctx.status = 403;
			ctx.body = { error: "Authorization header not provided" } as ErrorResponseApi<JwtToSignDto>;
			return;
		}

		const [bearer, tokenRequest] = ctx.header.authorization.split(" ");
		if (bearer !== "Bearer") {
			ctx.status = 403;
			ctx.body = { error: "Wrong Authorization header format" } as ErrorResponseApi<JwtToSignDto>;
			return;
		}

		try {
			const decoded = jwt.verify(tokenRequest, config.secretKey);
			ctx.auth = { userId: (decoded as JwtPayload).user.userId };
			console.log("here");
		} catch (err) {
			ctx.status = 403;
			ctx.body = { error: "invalid token" } as ErrorResponseApi<JwtToSignDto>;
			return;
		}

		await next();
	};
}

