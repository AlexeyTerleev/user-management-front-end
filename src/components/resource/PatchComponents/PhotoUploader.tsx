import { useState, useEffect } from "react"
import styles from "../Resource.module.css";


interface PhotoUploaderProps {
    dynamicPhotoUrl: string | undefined;
    newPhoto: File | undefined;
    setNewPhoto: (newPhoto: File | undefined) => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({dynamicPhotoUrl, newPhoto, setNewPhoto}) => {

    const [photoUrl, setPhotoUrl] = useState(dynamicPhotoUrl);
    const fallbackPhotoUrl = '/src/images/photoNotFound.png';

    useEffect(() => {
        const checkImage = new Image();
        if (newPhoto) {
            const reader = new FileReader();
            reader.onload = () => {
                setPhotoUrl(reader.result as string);
            };
            reader.readAsDataURL(newPhoto);
        } else if (dynamicPhotoUrl) {
            checkImage.src = dynamicPhotoUrl;
            checkImage.onerror = () => {
                setPhotoUrl(fallbackPhotoUrl);
            };
        }
        else {
            setPhotoUrl(fallbackPhotoUrl);
        }
    }, [dynamicPhotoUrl, fallbackPhotoUrl, newPhoto]);


    const handlePhotoClick = () => {
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        fileInput.click();
    };

    const handleLoadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPhoto(e.target.files?.[0]);
    };    
    
    return(
        <>
            <img
                src={photoUrl}
                alt="Profile"
                className={styles.UserPhoto}
                style={{ cursor: 'pointer' }}
                onClick={handlePhotoClick}
            />
            <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                onChange={handleLoadPhoto}
            />
        </>
    )
}

export default PhotoUploader;