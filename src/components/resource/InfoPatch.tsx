import { useCallback, useContext, useEffect, useState, ChangeEvent } from "react";
import {
    validateNameFormat,
    validateEmailFormat,
    validateGroupFormat,
    validatePhoneFormat,
    validateUsernameFormat,
} from "../auth/validations.ts"
import UserData from "./UserData";
import styles from "./Resource.module.css";

interface props {
    user: UserData | undefined;
    setPageState: React.Dispatch<React.SetStateAction<string>>;
}

const InfoPatch: React.FC<props> = ({user, setPageState}) => {

    const [editedUser, setEditedUser] = useState<UserData | undefined>(user);

    const [wrongName, setWrongName] = useState(false);
    const [wrongUsername, setWrongUsername] = useState(false);
    const [wrongPhone, setWrongPhone] = useState(false);
    const [wrongEmail, setWrongEmail] = useState(false);
    const [wrongGroup, setWrongGroup] = useState(false);
    const [showBadRequestAlert, setShowBadRequestAlert] = useState(false);
    const [showWrongFormatAlert, setShowWrongFormatAlert] = useState(false);

    useEffect(() => {
        if (showBadRequestAlert){
            const timer = setTimeout(() => {
                setShowBadRequestAlert(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showBadRequestAlert]);

    useEffect(() => {
        if (showWrongFormatAlert){
            const timer = setTimeout(() => {
                setShowWrongFormatAlert(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showWrongFormatAlert]);

    const validateEditedUser = (): boolean => {
        let result = true;
        if (!validateUsernameFormat(editedUser?.username || "")) {
            setWrongUsername(true);
            result = false;
        }
        if (!validateNameFormat(editedUser?.name + " " + editedUser?.surname)) {
            setWrongName(true);
            result = false;
        }
        if (!validateEmailFormat(editedUser?.email || "")) {
            setWrongEmail(true);
            result = false;
        }
        if (!validatePhoneFormat(editedUser?.phone_number || "")) {
            setWrongPhone(true);
            result = false;
        }
        if (!validateGroupFormat(editedUser?.group.name || "")) {
            setWrongGroup(true);
            result = false;
        }
        if (!result) {
            setShowWrongFormatAlert(true);
        }
        return result;
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "name") {
            const fullName =  value.split(" ")
            if (value.endsWith(" ") && !fullName[1]) {
                fullName[0] = fullName[0] + " ";
            }
            console.log(fullName);
            setEditedUser((prevUser) => ({
                ...(prevUser as UserData || user),
                ["name"]: fullName[0] || "",
                ["surname"]: fullName[1] || "",
            }));
        } else {
            setEditedUser((prevUser) => ({
                ...(prevUser as UserData || user),
                [name]: value,
            }));
        }
    };

    useEffect(() => {
        setEditedUser(user);
    }, []);

    const handleConfirm = () => {
        if (validateEditedUser()){
            setPageState("get");
        }
    };

    const handleDiscard = () => {
        setPageState("get");
    };

    return (
        <>
            {showBadRequestAlert && (
            <div className={styles.Alert}>
                {wrongUsername && <p>This username is already taken</p>}
                {wrongEmail && <p>This email is already used</p>}
                {wrongPhone && <p>This phone number is already used</p>}
            </div>
            )}
            {showWrongFormatAlert && (
                <div className={styles.Alert}>
                    <p>It seems like some fields are incorrect</p>
                </div>
            )}
            <img className={styles.UserPhoto} src={user?.img_path} alt="User Image" />
            <div className={styles.UserData}>
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
                    <button className={styles.ConfirmButton} onClick={()=>handleConfirm()}>Confirm</button>
                    <button className={styles.DiscardButton} onClick={()=>handleDiscard()}>Discard</button>
                </div>
            </div>
        </>
    );
};

export default InfoPatch;