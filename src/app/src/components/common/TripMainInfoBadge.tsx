import React from "react";
import { TripDto } from "@aindo/dto";
import { formatDistance } from "../../utils/distanceUtils";
import TripVehicleIcon from "./TripVehicleIcon";
import { toLocalDate } from "../../utils/dateUtils";

export default function TripMainInfoBadge(props: { className?: string; trip: TripDto }) {
    const { trip } = props;

    return (
        <div className="flex justify-between items-center bg-primary-normal text-white px-4 py-1 rounded-md">
            <TripVehicleIcon vehicle={trip.vehicle} className="w-8 h-8 fill-white" />
            <div className="text-lg flex flex-col items-end">
                <span>{formatDistance(trip.distance)}</span>
                <span>{toLocalDate(trip.date)}</span>
            </div>
        </div>
    );
}
