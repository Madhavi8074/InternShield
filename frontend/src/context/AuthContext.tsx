import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; message: string };
  register: (name: string, email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("internshield_session");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("internshield_session");
      }
    }
  }, []);

  const register = (name: string, email: string, password: string) => {
    const usersStr = localStorage.getItem("internshield_users") || "[]";
    const users = JSON.parse(usersStr);
    
    const exists = users.find((u: { email: string }) => u.email === email);
    if (exists) {
      return { success: false, message: "An account with this email already exists" };
    }
    
    users.push({ name, email, password });
    localStorage.setItem("internshield_users", JSON.stringify(users));

    const userData = { name, email };
    setUser(userData);
    localStorage.setItem("internshield_session", JSON.stringify(userData));
    
    return { success: true, message: "Account created successfully!" };
  };

  const login = (email: string, password: string) => {
    const usersStr = localStorage.getItem("internshield_users") || "[]";
    const users = JSON.parse(usersStr);
    
    const found = users.find(
      (u: { email: string; password: string }) => u.email === email && u.password === password
    );
    
    if (!found) {
      return { success: false, message: "Invalid email or password" };
    }
    
    const userData = { name: found.name, email: found.email };
    setUser(userData);
    localStorage.setItem("internshield_session", JSON.stringify(userData));
    
    return { success: true, message: "Login successful!" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("internshield_session");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
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
