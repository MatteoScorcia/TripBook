import React, {useEffect, useState} from "react";
import {SuccessResponseApi, TripDto} from "@aindo/dto";
import {useNavigate, useParams} from "react-router-dom";
import TripMapView from "./block/TripMapView";
import {dateDecoder, dateEncoder, validateDateEncoded} from "../utils/dateUtils";
import Navbar from "./common/Navbar";
import {TripApi} from "../network/TripApi";
import {Button} from "./common/Button";
import TripVehicleSelector from "./block/TripVehicleSelector";
import {Modal} from "./common/Modal";
import TripMainInfoBadge from "./common/TripMainInfoBadge";
import warning from "../img/warning.png";
import remove from "../img/remove.png";
import {Calendar} from "./common/Calendar";
import {TripPathView} from "./common/TripPathView";
import {useDateUrlParam} from "../customHooks/useDateUrlParam";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {AxiosError} from "axios";
import {usePatch} from "../customHooks/usePatch";

export default function PageTrip() {
    const params = useParams();
    const navigate = useNavigate();

    // State machine
    const createNew = params.id === "new";
    const [stateEditMode, setEditMode] = useState(false);
    // const [showFetchError, setShowFetchError] = useState(false);
    // const [showSaveError, setShowSaveError] = useState(false);
    // const [showDeleteError, setShowDeleteError] = useState(false);
    const [showErrors, setShowErrors] = useState(false);

    const editMode = stateEditMode || createNew

    // URL
    const { date: currentDate, setDate: setCurrentDate } = useDateUrlParam(
        dateEncoder,
        dateDecoder,
        validateDateEncoded,
    );

    // HTTP actions
    const queryClient = useQueryClient()

    const {
        isLoading: isFetchLoading,
        error: fetchError,
        data: queryTrip,
    } = useQuery<SuccessResponseApi<TripDto>, AxiosError>(
        ["trips", params.id],
        async () => TripApi.getTrip(params.id!),
        {
            placeholderData: () => ({
                data: {
                    date: currentDate,
                    distance: 0,
                    paths: [],
                    vehicle: "car",
                }
            }),
            onError: (error) => {
                setShowErrors(true);
            },
            enabled: !createNew
        }
    );

    //Local state to edit
    const [localTrip, setLocalTrip, patchLocalTrip] = usePatch<TripDto>(queryTrip!.data);

    useEffect(() => {
        if(!createNew) {
            patchLocalTrip(queryTrip!.data);
        }
    }, [queryTrip]);

    const {
        mutateAsync: save,
        isLoading: isSaveLoading,
        error: saveError,
    } = useMutation<SuccessResponseApi<TripDto>, AxiosError, TripDto, {updatedTrip: TripDto, rollbackTrip: TripDto}>(
        async () => createNew ? TripApi.saveTrip(localTrip) : TripApi.updateTrip(localTrip),
        {
            onMutate: async (updatedTrip) => {
                    if(!createNew) {
                        await queryClient.cancelQueries(["trips", updatedTrip._id]);
                        const rollbackTrip = queryClient.getQueryData<SuccessResponseApi<TripDto>>(["trips", updatedTrip._id])!.data;
                        queryClient.setQueryData(["trips", updatedTrip._id], updatedTrip);
                        return {rollbackTrip, updatedTrip};
                    }
            },
            onSuccess: async (data) => {
                await queryClient.invalidateQueries(["trips", data.data._id]);
                setEditMode(false);
            },
            onError: (error, updatedTrip, context) => {
                setShowErrors(true);
                if(!createNew && context) {
                    queryClient.setQueryData(["todos", context.updatedTrip._id], context.rollbackTrip);
                }
            },
        }
    );

    // const [deleteLoading, setDeleteLoading] = useState(false);
    // const [deleteError, setDeleteError] = useState<AxiosError | undefined>(undefined);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // const handleDelete = () => {
    //     if (!createNew) {
    //         setDeleteLoading(true);
    //         setDeleteError(undefined);
    //         TripApi.deleteTrip(params.id!)
    //             .then((res) => {
    //                 navigate(`/?date=${dateEncoder(currentDate)}`);
    //             })
    //             .catch((err: AxiosError) => {
    //                 setDeleteError(err);
    //                 setShowDeleteError(true);
    //             })
    //             .finally(() => {
    //                 setDeleteLoading(false);
    //             });
    //     }
    // };

    const {
        mutateAsync: del,
        isLoading: isDeleteLoading,
        error: deleteError,
    } = useMutation<SuccessResponseApi<TripDto>, AxiosError, TripDto>(
        async () => TripApi.deleteTrip(localTrip._id!),
        {
            onSuccess: () => {
                navigate(`/?date=${dateEncoder(currentDate)}`);
            },
            onError: () => {
                setShowErrors(true);
            },
        }
    );

    // Status handling
    const handleDateChange = (newDate: Date) => {
        patchLocalTrip({ date: newDate });
        setCurrentDate(newDate);
    };

    const handleSave = () => {
        save(localTrip).then(updatedTrip => {
            if(createNew) {
                navigate(`/trip/${updatedTrip.data._id}`);
            }
        });
    };

    const enterEdit = () => {
        setEditMode(true);
    };

    const cancelEdit = () => {
        if (createNew) {
            navigate(`/?date=${dateEncoder(currentDate)}`);
        } else {
            patchLocalTrip(queryClient.getQueryData<SuccessResponseApi<TripDto>>(["trips", localTrip._id])!.data);
            setEditMode(false);
        }
    }

    const allErrors = saveError || deleteError || fetchError;

    return (
        <div className="flex w-screen h-screen">
            <Navbar className={isSaveLoading || isDeleteLoading || isFetchLoading ? "animate-pulse" : ""}>
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
                {!editMode && (
                    <>
                        <TripMainInfoBadge className="w-96" trip={localTrip} />
                        <TripPathView
                            className="rounded-md rounded-md overflow-auto -mx-4 px-4"
                            trip={queryTrip!.data}
                            concise={false}
                        />
                    </>
                )}
                {editMode && (
                    <>
                        <Calendar onChange={handleDateChange} value={localTrip.date} />
                        <TripVehicleSelector
                            className="w-full"
                            disabled={!editMode}
                            trip={localTrip}
                            onClick={patchLocalTrip}
                        />
                    </>
                )}
            </Navbar>

            {/* Map body */}
                <TripMapView
                    editable={editMode}
                    trip={localTrip}
                    onEdit={patchLocalTrip}
                />

            {/* Confirm Delete Modal */}
            <Modal
                show={showDeleteModal}
                onClickOutsideModal={() => setShowDeleteModal(false)}
                actionButtons={
                    <div className="flex space-x-1 w-full justify-between">
                        <Button accent={true} onClick={async () => {
                            setShowDeleteModal(false);
                            await del(localTrip);
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

            {/* Error Modals */}
            <Modal
                show={showErrors}
                onClickOutsideModal={() => setShowErrors(false)}
                actionButtons={
                    <Button accent={true} onClick={() => setShowErrors(false)}>
                        <span>Close</span>
                    </Button>
                }
            >
                <div className="flex justify-center">
                    <img src={warning} alt={"warning"} className="w-16 h-16" />
                </div>
                <div className="mt-4">
                    <div>{allErrors?.message}</div>
                    <div>{allErrors?.response?.data.error}</div>
                </div>
            </Modal>

        </div>
    );
}
