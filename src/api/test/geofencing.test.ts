import { computeNearestPlaces } from "../src/utils";
import { connectToMongoDB } from "../src/dal";
import { TripPathPointDto } from "@aindo/dto";
import * as mongoose from "mongoose";

const fatPath = [
    {
        lat: 47.42808726171425,
        lng: 10.239257812500002,
    },
    {
        lat: 47.42808726171425,
        lng: 10.239257812500002,
    },
    {
        lat: 44.62175409623327,
        lng: 10.151367187500002,
    },
    {
        lat: 44.62175409623327,
        lng: 10.151367187500002,
    },
    {
        lat: 47.15984001304432,
        lng: 15.556640625000002,
    },
    {
        lat: 47.15984001304432,
        lng: 15.556640625000002,
    },
    {
        lat: 49.55372551347579,
        lng: 13.271484375000002,
    },
    {
        lat: 49.92293545449574,
        lng: 9.360351562500002,
    },
    {
        lat: 47.48751300895658,
        lng: 5.449218750000001,
    },
    {
        lat: 46.195042108660154,
        lng: 7.250976562500001,
    },
    {
        lat: 47.90161354142077,
        lng: 13.491210937500002,
    },
    {
        lat: 48.951366470947725,
        lng: 12.392578125,
    },
    {
        lat: 50.17689812200107,
        lng: 10.898437500000002,
    },
    {
        lat: 50.958426723359935,
        lng: 11.645507812500002,
    },
    {
        lat: 48.90805939965008,
        lng: 24.0380859375,
    },
    {
        lat: 49.296471602658094,
        lng: 16.875000000000004,
    },
    {
        lat: 46.73986059969267,
        lng: 19.423828125000004,
    },
    {
        lat: 45.67548217560647,
        lng: 16.523437500000004,
    },
    {
        lat: 44.99588261816546,
        lng: 11.337890625,
    },
    {
        lat: 43.58039085560786,
        lng: 12.348632812500002,
    },
    {
        lat: 43.48481212891603,
        lng: 12.348632812500002,
    },
    {
        lat: 45.85941212790755,
        lng: 4.965820312500001,
    },
    {
        lat: 51.26191485308451,
        lng: 7.119140625,
    },
    {
        lat: 52.429222277955134,
        lng: 7.207031250000001,
    },
    {
        lat: 53.409531853086435,
        lng: 10.458984375000002,
    },
    {
        lat: 53.409531853086435,
        lng: 16.787109375000004,
    },
    {
        lat: 52.64306343665892,
        lng: 20.874023437500004,
    },
    {
        lat: 52.53627304145948,
        lng: 18.588867187500004,
    },
    {
        lat: 49.52520834197442,
        lng: 22.126464843750004,
    },
    {
        lat: 47.54687159892238,
        lng: 22.82958984375,
    },
    {
        lat: 51.09662294502995,
        lng: 17.863769531250004,
    },
    {
        lat: 51.83577752045248,
        lng: 15.358886718750002,
    },
    {
        lat: 48.951366470947725,
        lng: 14.08447265625,
    },
    {
        lat: 47.87214396888731,
        lng: 16.193847656250004,
    },
    {
        lat: 46.255846818480315,
        lng: 21.59912109375,
    },
    {
        lat: 45.30580259943578,
        lng: 19.62158203125,
    },
    {
        lat: 43.992814500489914,
        lng: 19.00634765625,
    },
    {
        lat: 43.929549935614595,
        lng: 15.798339843750002,
    },
    {
        lat: 42.58544425738491,
        lng: 13.513183593750002,
    },
    {
        lat: 42.22851735620852,
        lng: 15.490722656250002,
    },
    {
        lat: 44.84029065139799,
        lng: 17.160644531250004,
    },
    {
        lat: 48.22467264956519,
        lng: 15.007324218750002,
    },
    {
        lat: 49.653404588437894,
        lng: 9.580078125,
    },
    {
        lat: 52.36218321674427,
        lng: 8.591308593750002,
    },
    {
        lat: 53.57946149373232,
        lng: 13.732910156250002,
    },
    {
        lat: 54.380557368630654,
        lng: 15.051269531250002,
    },
    {
        lat: 54.226707764386695,
        lng: 20.236816406250004,
    },
    {
        lat: 54.12382170046237,
        lng: 20.895996093750004,
    },
    {
        lat: 52.119998657638156,
        lng: 24.587402343750004,
    },
    {
        lat: 50.99992885585966,
        lng: 24.104003906250004,
    },
    {
        lat: 51.11041991029264,
        lng: 22.78564453125,
    },
    {
        lat: 51.2206474303833,
        lng: 21.774902343750004,
    },
    {
        lat: 50.0923932109388,
        lng: 20.961914062500004,
    },
    {
        lat: 50.680797145321655,
        lng: 19.907226562500004,
    },
    {
        lat: 50.65294336725709,
        lng: 17.885742187500004,
    },
    {
        lat: 52.802761415419674,
        lng: 17.094726562500004,
    },
    {
        lat: 53.014783245859235,
        lng: 13.710937500000002,
    },
    {
        lat: 50.875311142200765,
        lng: 13.535156250000002,
    },
    {
        lat: 49.1242192485914,
        lng: 9.030761718750002,
    },
    {
        lat: 48.16608541901253,
        lng: 4.108886718750001,
    },
    {
        lat: 50.48547354578499,
        lng: 3.40576171875,
    },
    {
        lat: 47.100044694025215,
        lng: 0.5493164062500001,
    },
    {
        lat: 45.30580259943578,
        lng: 0.5493164062500001,
    },
    {
        lat: 43.58039085560786,
        lng: -0.6811523437500001,
    },
    {
        lat: 41.244772343082076,
        lng: -0.6811523437500001,
    },
    {
        lat: 40.94671366508002,
        lng: -2.8784179687500004,
    },
    {
        lat: 41.21172151054787,
        lng: 3.5815429687500004,
    },
    {
        lat: 46.255846818480315,
        lng: 2.39501953125,
    },
    {
        lat: 45.089035564831036,
        lng: 8.591308593750002,
    },
    {
        lat: 44.62175409623327,
        lng: 5.690917968750001,
    },
    {
        lat: 50.12057809796008,
        lng: 4.899902343750001,
    },
] as TripPathPointDto[];

jest.setTimeout(30_000);

it("Test fatPath geofencing", async () => {
    await connectToMongoDB();
    const start = Date.now();
    await computeNearestPlaces(fatPath);
    console.log(`Elapsed time ${Date.now() - start}ms`);
    expect(fatPath[0].nearestPlace).toEqual(["Oberallgäu", "Schwaben", "Bayern", "Deutschland"]);
    expect(fatPath[7].nearestPlace).toEqual([
        "Aschaffenburg, Landkreis",
        "Unterfranken",
        "Bayern",
        "Deutschland",
    ]);
    expect(fatPath.at(-1).nearestPlace).toEqual([
        "Arr. Dinant",
        "Prov. Namur",
        "Région wallonne",
        "Belgique/België",
    ]);
    await mongoose.disconnect();
});