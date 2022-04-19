import { ErrorResponseApi } from "@aindo/dto";

export function internalErrorCatcher() {
    return async (ctx, next) => {
        try {
            await next();
        } catch (e) {
            ctx.status = 500;
            ctx.body = { error: "Internal server error" } as ErrorResponseApi<string>;
        }
    };
}
