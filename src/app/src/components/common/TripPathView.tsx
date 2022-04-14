import React from "react";
import classNames from "classnames";
import { TripDto } from "@aindo/dto";
import { ArrowDownIcon, LocationMarkerIcon } from "@heroicons/react/solid";

export function TripPathView(props: { className?: string; trip: TripDto; concise: boolean }) {
    const { className, trip, concise } = props;

    const pathClass = classNames("flex flex-col", className);

    if (trip.paths.length === 0) {
        return null;
    }

    const startPlace = trip.paths[0].nearestPlace!;
    const arrivalPlace = trip.paths[trip.paths.length - 1].nearestPlace!;

    return (
        <div className={pathClass}>
            {concise && (
                <div className="flex overflow-hidden">
                    <div className="flex flex-col justify-center">
                        <ArrowDownIcon className="w-4 h-4 ml-2 grow-0 shrink-0" />
                    </div>
                    <div className="flex flex-col ml-4 min-w-0">
                        <span className="text-lg truncate">
                            {startPlace.at(0) ? startPlace.at(0) : "unavailable"}
                        </span>
                        <span className="text-sm text-medium truncate">
                            {startPlace.at(-1) ? startPlace.at(-1) : "unavailable"}
                        </span>
                        <span className="text-lg truncate">
                            {arrivalPlace.at(0) ? arrivalPlace.at(0) : "unavailable"}
                        </span>
                        <span className="text-sm text-medium truncate">
                            {arrivalPlace.at(-1) ? arrivalPlace.at(-1) : "unavailable"}
                        </span>
                    </div>
                </div>
            )}
            {!concise &&
                trip.paths.map((path, idx) => (
                    <div key={idx} className="flex">
                        <div className="flex flex-col justify-center">
                            {idx !== 0 && idx !== trip.paths.length - 1 ? (
                                <ArrowDownIcon className="w-4 h-4 ml-2" />
                            ) : (
                                <LocationMarkerIcon className="w-4 h-4 ml-2" />
                            )}
                        </div>
                        <div className="flex flex-col ml-4 min-w-0">
                            <span className="text-lg truncate">
                                {path.nearestPlace!.at(0) ? path.nearestPlace!.at(0) : "unavailable"}
                            </span>
                            <span className="text-sm text-medium truncate">
                                {path.nearestPlace!.at(-1) ? path.nearestPlace!.at(-1) : "unavailable"}
                            </span>
                        </div>
                    </div>
                ))}
        </div>
    );
}
