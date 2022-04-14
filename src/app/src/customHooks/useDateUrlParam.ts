import { SetStateAction, useState } from "react";
import { floorDateToDay } from "../utils/dateUtils";

type Encoder = (date: Date) => string;
type Decoder = (dateEncoded: string) => Date;
type Validator = (dateEncoded: string) => boolean;

export function useDateUrlParam<I extends any[] = any[]>(
    encode: Encoder,
    decode: Decoder,
    validator: Validator
) {
    const [date, setDate] = useState<Date>(() => {
        const dateEncoded = new URLSearchParams(window.location.search).get("date");
        return dateEncoded && validator(dateEncoded) ? decode(dateEncoded) : floorDateToDay(new Date());
    });

    function setDateUrlParam(dateDispatcher: SetStateAction<Date>) {
        setDate((oldDate) => {
            const newDate = typeof dateDispatcher === "function" ? dateDispatcher(oldDate) : dateDispatcher;

            const urlSearchParams = new URLSearchParams(window.location.search);
            urlSearchParams.set("date", encode(newDate));
            const newUrlSearchParams = window.location.pathname + "?" + urlSearchParams.toString();
            window.history.pushState(null, "", newUrlSearchParams);
            return newDate;
        });
    }

    return {
        date,
        setDate: setDateUrlParam,
    };
}
