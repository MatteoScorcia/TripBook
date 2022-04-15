import * as Koa from "koa";
import * as logger from "koa-logger";
import * as json from "koa-json";
import * as bodyParser from "koa-bodyparser";

import {TripRouter} from "./routes/trip.route";
import {AuthRouter} from "./routes/auth.route";
import {InsightRouter} from "./routes/insight.route";
import {connectToMongoDB} from "./dal";
import * as Router from "koa-router";

import config from "./config";
import * as send from "koa-send";
import {authorizationHeaderValidator} from "./middlewares/authorizationHeaderValidator";
import {internalErrorCatcher} from "./middlewares/internalErrorCatcher";

declare module "koa" {
    interface BaseContext {
        auth: {
            userId: string;
        };
    }
}

(async () => {
    try {
        await connectToMongoDB();
    } catch (err) {
        console.log("something went wrong, cannot connect to MongoDB\n\n", err);
        process.exit(-1);
    }

    const app = new Koa();

    // Middlewares
    app.use(internalErrorCatcher());
    app.use(json());
    app.use(logger());
    app.use(bodyParser());

    const router = new Router();

    // Routes
    router.use("/auth", AuthRouter.allowedMethods());
    router.use("/auth", AuthRouter.routes());
    router.use(authorizationHeaderValidator());

    router.use("/trip", TripRouter.allowedMethods());
    router.use("/trip", TripRouter.routes());
    router.use("/insight", InsightRouter.allowedMethods());
    router.use("/insight", InsightRouter.routes());

    const superRouter = new Router();

    superRouter.use("/api", router.allowedMethods());
    superRouter.use("/api", router.routes());

    //method to serve the React app inside the koa routes :)
    superRouter.get(/^(?!\/api).*$/, async (ctx, next) => {
        try {
            await send(ctx, ctx.path, { root: "./static/", index: "index.html" });
        } catch (err) {
            if (err.status === 404) {
                await send(ctx, "index.html", { root: "./static/" });
            } else {
                throw err;
            }
        }
    });

    app.use(superRouter.allowedMethods());
    app.use(superRouter.routes());

    app.listen(config.port, () => console.log("Koa started"));

    const p = new Promise((res, rej) => app.once("error", rej));
    await p;
})()
    .then(() => {
        process.exit(0);
    })
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });
