import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageAuth from "./components/PageAuth";
import PageTrip from "./components/PageTrip";
import PageHome from "./components/PageHome";
import { AuthProvider } from "./context/AuthProvider";
import { RequireAuth } from "./components/common/RequireAuth";

ReactDOM.render(
    <React.StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />}>

                        <Route element={<RequireAuth/>}>
                            <Route path="" element={<PageHome />} />
                            <Route path="trip/:id" element={<PageTrip />} />
                        </Route>

                        <Route path="login" element={<PageAuth sign={"login"} />} />
                        <Route path="sign-up" element={<PageAuth sign={"sign-up"} />} />
                    </Route>
                    <Route
                        path="*"
                        element={
                            <main style={{ padding: "1rem" }}>
                                <p>There's nothing here!</p>
                            </main>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
