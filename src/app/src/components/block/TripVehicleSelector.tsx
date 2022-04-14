import React, { useMemo } from "react";
import { TripDto } from "@aindo/dto";
import classNames from "classnames";
import { Button } from "../common/Button";
import TripVehicleIcon from "../common/TripVehicleIcon";

export default function TripVehicleSelector(props: {
    className: string;
    disabled: boolean;
    trip: TripDto | undefined;
    onClick: Function;
}) {
    const { className, disabled, trip, onClick } = props;

    const listClass = classNames("", className);

    const vehicleIconMap = useMemo(() => ["car", "train", "walk", "plane", "bike"], []);

    const handleVehicleChange = (newVehicle: string) => {
        onClick({ vehicle: newVehicle });
    };

    return (
        <div className={listClass}>
            <div className="flex justify-between rounded-md">
                {!disabled &&
                    vehicleIconMap.map((vehicle, idx) => (
                        <Button
                            key={idx}
                            accent={trip?.vehicle === vehicle}
                            onClick={() => handleVehicleChange(vehicle)}
                        >
                            <TripVehicleIcon vehicle={vehicle} className="w-8 h-8" />
                        </Button>
                    ))}
            </div>
        </div>
    );
}
