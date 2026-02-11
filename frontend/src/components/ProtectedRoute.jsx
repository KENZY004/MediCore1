import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, allowedRoles }) {
    const { isAuthenticated, userType, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}>
                <div>Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check if user type is allowed
    if (allowedRoles && !allowedRoles.includes(userType)) {
        // Redirect to appropriate dashboard
        const redirectPath = userType === 'admin' ? '/admin/dashboard' : '/hospital/dashboard';
        return <Navigate to={redirectPath} replace />;
    }

    return children;
}

export default ProtectedRoute;
