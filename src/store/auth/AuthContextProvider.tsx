import React, {
createContext,
useReducer,
useCallback,
useEffect,
} from "react";
import { useNavigate } from "react-router-dom";

import { AuthActionEnum } from "./authActions";
import authReducer, { AuthState, defaultAuthState } from "./authReducer";

type AuthProviderProps = {
    children: React.ReactElement;
};

export type UserData = {
    accessToken: string,
    refreshToken: string,
};

export interface AuthContext {
    authState: AuthState;
    globalLogInDispatch: (props: UserData) => void;
    globalLogOutDispatch: () => void;
}


const authCtx = createContext<AuthContext>({
    authState: defaultAuthState,
    globalLogInDispatch: () => {},
    globalLogOutDispatch: () => {},
});

export const AuthContextProvider = (props: AuthProviderProps) => {
    const { children } = props;

    const [authState, authDispatch] = useReducer(authReducer, defaultAuthState);
    const navigate = useNavigate();

    // Check if user detail is persisted, mostly catering for refreshing of the browser
    useEffect(() => {
        const tokenPair = localStorage.getItem("tokenPair");
        if (tokenPair) {
            const userData: UserData = JSON.parse(tokenPair);
            authDispatch({ type: AuthActionEnum.LOG_IN, payload: userData });
        }
    }, []);

    const globalLogInDispatch = useCallback((props: UserData) => {
        const { accessToken, refreshToken } = props;
        authDispatch({
            type: AuthActionEnum.LOG_IN,
            payload: {
                accessToken,
                refreshToken,
            },
        });
        navigate("/resource");
    }, [navigate]);

    const globalLogOutDispatch = useCallback(() => {
        authDispatch({ type: AuthActionEnum.LOG_OUT, payload: null });
        navigate("/auth/login");
    }, [navigate]);

    // context values to be passed down to children
    const ctx = {
        authState,
        globalLogInDispatch,
        globalLogOutDispatch,
    };

    return <authCtx.Provider value={ctx}>{children}</authCtx.Provider>;
};

export default authCtx;