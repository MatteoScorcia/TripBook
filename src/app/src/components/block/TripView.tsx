import React, { useState } from "react";
import { TripDto } from "@aindo/dto";
import TripMapView from "./TripMapView";

import { Card } from "../common/Card";
import { ExternalLinkIcon } from "@heroicons/react/solid";
import { IconButton } from "../common/IconButton";
import TripVehicleIcon from "../common/TripVehicleIcon";
import { TripPathView } from "../common/TripPathView";
import classNames from "classnames";

export default function TripView(props: { trips: TripDto[]; onNavigate: Function }) {
    const { trips, onNavigate } = props;

    const [highlightTripIdx, setHighlightTripIdx] = useState<number>(0);

    const onClickTrip = (trip: TripDto) => {
        console.log("clicked on trip: ", trip._id);
    };

    return (
        <div className="w-full relative">
            <TripMapView trip={trips} onClick={onClickTrip} highlightIdx={highlightTripIdx} />
            <div className="absolute bottom-0 left-0 max-w-[100%] z-[1000] overflow-x-auto">
                <div className="flex space-x-4 pb-10">
                    <div className="shrink-0 grow-0 w-6" />
                    {trips.map((trip, idx) => (
                        <Card
                            key={idx}
                            onClick={() => setHighlightTripIdx(idx)}
                            className={classNames("w-64 h-48 shrink-0 grow-0 cursor-pointer")}
                            logo={
                                <TripVehicleIcon vehicle={trip.vehicle} className="w-8 h-8 fill-bkg-dark" />
                            }
                            iconAction={
                                <IconButton onClick={() => onNavigate(`/trip/${trip._id}`)}>
                                    <ExternalLinkIcon className="w-4 h-4" />
                                </IconButton>
                            }
                        >
                            <TripPathView trip={trip} concise={true} />
                        </Card>
                    ))}
                    <div className="shrink-0 grow-0 w-6" />
                </div>
            </div>
        </div>
    );
}
