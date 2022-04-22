import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { AuthApi } from "../network/AuthApi";
import { useMutation } from "react-query";
import { JwtDto, SuccessResponseApi, UserDto } from "@aindo/dto";
import { AxiosError } from "axios";

export function useAuth() {
    const context = useContext(AuthContext);
    const [authError, setAuthError] = useState<AxiosError | undefined>(undefined);

    const { mutateAsync: signup, isLoading: isSignupLoading } = useMutation<
        SuccessResponseApi<JwtDto>,
        AxiosError,
        Omit<UserDto, "_id">
    >(async (user) => AuthApi.signUp(user), {
        onSuccess: (response, variables) => {
            context.setAuth({
                user: { name: variables.name },
                token: response.data.token,
                expiresIn: response.data.expiresIn,
            });
            sessionStorage.setItem(
                "authState",
                JSON.stringify({
                    user: { name: variables.name },
                    token: response.data.token,
                    expiresIn: response.data.expiresIn,
                })
            );
        },
        onError: (signupError) => {
            setAuthError(signupError);
        },
    });

    const { mutateAsync: login, isLoading: isLoginLoading } = useMutation<
        SuccessResponseApi<JwtDto>,
        AxiosError,
        Omit<UserDto, "email">
    >(async (user) => AuthApi.login(user), {
        onSuccess: (response, variables) => {
            context.setAuth({
                user: { name: variables.name },
                token: response.data.token,
                expiresIn: response.data.expiresIn,
            });
            sessionStorage.setItem(
                "authState",
                JSON.stringify({
                    user: { name: variables.name },
                    token: response.data.token,
                    expiresIn: response.data.expiresIn,
                })
            );
        },
        onError: (loginError) => {
            setAuthError(loginError);
        },
    });

    const logout = () => {
        context.setAuth(undefined);
        sessionStorage.clear();
    };

    return {
        isAuthenticated: !!context?.auth?.token,
        user: context?.auth?.user,
        isSignupLoading,
        signup,
        isLoginLoading,
        login,
        authError,
        logout,
    };
}
