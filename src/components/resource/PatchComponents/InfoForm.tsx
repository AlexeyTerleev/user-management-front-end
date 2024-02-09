import { FormEventHandler, ChangeEvent } from "react";

import { UserData } from "../../../types/UserTypes";
import styles from "../Resource.module.css";

interface props {
    editedUser: UserData | undefined,
    setEditedUser: React.Dispatch<React.SetStateAction<UserData | undefined>>,
    handleSubmit: FormEventHandler<HTMLFormElement>,
    handleDiscard: () => void,
    wrongName: boolean,
    wrongUsername: boolean,
    wrongPhone: boolean,
    wrongEmail: boolean,
    wrongGroup: boolean,
}

const InfoForm: React.FC<props> = (
    {
        editedUser, 
        setEditedUser, 
        handleSubmit, 
        handleDiscard,
        wrongName,
        wrongUsername,
        wrongPhone,
        wrongEmail,
        wrongGroup,
    }
) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "name") {
            const fullName =  value.split(" ")
            if (value.endsWith(" ") && !fullName[1]) {
                fullName[0] = fullName[0] + " ";
            }
            setEditedUser((prevUser) => ({
                ...(prevUser as UserData),
                ["name"]: fullName[0] || "",
                ["surname"]: fullName[1] || "",
            }));
        } else {
            setEditedUser((prevUser) => ({
                ...(prevUser as UserData),
                [name]: value,
            }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.UserData}>
            <div className={`${styles.Input} ${wrongUsername && styles.WrongInput}`}>
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
            <div className={`${styles.Input} ${wrongName && styles.WrongInput}`}>
            <label htmlFor="name">Full name</label>
            <input
                id="name"
                name="name"
                type="text"
                required
                value={(editedUser?.name || "") + ((editedUser?.surname) ? " " +editedUser.surname : "")}
                onChange={handleChange}
            />
            </div>
            <div className={`${styles.Input} ${wrongEmail && styles.WrongInput}`}>
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
            <div className={`${styles.Input} ${wrongPhone && styles.WrongInput}`}>
            <label htmlFor="phone_number">Phone</label>
            <input
                id="phone_number"
                name="phone_number"
                type="text"
                required
                value={editedUser?.phone_number}
                onChange={handleChange}
            />
            </div>
            <div className={`${styles.Input} ${wrongGroup && styles.WrongInput}`}>
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
                <button type="submit" className={styles.ConfirmButton}>Confirm</button>
                <button className={styles.DiscardButton} onClick={handleDiscard}>Discard</button>
            </div>
        </form> 
    );
};

export default InfoForm;