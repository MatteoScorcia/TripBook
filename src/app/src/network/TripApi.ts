import {InsightsDto, SuccessResponseApi, TripDto} from "@aindo/dto";
import { dateCoalesce } from "../utils/dateUtils";
import axios from "axios";

const apiRootURL = "/api";

export class TripApi {
    static async getTrip(id: string): Promise<SuccessResponseApi<TripDto>> {
        return dateCoalesce((await axios.get(`${apiRootURL}/trip/${id}`)).data, "date");
    }

    static async getStatisticsByDay(fromDate: Date): Promise<SuccessResponseApi<InsightsDto[]>> {
        const toDate = new Date(fromDate);
        toDate.setDate(fromDate.getDate() + 1);
        return (
            await axios.get(
                `${apiRootURL}/insight/stagesByDate?fromDate=${fromDate.toISOString()}&toDate=${toDate.toISOString()}`
            )
        ).data;
    }

    static async getTripsCountInRange(
        fromDate: Date,
        toDate: Date,
        gmtOffset: string
    ): Promise<SuccessResponseApi<InsightsDto[]>> {
        return (
            await axios.get(
                `${apiRootURL}/insight/tripsCountByDate?fromDate=${fromDate.toISOString()}&toDate=${toDate.toISOString()}&gmtOffset=${gmtOffset}`
            )
        ).data;
    }

    static async getTripsByDate(date: Date): Promise<SuccessResponseApi<TripDto[]>> {
        return dateCoalesce((await axios.get(`${apiRootURL}/trip/?date=${date.toISOString()}`)).data, "date");
    }

    static async deleteTrip(id: string): Promise<SuccessResponseApi<TripDto>> {
        return axios.delete(`${apiRootURL}/trip/${id}`);
    }

    static async saveTrip(trip: TripDto): Promise<SuccessResponseApi<TripDto>> {
        return dateCoalesce((await axios.post(`${apiRootURL}/trip`, { trip: trip })).data, "date");
    }

    static async updateTrip(trip: TripDto): Promise<SuccessResponseApi<TripDto>> {
        return dateCoalesce((await axios.put(`${apiRootURL}/trip`, { trip: trip })).data, "date");
    }
}
