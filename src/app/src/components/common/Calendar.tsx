import React from "react";
import "./Calendar.css";
import ReactCalendar, { CalendarProps } from "react-calendar";

export function Calendar(
    props: CalendarProps & {
        isDayDotted?: (date: Date) => boolean;
    }
) {
    return (
        <ReactCalendar
            {...props}
            onChange={props.onChange}
            value={props.value}
            className="rounded-md"
            formatShortWeekday={(locale, date) => {
                return date.toLocaleDateString(locale, { weekday: "narrow" });
            }}
            formatDay={(locale, date) => {
                return (
                    <div className="flex flex-col items-center">
                        <span>{date.getDate()}</span>
                        {props.isDayDotted && props.isDayDotted(date) && (
                            <div className="rounded-full w-1 h-1 bg-bkg-dark" />
                        )}
                    </div>
                ) as any;
            }}
            defaultView="month"
            maxDetail="month"
            minDetail="month"
            next2Label={null}
            prev2Label={null}
        />
    );
}
