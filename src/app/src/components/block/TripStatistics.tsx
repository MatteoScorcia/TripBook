import React, { useState } from "react";
import {InsightsDto, SuccessResponseApi} from "@aindo/dto";
import classNames from "classnames";
import { TripApi } from "../../network/TripApi";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import warning from "../../img/warning.png";
import {useQuery} from "react-query";
import {AxiosError} from "axios";

export default function TripStatistics(props: {
    children?: JSX.Element;
    className?: string;
    currentDate: Date;
}) {
    const { className, currentDate } = props;
    const [showStatisticsError, setShowStatisticsError] = useState(false);

    const {
        isLoading: isStatisticsLoading,
        error: statisticsError,
        data: dateStatistics,
    } = useQuery<SuccessResponseApi<InsightsDto[]>, AxiosError>(
        ["insights", currentDate],
        async () => TripApi.getStatisticsByDay(currentDate),
        {
            onError: (error) => {
                setShowStatisticsError(true);
            }
        }
    );

    const tripStatisticsClass = classNames(isStatisticsLoading && "animate-pulse", className);

    return (
        <div className={tripStatisticsClass}>
            <h3 className="text-xl">Nations visited on this day</h3>
            {dateStatistics && (
                <div className="mr-12">
                    {dateStatistics.data.map((tripStatistic, idx) => {
                        if (tripStatistic && tripStatistic.count) {
                            const numberOfStages = dateStatistics.data.reduce(
                                (prev, curr) => (curr.count ? prev + curr.count : prev),
                                0
                            );
                            const percentage = (tripStatistic.count / numberOfStages) * 100;
                            return (
                                <div key={idx} className="relative mt-2">
                                    <div className="absolute top-0 left-0 ml-[100%] text-disabled">
                                        {Math.round(percentage).toFixed(0)}%
                                    </div>
                                    <span className="text-emphasis">
                                        {tripStatistic.country || "unavailable"}
                                    </span>
                                    <div
                                        className={`top-0 left-0 h-1 rounded-full bg-primary-normal`}
                                        style={{ width: `${percentage * 0.97 + 3}%` }}
                                    />
                                </div>
                            );
                        }
                    })}
                </div>
            )}

            <Modal
                show={showStatisticsError}
                actionButtons={
                    <Button accent={true} onClick={() => setShowStatisticsError(false)}>
                        <span>Close</span>
                    </Button>
                }
            >
                <div className="flex justify-center">
                    <img src={warning} alt={"warning"} className="w-16 h-16" />
                </div>
                <div className="mt-4">
                    <div>{statisticsError?.message}</div>
                    <div className="text-medium">{statisticsError?.response?.data?.error}</div>
                </div>
            </Modal>

        </div>
    );
}
