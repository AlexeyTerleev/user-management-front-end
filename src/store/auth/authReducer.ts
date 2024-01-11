import { Reducer } from "react";
import { AuthAction } from "./authActions";

export interface AuthState {
    isLoggedIn: boolean;
    accessToken?: string;
    refreshToken?: string;
};

export const defaultAuthState: AuthState = {
    isLoggedIn: false,
};

const authReducer: Reducer<AuthState, AuthAction> = (state, action) => {
    // user successfully authenticated
    if (action.type === "LOG_IN") {
        localStorage.setItem("tokenPair", JSON.stringify(action.payload));
        return {
            ...state,
            isLoggedIn: true,
            accessToken: action.payload.accessToken,
            refreshToken: action.payload.refreshToken
        };
    }

    // log out user
    if (action.type === "LOG_OUT") {
        localStorage.removeItem("tokenPair");
        return defaultAuthState;
    }

    return defaultAuthState;
};

export default authReducer;