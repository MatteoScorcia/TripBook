import * as mongoose from "mongoose";

const polygonSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["Polygon", "MultiPolygon"],
            required: true,
        },
        coordinates: {
            type: mongoose.SchemaTypes.Mixed,
            required: true,
        },
    },
    {
        _id: false,
    }
);

const NUTSSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["Feature"],
        required: true,
    },
    geometry: {
        type: polygonSchema,
    },
    properties: {
        NUTS_ID: String,
        LEVL_CODE: Number,
        CNTR_CODE: String,
        NAME_LATN: String,
        NUTS_NAME: String,
        MOUNT_TYPE: Number,
        URBN_TYPE: Number,
        COAST_TYPE: Number,
        FID: String,
    },
    id: String,
});

NUTSSchema.index({ geometry: "2dsphere" });

export default mongoose.model("NUTS", NUTSSchema);
