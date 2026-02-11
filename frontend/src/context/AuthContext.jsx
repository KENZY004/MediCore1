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
    const [userType, setUserType] = useState(localStorage.getItem('userType')); // 'admin' or 'hospital'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUserType = localStorage.getItem('userType');

            if (!storedToken || !storedUserType) {
                setLoading(false);
                return;
            }

            try {
                // Determine endpoint based on user type
                let response;
                if (storedUserType === 'admin') {
                    // For admin, we call /api/admin/me
                    // Note: api.js automatically attaches the token from localStorage if set up that way?
                    // If not, we might need to manually set headers. 
                    // Assuming api.js uses an interceptor that reads from localStorage.
                    response = await api.get('/admin/me');

                    if (response.data.success) {
                        // Ensure we preserve the userType
                        setUser({ ...response.data.data.admin, userType: 'admin' });
                        setUserType('admin');
                    }
                } else if (storedUserType === 'hospital') {
                    // For hospital, we call /api/hospitals/profile
                    response = await api.get('/hospitals/profile');

                    if (response.data.success) {
                        setUser({ ...response.data.data.hospital, userType: 'hospital' });
                        setUserType('hospital');
                    }
                }

                // If we got here and response was successful, we are good.
                // We re-set the state just to be sure it's in sync with the DB data
                setToken(storedToken);

            } catch (error) {
                console.error('Session verification failed:', error);
                // If verification fails (e.g. 401), we logout
                logout();
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = (userData, authToken) => {
        // Determine user type based on userData structure if not present
        const type = userData.userType || (userData.role === 'admin' || userData.role === 'super_admin' ? 'admin' : 'hospital');
        const userWithRole = { ...userData, userType: type };

        setUser(userWithRole);
        setToken(authToken);
        setUserType(type);

        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userWithRole));
        localStorage.setItem('userType', type);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setUserType(null);

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
    };

    const value = {
        user,
        token,
        userType,
        login,
        logout,
        isAuthenticated: !!token,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
