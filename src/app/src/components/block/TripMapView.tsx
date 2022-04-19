import React, { useEffect, useMemo } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { TripDto, TripPathPointDto } from "@aindo/dto";
import { LatLngLiteral, LatLngTuple } from "leaflet";
import { Button } from "../common/Button";

// function computeCenterTrip(trip: TripDto): LatLngLiteral {
//     const lat = trip.paths.map((x) => x.lat).reduce((a, b) => a + b, 0) / trip.paths.length;
//     const lng = trip.paths.map((x) => x.lng).reduce((a, b) => a + b, 0) / trip.paths.length;
//     return { lat, lng };
// }

export default function TripMapView(props: {
    //trip or trip[] to work with.
    trip: TripDto | TripDto[];
    //enables editing of trip.
    //if trip is array, this prop is ignored and editing is not allowed
    editable?: boolean;
    //if provided, decides which trip in the array of trips has to be highlighted
    highlightIdx?: number;
    //if provided, call upon trip change.
    //returns updated trip
    onEdit?: (trip: TripDto, ix: number) => void;
    //if provided, call upon click on a trip
    onClick?: (trip: TripDto, ix: number) => void;
}) {
    const { trip, editable, highlightIdx, onEdit, onClick } = props;

    const initialCenter: LatLngLiteral = useMemo(() => {
        const arrayTrip = Array.isArray(trip) ? trip : [trip];
        if (arrayTrip.length !== 0) {
            return arrayTrip[0].paths.length !== 0 ? arrayTrip[0].paths[0] : { lat: 47, lng: 20 };
        }
        return { lat: 47, lng: 20 };
    }, []);

    return (
        <MapContainer className="h-screen w-full" zoom={5} center={initialCenter} doubleClickZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {trip &&
                (Array.isArray(trip) ? trip : [trip]).map((singleTrip, idx) => (
                    <SingleTrip
                        key={idx}
                        trip={singleTrip}
                        highlight={idx === (highlightIdx || 0)}
                        editable={!!editable}
                        onEdit={(tt) => onEdit && onEdit(tt, idx)}
                        onClick={() => onClick && onClick(singleTrip, idx)}
                    />
                ))}
        </MapContainer>
    );
}

function SingleTrip(props: {
    //the single trip passed from parent
    trip: TripDto;
    //enables editing of trip.
    //if trip is array, this prop is ignored and editing is not allowed
    editable: boolean;
    //boolean to know if is the highlighted trip
    highlight: boolean;
    //if provided, call upon trip change.
    //returns updated trip
    onEdit: (trip: TripDto) => void;
    //if provided, call upon click on a trip
    onClick: () => void;
}) {
    const { trip, editable, highlight, onEdit, onClick } = props;

    //react-leaflet built-in hook to handle events on map instance
    useMapEvents({
        click: (e) => {
            if (editable) {
                // STORE NEW POSITION IN TRIP OBJECT
                const newPosition: TripPathPointDto = { lat: e.latlng.lat, lng: e.latlng.lng };
                onEdit({ ...trip, paths: [...trip.paths, newPosition] });
            }
        },
    });

    //hook that returns leaflet map instance
    const map = useMap();

    //if highlight or trip changes, pan to new 'center of trip'
    useEffect(() => {
        if (highlight && !editable && trip.paths.length !== 0) {
            // map.panTo(computeCenterTrip(trip), { animate: true, duration: 0.5 });
            map.fitBounds([trip.paths.map((path) => [path.lat, path.lng]) as unknown as LatLngTuple], {
                animate: true,
                duration: 0.5,
            });
        }
    }, [highlight, editable, trip]);

    const onMarkerDrag = (pi: number, event: any) => {
        onEdit({
            ...trip,
            paths: trip.paths.map((point, i) =>
                i !== pi ? point : { lat: event.latlng.lat, lng: event.latlng.lng }
            ),
        });
    };

    // DELETE CURRENT POSITION in TRIP OBJECT
    const onRemoveElement = (pi: number) => {
        onEdit({
            ...trip,
            paths: trip.paths.filter((_, id) => id !== pi),
        });
    };

    return (
        <>
            {trip.paths.length !== 0 && (
                <Polyline
                    positions={trip.paths.map((point) => [point.lat, point.lng])}
                    eventHandlers={{
                        click: onClick,
                    }}
                />
            )}
            {trip.paths.length !== 0 &&
                trip.paths.map((point, pIdx) => (
                    <Marker
                        key={pIdx}
                        position={[point.lat, point.lng]}
                        draggable={editable}
                        autoPan={true}
                        eventHandlers={{
                            drag: (event) => onMarkerDrag(pIdx, event),
                            click: onClick,
                        }}
                    >
                        <Popup>
                            <div className="flex flex-col w-full font-semibold">
                                {point.nearestPlace && point.nearestPlace.length !== 0
                                    ? point.nearestPlace.join(" ")
                                    : "unavailable"}
                                {editable && (
                                    <Button onClick={() => onRemoveElement(pIdx)} accent={false}>
                                        Delete
                                    </Button>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}
        </>
    );
}
