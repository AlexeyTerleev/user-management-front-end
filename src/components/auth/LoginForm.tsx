import { FormEventHandler, useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";

import useApi from "../../hooks/api/useApi";
import AuthContext from "../../store/auth/AuthContextProvider";
import { AuthData } from "../../hooks/api/apiData";
import { 
    validatePasswordLength, 
    validateEmailFormat, 
    validatePhoneFormat, 
    validateUsernameFormat, 
} from "./validations";
import styles from "./Auth.module.css";


const LoginForm = () => {
    const { request, setError } = useApi();
    const [authData, setAuthData] = useState<AuthData>();
    const { globalLogInDispatch } = useContext(AuthContext);

    const [wrongUsername, setWrongUsername] = useState(false);
    const [wrongPassord, setWrongPassword] = useState(false);
    const [showBadRequestAlert, setShowBadRequestAlert] = useState(false);
    const [showWrongFormatAlert, setShowWrongFormatAlert] = useState(false);
    

    useEffect(() => {
        if (authData && "access_token" in authData) {
          globalLogInDispatch({
            accessToken: authData.access_token,
            refreshToken: authData.refresh_token,
          });
        }
    }, [authData, globalLogInDispatch]);

    const loginHandler: FormEventHandler<HTMLFormElement> = async (event) => {
        const handleErrorResponse = (error: any) => {
            
            if (error.response.status != 400)
                return;
            const reUsername = /^User with (?:username|email|phone) \[[a-zA-Z0-9_]+\] not found$/;
            const rePassword = /^Incorrect password$/;
            if (reUsername.test(error.response.data.detail) || rePassword.test(error.response.data.detail)) {
                setWrongUsername(true);
                setWrongPassword(true);
                setShowBadRequestAlert(true);
            }
        }
        
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (!await validateInput(data))
            return;

        try {
            
            const endpoint = "/auth/login";
            const params = {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                data: {
                    username: data.get("username"),
                    password: data.get("password"),
                },
            };
            await request(endpoint, params, setAuthData, handleErrorResponse);
        } catch (error: any) {
            setError(error.message || error);
        }
    };

    const validateInput = async (data: FormData): Promise<boolean> => {
        let result = true;      
        if (
            !validatePhoneFormat(data.get("username")?.toString() || "") &&
            !validateEmailFormat(data.get("username")?.toString() || "") && 
            !validateUsernameFormat(data.get("username")?.toString() || "")
        ) {
            setWrongUsername(true);
            setWrongPassword(true);
            result = false;
        }
        if (
            !validatePasswordLength(data.get("password")?.toString() || "")
        ) {
            setWrongPassword(true);
            result = false;
        }
        if (! result ){
            setShowWrongFormatAlert(true);
        }
        return result;
    };

    return (
        <>
            {showBadRequestAlert && (
                <div className={styles.Alert}>
                    {(wrongUsername || wrongPassord) && <p>Wrong login or password</p>}
                </div>
            )}
            {showWrongFormatAlert && (
                <div className={styles.Alert}>
                    <p>It seems like some field in incorrect form</p>
                </div>
            )}
            <form onSubmit={loginHandler} className={styles.Form}>
                <div className={`${styles.Input} ${wrongUsername && styles.WrongInput}`}>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        placeholder="Type your username or email"
                        onChange={()=>{setWrongUsername(false); setWrongPassword(false)}}
                    />
                </div>
                <div className={`${styles.Input} ${wrongPassord && styles.WrongInput}`}>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder="Type your password"
                    />
                </div>
                <button type="submit">Submit</button>
                <Link className={styles.Link} to={"/auth/register"}>
                    Sign up
                </Link>
            </form>
        </>
    );
};

export default LoginForm;