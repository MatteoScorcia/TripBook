import * as Router from "koa-router";
import {ErrorResponseApi, InsightsDto, ResponseApi, SuccessResponseApi, TripDto} from "@aindo/dto";
import { TripModel } from "../models/TripModel";
import * as mongoose from "mongoose";

const router = new Router();

const vehicles = {
    car: "car",
    plane: "plane",
    bike: "bike",
    train: "train",
    walk: "walk",
};

router.post("/", async (ctx) => {
    const tripToSave = <TripDto>ctx.request.body.trip;

    if (isNaN(new Date(tripToSave.date).getTime())) {
        ctx.status = 400;
        ctx.body = { error: "Cannot save, Invalid date field" } as ErrorResponseApi<InsightsDto>;
        return;
    }

    if (!vehicles[tripToSave.vehicle]) {
        ctx.status = 400;
        ctx.body = { error: "Cannot save, Invalid vehicle field" } as ErrorResponseApi<InsightsDto>;
        return;
    }

    const savedTrip = await TripModel.create({
        ...tripToSave,
        user_id: ctx.auth.userId,
    });

    ctx.body = { data: savedTrip } as SuccessResponseApi<InsightsDto>;
});

router.get("/:id", async (ctx) => {
    if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
        ctx.status = 400;
        ctx.body = { error: "Cannot get, invalid trip id" } as ErrorResponseApi<InsightsDto>;
        return;
    }

    const retrievedTrip = await TripModel.findOne({
        _id: ctx.params.id,
        user_id: ctx.auth.userId,
    });

    ctx.body = { data: retrievedTrip } as SuccessResponseApi<InsightsDto>;
});

router.get("/", async (ctx) => {
    const retrievedTrips = await TripModel.find({
        date: ctx.query.date ? ctx.query.date : undefined,
        user_id: ctx.auth.userId,
    });

    ctx.body = { data: retrievedTrips } as SuccessResponseApi<InsightsDto>;
});

router.put("/", async (ctx) => {
    const trip = ctx.request.body.trip;

    if (isNaN(new Date(trip.date).getTime())) {
        ctx.status = 400;
        ctx.body = { error: "Cannot update, Invalid date field" } as ErrorResponseApi<InsightsDto>;
        return;
    }

    if (!vehicles[trip.vehicle]) {
        ctx.status = 400;
        ctx.body = { error: "Cannot update, Invalid vehicle field" } as ErrorResponseApi<InsightsDto>;
        return;
    }

    if (!mongoose.Types.ObjectId.isValid(trip._id)) {
        ctx.status = 400;
        ctx.body = { error: "Cannot update, invalid trip id" } as ErrorResponseApi<InsightsDto>;
        return;
    }

    const responseUpdate = await TripModel.updateOne({ _id: trip._id }, trip);
    const promiseUpdatedTrip = TripModel.findOne({ _id: trip._id });
    if (responseUpdate.matchedCount === 0) {
        ctx.status = 204;
        ctx.body = { error: "Cannot update, trip not found" } as ErrorResponseApi<InsightsDto>;
        return;
    }

    ctx.body = { data: await promiseUpdatedTrip } as SuccessResponseApi<InsightsDto>;
});

router.delete("/:id", async (ctx) => {
    if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
        ctx.status = 400;
        ctx.body = { error: "Cannot delete, invalid trip id" } as ErrorResponseApi<InsightsDto>;
        return;
    }

    await TripModel.deleteOne({
        _id: ctx.params.id,
        user_id: ctx.auth.userId,
    });

    ctx.body = { data: { status: "success" } } as SuccessResponseApi<InsightsDto>;
});

export const TripRouter = router;
