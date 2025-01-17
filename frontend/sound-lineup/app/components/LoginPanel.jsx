'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import {loginArtist} from "@/app/services/artistService";
import {useAuth} from "@/app/AuthContext";

const LoginPanel = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('artists'); // default to artist
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const {login} = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
           const data = await loginArtist(name, password,userType);

           if (data && data.token){
               console.log(data);
               login(data.user, data.token, userType);
               router.push(`/`);
           }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            {error && <p>Error: {error}</p>}
            <label>
                Name:
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </label>
            <label>
                Password:
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>
            <label>
                User Type:
                <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                    <option value="artists">Artist</option>
                    <option value="groups">Group</option>
                    <option value="locals">Local</option>
                </select>
            </label>
            <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
        </form>
    );
};

export default LoginPanel;
