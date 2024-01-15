import { useEffect, useState, useContext, FormEventHandler } from "react";

// Project dependencies
import useApi from "../../hooks/api/useApi";
import AuthContext from "../../store/auth/AuthContextProvider";
import { validatePasswordLength, validateEmailFormat, validateGroupFormat, validateNameFormat, validatePhoneFormat, validateUsernameFormat } from "./validations";
import { AuthData } from "../../hooks/api/apiData";
import { useLocation, useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import styles from "./Auth.module.css"

const Auth = () => {
  const [authData, setAuthData] = useState<AuthData>();
  const { request, error, setError } = useApi();
  const { globalLogInDispatch } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPathArray = location.pathname.split('/');
  const isLogin = currentPathArray[currentPathArray.length - 1] === 'login';

  const [wrongUsername, setWrongUsername] = useState(false);
  const [wrongPassord, setWrongPassword] = useState(false);

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
        return null;
      const reUsername = /^User with (?:\{(?:username|email|phone)\}) \[(?:\{(?:[a-zA-Z0-9_]+)\})\] not found$/;
      const rePassword = /^Incorrect password$/;
      if (reUsername.test(error.response.message))
        setWrongUsername(true);
      else if (rePassword.test(error.response.message))
        setWrongPassword(true);
    }
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      if (
        (
          !validatePhoneFormat(data.get("username")?.toString() || "") &&
          !validateEmailFormat(data.get("username")?.toString() || "") && 
          !validateUsernameFormat(data.get("username")?.toString() || "")
        ) ||
        !validatePasswordLength(data.get("password")?.toString() || "")
      ) {
        throw new Error("Incorrect credential format!");
      }
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

  const registerHandler: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const userFullName = data.get("name");
    const userUsername = data.get("username");
    const userPhone = data.get("phone");
    const userEmail = data.get("email");
    const userGroup = data.get("group");
    const userPassword = data.get("password");
    const userRole = "USER";

    try {
      if (!validateNameFormat(userFullName?.toString() || "")){
        console.log("validateNameFormat");
        throw new Error("Incorrect credential format!");
      }
      if (!validateUsernameFormat(userUsername?.toString() || "") ){
        console.log("validateUsernameFormat");
        throw new Error("Incorrect credential format!");
      }
      if (!validatePhoneFormat(userPhone?.toString() || "") ){
        console.log("validatePhoneFormat");
        throw new Error("Incorrect credential format!");
      }
      if (!validateEmailFormat(userEmail?.toString() || "") ){
        console.log("validateEmailFormat");
        throw new Error("Incorrect credential format!");
      }
      if (!validateGroupFormat(userGroup?.toString() || "") ){
        console.log("validateGroupFormat");
        throw new Error("Incorrect credential format!");
      }
      if (!validatePasswordLength(userPassword?.toString() || "") ){
        console.log("validatePasswordLength");
        throw new Error("Incorrect credential format!");
      }

      const endpoint = "/auth/singup";
      const params = {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        data: {
          name: userFullName?.toString().split(' ')[0],
          surname: userFullName?.toString().split(' ')[1],
          username: userUsername,
          phone_number: userPhone,
          email: userEmail,
          role: userRole,
          password: userPassword,
          group_name: userGroup,
        },
      };
      await request(endpoint, params, () => {navigate("/login")});
    } catch (error: any) {
      console.log(error)
      setError(error.message || error);
    }
  };

  return (
    <div className={styles.FormContainier}>
      <div className={styles.FormWrapper}>
        <h2 className={styles.Title}>{isLogin ? 'Log In' : 'Sign Up'}</h2>
        {
          isLogin
            ? <LoginForm onSubmit={loginHandler} />
            : <RegisterForm onSubmit={registerHandler} />
        }
      </div>
    </div>
  );
};

export default Auth;