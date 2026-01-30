"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export function ProfileGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && user) {
            // If user has NOT created a profile, and is NOT on the profile creation page
            if (!user.profileCreated && !pathname.includes("/profile")) {
                router.push("/profile");
            }
        }
    }, [user, isLoading, pathname, router]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
        );
    }

    // Optionally, we could render nothing while redirecting, 
    // but usually returning children is fine as the router will kick in fast.
    // However, to prevent a flash of dashboard content, we can return null if condition matches.
    if (user && !user.profileCreated && !pathname.includes("/profile")) {
        return null;
    }

    return <>{children}</>;
}
