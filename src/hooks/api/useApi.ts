import { useState, useCallback, useContext } from "react";
import axios from 'axios';
import AuthContext from "../../store/auth/AuthContextProvider";

const BASE_URL = "http://localhost:8000";

const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { authState, globalLogInDispatch, globalLogOutDispatch } = useContext(AuthContext);

    const request = useCallback(
        async (
            endpoint: string,
            params: { [key: string]: any },
            handleSuccessResponse: (data: any) => void,
            handleErrorResponse?: (error: Error) => void
        ) => {
            setLoading(true);
            setError(null);
            const headers = params.headers || {};
            if (authState.isLoggedIn) {
                headers['Authorization'] = 'Bearer ' + authState.accessToken;
            }
            let requestData = {
                method: params.method || 'GET',
                url: BASE_URL + endpoint,
                headers: headers,
                data: params.data,
            }
            try {
                const headers = params.headers || {};
                if (authState.isLoggedIn) {
                    headers['Authorization'] = 'Bearer ' + authState.accessToken;
                }
                
                const response = await axios(requestData);
                handleSuccessResponse && (await handleSuccessResponse(response.data));
            } catch (error: any) {
                const status = error.response.status;

                if (status == 401) {
                    try {
                        await handleRefresh();
                    } catch (refreshError) {
                        globalLogOutDispatch();
                    }
                }
                else if (status == 403) {
                    globalLogOutDispatch();
                }

                if (handleErrorResponse) {
                    handleErrorResponse(error.message || error.response?.data || error);
                } else {
                    setError(error.message || error.response?.data || error);
                }
            }

            setLoading(false);
        },
        [authState.isLoggedIn, authState.accessToken, globalLogOutDispatch]
    );

    const handleRefresh = async () => {
        try {
            const refreshResponse = await axios({
                method: 'POST',
                url: BASE_URL + '/auth/refresh-token',
                data: {"refresh_token": authState.refreshToken}
            });

            const newTokenPair = refreshResponse.data;
            console.log(newTokenPair);
            await globalLogInDispatch({
                accessToken: newTokenPair.access_token,
                refreshToken: newTokenPair.refresh_token,
            });
            console.log(authState)
            
        } catch (refreshError) {
            throw refreshError;
        };
    };

    return {
        loading: loading,
        error: error,
        request: request,
        setError: setError,
    };
};


export default useApi;