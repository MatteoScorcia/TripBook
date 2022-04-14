import * as mongoose from "mongoose";
import { TripPathPointDto } from "@aindo/dto";
import { computeDistances, computeNearestPlaces } from "../utils";

const TripSchema = new mongoose.Schema({
    user_id: {
        type: String, //mongoose.Schema.Types.ObjectId,
        required: [true, "User ID not provided :("],
    },
    date: {
        type: Date,
        required: [true, "Date not provided :("],
    },
    vehicle: {
        type: String,
        enum: ["car", "bike", "walk", "train", "plane"],
        required: [true, "vehicle not provided :("],
    },
    paths: [
        {
            lat: Number,
            lng: Number,
            nearestPlace: [
                {
                    type: String,
                    required: false,
                    default: undefined,
                    _id: { _id: false },
                },
            ],
            _id: { _id: false },
        },
    ],
    distance: {
        type: Number,
        required: false,
        min: [0, "distance < 0 :("],
    },
});

TripSchema.pre("save", async function (next) {
    console.log(this);
    const paths = this.paths as TripPathPointDto[];
    this.distance = computeDistances(paths);
    await computeNearestPlaces(paths);
    next();
});

TripSchema.pre("updateOne", async function (next) {
    if (this._update.paths) {
        const paths = this._update.paths;
        this._update.distance = computeDistances(paths);
        await computeNearestPlaces(paths);
    }
    next();
});

export const TripModel = mongoose.model("Trip", TripSchema);
