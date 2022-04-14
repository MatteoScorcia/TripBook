import React from "react";
import { ReactComponent as Car } from "../../svg/directions_car_black_24dp.svg";
import { ReactComponent as Plane } from "../../svg/flight_black_24dp.svg";
import { ReactComponent as Walk } from "../../svg/directions_walk_black_24dp.svg";
import { ReactComponent as Train } from "../../svg/directions_transit_black_24dp.svg";
import { ReactComponent as Bike } from "../../svg/directions_bike_black_24dp.svg";

export default function TripVehicleIcon(
    props: React.SVGProps<SVGSVGElement> & { title?: string; vehicle: string }
) {
    switch (props.vehicle) {
        default:
        case "car":
            return <Car {...props} />;
        case "plane":
            return <Plane {...props} />;
        case "walk":
            return <Walk {...props} />;
        case "train":
            return <Train {...props} />;
        case "bike":
            return <Bike {...props} />;
    }
}
