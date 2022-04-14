import React, { useState } from "react";
import { InsightsDto } from "@aindo/dto";
import classNames from "classnames";
import { useGet } from "../../customHooks/useGet";
import { TripApi } from "../../network/TripApi";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import warning from "../../img/warning.png";

export default function TripStatistics(props: {
    children?: JSX.Element;
    className?: string;
    currentDate: Date;
}) {
    const [showModal, setShowModal] = useState(true);
    const { className, currentDate } = props;

    const {
        isLoading: isStatisticsLoading,
        error: statisticsError,
        dto: dateStatistics,
    } = useGet<InsightsDto[]>((date) => TripApi.getStatisticsByDay(date), currentDate);

    const tripStatisticsClass = classNames(isStatisticsLoading && "animate-pulse", className);

    return (
        <div className={tripStatisticsClass}>
            <h3 className="text-xl">Nations visited on this day</h3>
            {dateStatistics && (
                <div className="mr-12">
                    {dateStatistics.map((tripStatistic, idx) => {
                        if (tripStatistic && tripStatistic.country && tripStatistic.count) {
                            const numberOfStages = dateStatistics.reduce(
                                (prev, curr) => (curr.count ? prev + curr.count : prev),
                                0
                            );
                            const percentage = (tripStatistic.count / numberOfStages) * 100;
                            return (
                                <div key={idx} className="relative mt-2">
                                    <div className="absolute top-0 left-0 ml-[100%] text-disabled">
                                        {Math.round(percentage).toFixed(0)}%
                                    </div>
                                    <span className="text-emphasis">{tripStatistic.country}</span>
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

            {statisticsError && (
                <Modal
                    show={showModal}
                    title={""}
                    actionButtons={
                        <Button accent={true} onClick={() => setShowModal(false)}>
                            <span>Close</span>
                        </Button>
                    }
                >
                    <div className="flex justify-center">
                        <img src={warning} alt={"warning"} className="w-16 h-16" />
                    </div>
                    <div className="mt-4">
                        <div>{statisticsError[0]}</div>
                        {statisticsError[1] && <div className="text-medium">{statisticsError[1]}</div>}
                    </div>
                </Modal>
            )}
        </div>
    );
}
