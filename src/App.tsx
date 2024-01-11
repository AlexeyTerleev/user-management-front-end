import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import AuthContext from "./store/auth/AuthContextProvider";
import { useContext } from "react";
import Resource from "./components/resource/Resource";
import Auth from "./components/auth/Auth";
import styles from "./App.module.css"

function App() {
    const { authState } = useContext(AuthContext);
    const location = useLocation();

    return (
        <div className={styles.App}>
            <Routes>
                <Route path="/" element={<Navigate to={authState.isLoggedIn ? location.pathname : "/auth/login"}/>}/>

                {!authState.isLoggedIn && (
                <Route path="auth">
                    <Route path="register" element={<Auth />} />
                    <Route path="login" element={<Auth />} />
                    <Route path="*" element={<Navigate to={"login"}/>} />
                    <Route index element={<Navigate to={"login"} />} />
                </Route>
                )}

                {authState.isLoggedIn && (
                <Route path="resource" element={<Resource />} />
                )}
                <Route path="*" element={<Navigate to={authState.isLoggedIn ? "resource" : "/auth/login"}/>} />
            </Routes>
        </div>
    );
}

export default App;