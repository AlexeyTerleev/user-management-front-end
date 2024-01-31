import { useCallback, useContext, useEffect, useState } from "react";
import useApi from "../../hooks/api/useApi";
import UserData from "./UserData.ts"
import InfoGet from "./InfoGet.tsx";
import InfoPatch from "./InfoPatch.tsx";
import styles from "./Resource.module.css";

const Resource = () => {
    const [data, setData] = useState<UserData | undefined>();
    const [pageState, setPageState] = useState<string>("get");
    const { request, setError } = useApi();
    
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
                {
                    pageState == "get"
                        ? <InfoGet user={data} setPageState={setPageState} /> 
                        : <InfoPatch user={data} setPageState={setPageState} />
                }
            </div>
        </div>
    </div>
    );
};

export default Resource;