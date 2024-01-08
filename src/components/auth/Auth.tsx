import { useEffect, useState, useContext, FormEventHandler } from "react";

// Project dependencies
import useApi from "../../hooks/api/useApi";
import AuthContext from "../../store/auth/AuthContextProvider";
import { validatePasswordLength, validateEmailFormat, validateGroupFormat, validateNameFormat, validatePhoneFormat, validateUsernameFormat } from "./validations";
import { AuthData } from "../../hooks/api/apiData";
import { useLocation, useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const Auth = () => {
  const [authData, setAuthData] = useState<AuthData>();
  const { request, setError } = useApi();
  const { globalLogInDispatch } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPathArray = location.pathname.split('/');
  const isLogin = currentPathArray[currentPathArray.length - 1] === 'login';

  useEffect(() => {
    if (authData && "access_token" in authData) {
      globalLogInDispatch({
        accessToken: authData.access_token,
        refreshToken: authData.refresh_token,
      });
    }
  }, [authData, globalLogInDispatch]);

  const loginHandler: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userEmail = data.get("email");
    const userPassword = data.get("password");
    try {
      if (
        !validateEmailFormat(userEmail?.toString() || "") ||
        !validatePasswordLength(userPassword?.toString() || "")
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
        data: new URLSearchParams({
          username: userEmail,
          password: userPassword,
        }),
      };
      await request(endpoint, params, setAuthData);
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
    <>
      <h2>{isLogin ? 'Log In' : 'Sign Up'}</h2>
      {
        isLogin
          ? <LoginForm onSubmit={loginHandler} />
          : <RegisterForm onSubmit={registerHandler} />
      }
    </>
  );
};

export default Auth;