import React, { useEffect, useState } from "react";
import {
    getActiveStartDateFromDate,
    getLastDayInMonth,
    getLocalGMTOffset,
    getNumberOfDaysInMonth,
} from "../../utils/dateUtils";
import { Calendar } from "../common/Calendar";
import { TripApi } from "../../network/TripApi";

export default function CalendarView(props: {
    currentDate: Date;
    setCurrentDate: (dateDispatcher: React.SetStateAction<Date>) => void;
}) {
    const { currentDate, setCurrentDate } = props;

    const [__activeStartDate, set__activeStartDate] = useState(() => getActiveStartDateFromDate(currentDate));
    const [presenceTripInMonth, setPresenceTripInMonth] = useState<{ date: Date; trips: boolean[] }>();

    useEffect(() => {
        const lastDayCurrentMonth = getLastDayInMonth(__activeStartDate);
        TripApi.getTripsCountInRange(
            __activeStartDate,
            lastDayCurrentMonth,
            encodeURIComponent(getLocalGMTOffset())
        )
            .then((resp) => {
                const countTripsPerDay = new Array(getNumberOfDaysInMonth(__activeStartDate)).fill(0);
                for (const doc of resp.data!) {
                    if (doc && doc.date && doc.count) {
                        countTripsPerDay[Number(doc.date.split("-")[2]) - 1] = doc.count;
                    }
                }
                setPresenceTripInMonth({
                    date: __activeStartDate,
                    trips: countTripsPerDay.map((countDay) => countDay > 0),
                });
            })
            .catch((err) => console.log(err));
    }, [__activeStartDate]);

    return (
        <Calendar
            onChange={setCurrentDate}
            value={currentDate}
            onActiveStartDateChange={({ activeStartDate }) => set__activeStartDate(activeStartDate)}
            isDayDotted={(date) => {
                return (
                    (presenceTripInMonth &&
                        date.getMonth() === presenceTripInMonth.date.getMonth() &&
                        presenceTripInMonth.trips[date.getDate() - 1]) ||
                    false
                );
            }}
        />
    );
}
