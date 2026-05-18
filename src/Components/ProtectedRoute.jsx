import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import supabase from "../Config/supabaseClient";

function ProtectedRoute({ children }) {
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };
        init();

        const { data: { subscription } } =
            supabase.auth.onAuthStateChange((_event, session) => {
                setUser(session?.user ?? null);
            });

        return () => subscription.unsubscribe();
    }, []);

    if (user === undefined) return <p>Loading...</p>;
    if (user === null) return <Navigate to="/login" replace />;

    // 👇 add this
    const isAdmin = user?.user_metadata?.role === "admin";
    if (!isAdmin) return <Navigate to="/" replace />;

    return children;
}

export default ProtectedRoute;