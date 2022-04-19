import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { UserDto } from "@aindo/dto";

export interface AuthState {
    user: Partial<UserDto> & Pick<UserDto, "name">;
    token: string;
    expiresIn: number;
}

export const AuthContext = createContext<{
    auth: AuthState | undefined;
    setAuth: Dispatch<SetStateAction<AuthState | undefined>>;
}>({} as any);

// >>

let _AUTH_TOKEN: string | undefined;
let _AUTH_FAILED_CALLBACK: () => void | undefined;

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (err: AxiosError) => {
        if (err?.response?.status === 403) {
            _AUTH_FAILED_CALLBACK && _AUTH_FAILED_CALLBACK();
        }
        return Promise.reject(err);
    }
);

axios.interceptors.request.use((response) => {
    if (_AUTH_TOKEN && response.headers && !response.headers["Authorization"]) {
        response.headers["Authorization"] = `Bearer ${_AUTH_TOKEN}`;
    }
    return response;
});

// <<

export const AuthProvider = (props: { children: ReactNode }) => {
    const [auth, setAuth] = useState<AuthState | undefined>(() => {
        const storedState = sessionStorage.getItem("authState");
        return storedState ? JSON.parse(storedState) : undefined;
    });

    // useEffect(()=> {
    // 	const reqIntercept = axios.interceptors.request.use(
    // 		response => {
    // 			if(response.headers && !response.headers['Authorization']) {
    // 				response.headers['Authorization'] = `Bearer ${auth}`
    // 			}
    // 			return response;
    // 		}
    // 	);
    //
    // 	const respIntercept = axios.interceptors.response.use(
    // 		response => {
    // 			return response;
    // 		},
    // 		async (err) => {
    // 			setAuth(undefined);
    // 			sessionStorage.clear()
    // 			return Promise.reject(err);
    // 		}
    // 	);
    //
    // 	return () => {
    // 		axios.interceptors.request.eject(reqIntercept);
    // 		axios.interceptors.response.eject(respIntercept);
    // 	}
    // }, [auth]);

    useEffect(() => {
        _AUTH_FAILED_CALLBACK = () => {
            setAuth(undefined);
            sessionStorage.clear();
        };
    }, []);

    _AUTH_TOKEN = auth?.token;

    useEffect(() => {
        if (auth) {
            const timer = setTimeout(_AUTH_FAILED_CALLBACK, auth.expiresIn * 1000);
            return () => clearTimeout(timer);
        }
    }, [auth]);

    return <AuthContext.Provider value={{ auth, setAuth }}>{props.children}</AuthContext.Provider>;
};
