import { useState, useEffect } from "react"
import useApi from "../../hooks/api/useApi";


interface PhotoUploaderProps {
    current_photo_url: string | undefined;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({current_photo_url}) => {
    
    const { request, setError } = useApi();
    const [photoUrl, setPhotoUrl] = useState(current_photo_url);


    const handlePhotoClick = () => {
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        fileInput.click();
    };

    const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPhoto = e.target.files?.[0];
        if (newPhoto) {
            const formData = new FormData();
            formData.append("photo", newPhoto);

            try {
                const endpoint = "/user/me/photo";
                const params = {
                    method: "PATCH",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    data: formData,
                };
                await request(endpoint, params, setPhotoUrl);
            } catch (error: any) {
                console.log(error)
                setError(error.message || error);
            }
          }
    };

    return(
        <>
            <img
                src={photoUrl}
                alt="Profile"
                style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                onClick={handlePhotoClick}
            />
            <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                onChange={handleUploadPhoto}
            />
        </>
    )
}

export default PhotoUploader;