'use client';

import React, {createContext, useState, useContext, useEffect, useCallback} from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const [userType, setUserType] = useState('artists');
    const router = useRouter();

    const validateToken = useCallback(async () => {
        if (!token) {
            return
        }

        const response = await fetch('http://localhost:3001/check-token', {
            headers: { authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            logout()
        }

        const data = await response.json();
    }, [token]);



    const restoreSession = useCallback(async () => {
        try {
            const storedUser = localStorage.getItem("user");
            const storedToken = localStorage.getItem("token");
            const storedUserType = localStorage.getItem("userType");

            if (storedUser && storedToken && storedUserType) {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
                setUserType(storedUserType);

                if(storedToken){
                    await validateToken();
                }
            } else {
                logout()
            }
        } catch (err) {
            logout()
        }
    }, [validateToken]);



    const login = (userData, tokenData, userTypeData) => {
        setUser(userData);
        setToken(tokenData);
        setUserType(userTypeData);

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', tokenData);
        localStorage.setItem('userType', userTypeData);
    };

    const logout = () => {
        console.log("Logging out: Clearing localStorage");
        setUser(null);
        setToken(null);
        setUserType(null);

        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        router.push('/login');
    };

    useEffect(() => {
        restoreSession()
    }, [restoreSession]);
    return (
        <AuthContext.Provider value={{ user, token,userType, login, logout,validateToken,loading,restoreSession }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
