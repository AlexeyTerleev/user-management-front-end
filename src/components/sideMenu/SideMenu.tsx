import { useCallback, useContext, useEffect, useState } from "react";
import useApi from "../../hooks/api/useApi";
import { UserData } from "../../types/UserTypes"
import styles from "./SideMenu.module.css";

interface SideMenuProps {
    role: string | undefined,
}

const SideMenu: React.FC<SideMenuProps> = ({role}) => {
    return (
    <div className={styles.SidePanelWrapper}>
        <ul className={styles.SidePanel}>
            <li>Me</li>
            { 
            role === "ADMIN" && 
            <li>Users</li> 
            }
            { 
            role === "MODERATOR" && 
            <li>Group</li> 
            }
            <li>Log Out</li>
        </ul>
    </div>
    );
};

export default SideMenu;