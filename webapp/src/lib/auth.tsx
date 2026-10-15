"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isGuest: boolean;
  loginAsDemoUser: () => void;
  loginAsDemoAdmin: () => void;
  loginAsGuest: () => void;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  registerWithEmail: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Read from localStorage on mount
    try {
      const savedUser = localStorage.getItem("scamgraph_user");
      const savedToken = localStorage.getItem("scamgraph_token");
      const savedGuest = localStorage.getItem("scamgraph_is_guest");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken || "demo-token");
      } else if (savedGuest === "true") {
        setIsGuest(true);
      } else {
        // Default to demo user for instant hackathon review experience
        const defaultUser: User = {
          id: "usr-demo-1",
          email: "demo.user@scamgraph.ai",
          name: "ผู้ใช้สาธิต (Demo User)",
          role: "user",
          created_at: new Date().toISOString(),
        };
        setUser(defaultUser);
        setToken("demo-user-token");
        localStorage.setItem("scamgraph_user", JSON.stringify(defaultUser));
      }
    } catch {
      // Ignore
    }
  }, []);

  const loginAsDemoUser = () => {
    const demoUser: User = {
      id: "usr-demo-1",
      email: "demo.user@scamgraph.ai",
      name: "ผู้ใช้สาธิต (Demo User)",
      role: "user",
      created_at: new Date().toISOString(),
    };
    setUser(demoUser);
    setToken("demo-user-token");
    setIsGuest(false);
    localStorage.setItem("scamgraph_user", JSON.stringify(demoUser));
    localStorage.setItem("scamgraph_token", "demo-user-token");
    localStorage.removeItem("scamgraph_is_guest");
  };

  const loginAsDemoAdmin = () => {
    const demoAdmin: User = {
      id: "usr-admin-1",
      email: "admin@scamgraph.ai",
      name: "ผู้ดูแลระบบ (Admin Officer)",
      role: "admin",
      created_at: new Date().toISOString(),
    };
    setUser(demoAdmin);
    setToken("demo-admin-token");
    setIsGuest(false);
    localStorage.setItem("scamgraph_user", JSON.stringify(demoAdmin));
    localStorage.setItem("scamgraph_token", "demo-admin-token");
    localStorage.removeItem("scamgraph_is_guest");
  };

  const loginAsGuest = () => {
    setUser(null);
    setToken(null);
    setIsGuest(true);
    localStorage.removeItem("scamgraph_user");
    localStorage.removeItem("scamgraph_token");
    localStorage.setItem("scamgraph_is_guest", "true");
  };

  const loginWithEmail = async (email: string): Promise<boolean> => {
    const isAdmin = email.toLowerCase().includes("admin");
    const newUser: User = {
      id: `usr-${Date.now()}`,
      email,
      name: email.split("@")[0],
      role: isAdmin ? "admin" : "user",
      created_at: new Date().toISOString(),
    };
    setUser(newUser);
    setToken("auth-token-" + Date.now());
    setIsGuest(false);
    localStorage.setItem("scamgraph_user", JSON.stringify(newUser));
    localStorage.setItem("scamgraph_token", "auth-token-" + Date.now());
    localStorage.removeItem("scamgraph_is_guest");
    return true;
  };

  const registerWithEmail = async (name: string, email: string): Promise<boolean> => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      email,
      name,
      role: "user",
      created_at: new Date().toISOString(),
    };
    setUser(newUser);
    setToken("auth-token-" + Date.now());
    setIsGuest(false);
    localStorage.setItem("scamgraph_user", JSON.stringify(newUser));
    localStorage.setItem("scamgraph_token", "auth-token-" + Date.now());
    localStorage.removeItem("scamgraph_is_guest");
    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsGuest(true);
    localStorage.removeItem("scamgraph_user");
    localStorage.removeItem("scamgraph_token");
    localStorage.setItem("scamgraph_is_guest", "true");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isGuest,
        loginAsDemoUser,
        loginAsDemoAdmin,
        loginAsGuest,
        loginWithEmail,
        registerWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
