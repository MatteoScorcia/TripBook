import React, { useState } from "react";
import { ResponseApi, TripDto } from "@aindo/dto";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import TripMapView from "./block/TripMapView";
import { dateDecoder, dateEncoder, validateDateEncoded } from "../utils/dateUtils";
import Navbar from "./common/Navbar";
import { TripApi } from "../network/TripApi";
import { useEdit } from "../customHooks/useEdit";
import { Button } from "./common/Button";
import TripVehicleSelector from "./block/TripVehicleSelector";
import { Modal } from "./common/Modal";
import TripMainInfoBadge from "./common/TripMainInfoBadge";
import warning from "../img/warning.png";
import remove from "../img/remove.png";
import { Calendar } from "./common/Calendar";
import { TripPathView } from "./common/TripPathView";
import { useDateUrlParam } from "../customHooks/useDateUrlParam";
import { useAuth } from "../customHooks/useAuth";

export default function PageTrip() {
    const { date: currentDate, setDate: setCurrentDate } = useDateUrlParam(
        dateEncoder,
        dateDecoder,
        validateDateEncoded
    );

    const [editMode, setEditMode] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);

    const params = useParams();
    const navigate = useNavigate();

    const [deleteError, setDeleteError] = useState<[string, string] | undefined>(undefined);
    const [deleteLoading, setDeleteLoading] = useState(false);

    let createNew = params.id === "new";

    const {
        isLoading,
        error,
        dto: trip,
        setDto: setTrip,
        resetState: rollbackTrip,
        patchDto: patchTrip,
        save: saveTrip,
    } = useEdit<TripDto>(
        async (id: string) => {
            if (createNew) {
                return {
                    data: {
                        date: currentDate,
                        distance: 0,
                        paths: [],
                        vehicle: "car",
                    },
                } as ResponseApi<TripDto>;
            } else {
                return TripApi.getTrip(id);
            }
        },
        async (trip: TripDto) => {
            if (createNew) {
                return TripApi.saveTrip(trip);
            } else {
                return TripApi.updateTrip(trip);
            }
        },
        params.id
    );

    const handleDateChange = (newDate: Date) => {
        patchTrip({ date: newDate });
        setCurrentDate(newDate);
    };

    const toggleEdit = () => {
        if (editMode) {
            rollbackTrip();
        }
        setEditMode((prevState) => !prevState);
    };

    const handleSave = () => {
        saveTrip();
        createNew = false;
        toggleEdit();
    };

    const handleDelete = () => {
        setDeleteLoading(true);
        setDeleteError(undefined);
        if (!createNew) {
            TripApi.deleteTrip(params.id!)
                .then((res) => {
                    navigate(`/?date=${dateEncoder(currentDate)}`);
                })
                .catch((err) => {
                    const errorMessage = [err.message, err.response.data.error] as [string, string];
                    setDeleteError(errorMessage);
                })
                .finally(() => {
                    setDeleteLoading(false);
                });
        } else {
            setDeleteLoading(false);
            navigate(`/?date=${dateEncoder(currentDate)}`);
        }
    };

    return (
        <div className="flex w-screen h-screen">
            <Navbar className={isLoading || deleteLoading ? "animate-pulse" : ""}>
                <div className="flex space-x-1 self-end">
                    {!editMode && (
                        <Button onClick={toggleEdit} accent={true}>
                            <span>Edit</span>
                        </Button>
                    )}
                    {!editMode && (
                        <Button accent={false} onClick={() => setShowModal((prevState) => !prevState)}>
                            <span>Delete</span>
                        </Button>
                    )}
                    {editMode && (
                        <Button accent={true} onClick={handleSave}>
                            <span>Save</span>
                        </Button>
                    )}
                    {editMode && (
                        <Button accent={false} onClick={toggleEdit}>
                            <span>Cancel</span>
                        </Button>
                    )}
                </div>
                {!editMode && trip && (
                    <>
                        <TripMainInfoBadge className="w-96" trip={trip} />
                        <TripPathView
                            className="rounded-md rounded-md overflow-auto -mx-4 px-4"
                            trip={trip}
                            concise={false}
                        />
                    </>
                )}
                {editMode && <Calendar onChange={handleDateChange} value={trip?.date} />}
                {trip && editMode && (
                    <TripVehicleSelector
                        className="w-full"
                        disabled={!editMode}
                        trip={trip}
                        onClick={patchTrip}
                    />
                )}
            </Navbar>

            {trip && <TripMapView editable={editMode} trip={trip} onEdit={setTrip} />}

            <Modal
                show={showModal}
                title={""}
                onClickOutsideModal={() => setShowModal(false)}
                actionButtons={
                    <div className="flex space-x-1 w-full justify-between">
                        <Button accent={true} onClick={() => handleDelete()}>
                            <span>Confirm</span>
                        </Button>
                        <Button accent={false} onClick={() => setShowModal(false)}>
                            <span>Cancel</span>
                        </Button>
                    </div>
                }
            >
                <div className="flex flex-col items-center">
                    <img src={remove} alt={"delete trip"} className="w-16 h-16" />
                    <span className="pt-8">Delete this trip?</span>
                </div>
            </Modal>

            {(deleteError || error) && (
                <Modal
                    show={true}
                    title={""}
                    onClickOutsideModal={() => setShowModal(false)}
                    actionButtons={
                        <Button accent={true} onClick={() => setShowModal(false)}>
                            <span>Close</span>
                        </Button>
                    }
                >
                    <div className="flex justify-center">
                        <img src={warning} alt={"warning"} className="w-16 h-16" />
                    </div>
                    {deleteError && (
                        <div className="mt-4">
                            <div>{deleteError[0]}</div>
                            {deleteError[1] && <div>{deleteError[1]}</div>}
                        </div>
                    )}
                    {error && (
                        <div className="mt-4">
                            <div>{error[0]}</div>
                            {error[1] && <div>{error[1]}</div>}
                        </div>
                    )}
                </Modal>
            )}
        </div>
    );
}
