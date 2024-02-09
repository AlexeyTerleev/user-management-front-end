
import { useLocation } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import styles from "./Auth.module.css"

const Auth = () => {

  const location = useLocation();
  const currentPathArray = location.pathname.split('/');
  const isLogin = currentPathArray[currentPathArray.length - 1] === 'login';
  
  return (
    <div className={styles.FormContainier}>
      <div className={styles.FormWrapper}>
        <h2 className={styles.Title}>{isLogin ? 'Log In' : 'Sign Up'}</h2>
        {
          isLogin
            ? <LoginForm />
            : <RegisterForm />
        }
      </div>
    </div>
  );
};

export default Auth;