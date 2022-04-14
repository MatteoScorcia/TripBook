import { useEffect } from "react";
import { usePatch } from "./usePatch";
import { SuccessResponseApi } from "@aindo/dto";

interface UseGetHookState<D> {
    isLoading: boolean;
    error: [string, string] | undefined;
    dto: D | undefined;
}

type AxiosFetcher<D, I extends any[] = any[]> = (...input: I) => Promise<SuccessResponseApi<D>>;

export function useGet<D, I extends any[] = any[]>(fetcher: AxiosFetcher<D, I>, ...input: I) {
    const [state, setState, patchState] = usePatch<UseGetHookState<D>>({
        isLoading: false,
        error: undefined,
        dto: undefined,
    });

    useEffect(() => {
        patchState({ error: undefined, isLoading: true });

        fetcher(...input)
            .then((response) => {
                patchState({ dto: response.data, isLoading: false });
                return response.data;
            })
            .catch((err) => {
                const errorMessage = [err?.message, err?.response?.data?.error] as [string, string];
                patchState({ error: errorMessage, isLoading: false });
                return Promise.reject(err);
            });
    }, input);

    return {
        ...state,
        setDto: (dto: D) => setState({ isLoading: false, error: undefined, dto }),
        resetError: () =>
            patchState({
                error: undefined,
            }),
    };
}
