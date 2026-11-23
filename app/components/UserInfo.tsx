"use client";

import { useAuth } from "@/lib/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UserInfo() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) {
    return <div className="user-info">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="user-info">
        <Link href="/login" className="nav-link">
          Sign In
        </Link>
        <Link href="/register" className="nav-link">
          Register
        </Link>
      </div>
    );
  }

  return (
    <div className="user-info">
      <span className="user-email">{user.email}</span>
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="logout-btn"
      >
        {loggingOut ? "Logging out..." : "Log Out"}
      </button>
    </div>
  );
}
