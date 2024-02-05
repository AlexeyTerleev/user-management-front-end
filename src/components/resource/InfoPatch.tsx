import React, { FormEvent, useEffect, useState } from "react";
import useApi from "../../hooks/api/useApi";
import { UserData } from "./UserData";
import { 
    findDifferingFields, 
    transformToPatchInterfece, 
    validateEditedUser,
} from  "./PatchComponents/utils.ts"
import PhotoUploader from "./PatchComponents/PhotoUploader.tsx";
import InfoForm from "./PatchComponents/InfoForm.tsx";
import styles from "./Resource.module.css";

interface props {
    user: UserData | undefined;
    setUser: React.Dispatch<React.SetStateAction<UserData | undefined>>;
    setPageState: React.Dispatch<React.SetStateAction<string>>;
}

const InfoPatch: React.FC<props> = ({user, setUser, setPageState}) => {

    const { request, setError } = useApi();

    const [editedUser, setEditedUser] = useState<UserData | undefined>(user);
    const [newPhoto, setNewPhoto] = useState<File | undefined>(undefined);

    const timestamp = new Date().getTime();
    const imgUrlWithTimestamp = `${user?.img_path}?t=${timestamp}`;

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

    const handlePatchInfo = async (data: Partial<UserData>) => {

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

        try {
            const endpoint = "/user/me";
            const params = {
                method: "PATCH",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                data: data,
            };
            await request(
                endpoint, 
                params, 
                (result) => {setUser(result)}, 
                handleErrorResponse,
            );
        } catch (error: any) {
            console.log(error)
            setError(error.message || error);
        }
    };

    const handleUploadPhoto = async (photo: File) => {
        const formData = new FormData();
        formData.append("photo", photo);

        try {
            const endpoint = "/user/me/photo";
            const params = {
                method: "PATCH",
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                data: formData,
            };
            await request(endpoint, params, ()=>{});
        } catch (error: any) {
            console.log(error)
            setError(error.message || error);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        if (
            validateEditedUser(
                editedUser, 
                setWrongName, 
                setWrongUsername, 
                setWrongPhone, 
                setWrongEmail, 
                setWrongGroup, 
                setShowWrongFormatAlert
            )
        ) {
            const data = transformToPatchInterfece(findDifferingFields(user, editedUser));

            await Promise.all([
                newPhoto && handleUploadPhoto(newPhoto),
                Object.keys(data).length !== 0 && handlePatchInfo(data)
            ]);

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
            <PhotoUploader dynamicPhotoUrl={imgUrlWithTimestamp} newPhoto={newPhoto} setNewPhoto={setNewPhoto}/>
            <InfoForm 
                editedUser={editedUser} 
                setEditedUser={setEditedUser} 
                handleSubmit={handleSubmit} 
                handleDiscard={handleDiscard} 
                wrongName={wrongName}
                wrongUsername={wrongUsername}
                wrongPhone={wrongPhone}
                wrongEmail={wrongEmail}
                wrongGroup={wrongGroup}
            />
        </>
    );
};

export default React.memo(InfoPatch);;