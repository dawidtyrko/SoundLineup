import { useState } from 'react';

import { uploadProfileImage } from '@/app/services/artistService';
import { useAuth } from "@/app/AuthContext";
import styles from './UploadProfileImage.module.css';  // Import the new CSS module

const UploadProfileImage = ({ artistId }) => {
    const { token, login, userType } = useAuth();
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage('Please select a file to upload.');
            return;
        }

        setIsUploading(true);
        try {
            const result = await uploadProfileImage(artistId, file, token);
            setMessage(result.message);
            login(result.user, token, userType);
        } catch (error) {
            setMessage(error.message || 'Error uploading profile image.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={styles.uploadWrapper}>
            <h2 className={styles.uploadHeader}>Upload Profile Image</h2>
            <form onSubmit={handleSubmit} className={styles.uploadForm}>
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className={styles.fileInput}
                />
                <button type="submit" className={styles.uploadButton} disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Upload'}
                </button>
            </form>
            {message && (
                <p className={message.includes('Error') ? styles.uploadMessageError : styles.uploadMessageSuccess}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default UploadProfileImage;
