'use client'
import classes from './LoginPanel.module.css'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginArtist } from "@/app/services/artistService";
import { useAuth } from "@/app/AuthContext";
import Link from "next/link";

const LoginPanel = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('artists'); // default to artist
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await loginArtist(name, password, userType);

            if (data && data.token) {
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
        <div className={classes.formContainer}>
            <form onSubmit={handleSubmit}>
                <h1 className={classes.headerOne}>Login</h1>
                {error && <p className={classes.error}>Error: {error}</p>}

                <div className={classes.formField}>
                    <label htmlFor="name" className={classes.labelFields} style={{color:'black'}}>Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        placeholder="Enter your name"
                        onChange={(e) => setName(e.target.value)}
                        className={classes.input}
                    />
                </div>

                <div className={classes.formField}>
                    <label htmlFor="password" className={classes.labelFields} style={{color:'black'}}>Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={classes.input}
                    />
                </div>

                <div className={classes.formField}>
                    <label htmlFor="userType" className={classes.labelFields} style={{color:'black'}}>User Type</label>
                    <select
                        id="userType"
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        className={classes.select}
                    >
                        <option value="artists">Artist</option>
                        <option value="groups">Group</option>
                        <option value="locals">Local</option>
                    </select>
                </div>

                <div className={classes.formField}>
                    <button type="submit" disabled={loading} className={classes.submitBtn}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
            </form>
            <Link href="/register" className={classes.registerLink}>
                Don't have an account? <span>Register!</span>
            </Link>

        </div>
    );
};

export default LoginPanel;
