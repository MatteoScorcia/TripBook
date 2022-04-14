import React, { useState } from "react";
import { TripDto } from "@aindo/dto";
import TripView from "./block/TripView";
import Navbar from "./common/Navbar";
import TripStatistics from "./block/TripStatistics";
import { dateDecoder, dateEncoder, validateDateEncoded } from "../utils/dateUtils";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { TripApi } from "../network/TripApi";
import { useGet } from "../customHooks/useGet";
import { Button } from "./common/Button";
import { PlusIcon, RefreshIcon } from "@heroicons/react/solid";
import { Modal } from "./common/Modal";
import warning from "../img/warning.png";
import { useDateUrlParam } from "../customHooks/useDateUrlParam";
import CalendarView from "./block/CalendarView";
import { useAuth } from "../customHooks/useAuth";

export default function PageHome() {
    const { date: currentDate, setDate: setCurrentDate } = useDateUrlParam(
        dateEncoder,
        dateDecoder,
        validateDateEncoded
    );

    const {
        isLoading: isFetchLoading,
        error: fetchError,
        dto: selectedTrips,
    } = useGet<TripDto[]>((date) => TripApi.getTripsByDate(date), currentDate);

    const [showModal] = useState(true);

    const navigate = useNavigate();

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

            <TripView trips={selectedTrips || []} onNavigate={navigateToPage} />

            {fetchError && (
                <Modal
                    show={showModal}
                    title={""}
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
                        <div>{fetchError[0]}</div>
                        {fetchError[1] && <div className="text-medium">{fetchError[1]}</div>}
                    </div>
                </Modal>
            )}
        </div>
    );
}
