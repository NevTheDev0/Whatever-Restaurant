import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import supabase from "../Config/supabaseClient";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSignUp() {
        setError("");
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            return setError(error.message);
        }

        setUser(data.user ?? null);
    }

    async function handleLogin() {
        setError("");
        setLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            return setError(error.message);
        }

        if (data.user) {
            setUser(data.user);
            // 👇 redirect to /admin if admin, otherwise homepage
            const isAdmin = data.user?.user_metadata?.role === "admin";
            navigate(isAdmin ? "/admin" : "/");
        }
    }

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

    return (
        <div className="h-screen flex justify-center items-center bg-yellow-200">
            {!user ? (
                <div className="bg-red-300 p-8 rounded-xl shadow-lg w-xs">
                    <h2 className="mb-6 text-yellow-600 font-bold">
                        Login
                    </h2>

                    {error && (
                        <p className="text-red-600 mb-2">
                            {error}
                        </p>
                    )}
                    {loading ? "Please Wait..." : ""}

                    <input
                        className="w-full p-3.5 my-2 border border-yellow-300 rounded-xl text-base text-yellow-700"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        className="w-full p-3.5 my-2 border border-yellow-300 rounded-xl text-base text-yellow-700"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="flex justify-between mt-4">
                        <button
                            className="flex mx-1 p-3 border-none rounded-xl text-base cursor-pointer disabled:cursor-not-allowed duration-100 ease-in hover:bg-red-200 bg-yellow-200 text-red-400"
                            onClick={handleLogin}
                            disabled={loading || !email || password.length < 6}
                        >
                           Login
                        </button>

                        <button
                            className="flex mx-1 p-3 border-none rounded-xl text-base cursor-pointer disabled:cursor-not-allowed duration-100 ease-in hover:bg-red-200 bg-yellow-200 text-red-400"
                            onClick={handleSignUp}
                            disabled={loading || !email || password.length < 6}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-green-300 p-8 rounded-xl shadow-lg">
                    <h1 className="text-2xl font-bold text-green-800">
                        You are logged in!
                    </h1>

                    <p className="mt-2 text-green-700">
                        Welcome, {user.email}
                    </p>
                </div>
            )}
        </div>
    );
}

export default LoginPage;