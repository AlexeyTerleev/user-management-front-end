import { useCallback, useContext, useEffect, useState } from "react";
import authCtx from "../../store/auth/AuthContextProvider";
import { UserData } from "./UserData";
import styles from "./Resource.module.css";

interface props {
    user: UserData | undefined;
    setPageState: React.Dispatch<React.SetStateAction<string>>;
}

const InfoGet: React.FC<props> = ({user, setPageState}) => {
    const { globalLogOutDispatch } = useContext(authCtx);

    return (
        <>
            <img className={styles.UserPhoto} src={user?.img_path} alt="User Image" />
            <div className={styles.UserData}>
                <div className={styles.UserDataHeaderWrapper}>
                    <div className={styles.Username}>{user?.username}</div>
                    <button className={styles.DiscardButton} onClick={()=>setPageState("patch")}>Edit</button>
                    <button className={styles.DiscardButton} onClick={globalLogOutDispatch}>Log Out</button>
                </div>
                <div className={styles.DataRow}>Full name: {user?.name} {user?.surname}</div>
                <div className={styles.DataRow}>Email: {user?.email}</div>
                <div className={styles.DataRow}>Phone: {user?.phone_number}</div>
                <div className={styles.DataRow}>Group: {user?.group.name}</div>
            </div>
        </>
    );
};

export default InfoGet;