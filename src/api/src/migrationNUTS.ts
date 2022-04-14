import NUTSModel from "./models/NutsModel";
import { connectToMongoDB } from "./dal";

async function importGeoJson(urlPath) {
    let geoJson = require(urlPath);
    try {
        await NUTSModel.deleteMany({});
        await NUTSModel.insertMany(geoJson.features);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

if (!process.argv[2]) {
    console.log("Path not provided");
    process.exit(1);
}

if (process.env.MIGRATE === "true") {
    connectToMongoDB()
        .then(async () => {
            const absolutePathJson = process.argv[2];
            try {
                console.log("Starting migration NUTS.json to MongoDB");
                await importGeoJson(absolutePathJson);
                console.log("Finished migration");
            } catch (err) {
                console.log("Something went wrong during the migration\n", err);
            }
            process.exit(0);
        })
        .catch((err) => {
            console.log(err);
            process.exit(1);
        });
} else {
    process.exit(0);
}
