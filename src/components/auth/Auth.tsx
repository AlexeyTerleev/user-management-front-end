import { useEffect, useState, useContext, FormEventHandler } from "react";

// Project dependencies
import useApi from "../../hooks/api/useApi";
import AuthContext from "../../store/auth/AuthContextProvider";
import { validatePasswordLength, validateEmailFormat } from "./validations";
import { AuthData } from "../../hooks/api/apiData";
import { useLocation } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const Auth = () => {
  const [authData, setAuthData] = useState<AuthData>();
  const { request, setError } = useApi();
  const { globalLogInDispatch } = useContext(AuthContext);
  const location = useLocation();
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

  const authHandler: FormEventHandler<HTMLFormElement> = async (event) => {
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

  return (
    <>
      <h2>{isLogin ? 'Log In' : 'Sign Up'}</h2>
      {
        isLogin
          ? <LoginForm onSubmit={authHandler} />
          : <RegisterForm onSubmit={authHandler} />
      }
    </>
  );
};

export default Auth;