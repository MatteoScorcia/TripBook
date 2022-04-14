import * as Router from "koa-router";
import { TripModel } from "../models/TripModel";
import { InsightsDto, ResponseApi } from "@aindo/dto";

const router = new Router();

// function parseDate(string: string): Date {
//     if (typeof string !== 'string' || isNaN(new Date(string).getTime())) {
//         throw new ERROR_400_BAD_REQUEST({ detail: `Invalid date field ${string}` });
//     }
//     return new Date(string);
// }

router.use(async (ctx, next) => {
    if (
        typeof ctx.query.fromDate !== "string" ||
        isNaN(new Date(ctx.query.fromDate).getTime()) ||
        typeof ctx.query.toDate !== "string" ||
        isNaN(new Date(ctx.query.toDate).getTime())
    ) {
        ctx.status = 400;
        ctx.body = { error: "Invalid date field" } as ResponseApi<InsightsDto>;
        return;
    }
    await next();
});

router.get("/tripsCountByDate", async (ctx) => {
    if (typeof ctx.query.gmtOffset !== "string" || !/^[+-]\d\d(:\d\d|\d\d)?$/.test(ctx.query.gmtOffset)) {
        ctx.status = 400;
        ctx.body = { error: "Invalid gmtOffset field" };
        return;
    }

    const tripCounts = await TripModel.aggregate([
        {
            $match: {
                date: {
                    $gte: new Date(ctx.query.fromDate as string),
                    $lt: new Date(ctx.query.toDate as string),
                },
                user_id: ctx.auth.userId,
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$date", timezone: ctx.query.gmtOffset },
                },
                count: { $sum: 1 },
            },
        },
        { $project: { _id: false, date: "$_id", count: true } },
    ]);

    ctx.body = { data: tripCounts } as ResponseApi<InsightsDto>;
});

router.get("/stagesByDate", async (ctx) => {
    const level = parseInt((ctx.query.level as string) || "3");
    if (isNaN(level) || level < 0 || level > 3) {
        ctx.status = 400;
        ctx.body = { error: "Invalid level field" };
        return;
    }

    const fromDate = new Date(ctx.query.fromDate as string);
    const toDate = new Date(ctx.query.toDate as string);

    const numberOfStages = await TripModel.aggregate([
        { $match: { date: { $gte: fromDate, $lt: toDate }, user_id: ctx.auth.userId } },
        { $unwind: { path: "$paths" } },
        { $project: { country: { $arrayElemAt: ["$paths.nearestPlace", level] } } },
        { $sortByCount: "$country" },
        { $project: { _id: false, country: "$_id", count: true } },
    ]);

    ctx.body = { data: numberOfStages } as ResponseApi<InsightsDto>;
});

export const InsightRouter = router;
