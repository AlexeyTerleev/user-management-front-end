import { FormEventHandler } from "react";
import { Link } from "react-router-dom";
import styles from "./Auth.module.css";

type Props = {
  onSubmit: FormEventHandler<HTMLFormElement>;
};

const LoginForm = (props: Props) => {
    const { onSubmit } = props;
    return (
        <form onSubmit={onSubmit} className={styles.Form}>
            <div className={styles.Input}>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    placeholder="Type your username or email"
                />
            </div>
            <div className={styles.Input}>
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
    );
};

export default LoginForm;