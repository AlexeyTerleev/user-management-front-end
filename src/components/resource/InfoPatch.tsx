import { useCallback, useContext, useEffect, useState, ChangeEvent } from "react";
import authCtx from "../../store/auth/AuthContextProvider";
import UserData from "./UserData";
import styles from "./Resource.module.css";

interface props {
    user: UserData | undefined;
    setPageState: React.Dispatch<React.SetStateAction<string>>;
}

const InfoPatch: React.FC<props> = ({user, setPageState}) => {

    const [editedUser, setEditedUser] = useState<UserData | undefined>(user);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log(name);
        console.log(value);
    
        if (name === "name") {
            const [first_name, ...rest] = value.trim().split(/\s+/);
            const second_name = rest.join(" ");
            
            setEditedUser((prevUser) => ({
                ...(prevUser as UserData || user),
                ["name"]: first_name || "",
                ["surname"]: second_name || "",
            }));
        } else {
            setEditedUser((prevUser) => ({
                ...(prevUser as UserData || user),
                [name]: value,
            }));
        }
    };

    const handleConfirm = () => {
        setPageState("get");
    };

    const handleDiscard = () => {
        setPageState("get");
    };

    return (
        <>
            <img className={styles.UserPhoto} src={user?.img_path} alt="User Image" />
            <div className={styles.UserData}>
                <div className={styles.Input}>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={editedUser?.username || ''}
                    onChange={handleChange}
                />
                </div>
                <div className={styles.Input}>
                <label htmlFor="name">Full name</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={editedUser?.name + " " + editedUser?.surname || ''}
                    onChange={handleChange}
                />
                </div>
                <div className={styles.Input}>
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="text"
                    required
                    value={editedUser?.email}
                    onChange={handleChange}
                />
                </div>
                <div className={styles.Input}>
                <label htmlFor="phone">Phone</label>
                <input
                    id="phone"
                    name="phone"
                    type="text"
                    required
                    value={editedUser?.phone_number}
                    onChange={handleChange}
                />
                </div>
                <div className={styles.Input}>
                <label htmlFor="group">Group</label>
                <input
                    id="group"
                    name="group"
                    type="text"
                    required
                    value={editedUser?.group.name}
                    onChange={handleChange}
                />
                </div>
                <div className={styles.ButtonsCont}>
                    <button className={styles.ConfirmButton} onClick={()=>handleConfirm()}>Confirm</button>
                    <button className={styles.DiscardButton} onClick={()=>handleDiscard()}>Discard</button>
                </div>
            </div>
        </>
    );
};

export default InfoPatch;