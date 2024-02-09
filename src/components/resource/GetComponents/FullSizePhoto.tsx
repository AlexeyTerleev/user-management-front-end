import { useState, useEffect } from "react";
import styles from "../Resource.module.css";

interface UserPhotoProps {
  dynamicPhotoUrl: string | undefined;
  setShowFullSizePhoto: React.Dispatch<React.SetStateAction<boolean>>;
}

const FullSizePhoto: React.FC<UserPhotoProps> = ({ dynamicPhotoUrl, setShowFullSizePhoto }) => {
  const [photoUrl, setPhotoUrl] = useState(dynamicPhotoUrl);
  const fallbackPhotoUrl = '/src/images/photoNotFound.png';

  useEffect(() => {
    console.log(dynamicPhotoUrl);
    const checkImage = new Image();

    const handleLoad = () => {
      setPhotoUrl(dynamicPhotoUrl);
    };

    const handleError = () => {
      setPhotoUrl(fallbackPhotoUrl);
    };

    if (dynamicPhotoUrl) {
      checkImage.onload = handleLoad;
      checkImage.onerror = handleError;
      checkImage.src = dynamicPhotoUrl;
    } else {
      setPhotoUrl(fallbackPhotoUrl);
    }
  }, [dynamicPhotoUrl]);

  const imgKey = `${dynamicPhotoUrl}/full-size`  || 'fallback/full-size';

  return (
    <div className={styles.FullSizePhotoWrapper} onClick={() => setShowFullSizePhoto(false)}>
        <img
        key={imgKey}
        src={photoUrl}
        alt="Profile"
        className={styles.FullSizePhoto}
        onClick={(e) => e.stopPropagation()}
        />
    </div>
  );
};

export default FullSizePhoto;
