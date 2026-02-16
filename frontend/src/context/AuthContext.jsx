import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const loadUser = async (currentToken) => {
        if (!currentToken) {
            setLoading(false);
            return;
        }

        try {
            // Set header for this request specifically if not already set globally
            // api.js interceptor usually handles this if token is in localStorage

            const { data } = await api.get('/auth/me');
            if (data.success) {
                setUser(data.user);
            }
        } catch (error) {
            console.error("Failed to load user", error);
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Initialize state from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            loadUser(storedToken);
        } else {
            setLoading(false);
        }
    }, []);

    const login = (userData, authToken) => {
        setToken(authToken);
        setUser(userData);
        localStorage.setItem('token', authToken);
        // Do NOT store user object in localStorage
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    const value = {
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        loading,
        // Helper to check specific roles
        // Usage: hasRole(['admin', 'doctor'])
        hasRole: (allowedRoles) => {
            if (!user || !user.role) return false;
            return allowedRoles.includes(user.role);
        }
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
