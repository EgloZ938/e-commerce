import { Navigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';

export function PrivateRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
}