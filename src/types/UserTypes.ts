export interface UserData {
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

export interface UserDataPatch {
    img_path: string;
    username: string;
    name: string;
    surname: string;
    email: string;
    phone_number: string;
    group_name: string;
}