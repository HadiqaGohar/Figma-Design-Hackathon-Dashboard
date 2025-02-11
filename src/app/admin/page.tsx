"use client"; // Ensure it's a client component

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (email === "hg@gmail.com" && password === "hg12") {
            localStorage.setItem("isLoggedIn", "true"); // Fixed typo
            router.push("/admin/dashboard");
        } else {
            alert("Invalid email or password");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-80">
                <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded mb-3"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded mb-3"
                    required
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
            </form>
        </div>
    );
}

export default AdminLogin;
