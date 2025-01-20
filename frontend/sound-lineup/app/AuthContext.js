'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    //const [role, setRole] = useState(null);
    const [token, setToken] = useState(null);
    const [userType, setUserType] = useState('artists');
    const router = useRouter();


    // Load user info from localStorage on initial load
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        const storedUserType = localStorage.getItem('userType');
        //const storedRole = localStorage.getItem('role');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
            setUserType(storedUserType);
            //setRole(storedRole);
        }
    }, []);

    const validateToken = async () => {
        if (!token) {
            logout();  // If no token, logout immediately
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/check-token', {
                headers: { authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error('Token is invalid or expired');
            }

            const data = await response.json();
            console.log(data.message); // Token is valid
        } catch (err) {
            console.error(err.message);
            logout(); // Logout if token is invalid or expired
        }
    };
    // useEffect(() => {
    //     if (token) {
    //         validateToken();
    //     }
    // },[token])

    const login = (userData, tokenData, userTypeData) => {
        setUser(userData);
        setToken(tokenData);
        setUserType(userTypeData);
        //setRole(roleData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', tokenData);
        localStorage.setItem('userType', userTypeData);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setUserType(null);
        //setRole(null);

        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        //localStorage.removeItem('role');

        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token,userType, login, logout,validateToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
