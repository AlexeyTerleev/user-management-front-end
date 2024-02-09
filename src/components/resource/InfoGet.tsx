import { useState, useEffect } from "react";
import { UserData } from "../../types/UserTypes";
import UserPhoto from "./GetComponents/UserPhoto";
import UserInfo from "./GetComponents/UserInfo";
import FullSizePhoto from "./GetComponents/FullSizePhoto";


interface props {
    user: UserData | undefined;
    setPageState: React.Dispatch<React.SetStateAction<string>>;
}

const InfoGet: React.FC<props> = ({user, setPageState}) => {

    const [showFullSizePhoto, setShowFullSizePhoto] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setShowFullSizePhoto(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    
    const timestamp = new Date().getTime();
    const imgUrlWithTimestamp = `${user?.img_path}?t=${timestamp}`;

    return (
        <>
            {showFullSizePhoto && <FullSizePhoto dynamicPhotoUrl={imgUrlWithTimestamp} setShowFullSizePhoto={setShowFullSizePhoto} />}
            <UserPhoto dynamicPhotoUrl={imgUrlWithTimestamp} setShowFullSizePhoto={setShowFullSizePhoto} />
            <UserInfo user={user} setPageState={setPageState} />
        </>
    );
};

export default InfoGet;