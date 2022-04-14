import { Secret, SignOptions } from "jsonwebtoken";

export type VehicleType = "car" | "bike" | "walk" | "train" | "plane";

export interface TripPathPointDto {
    lat: number;
    lng: number;
    nearestPlace?: string[] | undefined;
}

export interface UserDto {
    _id?: string;
    name: string;
    email: string;
    password: string;
}

export interface TripDto {
    _id?: string;
    date: Date;
    vehicle: VehicleType;
    paths: TripPathPointDto[];
    distance: number;
}

export interface InsightsDto {
    country?: string;
    count?: number;
    date?: string;
}

export interface JwtToSignDto {
    payload: string | Buffer | object;
    secretOrPrivateKey: Secret;
    options?: SignOptions;
}

export interface JwtDto {
    token: string;
    expiresIn: number;
}

export type ResponseApi<D> = { data?: D; error?: string };

export type SuccessResponseApi<D> = { data: D };
export type ErrorResponseApi<D> = { error: string };
