'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadProfileImage } from '@/app/services/artistService';
import {useAuth} from "@/app/AuthContext";  // Import the function

const UploadProfileImage = ({ artistId }) => {
    const { token, login, userType } = useAuth();
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage('Please select a file to upload.');
            return;
        }

        //const token = localStorage.getItem('token'); // Get the token from localStorage

        try {
            const result = await uploadProfileImage(artistId, file, token);
            setMessage(result.message);
            login(result.user,token,userType);
        } catch (error) {
            setMessage(error.message || 'Error uploading profile image.');
        }
    };

    return (
        <div>
            <h2>Upload Profile Image</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} accept="image/*" />
                <button type="submit">Upload</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UploadProfileImage;
