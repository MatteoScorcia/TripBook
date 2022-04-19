import NUTSModel from "../models/NutsModel";
import { TripPathPointDto } from "@aindo/dto";

// https://stackoverflow.com/questions/27928/
function haversineDistance(lat1, lon1, lat2, lon2) {
    const p = 0.017453292519943295; // Math.PI / 180
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p) / 2 + (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

export async function computeNearestPlaces(paths: TripPathPointDto[]) {
    const promiseNearestPlacesPerPoint = paths.map(async (point) => {
        return NUTSModel.find(
            {
                geometry: {
                    $geoIntersects: {
                        $geometry: {
                            type: "Point",
                            coordinates: [point.lng, point.lat],
                        },
                    },
                },
            },
            { properties: true },
            { sort: { "properties.LEVL_CODE": -1 } }
        );
    });

    const nearestPlacesPerPoint = await Promise.all(promiseNearestPlacesPerPoint);

    nearestPlacesPerPoint.forEach((nearestPlacesCurrentPoint, pointIdx) => {
        paths[pointIdx].nearestPlace = nearestPlacesCurrentPoint.map(
            (nearestPlace) => nearestPlace.properties.NAME_LATN
        );
    });
}

export function computeDistances(paths: TripPathPointDto[]) {
    let totalDistance = 0; //total distance in Km
    for (let idx = 0; idx < paths.length - 1; idx++) {
        totalDistance += haversineDistance(
            paths[idx].lat,
            paths[idx].lng,
            paths[idx + 1].lat,
            paths[idx + 1].lng
        );
    }
    return totalDistance;
}
