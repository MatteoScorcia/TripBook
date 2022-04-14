import React, {KeyboardEvent, useState} from "react";
import travelImg from "../img/travel.jpg";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Button} from "./common/Button";
import {useAuth} from "../customHooks/useAuth";
import warning from "../img/warning.png";
import {Modal} from "./common/Modal";
import {ReactComponent as Logo} from "../svg/logo.svg";

export default function PageAuth(props: { sign: "login" | "sign-up" }) {
    const { sign } = props;

    const [authError, setAuthError] = useState<[string, string] | undefined>();

    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as any)?.from?.pathname || "/";

    const [formData, setFormData] = useState({
        name: "",
        password: "",
        email: "",
    });

    const { login, signup } = useAuth();

    function handleChange(event: any) {
        const { name, value } = event.target;
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                [name]: value,
            };
        });
    }

    function handleSubmit() {
        if (sign === "login") {
            login(formData.name, formData.password)
                .then(() => {
                    navigate(from, { replace: true });
                })
                .catch((err) => {
                    setAuthError([err.message, err.response.data.error]);
                });
        } else {
            signup(formData.name, formData.password, formData.email)
                .then(() => {
                    navigate(from, { replace: true });
                })
                .catch((err) => {
                    setAuthError([err.message, err.response.data.error]);
                });
        }
    }

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>){
        if(event.key === "Enter") {
            handleSubmit()
        }
    }

    return (
        <div className="flex flex-row" onKeyDown={handleKeyDown}>
            <div className="w-1/2 flex justify-center items-center">
                <div className="bg-white p-4 flex flex-col items-center shadow-md rounded-md space-y-4">
                    <div className="flex justify-center">
                        <Logo />
                    </div>
                    <input
                        className="shadow appearance-none rounded-md w-full p-2 text-emphasis focus:outline-none focus:ring-2 ring-inset ring-secondary-normal"
                        type="text"
                        placeholder="Username"
                        onChange={handleChange}
                        name="name"
                        value={formData.name}
                    />
                    <input
                        className="shadow appearance-none rounded w-full p-2 focus:outline-none focus:ring-2 ring-inset ring-secondary-normal"
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                        name="password"
                        value={formData.password}
                    />
                    {sign === "sign-up" && (
                        <input
                            className="shadow appearance-none rounded w-full p-2 focus:outline-none focus:ring-2 ring-inset ring-secondary-normal"
                            type="email"
                            placeholder="Email"
                            onChange={handleChange}
                            name="email"
                            value={formData.email}
                        />
                    )}
                    <Button accent={false} onClick={handleSubmit}>
                        {sign === "login" ? "Login" : "Register"}
                    </Button>
                    {sign === "login" && (
                        <Link to={"/sign-up"} className="underline self-end">
                            Sign Up
                        </Link>
                    )}
                    {sign === "sign-up" && (
                        <Link to={"/login"} className="underline self-end">
                            Login
                        </Link>
                    )}
                </div>
            </div>
            <div
                className="bg-left bg-cover bg-no-repeat w-1/2 h-screen"
                style={{ backgroundImage: `url(${travelImg})` }}
            />

            {authError && (
                <Modal
                    show={true}
                    actionButtons={
                        <Button accent={true} onClick={() => setAuthError(undefined)}>
                            <span>Close</span>
                        </Button>
                    }
                >
                    <div className="flex justify-center">
                        <img src={warning} alt={"warning"} className="w-16 h-16" />
                    </div>
                    <div className="mt-4">
                        <div>{authError[0]}</div>
                        {authError[1] && <div className="text-medium">{authError[1]}</div>}
                    </div>
                </Modal>
            )}
        </div>
    );
}
