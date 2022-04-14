export function floorDateToDay(date: Date) {
    date.setHours(0, 0, 0, 0);
    return date;
}

export function toLocalDate(date: Date | string, locales: string | undefined = undefined): string {
    const parseDate = new Date(date);
    return parseDate.toLocaleDateString(locales);
}

export function getLocalGMTOffset() {
    return new Date()
        .toString()
        .split(" ")
        .filter((s) => s.includes("GMT"))[0]
        .slice(3);
}

export function getActiveStartDateFromDate(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getLastDayInMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

export function getNumberOfDaysInMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function dateEncoder(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`; //yyyy-[mm/m]-[dd/d]
}

export function dateDecoder(dateString: string): Date {
    const res = dateString.split("-");
    return new Date(Number(res[0]), Number(res[1]) - 1, Number(res[2]));
}
export function validateDateEncoded(dateEncoded: string) {
    const reg = new RegExp("^\\d{4}-\\d{1,2}-\\d{1,2}$"); //yyyy-[mm/m]-[dd/d]
    return reg.test(dateEncoded);
}

//needed to return dto object with date field as date and not just a string
export function dateCoalesce<T>(object: T, ...keys: (keyof T)[]): T {
    for (const [key, value] of Object.entries(object)) {
        if (typeof value === "object") {
            dateCoalesce(value, ...keys);
        }
    }
    for (const k of keys) {
        if (object[k] && !(object[k] instanceof Date)) {
            object[k] = new Date(object[k] as any) as any;
        }
    }
    return object;
}
