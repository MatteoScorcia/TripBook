import { useEffect } from "react";
import { usePatch } from "./usePatch";
import { ResponseApi } from "@aindo/dto";

interface UseEditHookState<D> {
    isLoading: boolean;
    isSaving: boolean;
    isDirty: boolean;
    error: [string, string] | undefined;
    dto: D | undefined;
    rollBackDto: D | undefined;
}

/* useEdit
1. getData
	1.1 axios fetch / create new date
2. keepData
	2.1 keep data in a state
	2.2 function resetState
	2.3 track if dirty
3. saveData
	3.1 if dirty, save / update

	input<D,I>: function(fetcher<D,I>, saver<D,I>, ...input: I)

return {state, resetState, isDirty, setState, patchState, doSave, doFetch}
*/

type UseEditFetcher<D, I extends any[] = any[]> = (...input: I) => Promise<ResponseApi<D>>;
type UseEditSaver<D> = (input: D) => Promise<ResponseApi<D>>;

export function useEdit<D, I extends any[] = any[]>(
    fetcher: UseEditFetcher<D, I>,
    saver: UseEditSaver<D>,
    ...input: I
) {
    const [state, setState, patchState] = usePatch<UseEditHookState<D>>({
        isLoading: false,
        isSaving: false,
        isDirty: false,
        error: undefined,
        dto: undefined,
        rollBackDto: undefined,
    });

    useEffect(() => {
        fetch();
    }, input);

    function fetch() {
        patchState({ error: undefined, isLoading: true });
        fetcher(...input)
            .then((response) => {
                patchState({
                    isLoading: false,
                    isDirty: false,
                    dto: response.data,
                    rollBackDto: response.data,
                });
            })
            .catch((err) => {
                const errorMessage = [err.message, err.response.data.error] as [string, string];
                patchState({ error: errorMessage, isLoading: false });
            });
    }

    function save() {
        patchState({ error: undefined, isLoading: true, isSaving: true });
        saver(state.dto!)
            .then((response) =>
                patchState({
                    isLoading: false,
                    isSaving: false,
                    isDirty: false,
                    dto: response.data,
                    rollBackDto: response.data,
                })
            )
            .catch((err) => {
                const errorMessage = [err.message, err.response.data.error] as [string, string];
                patchState({ error: errorMessage, isLoading: false, isSaving: false });
            });
    }

    return {
        ...state,
        setDto: (dto: D) => patchState({ dto, isDirty: true }),
        resetState: () =>
            patchState({
                isDirty: false,
                error: undefined,
                dto: state.rollBackDto,
            }),
        patchDto: (partialDto: Partial<D>) =>
            patchState((prevState) => {
                if (!prevState.dto) {
                    throw new Error(`Impossible to patch DTO before loading`);
                } else {
                    return {
                        dto: { ...prevState.dto, ...partialDto },
                        isDirty: true,
                    };
                }
            }),
        fetch,
        save,
    };
}
