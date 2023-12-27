import React, { useContext } from "react";
import {Routes, Route, Navigate, Outlet} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";

type Props = {};

const PrivateRoutes = () => {
    const { authenticated } = useContext(AuthContext);
    console.log(authenticated)
    if (!authenticated) return <Navigate to="/login" replace />
    return <Outlet />
}

const Router = (props: Props) => {
    return (
        <Routes>
            <Route path="/login" element={<Login />}/>
            <Route element={<PrivateRoutes />}>
                <Route path="/" element={<Home />} />
            </Route>
        </Routes>
    )
}

export default Router