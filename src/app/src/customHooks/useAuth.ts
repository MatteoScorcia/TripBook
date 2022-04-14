import {useContext} from "react";
import {AuthContext} from "../context/AuthProvider";
import {AuthApi} from "../network/AuthApi";

export function useAuth() {
    const context = useContext(AuthContext);

    const signup = async (name: string, password: string, email: string) => {
        return AuthApi.signUp({ name, password, email })
            .then((res) => {
            context.setAuth({
                user: { name },
                token: res.data!.token,
                expiresIn: res.data!.expiresIn,
            });
            sessionStorage.setItem(
                "authState",
                JSON.stringify({
                    user: { name },
                    token: res.data!.token,
                    expiresIn: res.data!.expiresIn,
                })
            );
        });
    };

    const login = async (name: string, password: string) => {
        return AuthApi.login({ name, password })
            .then((res) => {
            context.setAuth({
                user: { name },
                token: res.data!.token,
                expiresIn: res.data!.expiresIn,
            });
            sessionStorage.setItem(
                "authState",
                JSON.stringify({
                    user: { name },
                    token: res.data!.token,
                    expiresIn: res.data!.expiresIn,
                })
            );
        });
    };

    const logout = () => {
        context.setAuth(undefined);
        sessionStorage.clear();
    };

    return {
        isAuthenticated: !!context?.auth?.token,
        user: context?.auth?.user,
        signup,
        login,
        logout,
    };
}
