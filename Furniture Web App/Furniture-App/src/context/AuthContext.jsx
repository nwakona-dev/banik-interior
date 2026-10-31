import { createContext,  useCallback,  useContext,  useEffect,  useState  } from "react";
import { getCurrentUser,  loginAdmin, logoutAdmin  } from "../services/authService";

    const AuthContext = createContext(null);

    export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        try {
        const response = await getCurrentUser();

        if (response?.authenticated) {
            setUser(response);
            return response;
        }

        setUser(null);
        return null;
        } catch {
        setUser(null);
        return null;
        } finally {
        setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const login = async (credentials) => {
        const response = await loginAdmin(credentials);

        // Confirm the session using the backend.
        const currentUser = await getCurrentUser();

        if (!currentUser?.authenticated) {
        setUser(null);
        throw new Error("Login succeeded, but the admin session could not be verified.");
        }

        setUser(currentUser);
        return response;
    };

    const logout = async () => {
        try {
        await logoutAdmin();
        } finally {
        setUser(null);
        }
    };

    return (
        <AuthContext.Provider
        value={{
            user,
            loading,
            isAuthenticated: Boolean(user?.authenticated),
            login,
            logout,
            refreshUser,
        }}
        >
        {children}
        </AuthContext.Provider>
    );
    }

    export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider.");
    }

    return context;
}
