import { FormEventHandler, useContext, useEffect, useState, ChangeEvent } from "react";
import useApi from "../../hooks/api/useApi";
import {
    validateNameFormat,
    validateEmailFormat,
    validateGroupFormat,
    validatePhoneFormat,
    validateUsernameFormat,
} from "../auth/validations.ts"
import { UserData, UserDataPatch } from "./UserData";
import styles from "./Resource.module.css";

interface props {
    user: UserData | undefined;
    setPageState: React.Dispatch<React.SetStateAction<string>>;
}

const InfoPatch: React.FC<props> = ({user, setPageState}) => {

    const { request, setError } = useApi();
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

    const editInfoHandler: FormEventHandler<HTMLFormElement> = async (event) => {
        const handleErrorResponse = (error: any) => {
            if (error.response.status != 400)
                return;
            const reUsername = /^username \[[a-zA-Z0-9_\.]{3,16}\] is already used$/;
            const reEmail = /^email \[[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\] is already used$/;
            const rePhone = /^phone_number \[\+\d{3}(\d{2})(\d{3})(\d{2})(\d{2})] is already used$/;
            if (reUsername.test(error.response.data.detail)) {
                setWrongUsername(true);
                setShowBadRequestAlert(true);
            }
            if (rePhone.test(error.response.data.detail)){
                setWrongPhone(true);
                setShowBadRequestAlert(true);
            }
            if (reEmail.test(error.response.data.detail)){
                setWrongEmail(true);
                setShowBadRequestAlert(true);
            }
        }

        event.preventDefault();

        const data = new FormData(event.currentTarget);

        if (!await validateEditedUser(data)){
            return;
        }
        try {
            const endpoint = "/user/me";
            const params = {
                method: "PATCH",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                data: transformToPatchInterfece(findDifferingFields(user, editedUser)),
            };
            console.log(params)
            await request(endpoint, params, () => {setPageState("get")}, handleErrorResponse);
        } catch (error: any) {
            console.log(error)
            setError(error.message || error);
        }
    };
    
    const validateEditedUser = async (data: FormData): Promise<boolean> => {
        let result = true;
        if (!validateUsernameFormat(data.get("username")?.toString() || "")) {
            setWrongUsername(true);
            result = false;
        }
        if (!validateNameFormat(data.get("name")?.toString() || "")) {
            setWrongName(true);
            result = false;
        }
        if (!validateEmailFormat(data.get("email")?.toString() || "")) {
            setWrongEmail(true);
            result = false;
        }
        if (!validatePhoneFormat(data.get("phone_number")?.toString() || "")) {
            setWrongPhone(true);
            result = false;
        }
        if (!validateGroupFormat(data.get("group")?.toString() || "")) {
            setWrongGroup(true);
            result = false;
        }
        if (!result) {
            setShowWrongFormatAlert(true);
        }
        return result;
    }

    const findDifferingFields = (current_user: UserData | undefined, edited_user: UserData | undefined): Partial<UserData> => {
        const differingFields: Partial<UserData> = {};
        if (!current_user || !edited_user)
            return differingFields;
        Object.keys(edited_user).forEach((key) => {
            const typedKey = key as keyof UserData;
            if (current_user[typedKey] !== edited_user[typedKey]) {
                differingFields[typedKey] = edited_user[typedKey];
            }
        });
        return differingFields;
    };

    const transformToPatchInterfece = (user: Partial<UserData>): Partial<UserDataPatch> => {
        const userDataPatch: Partial<UserDataPatch> = {};
        Object.keys(user).forEach((key) => {
            if (key === "group") {
                userDataPatch.group_name = user.group.name;
            }
            else {
                userDataPatch[key as keyof UserDataPatch] = user[key as keyof userData];
            }
        });
        return userDataPatch;
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
            <form onSubmit={editInfoHandler} className={styles.UserData}>
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
                    <button className={styles.DiscardButton} onClick={()=>handleDiscard()}>Discard</button>
                </div>
            </form>
        </>
    );
};

export default InfoPatch;