import React, { createContext, useState } from 'react';
import apiClient from '../api/apiClient';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));

    const login = async (email, password) => {
        try {
            const response = await apiClient.post('/auth/login', { email, password });
            const { accessToken, refreshToken } = response.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            setAccessToken(accessToken);

            // Giriş sonrası kullanıcı bilgilerini de alabiliriz
            // const meResponse = await apiClient.get('/auth/me');
            // setUser(meResponse.data);

            return true;
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setAccessToken(null);
        setUser(null);
    };

    const value = { isAuthenticated: !!accessToken, user, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};