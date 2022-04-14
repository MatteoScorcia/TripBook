import { Dispatch, SetStateAction, useState } from "react";

type PatchStateAction<D> = Partial<D> | ((prevState: D) => Partial<D>);

export function usePatch<D>(
    initialState: D | (() => D)
): [D, Dispatch<SetStateAction<D>>, Dispatch<PatchStateAction<D>>] {
    const [state, setState] = useState<D>(initialState);

    function patchState(newState: PatchStateAction<D>) {
        setState((prevState) => {
            if (typeof newState === "function") {
                return { ...prevState, ...newState(prevState) };
            } else {
                return { ...prevState, ...newState };
            }
        });
    }

    return [state, setState, patchState];
}
