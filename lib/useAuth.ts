"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export type User = {
  id: string;
  email: string;
};

function getUserFriendlyError(err: unknown): string {
  const message = err instanceof Error ? err.message : "";

  if (
    message.includes("Invalid login credentials") ||
    message.includes("User not found") ||
    message.includes("Invalid email or password") ||
    message.includes("User already registered")
  ) {
    return "Invalid email or password";
  }

  return "An error occurred. Please try again.";
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email || "",
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Auth error");
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
          });
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (err) {
      const userMessage = getUserFriendlyError(err);
      setError(userMessage);
      throw err;
    }
  };

  const register = async (email: string, password: string) => {
    setError(null);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
    } catch (err) {
      const userMessage = getUserFriendlyError(err);
      setError(userMessage);
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Logout failed";
      setError(message);
      throw err;
    }
  };

  return { user, loading, error, login, register, logout };
}
