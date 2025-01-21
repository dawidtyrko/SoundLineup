'use client'

import { useState } from "react";
import CreateArtist from "@/app/components/CreateArtist";
import CreateGroup from "@/app/components/CreateGroup";
import './register.css'
export default function RegisterPage() {
    const [userType, setUserType] = useState('');

    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
    };

    return (
        <div className="register-container">
            <h1>Register as</h1>
            <select value={userType} onChange={handleUserTypeChange} className="user-type-select">
                <option value="">Select account type</option>
                <option value="artist">Artist</option>
                <option value="group">Group</option>
                <option value="local">Local</option>
            </select>

            <div className="form-container">
                {userType === 'artist' && <CreateArtist />}
                {userType === 'group' && <CreateGroup />}
                {userType === 'local' && <p>Local registration form coming soon...</p>}
            </div>

        </div>
    );
}
