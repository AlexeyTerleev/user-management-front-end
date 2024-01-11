import { FormEventHandler } from "react";
import { Link } from "react-router-dom";
import styles from "./Auth.module.css";

type Props = {
  onSubmit: FormEventHandler<HTMLFormElement>;
};

const RegisterForm = (props: Props) => {
  const { onSubmit } = props;
  return (
    <form onSubmit={onSubmit} className={styles.Form}>
      <div className={styles.Input}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Full Name"
        />
      </div>
      <div className={styles.Input}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          required
          placeholder="Username"
        />
      </div>
      <div className={styles.Input}>
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          name="phone"
          type="text"
          required
          placeholder="Phone number"
        />
      </div>
      <div className={styles.Input}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="Email Address"
        />
      </div>
      <div className={styles.Input}>
        <label htmlFor="group">Group</label>
        <input
          id="group"
          name="group"
          type="text"
          required
          placeholder="Group name"
        />
      </div>
      <div className={styles.Input}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="Password"
        />
      </div>
      <button type="submit">Submit</button>
      <Link className={styles.Link} to={"/auth/login"}>
        Sign in
      </Link>
    </form>
  );
};

export default RegisterForm;