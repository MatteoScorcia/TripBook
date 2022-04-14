import React from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../../svg/logo.svg";
import classNames from "classnames";
import { useAuth } from "../../customHooks/useAuth";
import { Button } from "./Button";

export default function Navbar(props: { children?: React.ReactNode; className?: string }) {
    const { children, className } = props;
    const navigate = useNavigate();
    const { logout } = useAuth();

    const navClass = classNames("flex flex-col h-full w-96 flex-none bg-white space-y-4 p-4", className);

    return (
        <nav className={navClass}>
            <div className="flex justify-center">
                <Logo
                    className={"cursor-pointer"}
                    onClick={() => {
                        navigate("/");
                    }}
                />
            </div>
            {children}
            <div className="flex-grow flex-shrink" style={{ marginTop: "0" }} />
            <div className="flex justify-center">
                <Button
                    onClick={() => {
                        logout();
                        navigate("/login");
                    }}
                    accent={false}
                >
                    Logout
                </Button>
            </div>
        </nav>
    );
}
