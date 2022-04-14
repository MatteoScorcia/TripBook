import React, {useState} from "react";
import {SuccessResponseApi, TripDto} from "@aindo/dto";
import {useNavigate, useParams} from "react-router-dom";
import TripMapView from "./block/TripMapView";
import {dateDecoder, dateEncoder, validateDateEncoded} from "../utils/dateUtils";
import Navbar from "./common/Navbar";
import {TripApi} from "../network/TripApi";
import {useEdit} from "../customHooks/useEdit";
import {Button} from "./common/Button";
import TripVehicleSelector from "./block/TripVehicleSelector";
import {Modal} from "./common/Modal";
import TripMainInfoBadge from "./common/TripMainInfoBadge";
import warning from "../img/warning.png";
import remove from "../img/remove.png";
import {Calendar} from "./common/Calendar";
import {TripPathView} from "./common/TripPathView";
import {useDateUrlParam} from "../customHooks/useDateUrlParam";

export default function PageTrip() {
    const params = useParams();
    const navigate = useNavigate();

    // State machine

    const createNew = params.id === "new";
    const [stateEditMode, setEditMode] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const editMode = stateEditMode || createNew

    // URL

    const { date: currentDate, setDate: setCurrentDate } = useDateUrlParam(
        dateEncoder,
        dateDecoder,
        validateDateEncoded,
    );

    // HTTP actions

    const {
        isLoading,
        error: editError,
        resetError: resetEditError,
        dto: trip,
        setDto: setTrip,
        resetState: rollbackTrip,
        patchDto: patchTrip,
        save: saveTrip,
    } = useEdit<TripDto>(
        async (_, id: string) => {
            if (createNew) {
                return {
                    data: {
                        date: currentDate,
                        distance: 0,
                        paths: [],
                        vehicle: "car",
                    },
                } as SuccessResponseApi<TripDto>;
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
        [createNew, params.id]
    );

    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState<[string, string] | undefined>(undefined);

    const handleDelete = () => {
        if (!createNew) {
            setDeleteLoading(true);
            setDeleteError(undefined);
            TripApi.deleteTrip(params.id!)
                .then((res) => {
                    navigate(`/?date=${dateEncoder(currentDate)}`);
                })
                .catch((err) => {
                    const errorMessage = [err?.message, err?.response?.data?.error] as [string, string];
                    setDeleteError(errorMessage);
                })
                .finally(() => {
                    setDeleteLoading(false);
                });
        }
    };

    // Status handling

    const handleDateChange = (newDate: Date) => {
        patchTrip({ date: newDate });
        setCurrentDate(newDate);
    };

    const handleSave = () => {
        saveTrip().then((data) => {
            setEditMode(false);
            navigate(`/trip/${data._id}`)
        })
    };

    const enterEdit = () => {
        setEditMode(true);
    };

    const cancelEdit = () => {
        if (createNew) {
            navigate(`/?date=${dateEncoder(currentDate)}`);
        } else {
            rollbackTrip();
            setEditMode(false);
        }
    }

    // Errors
    const allErrors = deleteError || editError;

    const clearErrors = () => {
        setDeleteError(undefined);
        resetEditError();
    }

    return (
        <div className="flex w-screen h-screen">
            <Navbar className={isLoading || deleteLoading ? "animate-pulse" : ""}>
                <div className="flex space-x-1 self-end">
                    {!editMode && (
                        <>
                            <Button onClick={enterEdit} accent={true}>
                                <span>Edit</span>
                            </Button>
                            <Button accent={false} onClick={() => setShowDeleteModal(true)}>
                                <span>Delete</span>
                            </Button>
                        </>
                    )}
                    {editMode && (
                        <>
                            <Button accent={true} onClick={handleSave}>
                                <span>Save</span>
                            </Button>
                            <Button accent={false} onClick={cancelEdit}>
                                <span>Cancel</span>
                            </Button>
                        </>
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
                {editMode && (
                    <>
                        <Calendar onChange={handleDateChange} value={trip?.date} />
                        {trip && (
                            <TripVehicleSelector
                                className="w-full"
                                disabled={!editMode}
                                trip={trip}
                                onClick={patchTrip}
                            />
                        )}
                    </>
                )}
            </Navbar>

            {/* Map body */}
            {trip && (
                <TripMapView editable={editMode} trip={trip} onEdit={setTrip} />
            )}

            {/* Delete confirm modal */}
            <Modal
                show={showDeleteModal}
                onClickOutsideModal={() => setShowDeleteModal(false)}
                actionButtons={
                    <div className="flex space-x-1 w-full justify-between">
                        <Button accent={true} onClick={() => {
                            setShowDeleteModal(false);
                            handleDelete()
                        }}>
                            <span>Confirm</span>
                        </Button>
                        <Button accent={false} onClick={() => setShowDeleteModal(false)}>
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

            {/* Error modal */}
            {allErrors && (
                <Modal
                    show={true}
                    onClickOutsideModal={clearErrors}
                    actionButtons={
                        <Button accent={true} onClick={clearErrors}>
                            <span>Close</span>
                        </Button>
                    }
                >
                    <div className="flex justify-center">
                        <img src={warning} alt={"warning"} className="w-16 h-16" />
                    </div>
                    <div className="mt-4">
                        <div>{allErrors[0]}</div>
                        {allErrors[1] && <div>{allErrors[1]}</div>}
                    </div>
                </Modal>
            )}

        </div>
    );
}
