import { UserData, UserDataPatch } from "../../../types/UserTypes"
import {
    validateNameFormat,
    validateEmailFormat,
    validateGroupFormat,
    validatePhoneFormat,
    validateUsernameFormat,
} from "../../auth/validations.ts"

export const findDifferingFields = (user: UserData | undefined, editedUser: UserData | undefined): Partial<UserData> => {
        const differingFields: Partial<UserData> = {};
        if (!user || !editedUser)
            return differingFields;
        Object.keys(editedUser).forEach((key) => {
            const typedKey = key as keyof UserData;
            if (typedKey == "group" as keyof UserData) {
                if (user.group.name !== user.group.name)    {
                    differingFields[typedKey] = editedUser[typedKey];
                }
            }
            else if (user[typedKey] !== editedUser[typedKey]) {
                differingFields[typedKey] = editedUser[typedKey];
            }
        });
        return differingFields;
    };

export const transformToPatchInterfece = (user: Partial<UserData>): Partial<UserDataPatch> => {
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

export const validateEditedUser = (
    user: UserData | undefined,
    setWrongName: React.Dispatch<boolean>,
    setWrongUsername: React.Dispatch<boolean>,
    setWrongPhone: React.Dispatch<boolean>,
    setWrongEmail: React.Dispatch<boolean>,
    setWrongGroup: React.Dispatch<boolean>,
    setShowWrongFormatAlert: React.Dispatch<boolean>,
): boolean => {
    let result = true;
    if (!validateUsernameFormat(user?.username || "")) {
        setWrongUsername(true);
        result = false;
    }
    if (!validateNameFormat(user?.name + " " + user?.surname || "")) {
        setWrongName(true);
        result = false;
    }
    if (!validateEmailFormat(user?.email || "")) {
        setWrongEmail(true);
        result = false;
    }
    if (!validatePhoneFormat(user?.phone_number || "")) {
        setWrongPhone(true);
        result = false;
    }
    if (!validateGroupFormat(user?.group.name || "")) {
        setWrongGroup(true);
        result = false;
    }
    if (!result) {
        setShowWrongFormatAlert(true);
    }
    return result;
}

export const showAlert = (showAlert: boolean, setShowWrongFormatAlert: React.Dispatch<boolean>) => {
    if (showAlert){
        const timer = setTimeout(() => {
            setShowWrongFormatAlert(false);
        }, 3000);
        return () => clearTimeout(timer);
    }
}