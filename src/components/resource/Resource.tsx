import { useCallback, useContext, useEffect, useState } from "react";
import useApi from "../../hooks/api/useApi";
import authCtx from "../../store/auth/AuthContextProvider";
import styles from "./Resource.module.css";

interface UserData {
    img_path: string;
    username: string;
    name: string;
    surname: string;
    email: string;
    phone_number: string;
    group: {
        name: string
    }
}

const Resource = () => {
    const [data, setData] = useState<UserData | undefined>();
    const { request, setError } = useApi();
    const { globalLogOutDispatch } = useContext(authCtx);

    const fetchData = useCallback(async () => {
        try {
        const params = {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        };
        await request("/user/me", params, (result) => {
            setData(result);
        });
        } catch (error: any) {
        setError(error.message || error);
        }
    }, [request, setError]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
    <div className={styles.Resource}>
        <div className={styles.ResourceContainer}>
        <div className={styles.UserDataWrapper}>    
            <img className={styles.UserPhoto} src={data?.img_path} alt="User Image" />
            <div className={styles.UserData}>
                <div className={styles.UserDataHeaderWrapper}>
                    <div className={styles.Username}>{data?.username}</div>
                    <button onClick={()=>{}}>Edit</button>
                    <button onClick={globalLogOutDispatch}>Log Out</button>
                </div>
                <div className={styles.DataRow}>Full name: {data?.name} {data?.surname}</div>
                <div className={styles.DataRow}>Email: {data?.email}</div>
                <div className={styles.DataRow}>Phone: {data?.phone_number}</div>
                <div className={styles.DataRow}>Group: {data?.group.name}</div>
            </div>
        </div>
        
        </div>
    </div>
    );
};

export default Resource;