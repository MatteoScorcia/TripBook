import React, {useState} from "react";
import {SuccessResponseApi, TripDto} from "@aindo/dto";
import TripView from "./block/TripView";
import Navbar from "./common/Navbar";
import TripStatistics from "./block/TripStatistics";
import {dateDecoder, dateEncoder, validateDateEncoded} from "../utils/dateUtils";
import {useNavigate} from "react-router-dom";
import {TripApi} from "../network/TripApi";
import {Button} from "./common/Button";
import {PlusIcon, RefreshIcon} from "@heroicons/react/solid";
import {Modal} from "./common/Modal";
import warning from "../img/warning.png";
import {useDateUrlParam} from "../customHooks/useDateUrlParam";
import CalendarView from "./block/CalendarView";
import {useQuery} from "react-query";
import {AxiosError} from "axios";

export default function PageHome() {
    const navigate = useNavigate();
    const [showFetchError, setShowFetchError] = useState(false);

    const { date: currentDate, setDate: setCurrentDate } = useDateUrlParam(
        dateEncoder,
        dateDecoder,
        validateDateEncoded
    );

    const {
        isLoading: isFetchLoading,
        error: fetchError,
        data: selectedTrips,
    } = useQuery<SuccessResponseApi<TripDto[]>, AxiosError>(
        ["trips", currentDate],
        async () => TripApi.getTripsByDate(currentDate),
        {
            onError: (error) => {
                setShowFetchError(true);
            }
        }
        );

    const navigateToPage = (url: string) => {
        navigate(url);
    };

    return (
        <div className="flex w-screen h-screen">
            <Navbar className={isFetchLoading ? "animate-pulse" : ""}>
                <Button
                    className="self-end"
                    accent={true}
                    onClick={() => navigateToPage(`/trip/new?date=${dateEncoder(currentDate)}`)}
                >
                    <span>New Trip</span>
                    <PlusIcon className="w-4 h-4" />
                </Button>
                <CalendarView currentDate={currentDate} setCurrentDate={setCurrentDate} />
                <TripStatistics currentDate={currentDate} className={"overflow-y-auto -mr-4 pr-4"} />
            </Navbar>

            {/* Map body and cards */}
            <TripView trips={selectedTrips?.data || []} onNavigate={navigateToPage}/>

            {/* Error modal */}
            <Modal
                show={showFetchError}
                actionButtons={
                    <Button accent={true} onClick={() => window.location.reload()}>
                        <span>Reload</span>
                        <RefreshIcon className="w-4 h-4" />
                    </Button>
                }
            >
                <div className="flex justify-center">
                    <img src={warning} alt={"warning"} className="w-16 h-16" />
                </div>
                <div className="mt-4">
                    <div>{fetchError?.message}</div>
                    <div className="text-medium">{fetchError?.response?.data?.error}</div>
                </div>
            </Modal>

        </div>
    );
}
