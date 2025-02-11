// 'use client'
// import { useRouter } from 'next/navigation';
// import React, { useEffect } from 'react';

// function ProtectedRoute({ children }: { children: React.ReactNode }) {
//     const router = useRouter();

//     useEffect(() => {
//         const isLoggedIn = localStorage.getItem("isLoggedIn");
//         if (!isLoggedIn) {
//             router.push("/admin");
//         }
//     }, [router]);

//     return <>{children}</>;
// }

// export default ProtectedRoute;
'use client';  // Ensure it's a client component

import { useRouter } from 'next/navigation';
import React, { useEffect, ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;  // Explicitly type children
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const router = useRouter();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (!isLoggedIn) {
            router.push("/admin");
        }
    }, [router]);

    return <>{children}</>;
};

export default ProtectedRoute;
